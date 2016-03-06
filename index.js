/* jshint node: true */
/*eslint-env node*/
'use strict';

var TemplateLinter = require('./broccoli-template-linter');

module.exports = {
  name: 'ember-cli-template-lint',

  lintTree: function(type, tree) {
    if (type === 'templates') {
      var ui = this.ui;
      var mockConsole = {
        log: function(data) {
          ui.writeLine(data);
        },

        error: function(data) {
          ui.writeLine(data, 'ERROR');
        }
      };

      return new TemplateLinter(tree, {
        annotation: 'TemplateLinter',
        templatercPath: this.project.root + '/.template-lintrc',
        generateTestFile: this.project.generateTestFile,
        _console: mockConsole
      });
    }
  }
};
