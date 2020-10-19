const { buildTodoData, readTodos, getTodoBatches } = require('@ember-template-lint/todo-utils');

module.exports = class TodoHandler {
  constructor(todoStorageDir) {
    this._todoStorageDir = todoStorageDir;
  }

  async processTodos(filePath, results) {
    let existingTodoFiles = readTodos(this._todoStorageDir, filePath);

    let [, itemsToRemoveFromTodos, existingTodos] = await getTodoBatches(
      buildTodoData(results),
      existingTodoFiles
    );

    if (itemsToRemoveFromTodos.size > 0) {
      itemsToRemoveFromTodos.forEach((todoRule) => {
        results.push({
          rule: 'invalid-todo-violation-rule',
          message: `Todo violation passes \`${todoRule}\` rule. Please run \`--fix\` to update todo list.`,
          filePath: todoRule.filePath,
          moduleId: todoRule.moduleId,
          severity: 2,
          isFixable: true,
        });
      });
    }

    [...existingTodos.values()].forEach((todoLintMessage) => {
      let result = results.find(
        (result) =>
          result.filePath === todoLintMessage.filePath &&
          result.ruleId === todoLintMessage.ruleId &&
          result.line === todoLintMessage.line &&
          result.column === todoLintMessage.column
      );

      // set result to -1 so we don't failing linting for todo violations
      result.severity = -1;
    });
  }
};
