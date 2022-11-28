// main code parts copypasted from https://github.com/editorconfig/editorconfig-core-js and and rewritten as Class.

import micromatch from 'micromatch';
import fs from 'node:fs';
import path from 'node:path';

export default class EditorConfigResolver {
  constructor(workingDir) {
    this.workingDir = workingDir;
    this.EDITOR_CONFIG_CACHE = null;
    this.CONFIG_RESOLUTIONS_CACHE = new Map();
    /**
     * define the possible values:
     * section: [section]
     * param: key=value
     * comment: ;this is a comment
     */
    this.regex = {
      section: /^\s*\[(([^#;]|\\#|\\;)+)]\s*([#;].*)?$/,
      param: /^\s*([\w.-]+)\s*[:=]\s*(.*?)\s*([#;].*)?$/,
      comment: /^\s*[#;].*$/,
    };

    this.knownProps = {
      end_of_line: true,
      indent_style: true,
      indent_size: true,
      insert_final_newline: true,
      trim_trailing_whitespace: true,
      charset: true,
    };
  }
  opts(filepath, options) {
    const resolvedFilePath = path.resolve(filepath);
    return [resolvedFilePath, this.processOptions(options, resolvedFilePath)];
  }
  processOptions(options = {}, filepath) {
    return {
      config: options.config || '.editorconfig',
      root: path.resolve(options.root || path.parse(filepath).root),
    };
  }
  parseString(data) {
    let sectionBody = {};
    let sectionName = null;
    const value = [[sectionName, sectionBody]];
    const lines = data.split(/\r\n|\r|\n/);
    for (const line of lines) {
      let match;
      if (this.regex.comment.test(line)) {
        continue;
      }
      if (this.regex.param.test(line)) {
        match = line.match(this.regex.param);
        sectionBody[match[1]] = match[2];
      } else if (this.regex.section.test(line)) {
        match = line.match(this.regex.section);
        sectionName = match[1];
        sectionBody = {};
        value.push([sectionName, sectionBody]);
      }
    }
    return value;
  }
  buildFullGlob(pathPrefix, glob) {
    switch (glob.indexOf('/')) {
      case -1: {
        glob = `**/${glob}`;
        break;
      }
      case 0: {
        glob = glob.slice(1);
        break;
      }
      default: {
        break;
      }
    }
    return path.join(pathPrefix, glob);
  }
  fnmatch(filepath, glob) {
    const matchOptions = { matchBase: false, dot: false, noext: true };
    glob = glob.split(path.sep).join('/');
    filepath = filepath.split(path.sep).join('/');
    return micromatch.isMatch(filepath, glob, matchOptions);
  }
  extendProps(props = {}, options = {}) {
    for (const key in options) {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        const value = options[key];
        const key2 = key.toLowerCase();
        let value2 = value;
        if (this.knownProps[key2]) {
          value2 = value.toLowerCase();
        }
        try {
          value2 = JSON.parse(value);
        } catch {
          //
        }
        if (value === undefined || value === null) {
          // null and undefined are values specific to JSON (no special meaning
          // in editorconfig) & should just be returned as regular strings.
          value2 = String(value);
        }
        props[key2] = value2;
      }
    }
    return props;
  }
  readConfigFilesSync(filepaths) {
    const files = [];

    for (const filepath of filepaths) {
      if (!fs.existsSync(filepath)) {
        continue;
      }
      let file;
      try {
        file = fs.readFileSync(filepath, 'utf8');
      } catch {
        file = '';
      }
      files.push({
        name: filepath,
        contents: file,
      });
    }
    return files;
  }
  processMatches(matches) {
    // Set indent_size to 'tab' if indent_size is unspecified and
    // indent_style is set to 'tab'.
    if (
      'indent_style' in matches &&
      matches.indent_style === 'tab' &&
      !('indent_size' in matches)
    ) {
      matches.indent_size = 'tab';
    }

    // Set tab_width to indent_size if indent_size is specified and
    // tab_width is unspecified
    if ('indent_size' in matches && !('tab_width' in matches) && matches.indent_size !== 'tab') {
      matches.tab_width = matches.indent_size;
    }

    // Set indent_size to tab_width if indent_size is 'tab'
    if ('indent_size' in matches && 'tab_width' in matches && matches.indent_size === 'tab') {
      matches.indent_size = matches.tab_width;
    }

    return matches;
  }
  parseFromConfigs(configs, filepath) {
    return this.processMatches(
      configs.reverse().reduce((matches, file) => {
        const pathPrefix = path.dirname(file.name);
        for (const section of file.contents) {
          const [glob, options] = section;
          if (!glob) {
            continue;
          }
          const fullGlob = this.buildFullGlob(pathPrefix, glob);
          if (!this.fnmatch(filepath, fullGlob)) {
            continue;
          }
          matches = this.extendProps(matches, options);
        }
        return matches;
      }, {})
    );
  }
  resetEditorConfigCache() {
    this.EDITOR_CONFIG_CACHE = null;
  }
  resetConfigResolutionsCache() {
    this.CONFIG_RESOLUTIONS_CACHE.clear();
  }
  getConfigFileNames(filepath, options) {
    const paths = [];
    do {
      filepath = path.dirname(filepath);
      paths.push(path.join(filepath, options.config));
    } while (filepath !== options.root);
    return paths;
  }
  getConfigsForFiles(files) {
    const configs = [];
    for (const i in files) {
      if (Object.prototype.hasOwnProperty.call(files, i)) {
        const file = files[i];
        const contents = this.parseString(file.contents);
        configs.push({
          name: file.name,
          contents,
        });
        if ((contents[0][1].root || '').toLowerCase() === 'true') {
          break;
        }
      }
    }
    return configs;
  }
  /*
    provcess.cwd() = /root/path
    dirname(/root/path) => root
    but, we need to find .editorconfig under /root/path
    provcess.cwd() + "this.file.does.not.exist" = /root/path/this.file.does.not.exist
    dirname(/root/path/this.file.does.not.exist) => /root/path
  */
  resolveEditorConfigFiles(
    _filepath = path.join(this.workingDir, 'this.file.does.not.exist'),
    _options = {}
  ) {
    const [resolvedFilePath, processedOptions] = this.opts(_filepath, _options);
    const filepaths = this.getConfigFileNames(resolvedFilePath, processedOptions);
    const files = this.readConfigFilesSync(filepaths);
    const configForFiles = this.getConfigsForFiles(files);
    return configForFiles;
  }
  checkEditorConfigCache(entry, _opts) {
    if (this.EDITOR_CONFIG_CACHE === null) {
      this.EDITOR_CONFIG_CACHE = this.resolveEditorConfigFiles(entry, _opts);
    }
  }
  editorConfigForFilePath(resolvedFilePath) {
    return this.parseFromConfigs(this.EDITOR_CONFIG_CACHE, resolvedFilePath);
  }
  cachedEditorConfigForFilePath(resolvedFilePath) {
    if (!this.CONFIG_RESOLUTIONS_CACHE.has(resolvedFilePath)) {
      const editorConfig = this.editorConfigForFilePath(resolvedFilePath);
      this.CONFIG_RESOLUTIONS_CACHE.set(resolvedFilePath, JSON.stringify(editorConfig));
    }
    return JSON.parse(this.CONFIG_RESOLUTIONS_CACHE.get(resolvedFilePath));
  }
  getEditorConfigData(entry, _opts = {}) {
    this.checkEditorConfigCache(entry, _opts);
    const resolvedFilePath = path.resolve(entry);
    return this.cachedEditorConfigForFilePath(resolvedFilePath);
  }
}
