import Rule from './_base.js';

const DEPRECATION_URL = 'http://emberjs.com/deprecations/v1.x/#toc_ember-view';

const message =
  // eslint-disable-next-line prefer-template
  'The inline form of `view` is deprecated. Please use the `Ember.Component` instead. ' +
  'See the deprecation guide at ' +
  DEPRECATION_URL;

function asElementAsAttributeString(tag, attributeName, value) {
  return `<${tag} ${attributeName}={{${value}}}></${tag}>`;
}

function asPassedPropertyString(componentName, keyName, value) {
  return `{{${componentName} ${keyName}=${value}}}`;
}

function inBlockStatementString(componentName, keyName, value) {
  return `{{#${componentName} ${keyName}=${value}}}{{/${componentName}}}`;
}

function logMessage(context, node, actual, expected) {
  return context.log({
    message,
    node,
    source: actual,
    fix: {
      text: expected,
    },
  });
}

function manageMustacheViewInvocation(context, node, isBlockStatement) {
  let pairs = node.hash.pairs;
  const isYield =
    node.path.original === 'yield' && node.path.this === false && node.path.data === false;
  if (pairs.length > 0) {
    for (const currentPair of pairs) {
      let originalValue = currentPair.value.original;

      if (
        typeof originalValue === 'string' &&
        originalValue.split('.')[0] === 'view' &&
        !isYield &&
        currentPair.key !== 'to'
      ) {
        if (isBlockStatement) {
          context.processInBlockStatement(node, currentPair);
        } else {
          context.processAsPassedProperty(node, currentPair);
        }
      }
    }
  }
}

export default class DeprecatedInlineViewHelper extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        let attributes = node.attributes;

        for (const currentAttribute of attributes) {
          let value = currentAttribute.value;

          if (value.type === 'MustacheStatement') {
            let originalValue = value.path.original;

            if (typeof originalValue === 'string' && originalValue.split('.')[0] === 'view') {
              this.processAsElementAttribute(node, currentAttribute);
            }
          }
        }
      },

      MustacheStatement(node) {
        // this MustachStatement was already processed by ElementNode
        if (node._processedByInlineViewHelper === true) {
          return;
        }

        if (node.path.type === 'PathExpression' && node.path.parts[0] === 'view') {
          if (node.params.length === 1) {
            this.processWithArgument(node);
          } else if (
            node.loc.start.line !== null &&
            !node.path.this &&
            !node.path.data &&
            !this.scope.isLocal(node)
          ) {
            this.processWithProperty(node);
          }
        } else {
          manageMustacheViewInvocation(this, node, false);
        }
      },

      BlockStatement(node) {
        manageMustacheViewInvocation(this, node, true);
      },
    };
  }

  processAsElementAttribute(node, attribute) {
    let tag = node.tag;
    let originalValue = attribute.value.path.original;
    let strippedValue = originalValue.replace('view.', '');
    let actual = asElementAsAttributeString(tag, attribute.name, originalValue);
    let expected = asElementAsAttributeString(tag, attribute.name, strippedValue);

    attribute.value._processedByInlineViewHelper = true;

    logMessage(this, node, actual, expected);
  }

  processWithProperty(node) {
    let originalValue = node.path.original;
    let strippedValue = originalValue.replace('view.', '');
    let actual = `{{${originalValue}}}`;
    let expected = `{{${strippedValue}}}`;

    logMessage(this, node, actual, expected);
  }

  processWithArgument(node) {
    let originalValue = node.params[0].original;
    let actual = `{{view '${originalValue}'}}`;
    let expected = `{{${originalValue}}}`;

    logMessage(this, node, actual, expected);
  }

  processAsPassedProperty(node, pair) {
    let componentName = node.path.original;
    let keyName = pair.key;
    let originalValue = pair.value.original;
    let strippedValue = originalValue.replace('view.', '');
    let actual = asPassedPropertyString(componentName, keyName, originalValue);
    let expected = asPassedPropertyString(componentName, keyName, strippedValue);

    logMessage(this, pair, actual, expected);
  }

  processInBlockStatement(node, pair) {
    let componentName = node.path.original;
    let keyName = pair.key;
    let originalValue = pair.value.original;
    let strippedValue = originalValue.replace('view.', '');
    let actual = inBlockStatementString(componentName, keyName, originalValue);
    let expected = inBlockStatementString(componentName, keyName, strippedValue);

    logMessage(this, pair, actual, expected);
  }
}
