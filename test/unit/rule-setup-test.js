import { readdirSync, existsSync, readFileSync } from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import configRecommended from '../../lib/config/recommended.js';
import configStylistic from '../../lib/config/stylistic.js';
import exportedRules from '../../lib/rules/index.js';
import isRuleFixable from '../helpers/is-rule-fixable.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const RULE_NAMES_RECOMMENDED = new Set(Object.keys(configRecommended.rules));
const RULE_NAMES_STYLISTIC = new Set(Object.keys(configStylistic.rules));

describe('rules setup is correct', function () {
  const rulesEntryPath = path.join(__dirname, '..', '..', 'lib', 'rules');
  const files = readdirSync(rulesEntryPath);
  const expectedRules = files
    .filter((fileName) => {
      return (
        fileName.endsWith('.js') &&
        !['_base.js', '_report-unused-disable-directives.js', 'index.js'].includes(fileName)
      );
    })
    .map((fileName) => fileName.replace('.js', ''));

  it('has correct rules reexport', async function () {
    const exportedRuleNames = Object.keys(exportedRules);
    for (const ruleName of exportedRuleNames) {
      let pathName = path.join(rulesEntryPath, `${ruleName}.js`);
      const { default: loadedRule } = await import(pathName);
      expect(exportedRules[ruleName]).toEqual(loadedRule);
    }
    expect(expectedRules.length).toEqual(exportedRuleNames.length);
  });

  it('has docs/rule reference for each item', function () {
    const ruleDocsFolder = path.join(__dirname, '..', '..', 'docs', 'rule');
    for (const ruleName of expectedRules) {
      const docFileName = `${ruleName}.md`;
      const docFilePath = path.join(ruleDocsFolder, docFileName);
      expect(existsSync(docFilePath)).toBe(true);
    }
  });

  it('All rules have test files', function () {
    const testsPath = path.join(__dirname, '..', 'unit', 'rules');
    const ruleFiles = new Set(readdirSync(testsPath).filter((name) => name.endsWith('-test.js')));
    for (const ruleFileName of expectedRules) {
      const ruleTestFileName = `${ruleFileName}-test.js`;
      expect(ruleFiles.has(ruleTestFileName)).toBe(true);
    }
  });

  describe('rule documentation files', function () {
    const MESSAGES = {
      configRecommended:
        "✅ The `extends: 'recommended'` property in a configuration file enables this rule.",
      configStylistic:
        "💅 The `extends: 'stylistic'` property in a configuration file enables this rule.",
      fixable:
        '🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.',
    };

    describe.each(expectedRules)('%s', (ruleName) => {
      it('should have the right contents (title, notices, examples, references)', function () {
        const ruleFilePath = path.join(__dirname, '..', '..', 'lib', 'rules', `${ruleName}.js`);
        const ruleFileContents = readFileSync(ruleFilePath, 'utf8');

        const docFilePath = path.join(__dirname, '..', '..', 'docs', 'rule', `${ruleName}.md`);
        const docFileContents = readFileSync(docFilePath, 'utf8');
        const docFileLines = docFileContents.split('\n');

        expect(docFileLines[0]).toStrictEqual(`# ${ruleName}`); // Title header.
        expect(docFileContents).toContain('## Examples'); // Examples section header.
        expect(docFileContents).toContain('## References');

        const expectedNotices = [];
        const unexpectedNotices = [];
        if (RULE_NAMES_RECOMMENDED.has(ruleName)) {
          expectedNotices.push('configRecommended');
        } else {
          unexpectedNotices.push('configRecommended');
        }
        if (RULE_NAMES_STYLISTIC.has(ruleName)) {
          expectedNotices.push('configStylistic');
        } else {
          unexpectedNotices.push('configStylistic');
        }
        if (isRuleFixable(ruleName)) {
          expectedNotices.push('fixable');
        } else {
          unexpectedNotices.push('fixable');
        }

        // Ensure that expected notices are present in the correct order.
        let currentLineNumber = 1;
        for (const expectedNotice of expectedNotices) {
          expect(docFileLines[currentLineNumber]).toStrictEqual('');
          expect(docFileLines[currentLineNumber + 1]).toStrictEqual(MESSAGES[expectedNotice]);
          currentLineNumber += 2;
        }

        // Ensure that unexpected notices are not present.
        for (const unexpectedNotice of unexpectedNotices) {
          expect(docFileContents).not.toContain(MESSAGES[unexpectedNotice]);
        }

        // Check if the rule has configuration options.
        if (['parseConfig', 'this.config'].some((str) => ruleFileContents.includes(str))) {
          // Should have a configuration section header.
          expect(docFileContents).toContain('## Configuration');
        } else {
          // Should NOT have any options/config section headers.
          expect(docFileContents).not.toContain('# Config');
          expect(docFileContents).not.toContain('# Option');
        }
      });
    });
  });
});
