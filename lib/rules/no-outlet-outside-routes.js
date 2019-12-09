'use strict';

const Rule = require('./base');
const isRouteTemplate = require('../helpers/is-route-template');

const message = 'Unexpected {{outlet}} usage. Only use {{outlet}} within a route template.';

module.exports = class NoOutletOutsideRoutes extends Rule {
  static get meta() {
    return {
      description: 'disallows use of `{{outlet}}` outside of routes',
      category: 'Possible Error', // 'Stylistic Issues', 'Deprecated Rules', 'Possible Error', 'Best Practices',
      presets: { recommended: true },
      url:
        'https://github.com/ember-template-lint/ember-template-lint/blog/master/docs/rules/no-outlet-outside-routes.md',
      fixable: false,
    };
  }
  _checkForOutlet(node) {
    if (this.__isRouteTemplate === true) {
      return;
    }

    if (node.path.original === 'outlet') {
      this.log({
        message,
        line: node.loc && node.loc.start.line,
        column: node.loc && node.loc.start.column,
        source: this.sourceForNode(node),
      });
    }
  }

  visitor() {
    this.__isRouteTemplate = isRouteTemplate(this._moduleName);

    return {
      MustacheStatement: this._checkForOutlet,

      BlockStatement: this._checkForOutlet,
    };
  }
};

module.exports.message = message;
