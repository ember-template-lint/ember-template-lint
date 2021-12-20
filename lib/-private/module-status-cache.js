import micromatch from 'micromatch';
import path from 'node:path';

export default class ModuleStatusCache {
  constructor(workingDir, config, configPath) {
    this.workingDir = workingDir;
    this.config = config;
    this.configPath = configPath || '';
    this.cache = {
      ignore: {},
    };
  }

  lookupIgnore(moduleId) {
    if (!(moduleId in this.cache.ignore)) {
      const ignores = this.config['ignore'] || [];
      this.cache.ignore[moduleId] = ignores.find((match) => match(moduleId));
    }
    return Boolean(this.cache.ignore[moduleId]);
  }

  resolveFullModuleId(moduleId) {
    if (!this._baseDirBasedOnConfigPath) {
      this._baseDirBasedOnConfigPath = path.resolve(this.workingDir, path.dirname(this.configPath));
    }
    return path.resolve(this._baseDirBasedOnConfigPath, moduleId);
  }

  getConfigForFile(options) {
    let filePath = options.filePath;
    let configuredRules = this.config.rules;
    let overrides = this.config.overrides;

    let fileConfig = Object.assign({}, this.config, {
      shouldIgnore: this.lookupIgnore(options.moduleId),
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
