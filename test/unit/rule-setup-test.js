const { readdirSync, existsSync, readFileSync } = require('fs');
const { join } = require('path');
const configRecommended = require('../../lib/config/recommended');
const configOctane = require('../../lib/config/octane');
const configStylistic = require('../../lib/config/stylistic');
const isRuleFixable = require('../helpers/is-rule-fixable');

const RULE_NAMES_RECOMMENDED = new Set(Object.keys(configRecommended.rules));
const RULE_NAMES_OCTANE = new Set(Object.keys(configOctane.rules));
const RULE_NAMES_STYLISTIC = new Set(Object.keys(configStylistic.rules));

describe('rules setup is correct', function () {
  const rulesEntryPath = join(__dirname, '..', '..', 'lib', 'rules');
  const files = readdirSync(rulesEntryPath);
  const deprecatedFiles = readdirSync(join(rulesEntryPath, 'deprecations'));
  const deprecatedRules = deprecatedFiles
    .filter((fileName) => {
      return fileName.endsWith('.js');
    })
    .map((fileName) => fileName.replace('.js', ''));
  const expectedRules = files
    .filter((fileName) => {
      return fileName.endsWith('.js') && !['base.js', 'index.js'].includes(fileName);
    })
    .map((fileName) => fileName.replace('.js', ''));

  it('has correct rules reexport', function () {
    const defaultExport = require(rulesEntryPath);
    const exportedRules = Object.keys(defaultExport);
    exportedRules.forEach((ruleName) => {
      let pathName = join(rulesEntryPath, `${ruleName}`);

      if (ruleName.startsWith('deprecated-')) {
        pathName = join(rulesEntryPath, 'deprecations', `${ruleName}`);
      }

      expect(defaultExport[ruleName]).toEqual(require(pathName));
    });
    expect(expectedRules.length + deprecatedRules.length).toEqual(exportedRules.length);
  });

  it('has docs/rule reference for each item', function () {
    const ruleDocsFolder = join(__dirname, '..', '..', 'docs', 'rule');
    deprecatedRules.forEach((ruleName) => {
      const docFileName = `${ruleName}.md`;
      const docFilePath = join(ruleDocsFolder, 'deprecations', docFileName);
      expect(existsSync(docFilePath)).toBe(true);
    });
    expectedRules.forEach((ruleName) => {
      const docFileName = `${ruleName}.md`;
      const docFilePath = join(ruleDocsFolder, docFileName);
      expect(existsSync(docFilePath)).toBe(true);
    });
  });

  it('All rules has test files', function () {
    const testsPath = join(__dirname, '..', 'unit', 'rules');
    const ruleFiles = new Set(readdirSync(testsPath).filter((name) => name.endsWith('-test.js')));
    const deprecatedRuleFiles = new Set(
      readdirSync(join(testsPath, 'deprecations')).filter((name) => name.endsWith('-test.js'))
    );
    expectedRules.forEach((ruleFileName) => {
      const ruleTestFileName = `${ruleFileName}-test.js`;
      expect(ruleFiles.has(ruleTestFileName)).toBe(true);
    });
    deprecatedRules.forEach((ruleFileName) => {
      const ruleTestFileName = `${ruleFileName}-test.js`;
      expect(deprecatedRuleFiles.has(ruleTestFileName)).toBe(true);
    });
  });

  it('should have the right contents (title, examples, notices) for each rule documentation file', function () {
    const CONFIG_MSG_RECOMMENDED =
      ":white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.";
    const CONFIG_MSG_OCTANE =
      ":car: The `extends: 'octane'` property in a configuration file enables this rule.";
    const CONFIG_MSG_STYLISTIC =
      ":dress: The `extends: 'stylistic'` property in a configuration file enables this rule.";
    const FIXABLE_NOTICE =
      ':wrench: The `--fix` option on the command line can automatically fix some of the problems reported by this rule.';

    deprecatedRules.forEach((ruleName) => {
      const path = join(__dirname, '..', '..', 'docs', 'rule', 'deprecations', `${ruleName}.md`);
      const file = readFileSync(path, 'utf8');

      expect(file).toContain(`# ${ruleName}`); // Title header.
      expect(file).toContain('## Examples'); // Examples section header.

      if (RULE_NAMES_RECOMMENDED.has(ruleName)) {
        expect(file).toContain(CONFIG_MSG_RECOMMENDED);
      } else {
        expect(file).not.toContain(CONFIG_MSG_RECOMMENDED);
      }

      if (RULE_NAMES_OCTANE.has(ruleName)) {
        expect(file).toContain(CONFIG_MSG_OCTANE);
      } else {
        expect(file).not.toContain(CONFIG_MSG_OCTANE);
      }

      if (RULE_NAMES_STYLISTIC.has(ruleName)) {
        expect(file).toContain(CONFIG_MSG_STYLISTIC);
      } else {
        expect(file).not.toContain(CONFIG_MSG_STYLISTIC);
      }

      if (isRuleFixable(ruleName)) {
        expect(file).toContain(FIXABLE_NOTICE);
      } else {
        expect(file).not.toContain(FIXABLE_NOTICE);
      }
    });

    expectedRules.forEach((ruleName) => {
      const path = join(__dirname, '..', '..', 'docs', 'rule', `${ruleName}.md`);
      const file = readFileSync(path, 'utf8');

      expect(file).toContain(`# ${ruleName}`); // Title header.
      expect(file).toContain('## Examples'); // Examples section header.

      if (RULE_NAMES_RECOMMENDED.has(ruleName)) {
        expect(file).toContain(CONFIG_MSG_RECOMMENDED);
      } else {
        expect(file).not.toContain(CONFIG_MSG_RECOMMENDED);
      }

      if (RULE_NAMES_OCTANE.has(ruleName)) {
        expect(file).toContain(CONFIG_MSG_OCTANE);
      } else {
        expect(file).not.toContain(CONFIG_MSG_OCTANE);
      }

      if (RULE_NAMES_STYLISTIC.has(ruleName)) {
        expect(file).toContain(CONFIG_MSG_STYLISTIC);
      } else {
        expect(file).not.toContain(CONFIG_MSG_STYLISTIC);
      }

      if (isRuleFixable(ruleName)) {
        expect(file).toContain(FIXABLE_NOTICE);
      } else {
        expect(file).not.toContain(FIXABLE_NOTICE);
      }
    });
  });
});
