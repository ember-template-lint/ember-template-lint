import createErrorMessage from '../helpers/create-error-message.js';
import dasherize from '../helpers/dasherize-component-name.js';
import isDasherizedComponentOrHelperName from '../helpers/is-dasherized-component-or-helper-name.js';
import Rule from './_base.js';

function isValidCustomErrorMessage(str) {
  return typeof str === 'string' && str.length > 0;
}

export default class NoRestrictedInvocations extends Rule {
  parseConfig(config) {
    switch (typeof config) {
      case 'boolean': {
        if (!config) {
          return false;
        }
        break;
      }
      case 'object': {
        if (
          Array.isArray(config) &&
          config.length > 0 &&
          config.every(
            (item) =>
              (typeof item === 'string' && isDasherizedComponentOrHelperName(item)) ||
              (typeof item === 'object' &&
                Array.isArray(item.names) &&
                item.names.length > 0 &&
                item.names.every(isDasherizedComponentOrHelperName) &&
                isValidCustomErrorMessage(item.message))
          )
        ) {
          return config;
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
        '  One of these:',
        '  * string[] - helpers or components to disallow (using kebab-case names like `nested-scope/component-name`)',
        '  * object[] - with the following keys:',
        '    * `names` - string[] - helpers or components to disallow (using kebab-case names like `nested-scope/component-name`)',
        '    * `message` - string - custom error message to report for violations',
      ].join('\n'),
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    let checkDenylist = (node) => {
      let denylist = this.config;

      const name = this._getComponentOrHelperName(node);
      if (!name) {
        return;
      }

      const nameToDisplay = node.type === 'ElementNode' ? `<${node.tag} />` : `{{${name}}}`;

      for (let denylistItem of denylist) {
        if (typeof denylistItem === 'object') {
          if (denylistItem.names.includes(name)) {
            this._logNode(node, nameToDisplay, denylistItem.message);
          }
        } else {
          if (denylistItem === name) {
            this._logNode(node, nameToDisplay, denylistItem.message);
          }
        }
      }
    };

    return {
      BlockStatement: checkDenylist,
      ElementModifierStatement: checkDenylist,
      ElementNode: checkDenylist,
      MustacheStatement: checkDenylist,
      SubExpression: checkDenylist,
    };
  }

  _getComponentOrHelperName(node) {
    if (this.isLocal(node)) {
      return undefined;
    }

    if (node.type === 'ElementNode') {
      // Convert from angle-bracket naming to kebab-case.
      return dasherize(node.tag);
    } else {
      if (node.path.original === 'component' && node.params[0]) {
        return node.params[0].original;
      } else {
        return node.path.original;
      }
    }
  }

  _logNode(node, name, message) {
    this.log({
      message: message || `Cannot use disallowed helper, component or modifier '${name}'`,
      node,
    });
  }
}
