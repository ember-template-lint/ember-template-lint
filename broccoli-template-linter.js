'use strict';
/* jshint node: true */
/*eslint-env node*/

var path = require('path');
var Filter = require('broccoli-persistent-filter');
var md5Hex = require('md5-hex');
var existsSync = require('exists-sync');
var stringify = require('json-stable-stringify');
var chalk = require('chalk');
var compile = require('htmlbars').compile;
var jsStringEscape = require('js-string-escape');
var plugins = require('./ext/plugins');

function TemplateLinter(inputNode, _options) {
  if (!(this instanceof TemplateLinter)) { return new TemplateLinter(inputNode, _options); }

  var options = _options || {};
  if (!options.hasOwnProperty('persist')) {
    options.persist = true;
  }

  Filter.call(this, inputNode, {
    annotation: options.annotation,
    persist: options.persist
  });


  this.options = options;
  this._console = this.options.console || console;
  this._templatercConfig = undefined;
  this._astPlugins = undefined;
  this._generateTestFile = this.options.generateTestFile || function() {
    return '';
  };
}

TemplateLinter.prototype = Object.create(Filter.prototype);
TemplateLinter.prototype.constructor = TemplateLinter;

TemplateLinter.prototype.extensions = ['hbs'];
TemplateLinter.prototype.targetExtension = 'template-lint-test.js';

TemplateLinter.prototype.baseDir = function() {
  return __dirname;
};

TemplateLinter.prototype.loadConfig = function() {
  if (this._templatercConfig) {
    return this._templatercConfig;
  }

  var defaultConfigPath = this.options.templatercPath || path.join(process.cwd(), '.template-lintrc');
  var overrideConfigPath = process.env['TEMPLATE_LINTRC'];
  var configPath = overrideConfigPath || defaultConfigPath;

  if(existsSync(configPath + '.js') || existsSync(configPath + '.json')) {
    this._templatercConfig = require(configPath);
  } else {
    this._templatercConfig = {};
  }

  return this._templatercConfig;
};

TemplateLinter.prototype.cacheKeyProcessString = function(string, relativePath) {
  return md5Hex([
    stringify(this.loadConfig()),
    this._generateTestFile.toString(),
    string,
    relativePath
  ]);
};

TemplateLinter.prototype.logLintingError = function(pluginName, moduleName, message) {
  this._queuedMessages.push(message);

  this._console.log(chalk.yellow(message));
};

TemplateLinter.prototype.buildASTPlugins = function() {
  if (this._astPlugins) {
    return this._astPlugins;
  }

  var astPlugins = [];
  for (var pluginName in plugins) {
    astPlugins.push(plugins[pluginName](this));
  }

  return this._astPlugins = astPlugins;
};

TemplateLinter.prototype.processString = function(contents, relativePath) {
  this._queuedMessages = [];

  compile(contents, {
    moduleName: relativePath,
    plugins: {
      ast: this.buildASTPlugins()
    }
  });

  var errors = '\n' + this._queuedMessages.join('\n');
  var passed = this._queuedMessages.length === 0;

  return this._generateTestFile(
    'TemplateLint - ' + relativePath,
    [{
      name: 'should pass TemplateLint',
      passed: passed,
      errorMessage: relativePath + ' should pass TemplateLint.' + jsStringEscape(errors)
    }]
  );
};

module.exports = TemplateLinter;
