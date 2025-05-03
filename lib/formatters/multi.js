export default class MultiFormatter {
  constructor(options = {}) {
    this.options = options;
  }

  async format(results, todoInfo) {
    let formatConfig = this.options.config.format;

    if (formatConfig && formatConfig.formatters) {
      // The following disable should be safe. This particular rule does not need to identify
      // cycles that are broken when using dynamic imports. See https://github.com/import-js/eslint-plugin-import/issues/2265
      // eslint-disable-next-line import/no-cycle
      const { default: printResults } = await import('../helpers/print-results.js');
      for (let formatter of formatConfig.formatters) {
        let formatterOptions = {
          options: {
            ...this.options,
            format: formatter.name,
          },
          todoInfo,
          config: this.options.config,
        };

        if (formatter.outputFile) {
          formatterOptions.options.outputFile = formatter.outputFile;
        }

        await printResults(results, formatterOptions);
      }
    }

    return '';
  }
}
