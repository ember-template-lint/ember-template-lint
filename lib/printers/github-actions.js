const Linter = require('../index');

class GitHubActionsPrinter {
  constructor(options = {}) {
    this.console = options.console || console;
  }

  print(errors) {
    let files = Object.keys(errors);
    for (let file of files) {
      let fileErrors = errors[file];
      for (let error of fileErrors) {
        if (
          error.severity === Linter.ERROR_SEVERITY ||
          error.severity === Linter.WARNING_SEVERITY
        ) {
          let line = error.line;
          let col = error.column;

          let annotation = this._formatAnnotation(error.message, { file, line, col });
          this.console.log(annotation);
        }
      }
    }
  }

  _formatAnnotation(message, options = {}) {
    message = message || '';

    let output = '::error';

    let outputOptions = Object.keys(options)
      .map(key => `${key}=${escape(String(options[key]))}`)
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
  return s
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A')
    .replace(/]/g, '%5D')
    .replace(/;/g, '%3B');
}

module.exports = GitHubActionsPrinter;
