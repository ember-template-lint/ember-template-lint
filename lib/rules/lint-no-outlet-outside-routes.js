'use strict';

const Rule = require('./base');
const isRouteTemplate = require('../helpers/is-route-template');
const message = 'Unexpected {{outlet}} usage. Only use {{outlet}} within a route template.';

function getModuleName(visitor) {
  return visitor._templateEnvironmentData.moduleName;
}

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
        source: this.sourceForNode(node)
      });
    }
  }

  visitor() {
    return {
      Program: {
        enter() {
          this.__isRouteTemplate = isRouteTemplate(getModuleName(this));
        },
        exit() {
          this.__isRouteTemplate = false;
        }
      },
      MustacheStatement(node) {
        this._checkForOutlet(node);
      },

      BlockStatement(node) {
        this._checkForOutlet(node);
      }
    };
  }
};

module.exports.message = message;
