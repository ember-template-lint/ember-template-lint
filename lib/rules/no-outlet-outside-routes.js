'use strict';

const isRouteTemplate = require('../helpers/is-route-template');
const Rule = require('./_base');

const message = 'Unexpected {{outlet}} usage. Only use {{outlet}} within a route template.';

module.exports = class NoOutletOutsideRoutes extends Rule {
  _checkForOutlet(node) {
    if (this.__isRouteTemplate === true) {
      return;
    }

    if (node.path.original === 'outlet') {
      this.log({
        message,
        node,
      });
    }
  }

  visitor() {
    this.__isRouteTemplate = isRouteTemplate(this._filePath);

    return {
      MustacheStatement: this._checkForOutlet,

      BlockStatement: this._checkForOutlet,
    };
  }
};

module.exports.message = message;
