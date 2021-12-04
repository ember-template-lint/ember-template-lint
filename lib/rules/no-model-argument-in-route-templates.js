import { builders } from 'ember-template-recast';

import isRouteTemplate from '../helpers/is-route-template.js';
import Rule from './_base.js';

const ERROR_MESSAGE = 'Do not use `{{@model}}` in route templates, use `{{this.model}}` instead.';

export default class NoModelArgumentInRouteTemplates extends Rule {
  constructor(options) {
    super(options);

    this.isRouteTemplate = isRouteTemplate(options.filePath);
  }

  visitor() {
    if (!this.isRouteTemplate) {
      // do nothing for component templates
      return {};
    }

    return {
      PathExpression(node, path) {
        if (node.data && node.parts[0] === 'model') {
          if (this.mode === 'fix') {
            path.parentNode[path.parentKey] = builders.path(
              ['this', 'model', ...node.parts.slice(1)].join('.'),
              node.loc
            );
            return;
          }

          this.log({
            message: ERROR_MESSAGE,
            node,
            isFixable: true,
          });
        }
      },
    };
  }
}
