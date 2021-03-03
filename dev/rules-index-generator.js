const fs = require('fs');
const path = require('path');

const Generator = require('yeoman-generator');

module.exports = class RulesIndexGenerator extends Generator {
  get rules() {
    let rulesIndexPath = path.resolve(__dirname, '../lib/rules');

    return fs
      .readdirSync(rulesIndexPath)
      .filter(
        (rule) =>
          !fs.lstatSync(path.join(rulesIndexPath, rule)).isDirectory() &&
          rule !== 'index.js' &&
          rule !== 'base.js'
      )
      .map((rule) => rule.slice(0, -path.extname(rule).length))
      .sort();
  }

  writing() {
    this.sourceRoot(path.join(__dirname, 'templates'));

    this.options.rules = this.rules;

    this.fs.copyTpl(
      this.templatePath('rules-index.ejs'),
      this.destinationPath('lib/rules/index.js'),
      this.options
    );
  }
};
