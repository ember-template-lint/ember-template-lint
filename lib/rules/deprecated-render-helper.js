import Rule from './_base.js';

const DEPRECATION_URL = 'https://emberjs.com/deprecations/v2.x/#toc_code-render-code-helper';

const message = `The \`{{render}}\` helper is deprecated in favor of using components. Please see the deprecation guide at ${DEPRECATION_URL}.`;

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

export default class DeprecatedRenderHelper extends Rule {
  visitor() {
    return {
      MustacheStatement(node) {
        if (node.path.type === 'PathExpression' && node.path.parts[0] === 'render') {
          if (node.params.length === 1) {
            this.processWithOneArgument(node);
          } else if (node.params.length === 2) {
            this.processWithTwoArguments(node);
          }
        }
      },
    };
  }

  processWithOneArgument(node) {
    let originalValue = node.params[0].original;
    let actual = `{{render '${originalValue}'}}`;
    let expected = `{{${originalValue}}}`;

    logMessage(this, node, actual, expected);
  }

  processWithTwoArguments(node) {
    let originalValue = node.params[0].original;
    let model = node.params[1].original;
    let actual = `{{render '${originalValue}' ${model}}}`;
    let expected = `{{${originalValue} model=${model}}}`;

    logMessage(this, node, actual, expected);
  }
}
