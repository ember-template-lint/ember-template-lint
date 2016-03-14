'use strict';
/* jshint node: true */
/*eslint-env node*/

var getConfig = require('./lib/get-config');
var Filter = require('broccoli-persistent-filter');
var md5Hex = require('md5-hex');
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

  this._templatercConfig = getConfig(this.options.templatercPath);

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

TemplateLinter.prototype.build = function () {
  var self = this;
  self._errors = [];

  return Filter.prototype.build.apply(this, arguments)
    .finally(function() {
      if (self._errors.length > 0) {
        var label = ' Template Linting Error' + (self._errors.length > 1 ? 's' : '');
        self._console.log('\n' + self._errors.join('\n'));
        self._console.log(chalk.yellow('===== ' + self._errors.length + label + '\n'));
      }
    });
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

  var output = this._generateTestFile(
    'TemplateLint - ' + relativePath,
    [{
      name: 'should pass TemplateLint',
      passed: passed,
      errorMessage: relativePath + ' should pass TemplateLint.' + jsStringEscape(errors)
    }]
  );

  return {
    messages: this._queuedMessages,
    output: output
  };
};

TemplateLinter.prototype.postProcess = function(results) {
  var messages = results.messages;

  for (var i = 0; i < messages.length; i++) {
    this._errors.push(chalk.red(messages[i]));
  }

  return results;
};

module.exports = TemplateLinter;
