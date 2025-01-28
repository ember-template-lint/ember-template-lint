import micromatch from 'micromatch';
import path from 'node:path';

function removeExt(filePath) {
  return filePath.slice(0, -path.extname(filePath).length);
}

export default class ModuleStatusCache {
  constructor(workingDir, config, configPath) {
    this.workingDir = workingDir;
    this.config = config;
    this.configPath = configPath || '';
    this.cache = {
      ignore: {},
    };
  }

  lookupIgnore(filePath) {
    let moduleId = filePath && removeExt(filePath);
    if (filePath in this.cache.ignore) {
      return Boolean(this.cache.ignore[filePath]);
    }
    if (moduleId in this.cache.ignore) {
      return Boolean(this.cache.ignore[moduleId]);
    }
    const ignores = this.config['ignore'] || [];
    const filePathIgnore = ignores.find((match) => match(filePath));
    if (filePathIgnore) {
      this.cache.ignore[filePath] = filePathIgnore;
      return Boolean(this.cache.ignore[filePath]);
    }
    const moduleIdIgnore = ignores.find((match) => match(moduleId));
    if (moduleIdIgnore) {
      this.cache.ignore[moduleId] = moduleIdIgnore;
      return Boolean(this.cache.ignore[moduleId]);
    }
    return false;
  }

  getConfigForFile(options) {
    let filePath = options.filePath;
    let configuredRules = this.config.rules;
    let overrides = this.config.overrides;

    let fileConfig = Object.assign({}, this.config, {
      shouldIgnore: this.lookupIgnore(filePath),
    });

    if (filePath && overrides) {
      let overridesRules = {};
      for (const override of overrides) {
        const isFileMatch = override.files && micromatch.isMatch(filePath, override.files);
        if (isFileMatch) {
          overridesRules = Object.assign(overridesRules, override.rules);
        }
      }
      // If there is an override present, then the overridden ruleset takes precedence.
      fileConfig.rules = Object.assign({}, configuredRules, overridesRules);
    }
    return fileConfig;
  }
}
