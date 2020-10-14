'use strict';

const isRouteTemplate = require('../helpers/is-route-template');
const Rule = require('./base');

const message = 'Unexpected {{outlet}} usage. Only use {{outlet}} within a route template.';

module.exports = class NoOutletOutsideRoutes extends Rule {
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
