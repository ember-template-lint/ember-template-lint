const path = require('path');

const micromatch = require('micromatch');

class ModuleStatusCache {
  constructor(workingDir, config, configPath) {
    this.workingDir = workingDir;
    this.config = config;
    this.configPath = configPath || '';
    this.cache = {
      pending: {},
      ignore: {},
    };
  }

  lookupPending(moduleId) {
    if (!moduleId || !this.config.pending) {
      return false;
    }
    if (!this.cache.pendingLookup) {
      this.cache.pendingLookup = this._extractPendingCache();
    }
    if (!(moduleId in this.cache.pending)) {
      const fullPathModuleId = path.resolve(this.workingDir, moduleId);
      this.cache.pending[moduleId] = this.cache.pendingLookup[fullPathModuleId];
    }
    return this.cache.pending[moduleId];
  }

  lookupIgnore(moduleId) {
    if (!(moduleId in this.cache.ignore)) {
      const ignores = this.config['ignore'] || [];
      this.cache.ignore[moduleId] = ignores.find((match) => match(moduleId));
    }
    return Boolean(this.cache.ignore[moduleId]);
  }

  _extractPendingCache() {
    const list = this.config.pending;
    const byFullModuleId = {};

    if (!list) {
      return byFullModuleId;
    }

    for (const item of list) {
      if (typeof item === 'string') {
        const fullPath = this.resolveFullModuleId(item);
        byFullModuleId[fullPath] = true;
      } else if (item.moduleId) {
        const fullPath = this.resolveFullModuleId(item.moduleId);
        byFullModuleId[fullPath] = item;
      }
    }

    return byFullModuleId;
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
      pendingStatus: this.lookupPending(options.moduleId),
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

module.exports = ModuleStatusCache;
