import createErrorMessage from '../helpers/create-error-message.js';
import { match } from '../helpers/node-matcher.js';
import Rule from './_base.js';

function ERROR_MESSAGE_FORBIDDEN_ELEMENTS(element) {
  return `Use of <${element}> detected. Do not use forbidden elements.`;
}

const FORBIDDEN_ELEMENTS = ['meta', 'style', 'html', 'script'];

const DEFAULT_CONFIG = {
  forbidden: FORBIDDEN_ELEMENTS,
};

function isValidConfigObjectFormat(config) {
  for (let key in config) {
    let value = config[key];
    let valueIsArray = Array.isArray(value);

    if (key === 'forbidden' && !valueIsArray) {
      return false;
    } else if (!DEFAULT_CONFIG[key]) {
      return false;
    }
  }

  return true;
}

function sanitizeConfigArray(forbidden = []) {
  return forbidden.filter(Boolean).sort((a, b) => b.length - a.length);
}

function hasHeadParent(path) {
  let parents = [...path.parents()];
  let refParentNode = {
    type: 'ElementNode',
    tag: 'head',
  };
  let hasHeadElementInParentPath = parents.some((parent) => match(parent.node, refParentNode));
  return Boolean(hasHeadElementInParentPath);
}
export default class NoForbiddenElements extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean': {
        // if `true` use `DEFAULT_CONFIG`
        return config ? DEFAULT_CONFIG : false;
      }
      case 'object': {
        if (Array.isArray(config)) {
          return {
            forbidden: sanitizeConfigArray(config),
          };
        } else if (isValidConfigObjectFormat(config)) {
          // default any missing keys to empty values
          return {
            forbidden: sanitizeConfigArray(config.forbidden || FORBIDDEN_ELEMENTS),
          };
        }
        break;
      }
      case 'undefined': {
        return false;
      }
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '  * boolean - `true` to enable / `false` to disable',
        '  * array -- an array of strings to forbid, default: ["meta", "style", "html", "style"]',
        '  * object -- An object with the following keys:',
        '    * `forbidden` -- An array of forbidden strings',
      ],
      config
    );

    throw new Error(errorMessage);
  }

  isInHeadHbsFile(scope) {
    return scope._filePath === 'app/templates/head.hbs';
  }

  visitor() {
    return {
      ElementNode(node, path) {
        if (node.tag === 'meta' && (hasHeadParent(path) || this.isInHeadHbsFile(this))) {
          return;
        }

        let isForbiddenElement = this.config.forbidden.includes(node.tag);

        if (isForbiddenElement) {
          this.log({
            message: ERROR_MESSAGE_FORBIDDEN_ELEMENTS(node.tag),
            node,
          });
        }
      },
    };
  }
}
