const fs = require('fs');
const builder = require('xmlbuilder');
const Linter = require('../index');

class JsonPrinter {
  constructor(options = {}) {
    this.options = options;
    this.console = options.console || console;
  }

  print(result) {
    fs.writeFileSync('junit-template-lint.xml', this.format(result), 'utf8');
  }

  format(result) {
    let root = builder.create('testsuite');

    let filePaths = Object.keys(result);

    let tests = filePaths.length;
    let failures = 0;

    for (let filePath of filePaths) {
      let fileResult = result[filePath] || [];

      let el = root.element('testcase');
      el.attribute('name', filePath);

      let errors = fileResult.filter(it => it.severity !== Linter.WARNING_SEVERITY);
      if (errors.length !== 0) {
        let failure = el.element('failure');
        failure.text(errors.map(it => this.formatFailure(it)).join('\n'));

        failures += 1;
      }
    }

    root.attribute('tests', tests);
    root.attribute('failures', failures);

    return root.end({ pretty: true });
  }

  formatFailure(error) {
    let line = error.line === undefined ? '-' : error.line;
    let column = error.column === undefined ? '-' : error.column;

    return `${line}:${column}  ${error.message}  ${error.rule}`;
  }
}

module.exports = JsonPrinter;
