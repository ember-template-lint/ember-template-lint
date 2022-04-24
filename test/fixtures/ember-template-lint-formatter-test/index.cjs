class TestFormatter {
  constructor(options = {}) {
    this.options = options;
  }

  format(results) {
    let output = [];

    output.push(
      'Custom Formatter Header',
      `errors: ${results.errorCount}`,
      `warnings: ${results.warningCount}`,
      `fixable: ${results.fixableErrorCount + results.fixableWarningCount}`
    );

    return output.join('\n');
  }
}

module.exports = TestFormatter;
