'use strict';

const Rule = require('./base');

module.exports = class LogTripleCurlies extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    let errorMessage = 'The triple-curlies rule accepts one of the following values.\n ' +
      '  * boolean - `true` to enable / `false` to disable\n' +
      '\nYou specified `' + JSON.stringify(config) + '`';

    switch (configType) {
    case 'boolean':
      return config;
    case 'undefined':
      return false;
    default:
      throw new Error(errorMessage);
    }
  }

  visitors() {
    return {
      MustacheStatement(node) {
        if (!node.escaped) {
          this.log({
            message: 'Usage of triple curly brackets is unsafe',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: `{{{${node.path.original}}}}`
          });
        }
      }
    };
  }
};
