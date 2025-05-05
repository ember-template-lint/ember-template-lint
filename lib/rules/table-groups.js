import AstNodeInfo from '../helpers/ast-node-info.js';
import createErrorMessage from '../helpers/create-error-message.js';
import dasherizeComponentName from '../helpers/dasherize-component-name.js';
import isDasherizedComponentOrHelperName from '../helpers/is-dasherized-component-or-helper-name.js';
import Rule from './_base.js';

const message = 'Tables must have a table group (thead, tbody or tfoot).';
const orderingMessage =
  'Tables must have table groups in the correct order (caption, colgroup, thead, tbody then tfoot).';

const ALLOWED_TABLE_CHILDREN = ['caption', 'colgroup', 'thead', 'tbody', 'tfoot'];
const CONTROL_FLOW_START_MARK = 0;
const CONTROL_FLOW_END_MARK = 1;

// For effective children, we skip over any control flow helpers,
// since we know that they don't render anything on their own
function getEffectiveChildren(node) {
  return AstNodeInfo.childrenFor(node).flatMap((childNode) => {
    if (AstNodeInfo.isControlFlowHelper(childNode)) {
      if (AstNodeInfo.isIf(childNode) || AstNodeInfo.isUnless(childNode)) {
        if (childNode.program && childNode.inverse) {
          return [
            CONTROL_FLOW_START_MARK,
            ...getEffectiveChildren(childNode.program),
            CONTROL_FLOW_END_MARK,
            CONTROL_FLOW_START_MARK,
            ...getEffectiveChildren(childNode.inverse),
            CONTROL_FLOW_END_MARK,
          ];
        }
      }
      return getEffectiveChildren(childNode);
    } else {
      return [childNode];
    }
  });
}

function isAllowedTableChild(node, config) {
  switch (node.type) {
    case 'BlockStatement':
    case 'MustacheStatement': {
      const tagNamePair = node.hash.pairs.find((pair) => pair.key === 'tagName');

      if (tagNamePair) {
        const index = ALLOWED_TABLE_CHILDREN.indexOf(tagNamePair.value.value);
        return { allowed: index > -1, indices: [index] };
      } else if (node.path.original === 'yield') {
        return { allowed: true, indices: [] };
      } else {
        const possibleIndices = config.get(node.path.original) || [];
        if (possibleIndices.length > 0) {
          return { allowed: true, indices: possibleIndices };
        }
      }
      break;
    }
    case 'ElementNode': {
      let index = ALLOWED_TABLE_CHILDREN.indexOf(node.tag);
      if (index > -1) {
        return { allowed: true, indices: [index] };
      }

      const tagNameAttribute = node.attributes.find((attribute) => attribute.name === '@tagName');
      if (tagNameAttribute) {
        index = ALLOWED_TABLE_CHILDREN.indexOf(tagNameAttribute.value.chars);
        return { allowed: index > -1, indices: [index] };
      }

      const possibleIndices = config.get(dasherizeComponentName(node.tag)) || [];
      if (possibleIndices.length > 0) {
        return { allowed: true, indices: possibleIndices };
      }

      break;
    }
    case 'CommentStatement':
    case 'MustacheCommentStatement': {
      return { allowed: true, indices: [] };
    }
    case 'TextNode': {
      return { allowed: !/\S/.test(node.chars), indices: [] };
    }
  }

  return { allowed: false };
}

export function createTableGroupsErrorMessage(ruleName, config) {
  return createErrorMessage(
    ruleName,
    [
      '  One of these:',
      '  * boolean - `true` to enable / `false` to disable',
      '  * object[] - with the following keys:',
      '    * `allowed-table-components` - string[] - components to treat as having the table tag (using kebab-case names like `nested-scope/component-name`)',
      '    * `allowed-caption-components` - string[] - components to treat as having the caption tag (using kebab-case names like `nested-scope/component-name`)',
      '    * `allowed-colgroup-components` - string[] - components to treat as having the colgroup tag (using kebab-case names like `nested-scope/component-name`)',
      '    * `allowed-thead-components` - string[] - components to treat as having the thead tag (using kebab-case names like `nested-scope/component-name`)',
      '    * `allowed-tbody-components` - string[] - components to treat as having the tbody tag (using kebab-case names like `nested-scope/component-name`)',
      '    * `allowed-tfoot-components` - string[] - components to treat as having the tfoot tag (using kebab-case names like `nested-scope/component-name`)',
    ],
    config
  );
}

export default class TableGroups extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean': {
        return config
          ? {
              outerTags: new Set(),
              internalTags: new Map(),
            }
          : false;
      }
      case 'object': {
        const allowedComponentKeysByIndex = [
          'allowed-caption-components',
          'allowed-colgroup-components',
          'allowed-thead-components',
          'allowed-tbody-components',
          'allowed-tfoot-components',
          'allowed-table-components',
        ];

        const result = new Map();
        let outerTags = new Set();

        let isValid = true;

        for (const [index, key] of allowedComponentKeysByIndex.entries()) {
          if (key in config) {
            const allowedComponents = config[key];
            if (
              Array.isArray(allowedComponents) &&
              allowedComponents.every(isDasherizedComponentOrHelperName)
            ) {
              if (key === 'allowed-table-components') {
                outerTags = new Set(allowedComponents);
              } else {
                for (const allowedComponent of allowedComponents) {
                  if (!result.has(allowedComponent)) {
                    result.set(allowedComponent, []);
                  }

                  result.get(allowedComponent).push(index);
                }
              }
            } else {
              isValid = false;
            }
          }
        }

        if (isValid && (result.size > 0 || outerTags.size > 0)) {
          return {
            internalTags: result,
            outerTags,
          };
        } else {
          break;
        }
      }
      case 'undefined': {
        return false;
      }
    }

    throw new Error(createTableGroupsErrorMessage(this.ruleName, config));
  }
  /**
   * @returns {import('./types.js').VisitorReturnType<TableGroups>}
   */
  visitor() {
    return {
      ElementNode(node) {
        if (
          node.tag === 'table' ||
          this.config.outerTags.has(dasherizeComponentName(node.tag)) ||
          node.attributes.some((attr) => {
            return (
              attr.name === '@tagName' &&
              attr.value.type === 'TextNode' &&
              attr.value.chars === 'table'
            );
          })
        ) {
          const children = getEffectiveChildren(node);
          let currentAllowedMinimumIndices = new Set([0]);
          let scopedIndices = [];
          for (const child of children) {
            const isControlFlowStartMark = child === CONTROL_FLOW_START_MARK;
            const isControlFlowEndMark = child === CONTROL_FLOW_END_MARK;
            const isControlMark = isControlFlowStartMark || isControlFlowEndMark;

            if (isControlFlowStartMark) {
              scopedIndices.push(currentAllowedMinimumIndices);
              currentAllowedMinimumIndices = new Set(
                scopedIndices.reduce((acc, indices) => {
                  return [...acc, ...indices];
                })
              );
              continue;
            } else if (isControlFlowEndMark) {
              currentAllowedMinimumIndices = scopedIndices.pop();
            }
            if (isControlMark) {
              continue;
            }

            const { allowed, indices } = isAllowedTableChild(child, this.config.internalTags);
            if (!allowed) {
              this.log({
                message,
                node,
              });
              break;
            }

            // It's possible for a component to be permissible for multiple children, so we need to make sure at least
            // one possible tag makes sense.
            if (indices.length > 0) {
              const newAllowedMinimumIndices = new Set(
                [...currentAllowedMinimumIndices].flatMap((currentIndex) => {
                  return indices.filter((newIndex) => newIndex >= currentIndex);
                })
              );
              if (newAllowedMinimumIndices.size === 0) {
                this.log({
                  message: orderingMessage,
                  node,
                });
                break;
              }

              currentAllowedMinimumIndices = newAllowedMinimumIndices;
            }
          }
        }
      },
    };
  }
}
