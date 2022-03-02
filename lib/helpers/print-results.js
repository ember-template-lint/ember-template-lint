import { loadFormatter } from '../formatters/load-formatter.js';
import writeOutputFile from './write-output-file.js';

export default function printResults(results, { options, todoInfo }) {
  let hasErrors = results.errorCount > 0;
  let hasWarnings = results.warningCount > 0;
  let hasTodos = options.includeTodo && results.todoCount;
  let hasUpdatedTodos = options.updateTodo;

  let formatter = loadFormatter({
    ...options,
    hasResultData: hasErrors || hasWarnings || hasTodos || hasUpdatedTodos,
  });

  if (typeof formatter.format === 'function') {
    let output = formatter.format(results, todoInfo);

    if ('output-file' in options) {
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
