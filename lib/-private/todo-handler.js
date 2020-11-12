const {
  buildTodoData,
  readTodos,
  getTodoBatches,
  todoStorageDirExists,
  writeTodos,
} = require('@ember-template-lint/todo-utils');

module.exports = class TodoHandler {
  constructor(workingDir) {
    this._workingDir = workingDir;
    this._processedResults = [];
  }

  get todosEnabled() {
    return todoStorageDirExists(this._workingDir);
  }

  async update(filePath, results) {
    this._processedResults = this._buildResult(results);

    await writeTodos(this._workingDir, this._processedResults);
  }

  async processResults(filePath, results) {
    let existingTodoFiles = await readTodos(this._workingDir, filePath);

    let [, itemsToRemoveFromTodos, existingTodos] = await getTodoBatches(
      buildTodoData(this._workingDir, this._buildResult(results)),
      existingTodoFiles
    );

    if (itemsToRemoveFromTodos.size > 0) {
      itemsToRemoveFromTodos.forEach((todo) => {
        results.push({
          rule: 'invalid-todo-violation-rule',
          message: `Todo violation passes \`${todo}\` rule. Please run \`--fix\` to update todo list.`,
          filePath: todo.filePath,
          moduleId: todo.moduleId,
          severity: 2,
          isFixable: true,
        });
      });
    }

    [...existingTodos.values()].forEach((todo) => {
      let result = results.find(
        (result) =>
          result.filePath === todo.filePath &&
          result.ruleId === todo.ruleId &&
          result.line === todo.line &&
          result.column === todo.column
      );

      // set result to -1 so we don't failing linting for todo violations
      result.severity = -1;
    });
  }

  _buildResult(results) {
    let builtResults = [];

    function buildMessage(result) {
      return {
        rule: result.rule,
        severity: result.severity,
        moduleId: result.moduleId,
        message: result.message,
        line: result.line,
        column: result.column,
        source: result.source,
      };
    }

    for (const result of results) {
      let resultForFile = builtResults.find((r) => r.filePath === result.filePath);

      if (resultForFile) {
        resultForFile.messages.push(buildMessage(result));
        resultForFile.errorCount += 1;
      } else {
        builtResults.push({
          filePath: result.filePath,
          messages: [buildMessage(result)],
          errorCount: 1,
          source: result.source,
        });
      }
    }

    return builtResults;
  }
};
