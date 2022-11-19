import AstNodeInfo from '../helpers/ast-node-info.js';
import createErrorMessage from '../helpers/create-error-message.js';
import Rule from './_base.js';

const ERROR_MESSAGE_NO_LABEL = 'form elements require a valid associated label.';
const ERROR_MESSAGE_MULTIPLE_LABEL = 'form elements should not have multiple labels.';

function hasValidLabelParent(path, config) {
  // Parental validation (descriptive elements)
  let parents = [...path.parents()];
  let labelParentPath = parents.find(
    (parent) =>
      parent.node.type === 'ElementNode' &&
      config.labelTags.some((item) => {
        return isRegExp(item) ? item.test(parent.node.tag) : item === parent.node.tag;
      })
  );
  if (labelParentPath && labelParentPath.node.tag !== 'label') {
    // it's custom label implementation, we could not check it
    return true;
  }
  if (labelParentPath && AstNodeInfo.childrenFor(labelParentPath.node).length > 1) {
    return true;
  }

  return false;
}

const INCLUDED_TAGS = new Set(['Input', 'input', 'Textarea', 'textarea', 'select']);
const INCLUDED_COMPONENTS = new Set(['input', 'textarea']);

function isString(value) {
  return typeof value === 'string';
}

function isRegExp(value) {
  return value instanceof RegExp;
}

function allowedFormat(value) {
  return isString(value) || isRegExp(value);
}
export default class RequireInputLabel extends Rule {
  parseConfig(config) {
    if (config === false || config === undefined) {
      return false;
    }

    switch (typeof config) {
      case 'undefined': {
        return false;
      }

      case 'boolean': {
        if (config) {
          return {
            labelTags: ['label'],
          };
        } else {
          return false;
        }
      }

      case 'object': {
        if (Array.isArray(config.labelTags) && config.labelTags.every(allowedFormat)) {
          return {
            labelTags: ['label', ...config.labelTags],
          };
        }
        break;
      }
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '  * boolean - `true` to enable / `false` to disable',
        '  * object -- An object with the following keys:',
        '    * `labelTags` -- An array of component / helper names for that may be called without arguments',
      ],
      config
    );

    throw new Error(errorMessage);
  }
  visitor() {
    return {
      ElementNode(node, path) {
        // Only input elements: check rule conditions
        if (!INCLUDED_TAGS.has(node.tag)) {
          return;
        }

        if (AstNodeInfo.hasAttribute(node, '...attributes')) {
          return;
        }

        let labelCount = 0;

        if (hasValidLabelParent(path, this.config)) {
          labelCount++;
        }

        const typeAttribute = AstNodeInfo.findAttribute(node, 'type');
        if (typeAttribute && typeAttribute.value.chars === 'hidden') {
          return;
        }

        // An input can be validated by either:
        // Self-validation (descriptive attributes)
        let validAttributesList = ['id', 'aria-label', 'aria-labelledby'];
        let attributes = validAttributesList.filter((name) => AstNodeInfo.hasAttribute(node, name));
        labelCount += attributes.length;
        if (labelCount === 1) {
          return;
        }
        if (hasValidLabelParent(path, this.config) && AstNodeInfo.hasAttribute(node, 'id')) {
          return;
        }

        let message = labelCount === 0 ? ERROR_MESSAGE_NO_LABEL : ERROR_MESSAGE_MULTIPLE_LABEL;
        this.log({
          message,
          node,
        });
      },

      MustacheStatement(node, path) {
        if (node.path.type !== 'PathExpression' || !INCLUDED_COMPONENTS.has(node.path.original)) {
          return;
        }

        if (hasValidLabelParent(path, this.config)) {
          return;
        }

        const typeAttribute = node.hash.pairs.find((pair) => pair.key === 'type');
        if (typeAttribute && typeAttribute.value.value === 'hidden') {
          return;
        }

        if (node.hash.pairs.some((pair) => pair.key === 'id')) {
          return;
        }

        this.log({
          message: ERROR_MESSAGE_NO_LABEL,
          node,
        });
      },
    };
  }
}
