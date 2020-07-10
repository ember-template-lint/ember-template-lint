'use strict';

const fs = require('fs');
const path = require('path');

const { parse } = require('@babel/parser');
const { default: traverse } = require('@babel/traverse');
const prettier = require('prettier');

const rules = require('../lib/rules');
const { rules: recommendedRules } = require('../lib/config/recommended');
const { rules: octaneRules } = require('../lib/config/octane');
const { rules: stylisticRules } = require('../lib/config/stylistic');

const prettierConfig = {
  ...require('../.prettierrc.js'),
  parser: 'markdown',
};

const pathReadme = path.resolve(__dirname, '../README.md');
const readmeContent = fs.readFileSync(pathReadme, 'utf8');
const tablePlaceholder = /<!--RULES_TABLE_START-->[\S\s]*<!--RULES_TABLE_END-->/;

// Config/preset emojis.
const EMOJI_STAR = ':white_check_mark:';
const EMOJI_OCTANE = ':car:';
const EMOJI_STYLISTIC = ':dress:';
const EMOJI_FIXABLE = ':wrench:';

function isRuleFixable(ruleName) {
  const relativePath = ruleName.startsWith('deprecated-')
    ? `../lib/rules/deprecations/${ruleName}.js`
    : `../lib/rules/${ruleName}.js`;
  const pathRule = path.resolve(__dirname, relativePath);
  let rule = fs.readFileSync(pathRule, { encoding: 'utf8' });

  let ast = parse(rule, { sourceType: 'module' });

  let isFixable = false;

  traverse(ast, {
    ObjectProperty(path) {
      if (path.node.key.name === 'isFixable' && path.node.value.value !== false) {
        isFixable = true;
      }
    },
  });

  return isFixable;
}

// Generate rule table contents.
const rulesTableContent = Object.keys(rules)
  .sort()
  .map((ruleName) => {
    // Check which configs this rule is part of.
    const isRecommended = Object.prototype.hasOwnProperty.call(recommendedRules, ruleName);
    const isOctane = Object.prototype.hasOwnProperty.call(octaneRules, ruleName);
    const isStylistic = Object.prototype.hasOwnProperty.call(stylisticRules, ruleName);
    const isFixable = isRuleFixable(ruleName);

    const emoji = [
      isRecommended ? EMOJI_STAR : '',
      isOctane ? EMOJI_OCTANE : '',
      isStylistic ? EMOJI_STYLISTIC : '',
      isFixable ? EMOJI_FIXABLE : '',
    ].join('');

    const url = ruleName.startsWith('deprecated-')
      ? `./docs/rule/deprecations/${ruleName}.md`
      : `./docs/rule/${ruleName}.md`;
    const link = `[${ruleName}](${url})`;

    return `| ${emoji} | ${link} |`;
  })
  .join('\n');

const readmeNewContent = readmeContent.replace(
  tablePlaceholder,
  `<!--RULES_TABLE_START-->\n\n|    | Rule ID |\n|:---|:--------|\n${rulesTableContent}\n\n<!--RULES_TABLE_END-->`
);

const readmeFormattedNewContent = prettier.format(readmeNewContent, prettierConfig);

fs.writeFileSync(pathReadme, readmeFormattedNewContent);
