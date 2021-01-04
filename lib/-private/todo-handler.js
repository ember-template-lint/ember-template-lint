const {
  buildTodoData,
  getTodoBatches,
  todoStorageDirExists,
  writeTodos,
  readTodosForFilePath,
  applyTodoChanges,
  getTodoStorageDirPath,
} = require('@ember-template-lint/todo-utils');

const { TODO_SEVERITY, WARNING_SEVERITY } = require('../get-config');

module.exports = class TodoHandler {
  constructor(workingDir) {
    this._workingDir = workingDir;
    this._processedResults = [];
  }

  async update(filePath, results, daysToDecay) {
    this._processedResults = this._buildResult(results);

    await writeTodos(this._workingDir, this._processedResults, filePath, daysToDecay);
  }

  async processResults(filePath, results, shouldFix) {
    if (!todoStorageDirExists(this._workingDir)) {
      return results;
    }

    let existingTodoFiles = await readTodosForFilePath(this._workingDir, filePath);

    let [, itemsToRemoveFromTodos, existingTodos] = await getTodoBatches(
      buildTodoData(this._workingDir, this._buildResult(results)),
      existingTodoFiles
    );

    if (itemsToRemoveFromTodos.size > 0) {
      if (shouldFix) {
        applyTodoChanges(
          getTodoStorageDirPath(this._workingDir),
          new Map(),
          itemsToRemoveFromTodos
        );
      } else {
        itemsToRemoveFromTodos.forEach((todo) => {
          results.push({
            rule: 'invalid-todo-violation-rule',
            message: `Todo violation passes \`${todo.ruleId}\` rule. Please run \`--update-todo\` to remove this todo from the todo list.`,
            filePath: todo.filePath,
            moduleId: todo.moduleId,
            severity: 2,
            isFixable: true,
          });
        });
      }
    }

    const today = new Date();

    [...existingTodos.values()].forEach((todo) => {
      if (todo.errorDate instanceof Date && today > todo.errorDate) {
        return;
      }

      let result = results.find(
        (result) =>
          result.filePath === todo.filePath &&
          result.rule === todo.ruleId &&
          result.line === todo.line &&
          result.column === todo.column
      );

      if (todo.warnDate instanceof Date && today > todo.warnDate) {
        result.severity = WARNING_SEVERITY;
      } else {
        result.severity = TODO_SEVERITY;
      }
    });

    return results;
  }

  _buildResult(results) {
    let builtResults = new Map();

    for (const result of results) {
      let resultForFile = builtResults.get(result.filePath);

      if (resultForFile === undefined) {
        resultForFile = {
          filePath: result.filePath,
          messages: [],
          errorCount: 0,
          source: result.source,
        };

        builtResults.set(result.filePath, resultForFile);
      }

      resultForFile.messages.push({ ...result });
      resultForFile.errorCount += 1;
    }
    return [...builtResults.values()];
  }
};
