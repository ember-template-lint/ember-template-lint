const path = require('path');

const chalk = require('chalk');
const Generator = require('yeoman-generator');
module.exports = class NewRuleGenerator extends Generator {
  async prompting() {
    this.log(`Generating ${chalk.bold.white('new ember-template-lint rule')}`);

    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'ruleId',
        message: 'Enter a rule ID. (Rule IDs are hyphen case eg. no-sleep-til-brooklyn)',
      },
      {
        type: 'input',
        name: 'ruleDescription',
        message: 'Enter a description of this rule.',
      },
    ]);

    this.options.ruleId = this.answers.ruleId;
    this.options.titleCase = toTitleCase(this.answers.ruleId);
    this.options.ruleDescription = this.answers.ruleDescription;
  }

  writing() {
    this.sourceRoot(path.join(__dirname, 'templates'));

    this.fs.copyTpl(
      this.templatePath('rule.ejs'),
      this.destinationPath(`lib/rules/${this.options.ruleId}.js`),
      this.options
    );

    this.fs.copyTpl(
      this.templatePath('test.ejs'),
      this.destinationPath(`test/unit/rules/${this.options.ruleId}-test.js`),
      this.options
    );

    this.fs.copyTpl(
      this.templatePath('doc.md'),
      this.destinationPath(`docs/rule/${this.options.ruleId}.md`),
      this.options
    );

    this.updateRulesIndex(this.options);
  }

  updateRulesIndex() {
    let rulesIndexPath = this.destinationPath('lib/rules/index.js');
    // eslint-disable-next-line import/no-dynamic-require
    let rules = Object.keys(require(rulesIndexPath));

    rules.push(this.options.ruleId);
    rules.sort();

    this.options.rules = rules;

    this.fs.copyTpl(this.templatePath('rules-index.ejs'), rulesIndexPath, this.options);
  }
};

function toTitleCase(newRuleName) {
  let newRuleClassArray = newRuleName.split('-');
  let newRuleClassArrayCaps = newRuleClassArray.map((element) =>
    element.replace(element.charAt(0), element.charAt(0).toUpperCase())
  );
  let newRuleClassName = newRuleClassArrayCaps.join('');
  return newRuleClassName;
}
