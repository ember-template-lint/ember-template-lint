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
  },

  setupPreprocessorRegistry: function(type, registry) {
    var RemoveConfigurationHtmlComments = require('./ext/plugins/internal/remove-configuration-html-comments');

    registry.add('htmlbars-ast-plugin', {
      name: 'remove-configuration-html-comments',
      plugin: RemoveConfigurationHtmlComments()
    });
  }
};
