'use strict';

const fs = require('fs');
const path = require('path');

const prettier = require('prettier');

const { rules: a11yRules } = require('../lib/config/a11y');
const { rules: recommendedRules } = require('../lib/config/recommended');
const { rules: stylisticRules } = require('../lib/config/stylistic');
const rules = require('../lib/rules');
const isRuleFixable = require('../test/helpers/is-rule-fixable');

const prettierConfig = {
  ...require('../.prettierrc.js'),
  parser: 'markdown',
};

const pathReadme = path.resolve(__dirname, '../README.md');
const readmeContent = fs.readFileSync(pathReadme, 'utf8');
const tablePlaceholder = /<!--RULES_TABLE_START-->[\S\s]*<!--RULES_TABLE_END-->/;

// Config/preset emojis.
const EMOJI_A11Y = '⌨️';
const EMOJI_RECOMMENDED = '✅';
const EMOJI_STYLISTIC = '💅';
const EMOJI_FIXABLE = '🔧';

// Generate rule table contents.
const rulesTableContent = Object.keys(rules)
  .sort()
  .map((ruleName) => {
    // Check which configs this rule is part of.
    const isA11y = Object.prototype.hasOwnProperty.call(a11yRules, ruleName);
    const isRecommended = Object.prototype.hasOwnProperty.call(recommendedRules, ruleName);
    const isStylistic = Object.prototype.hasOwnProperty.call(stylisticRules, ruleName);
    const isFixable = isRuleFixable(ruleName);
    const url = `./docs/rule/${ruleName}.md`;
    const link = `[${ruleName}](${url})`;

    return `| ${link} | ${isRecommended ? EMOJI_RECOMMENDED : ''} | ${
      isStylistic ? EMOJI_STYLISTIC : ''
    } | ${isA11y ? EMOJI_A11Y : ''} | ${isFixable ? EMOJI_FIXABLE : ''} |`;
  })
  .join('\n');

const readmeNewContent = readmeContent.replace(
  tablePlaceholder,
  `<!--RULES_TABLE_START-->\n\n| Name | ${EMOJI_RECOMMENDED} | ${EMOJI_STYLISTIC} | ${EMOJI_A11Y} | ${EMOJI_FIXABLE} |\n|:--------|:---|:---|:---|\n${rulesTableContent}\n\n<!--RULES_TABLE_END-->`
);

const readmeFormattedNewContent = prettier.format(readmeNewContent, prettierConfig);

fs.writeFileSync(pathReadme, readmeFormattedNewContent);
