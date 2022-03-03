import printResults from '../helpers/print-results.js';

export default class PrettyFormatter {
  constructor(options = {}) {
    this.options = options;
  }

  format(results, todoInfo) {
    let formatConfig = this.options.config.format;

    if (!formatConfig && !formatConfig.formatters) {
      return '';
    }

    for (let formatter of formatConfig.formatters) {
      let formatterOptions = {
        options: Object.assign({}, this.options, {
          format: formatter.name,
        }),
        todoInfo,
        config: this.options.config,
      };

      if (formatter.outputFile) {
        formatterOptions.options.outputFile = formatter.outputFile;
      }

      printResults(results, formatterOptions);
    }
  }
}
