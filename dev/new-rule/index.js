// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const chalk = require('chalk');

const toTitleCase = require('./helpers/to-title-case');

function usage() {
  console.log(`
  node.js-CLI-based generation of new rule template files
  5 things will happen:
  1. a new rule file will be created
  2. a new test file will be created
  3. a new doc file will be created
  4. the rule will be appended to the list of rules in the index (you have to put it in the correct order)
  5. the doc will be appended to the list of docs in the doc index (you have to put it in the correct order)

  Example usage:
  --------------
  Templates use the rule name \`my-new-rule\`, so this example
  creates a functioning/immediately testable rule
  $ yarn new my-new-rule
  $ yarn test my-new-rule
  `);
}

// Some basics that we'll need
const pathUtil = __dirname;
const pathTemplates = path.join(pathUtil, 'templates');
const pathRoot = path.join(pathUtil, '..', '..');

function createNewRuleFile(newRuleName) {
  // Create rule file
  let pathRuleTemplate = path.join(pathTemplates, 'rule.js');
  let pathRuleNew = path.join(pathRoot, 'lib', 'rules', `${newRuleName}.js`);
  let originalContent = fs.readFileSync(pathRuleTemplate, { encoding: 'utf8' });
  let outputContent = originalContent.replace('PlaceholderForRuleClass', toTitleCase(newRuleName));
  fs.writeFileSync(pathRuleNew, outputContent);
  console.log(
    chalk.cyan(`1. Success! New rule ${chalk.yellow(newRuleName)} was created in ${pathRuleNew}`)
  );
}

function createNewTestFile(newRuleName) {
  // Create rule test file
  let pathTestTemplate = path.join(pathTemplates, 'test.js');
  let pathTestNew = path.join(pathRoot, 'test', 'unit', 'rules', `${newRuleName}-test.js`);
  let ruleTestContentOrg = fs.readFileSync(pathTestTemplate, { encoding: 'utf8' });
  let placeholderDasherized = 'placeholder-for-dasherized-rule';
  let placeholderDasherizedRegExp = new RegExp(placeholderDasherized, 'igm');
  let ruleTestContentOut = ruleTestContentOrg.replace(placeholderDasherizedRegExp, newRuleName);
  fs.writeFileSync(pathTestNew, ruleTestContentOut);
  console.log(
    chalk.cyan(
      `2. Success! New test for ${chalk.yellow(newRuleName)} was created in ${pathTestNew}`
    )
  );
}

function createNewRuleDocFile(newRuleName) {
  // Create rule doc file
  let pathDocTemplate = path.join(pathTemplates, 'doc.md');
  let pathDocNew = path.join(pathRoot, 'docs', 'rule', `${newRuleName}.md`);
  let orgContent = fs.readFileSync(pathDocTemplate, { encoding: 'utf8' });
  let placeholderDocTemplate = 'TODO: rule-name-goes-here';
  let outContent = orgContent.replace(placeholderDocTemplate, newRuleName);
  fs.writeFileSync(pathDocNew, outContent);
  console.log(
    chalk.cyan(
      `3. Success! A new doc (template) file for ${chalk.yellow(
        newRuleName
      )} was created in ${pathDocNew}`
    )
  );
}

function insertNewRuleIntoList(newRuleName) {
  // Insert rule into rule list
  let pathRuleList = path.join(pathRoot, 'lib', 'rules', 'index.js');
  let ruleListInsert = `\n  '${newRuleName}': require('./${newRuleName}'),`;
  let ruleListPattern = /\n};/;
  let orgContent = fs.readFileSync(pathRuleList, { encoding: 'utf8' });
  let matches = orgContent.match(ruleListPattern);
  if (matches) {
    let insertIndex = matches.index;
    let prepend = orgContent.slice(0, insertIndex);
    let insert = ruleListInsert;
    let append = orgContent.slice(insertIndex);
    let outContent = prepend + insert + append;
    fs.writeFileSync(pathRuleList, outContent);
    console.log(
      chalk.cyan(
        `5. Success! ${chalk.yellow(
          newRuleName
        )} was appended to ${pathRuleList}: please be sure to alpha sort the list before making a commit!`
      )
    );
  }
}

function main() {
  // CLI Argument: `my-new-rule` (name of new rule to add)
  let ruleName = process.argv[2];
  if (!ruleName || ruleName === '--help' || ruleName === '-h') {
    usage();
    return;
  }
  createNewRuleFile(ruleName);
  createNewTestFile(ruleName);
  createNewRuleDocFile(ruleName);
  insertNewRuleIntoList(ruleName);

  console.log(chalk.red('Please run `yarn update` to update the rules list in README.md.'));
}

main();
