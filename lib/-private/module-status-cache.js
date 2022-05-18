import micromatch from 'micromatch';
import path from 'node:path';

import removeExt from '../helpers/remove-ext.js';

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

  getConfigForFile(options) {
    let filePath = options.filePath;
    let moduleId = filePath && removeExt(filePath);
    let configuredRules = this.config.rules;
    let overrides = this.config.overrides;

    let fileConfig = Object.assign({}, this.config, {
      shouldIgnore: this.lookupIgnore(moduleId),
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
