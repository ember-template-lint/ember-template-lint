import isRouteTemplate from '../helpers/is-route-template.js';
import Rule from './_base.js';

const message = 'Unexpected {{outlet}} usage. Only use {{outlet}} within a route template.';

export default class NoOutletOutsideRoutes extends Rule {
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
}
