import createErrorMessage from '../helpers/create-error-message.js';
import Rule from './_base.js';

// Form `method` attribute keywords:
// https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-method
const VALID_FORM_METHODS = ['POST', 'GET', 'DIALOG'];

const DEFAULT_CONFIG = {
  allowedMethods: VALID_FORM_METHODS,
};

export default class RequireFormMethod extends Rule {
  logNode({ node, message }) {
    return this.log({
      message,
      node,
      isFixable: false,
    });
  }

  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean': {
        return config ? DEFAULT_CONFIG : false;
      }
      case 'object': {
        if (Array.isArray(config.allowedMethods)) {
          let allowedMethods = config.allowedMethods.map((m) => String(m).toUpperCase());
          let hasAnyInvalidMethod = allowedMethods.find((m) => {
            return !VALID_FORM_METHODS.includes(m);
          });

          if (hasAnyInvalidMethod) {
            break;
          }

          return {
            allowedMethods,
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
        '  * object -- An object with the following keys:',
        `    * \`allowedMethods\` -- An array of allowed form \`method\` attribute values of \`${VALID_FORM_METHODS}\``,
      ],
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    return {
      ElementNode(node) {
        let { tag, attributes } = node;

        if (tag !== 'form') {
          return;
        }

        let typeAttribute = attributes.find((it) => it.name === 'method');
        if (!typeAttribute) {
          this.logNode({
            node,
            message: makeErrorMessage(this.config.allowedMethods),
          });
          return;
        }

        let { value } = typeAttribute;
        if (value.type !== 'TextNode') {
          return;
        }

        let { chars } = value;
        if (!this.config.allowedMethods.includes(chars.toUpperCase())) {
          this.logNode({
            node,
            message: makeErrorMessage(this.config.allowedMethods),
          });
        }
      },
    };
  }
}

function makeErrorMessage(methods) {
  return `All \`<form>\` elements should have \`method\` attribute with value of \`${methods}\``;
}
