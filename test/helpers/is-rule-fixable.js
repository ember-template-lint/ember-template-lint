import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default function isRuleFixable(ruleName) {
  const relativePath = `../../lib/rules/${ruleName}.js`;
  const pathRule = path.resolve(__dirname, relativePath);
  let rule = fs.readFileSync(pathRule, { encoding: 'utf8' });

  let ast = parse(rule, { sourceType: 'module' });

  let isFixable = false;

  traverse.default(ast, {
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
