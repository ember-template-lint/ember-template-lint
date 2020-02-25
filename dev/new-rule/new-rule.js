/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-unsupported-features/node-builtins */
/* eslint-disable prefer-template */

/**
node.js-CLI-based generation of new rule template files
Example usage: 
--------------
Templates use the rule name `my-new-rule`, so this example
creates a functioning/immediately testable rule
# /path/to/ember-template-lint
$ yarn new my-new-rule
$ yarn test my-new-rule
*/

const fs = require('fs');
const path = require('path');

// CLI Argument: `my-new-rule` (name of new rule to add)
let newRuleName = process.argv[2];

// Utility Filesystem: template files co-localized with this script
let pathUtil = __dirname;
let pathTemplates = path.join(pathUtil, 'templates');
let pathDocTemplate = path.join(pathTemplates, 'doc.md');
let pathRuleTemplate = path.join(pathTemplates, 'rule.js');
let pathTestTemplate = path.join(pathTemplates, 'test.js');

// Parent Filesystem: path/to/ember-template-lint
let pathRoot = path.join(pathUtil, '../..');
let pathDocList = path.join(pathRoot, 'docs', 'rules.md');
let pathDocNew = path.join(pathRoot, 'docs', 'rule', newRuleName + '.md');
let pathRuleList = path.join(pathRoot, 'lib', 'rules', 'index.js');
let pathRuleNew = path.join(pathRoot, 'lib', 'rules', newRuleName + '.js');
let pathTestNew = path.join(pathRoot, 'test', 'unit', 'rules', newRuleName + '-test.js');
let docListAppend = '\n* [' + newRuleName + '](rule/' + newRuleName + '.md)';

fs.copyFileSync(pathDocTemplate, pathDocNew);
fs.copyFileSync(pathRuleTemplate, pathRuleNew);
fs.copyFileSync(pathTestTemplate, pathTestNew);
fs.appendFileSync(pathDocList, docListAppend);

// Feature: inserts new rule information into the rule list for immediate use
function insertNewRuleIntoList(newRuleName, pathRuleListOrg) {
  let ruleListInsert = "\n  '" + newRuleName + "': require('./" + newRuleName + "'),";
  let ruleListPattern = /\n\};/;
  let orgContent = fs.readFileSync(pathRuleListOrg, { encoding: 'utf8' });
  let matches = orgContent.match(ruleListPattern);
  if (matches) {
    let insertIndex = matches.index;
    let prepend = orgContent.slice(0, insertIndex);
    let insert = ruleListInsert;
    let append = orgContent.slice(insertIndex);
    let outContent = prepend + insert + append;
    fs.writeFileSync(pathRuleListOrg, outContent);
  }
}

insertNewRuleIntoList(newRuleName, pathRuleList);
