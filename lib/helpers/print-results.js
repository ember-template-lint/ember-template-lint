// The following disable should be safe. This particular rule does not need to identify
// cycles that are broken when using dynamic imports. See https://github.com/import-js/eslint-plugin-import/issues/2265
// eslint-disable-next-line import/no-cycle
import { loadFormatter } from '../formatters/load-formatter.js';
import writeOutputFile from './write-output-file.js';

export default async function printResults(results, { options, todoInfo, config }) {
  let hasErrors = results.errorCount > 0;
  let hasWarnings = results.warningCount > 0;
  let hasTodos = options.includeTodo && results.todoCount;
  let hasUpdatedTodos = options.updateTodo;

  let formatter = loadFormatter({
    ...options,
    config,
    hasResultData: hasErrors || hasWarnings || hasTodos || hasUpdatedTodos,
  });

  if (typeof formatter.format === 'function') {
    let output = await formatter.format(results, todoInfo);

    if ('outputFile' in options && options.outputFile !== undefined) {
      let outputPath = writeOutputFile(output, formatter.defaultFileExtension || 'txt', options);
      // eslint-disable-next-line no-console
      console.log(`Report written to ${outputPath}`);
    } else {
      // eslint-disable-next-line no-console
      console.log(output);
    }
  } else {
    // support legacy formatters
    formatter.print(results, todoInfo);
  }
}
