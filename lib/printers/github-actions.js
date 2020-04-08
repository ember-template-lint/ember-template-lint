const Linter = require('../linter');

class GitHubActionsPrinter {
  constructor(options = {}) {
    this.console = options.console || console;
    this.quiet = Boolean(options.quiet);
  }

  print(results) {
    let files = Object.keys(results.files);
    for (let file of files) {
      let fileResults = results.files[file];
      for (let error of fileResults.messages) {
        if (
          error.severity === Linter.ERROR_SEVERITY ||
          (error.severity === Linter.WARNING_SEVERITY && !this.quiet)
        ) {
          let line = error.line;
          let col = error.column;

          let annotation = this._formatAnnotation(error.message, error.severity, {
            file,
            line,
            col,
          });
          this.console.log(annotation);
        }
      }
    }
  }

  _formatAnnotation(message, errorSeverity, options = {}) {
    message = message || '';

    let output = errorSeverity === Linter.ERROR_SEVERITY ? '::error' : '::warning';

    let outputOptions = Object.keys(options)
      .map((key) => `${key}=${escape(String(options[key]))}`)
      .join(',');

    if (outputOptions) {
      output += ` ${outputOptions}`;
    }

    return `${output}::${escapeData(message)}`;
  }
}

function escapeData(s) {
  return s.replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

function escape(s) {
  return s.replace(/\r/g, '%0D').replace(/\n/g, '%0A').replace(/]/g, '%5D').replace(/;/g, '%3B');
}

module.exports = GitHubActionsPrinter;
