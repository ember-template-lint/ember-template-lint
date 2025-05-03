import fs from 'node:fs';
import { createRequire } from 'node:module';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

import a11y from '../lib/config/a11y.js';
import recommended from '../lib/config/recommended.js';
import stylistic from '../lib/config/stylistic.js';
import rules from '../lib/rules/index.js';
import isRuleFixable from '../test/helpers/is-rule-fixable.js';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const { rules: a11yRules } = a11y;
const { rules: recommendedRules } = recommended;
const { rules: stylisticRules } = stylistic;

const prettierConfig = {
  ...require('../.prettierrc.cjs'),
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

const readmeFormattedNewContent = await prettier.format(readmeNewContent, prettierConfig);

fs.writeFileSync(pathReadme, readmeFormattedNewContent);
