const { readdirSync, existsSync, readFileSync } = require('fs');
const { join } = require('path');

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

  it('All files under docs/rule/ have a link from docs/rules.md.', function () {
    const docsPath = join(__dirname, '..', '..', 'docs');
    const entryPath = join(docsPath, 'rule');
    const ruleFiles = readdirSync(entryPath).filter(
      (name) => name.endsWith('.md') && name !== '_TEMPLATE_.md'
    );
    const deprecatedRuleFiles = readdirSync(join(entryPath, 'deprecations')).filter((name) =>
      name.endsWith('.md')
    );
    const allRulesFile = readFileSync(join(docsPath, 'rules.md'), {
      encoding: 'utf8',
    });
    ruleFiles.forEach((fileName) => {
      expect(allRulesFile.includes(`(rule/${fileName})`)).toBe(true);
    });
    deprecatedRuleFiles.forEach((fileName) => {
      expect(allRulesFile.includes(`(rule/deprecations/${fileName})`)).toBe(true);
    });
  });

  it('All rules has test files', function () {
    const testsPath = join(__dirname, '..', 'unit', 'rules');
    const ruleFiles = readdirSync(testsPath).filter((name) => name.endsWith('-test.js'));
    const deprecatedRuleFiles = readdirSync(join(testsPath, 'deprecations')).filter((name) =>
      name.endsWith('-test.js')
    );
    expectedRules.forEach((ruleFileName) => {
      const ruleTestFileName = `${ruleFileName}-test.js`;
      expect(ruleFiles.includes(ruleTestFileName)).toBe(true);
    });
    deprecatedRules.forEach((ruleFileName) => {
      const ruleTestFileName = `${ruleFileName}-test.js`;
      expect(deprecatedRuleFiles.includes(ruleTestFileName)).toBe(true);
    });
  });

  it('should have the right contents (title, examples) for each rule documentation file', function () {
    deprecatedRules.forEach((ruleName) => {
      const path = join(__dirname, '..', '..', 'docs', 'rule', 'deprecations', `${ruleName}.md`);
      const file = readFileSync(path, 'utf8');

      expect(file).toContain(`# ${ruleName}`); // Title header.
      expect(file).toContain('## Examples'); // Examples section header.
    });

    expectedRules.forEach((ruleName) => {
      const path = join(__dirname, '..', '..', 'docs', 'rule', `${ruleName}.md`);
      const file = readFileSync(path, 'utf8');

      expect(file).toContain(`# ${ruleName}`); // Title header.
      expect(file).toContain('## Examples'); // Examples section header.
    });
  });
});
