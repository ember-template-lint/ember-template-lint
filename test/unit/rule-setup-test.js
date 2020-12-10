const { readdirSync, existsSync, readFileSync } = require('fs');
const path = require('path');

const configRecommended = require('../../lib/config/recommended');
const configStylistic = require('../../lib/config/stylistic');
const isRuleFixable = require('../helpers/is-rule-fixable');

const RULE_NAMES_RECOMMENDED = new Set(Object.keys(configRecommended.rules));
const RULE_NAMES_STYLISTIC = new Set(Object.keys(configStylistic.rules));

describe('rules setup is correct', function () {
  const rulesEntryPath = path.join(__dirname, '..', '..', 'lib', 'rules');
  const files = readdirSync(rulesEntryPath);
  const expectedRules = files
    .filter((fileName) => {
      return fileName.endsWith('.js') && !['base.js', 'index.js'].includes(fileName);
    })
    .map((fileName) => fileName.replace('.js', ''));

  it('has correct rules reexport', function () {
    const defaultExport = require(rulesEntryPath);
    const exportedRules = Object.keys(defaultExport);
    exportedRules.forEach((ruleName) => {
      let pathName = path.join(rulesEntryPath, `${ruleName}`);
      expect(defaultExport[ruleName]).toEqual(require(pathName));
    });
    expect(expectedRules.length).toEqual(exportedRules.length);
    expect(exportedRules).toEqual([...exportedRules].sort());
  });

  it('has docs/rule reference for each item', function () {
    const ruleDocsFolder = path.join(__dirname, '..', '..', 'docs', 'rule');
    expectedRules.forEach((ruleName) => {
      const docFileName = `${ruleName}.md`;
      const docFilePath = path.join(ruleDocsFolder, docFileName);
      expect(existsSync(docFilePath)).toBe(true);
    });
  });

  it('All rules have test files', function () {
    const testsPath = path.join(__dirname, '..', 'unit', 'rules');
    const ruleFiles = new Set(readdirSync(testsPath).filter((name) => name.endsWith('-test.js')));
    expectedRules.forEach((ruleFileName) => {
      const ruleTestFileName = `${ruleFileName}-test.js`;
      expect(ruleFiles.has(ruleTestFileName)).toBe(true);
    });
  });

  it('should have the right contents (title, examples, notices, references) for each rule documentation file', function () {
    const CONFIG_MSG_RECOMMENDED =
      ":white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.";
    const CONFIG_MSG_STYLISTIC =
      ":dress: The `extends: 'stylistic'` property in a configuration file enables this rule.";
    const FIXABLE_NOTICE =
      ':wrench: The `--fix` option on the command line can automatically fix some of the problems reported by this rule.';

    expectedRules.forEach((ruleName) => {
      const filePath = path.join(__dirname, '..', '..', 'docs', 'rule', `${ruleName}.md`);
      const file = readFileSync(filePath, 'utf8');

      expect(file).toContain(`# ${ruleName}`); // Title header.
      expect(file).toContain('## Examples'); // Examples section header.
      expect(file).toContain('## References');

      if (RULE_NAMES_RECOMMENDED.has(ruleName)) {
        expect(file).toContain(CONFIG_MSG_RECOMMENDED);
      } else {
        expect(file).not.toContain(CONFIG_MSG_RECOMMENDED);
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
