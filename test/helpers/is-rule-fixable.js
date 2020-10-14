const fs = require('fs');
const path = require('path');

const { parse } = require('@babel/parser');
const { default: traverse } = require('@babel/traverse');

function isRuleFixable(ruleName) {
  const relativePath = `../../lib/rules/${ruleName}.js`;
  const pathRule = path.resolve(__dirname, relativePath);
  let rule = fs.readFileSync(pathRule, { encoding: 'utf8' });

  let ast = parse(rule, { sourceType: 'module' });

  let isFixable = false;

  traverse(ast, {
    ObjectProperty(path) {
      if (
        path.node.key.type === 'Identifier' &&
        path.node.key.name === 'isFixable' &&
        !(path.node.value.type === 'BooleanLiteral' && path.node.value.value === false)
      ) {
        isFixable = true;
      }
    },
  });

  return isFixable;
}

module.exports = isRuleFixable;
