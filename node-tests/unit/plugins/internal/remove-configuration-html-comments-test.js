'use strict';

var assert = require('assert');
var _compile = require('htmlbars').compile;
var plugins = require('../../../../ext/plugins');
var lintConfigurationHtmlComments = require('../../../../ext/plugins/internal/lint-configuration-html-comments');

describe('internal/remove-configuration-html-comments', function() {
  var addonContext, messages;

  function compile(template) {
    _compile(template, {
      moduleName: 'layout.hbs',
      plugins: {
        ast: [
          plugins['internal-remove-configuration-html-comments'](addonContext),
          lintConfigurationHtmlComments(addonContext)
        ]
      }
    });
  }

  beforeEach(function() {
    messages = [];

    addonContext = {
      logLintingError: function(pluginName, moduleName, message) {
        messages.push(message);
      },
      loadConfig: function() {
        return {};
      }
    };
  });

  it('should remove `template-lint` configuration html comments', function() {
    compile('<!-- template-lint triple-curlies=false -->\n' +
            '<!-- template-lint enable=false -->\n' +
            '<div>hi Alex & Ben</div>');

    assert.deepEqual(messages, [], '`template-lint` configuration html comments are removed');
  });
});
