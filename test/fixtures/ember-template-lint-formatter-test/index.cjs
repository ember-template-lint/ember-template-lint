class TestFormatter {
  constructor(options = {}) {
    this.options = options;
    this.console = options.console || console;
  }

  format(results) {
    this.console.log('Custom Formatter Header');
    this.console.log();
    this.console.log(`errors: ${results.errorCount}`);
    this.console.log(`warnings: ${results.warningCount}`);
    this.console.log(`fixable: ${results.fixableErrorCount + results.fixableWarningCount}`);
  }
}

module.exports = TestFormatter;
