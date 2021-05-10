const fs = require('fs');

const {
  ensureTodoStorageDir,
  todoStorageDirExists,
  readTodos,
  getTodoStorageDirPath,
  writeTodos,
} = require('@ember-template-lint/todo-utils');
const { differenceInDays, subDays } = require('date-fns');

const Project = require('../helpers/fake-project');
const run = require('../helpers/run');
const setupEnvVar = require('../helpers/setup-env-var');

const ROOT = process.cwd();

describe('todo usage', () => {
  setupEnvVar('FORCE_COLOR', '0');

  // Fake project
  let project;
  beforeEach(function () {
    project = Project.defaultSetup();
    project.chdir();
  });

  afterEach(async function () {
    process.chdir(ROOT);
    await project.dispose();
  });

  describe('with/without --update-todo and --include-todo params', function () {
    it('does not create `.lint-todo` dir without --update-todo param', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
        pending: [
          {
            moduleId: 'app/templates/application',
            only: ['no-html-comments'],
          },
        ],
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<h2>Here too!!</h2><div>Bare strings are bad...</div>',
          },
        },
      });

      let result = await run(['.']);

      expect(todoStorageDirExists(project.baseDir)).toEqual(false);
      expect(result.stdout).toBeTruthy();
    });

    it('errors when config.pending and `.lint-todo` dir coexist', async function () {
      await ensureTodoStorageDir(project.baseDir);

      project.setConfig({
        pending: [
          {
            moduleId: 'app/templates/application',
            only: ['no-html-comments'],
          },
        ],
      });

      let result = await run(['.']);

      expect(result.stderr).toBeTruthy();
    });

    it('errors if config.pending is present when running with --update-todo', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
        pending: [
          {
            moduleId: 'app/templates/application',
            only: ['no-html-comments'],
          },
        ],
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<h2>Here too!!</h2><div>Bare strings are bad...</div>',
          },
        },
      });

      let result = await run(['.', '--update-todo']);

      expect(result.exitCode).toEqual(1);
      expect(result.stderr).toContain(
        'Cannot use the `pending` config option in conjunction with `--update-todo`. Please remove the `pending` option from your config and re-run the command.'
      );
    });

    it('errors if using either --todo-days-to-warn or --todo-days-to-error without --update-todo', async function () {
      let result = await run(['.', '--todo-days-to-warn', '10']);

      expect(result.exitCode).toEqual(1);
      expect(result.stderr).toContain(
        'Using `--todo-days-to-warn` or `--todo-days-to-error` is only valid when the `--update-todo` option is being used.'
      );

      result = await run(['.', '--todo-days-to-error', '10']);

      expect(result.exitCode).toEqual(1);
      expect(result.stderr).toContain(
        'Using `--todo-days-to-warn` or `--todo-days-to-error` is only valid when the `--update-todo` option is being used.'
      );
    });

    it('generates no todos for no errors', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<h2>{{@notBare}}</h2>',
          },
        },
      });

      await run(['.', '--update-todo']);

      const result = await readTodos(project.baseDir);

      expect(result.size).toEqual(0);
    });

    it('generates todos for existing errors', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
          'no-html-comments': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs':
              '<div>Bare strings are bad...</div><span>Very bad</span><!-- bad comment -->',
          },
        },
      });

      let result = await run(['.', '--update-todo']);

      expect(result.exitCode).toEqual(0);
      expect(todoStorageDirExists(project.baseDir)).toEqual(true);
    });

    it('does not remove todos from another engine', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
          'no-html-comments': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs':
              '<div>Bare strings are bad...</div><span>Very bad</span><!-- bad comment -->',
          },
        },
      });

      await writeTodos(project.baseDir, [
        {
          filePath: '{{path}}/app/controllers/settings.js',
          messages: [
            {
              ruleId: 'no-prototype-builtins',
              severity: 2,
              message: "Do not access Object.prototype method 'hasOwnProperty' from target object.",
              line: 25,
              column: 21,
              nodeType: 'CallExpression',
              messageId: 'prototypeBuildIn',
              endLine: 25,
              endColumn: 35,
            },
          ],
          errorCount: 1,
          warningCount: 0,
          fixableErrorCount: 0,
          fixableWarningCount: 0,
          source: '',
        },
      ]);

      const result = await run(['.', '--update-todo']);

      expect(result.exitCode).toEqual(0);
      expect(result.stdout).toMatch(/.*✔ 3 todos created, 0 todos removed/);
    });

    it('does not remove todos if custom config params are used', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
            'foo.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      await run(['.', '--update-todo']);

      let todos = [...(await readTodos(project.baseDir)).values()];

      expect(todos).toHaveLength(2);

      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
            'foo.hbs': '<div>{{foo}}</div><!-- such comment -->',
          },
        },
      });

      await run([
        '.',
        '--rule',
        'no-html-comments:error',
        '--update-todo',
        '--no-inline-config',
        '--no-config-path',
      ]);

      todos = [...(await readTodos(project.baseDir)).values()];

      expect(todos).toHaveLength(3);
    });

    it('does not remove todos if custom config params are used with subsequent invocations', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
          'no-html-comments': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
            'foo.hbs': '<div>Bare strings are bad...</div><!-- violation -->',
          },
        },
      });

      await run(['.', '--update-todo']);

      let todos = [...(await readTodos(project.baseDir)).values()];

      expect(todos).toHaveLength(3);

      let result = await run([
        '.',
        '--rule',
        'no-html-comments:error',
        '--update-todo',
        '--no-inline-config',
        '--no-config-path',
      ]);

      todos = [...(await readTodos(project.baseDir)).values()];

      expect(result.exitCode).toEqual(0);
      expect(todos).toHaveLength(3);
    });

    it('errors if a todo item is no longer valid when running without params, and cleans using --fix', async function () {
      project.setConfig({
        rules: {
          'require-button-type': true,
        },
      });

      project.write({
        app: {
          templates: {
            'require-button-type.hbs': '<button>Klikk</button>',
          },
        },
      });

      // generate todo based on existing error
      await run(['.', '--update-todo']);

      // mimic fixing the error manually via user interaction
      project.write({
        app: {
          templates: {
            'require-button-type.hbs': '<button type="submit">Klikk</button>',
          },
        },
      });

      // run normally and expect an error for not running --fix
      let result = await run(['.']);

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toMatchInlineSnapshot(`
        "app/templates/require-button-type.hbs
          -:-  error  Todo violation passes \`require-button-type\` rule. Please run \`ember-template-lint app/templates/require-button-type.hbs --clean-todo\` to remove this todo from the todo list.  invalid-todo-violation-rule

        ✖ 1 problems (1 errors, 0 warnings)
          1 errors and 0 warnings potentially fixable with the \`--fix\` option."
      `);

      // run fix, and expect that this will delete the outstanding todo item
      await run(['app/templates/require-button-type.hbs', '--fix']);

      // run normally again and expect no error
      result = await run(['.']);

      let todoDirs = fs.readdirSync(getTodoStorageDirPath(project.baseDir));

      expect(result.exitCode).toEqual(0);
      expect(result.stdout).toEqual('');
      expect(todoDirs).toHaveLength(0);
    });

    it('errors if a todo item is no longer valid when running without params, and cleans using --clean-todo', async function () {
      project.setConfig({
        rules: {
          'require-button-type': true,
        },
      });

      project.write({
        app: {
          templates: {
            'require-button-type.hbs': '<button>Klikk</button>',
          },
        },
      });

      // generate todo based on existing error
      await run(['.', '--update-todo']);

      // mimic fixing the error manually via user interaction
      project.write({
        app: {
          templates: {
            'require-button-type.hbs': '<button type="submit">Klikk</button>',
          },
        },
      });

      // run normally and expect an error for not running --fix
      let result = await run(['.']);

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toMatchInlineSnapshot(`
        "app/templates/require-button-type.hbs
          -:-  error  Todo violation passes \`require-button-type\` rule. Please run \`ember-template-lint app/templates/require-button-type.hbs --clean-todo\` to remove this todo from the todo list.  invalid-todo-violation-rule

        ✖ 1 problems (1 errors, 0 warnings)
          1 errors and 0 warnings potentially fixable with the \`--fix\` option."
      `);

      // run fix, and expect that this will delete the outstanding todo item
      await run(['app/templates/require-button-type.hbs', '--clean-todo']);

      // run normally again and expect no error
      result = await run(['.']);

      let todoDirs = fs.readdirSync(getTodoStorageDirPath(project.baseDir));

      expect(result.exitCode).toEqual(0);
      expect(result.stdout).toEqual('');
      expect(todoDirs).toHaveLength(0);
    });

    it('removes expired todo file if a todo item has expired when running without params', async function () {
      project.setConfig({
        rules: {
          'require-button-type': true,
        },
      });

      project.write({
        app: {
          templates: {
            'require-button-type.hbs': '<button>Check Expiration</button>',
          },
        },
      });

      project.writeTodoConfig({
        error: 5,
      });

      // generate todo based on existing error
      await run(['.', '--update-todo'], {
        // change the date so errorDate is before today
        env: {
          TODO_CREATED_DATE: subDays(new Date(), 10).toJSON(),
        },
      });

      // run normally and expect the issue to be back in the error state and there to be no todo
      let result = await run(['.']);

      let todoDirs = fs.readdirSync(getTodoStorageDirPath(project.baseDir));

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toMatchInlineSnapshot(`
        "app/templates/require-button-type.hbs
          1:0  error  All \`<button>\` elements should have a valid \`type\` attribute  require-button-type

        ✖ 1 problems (1 errors, 0 warnings)
          1 errors and 0 warnings potentially fixable with the \`--fix\` option."
      `);
      expect(todoDirs).toHaveLength(0);
    });

    it('outputs empty summary for no todos or errors', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>{{@foo}}</div>',
          },
        },
      });

      let result = await run(['.', '--update-todo']);

      expect(result.stdout).toMatchInlineSnapshot(
        `"✔ 0 todos created, 0 todos removed (warn after 30, error after 60 days)"`
      );
    });

    it('outputs empty summary for existing todos', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      // generate todos
      await run(['.', '--update-todo']);

      // running again should return no results
      let result = await run(['.']);

      expect(result.stdout).toEqual('');
    });

    it('with --update-todo but no todos, outputs todos created summary', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>{{someString}}</div>',
          },
        },
      });

      let result = await run(['.', '--update-todo']);

      expect(result.stdout).toMatchInlineSnapshot(
        `"✔ 0 todos created, 0 todos removed (warn after 30, error after 60 days)"`
      );
    });

    it('with --update-todo, outputs todos created summary', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      let result = await run(['.', '--update-todo']);

      expect(result.stdout).toMatchInlineSnapshot(
        `"✔ 1 todos created, 0 todos removed (warn after 30, error after 60 days)"`
      );
    });

    it('with --update-todo, outputs todos created summary for multiple errors', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
            'foo.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      let result = await run(['.', '--update-todo']);

      expect(result.stdout).toMatchInlineSnapshot(
        `"✔ 2 todos created, 0 todos removed (warn after 30, error after 60 days)"`
      );
    });

    it('with --update-todo, outputs todos created summary with warn info', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      let result = await run(['.', '--update-todo', '--todo-days-to-warn', '10']);

      expect(result.stdout).toMatchInlineSnapshot(
        `"✔ 1 todos created, 0 todos removed (warn after 10 days)"`
      );
    });

    it('with --update-todo, outputs todos created summary with error info', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      let result = await run(['.', '--update-todo', '--todo-days-to-error', '10']);

      expect(result.stdout).toMatchInlineSnapshot(
        `"✔ 1 todos created, 0 todos removed (error after 10 days)"`
      );
    });

    it('with --update-todo, outputs todos created summary with warn and error info', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      let result = await run([
        '.',
        '--update-todo',
        '--todo-days-to-warn',
        '5',
        '--todo-days-to-error',
        '10',
      ]);

      expect(result.stdout).toMatchInlineSnapshot(
        `"✔ 1 todos created, 0 todos removed (warn after 5, error after 10 days)"`
      );
    });

    it('with --include-todo param and --update-todo, outputs todos in results', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      let result = await run(['.', '--update-todo', '--include-todo']);

      expect(result.stdout).toMatchInlineSnapshot(`
        "app/templates/application.hbs
          1:5  todo  Non-translated string used  no-bare-strings

        ✖ 1 problems (0 errors, 0 warnings, 1 todos)
        ✔ 1 todos created, 0 todos removed (warn after 30, error after 60 days)"
      `);
    });

    it('with --include-todo param and existing todos, outputs todos in results', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      // generate todos
      await run(['.', '--update-todo']);

      // running again with --include-todo should return todo summary
      let result = await run(['.', '--include-todo']);

      expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/application.hbs
            1:5  todo  Non-translated string used  no-bare-strings

          ✖ 1 problems (0 errors, 0 warnings, 1 todos)"
        `);
    });

    it('should error if daysToDecay.error is less than daysToDecay.warn in package.json', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });
      project.writeTodoConfig({
        warn: 10,
        error: 5,
      });

      let result = await run(['.', '--update-todo']);

      expect(result.stderr).toMatch(
        'The provided todo configuration contains invalid values. The `warn` value (10) must be less than the `error` value (5).'
      );
    });

    it('should create todos with correct warn date set via package.json', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });
      project.writeTodoConfig({
        warn: 10,
      });

      let result = await run(['.', '--update-todo']);

      const todos = [...(await readTodos(project.baseDir)).values()];

      expect(result.exitCode).toEqual(0);

      for (const todo of todos) {
        expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(10);
      }
    });

    it('should create todos with correct warn date set via env var (overrides package.json)', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });
      project.writeTodoConfig({
        warn: 10,
      });

      let result = await run(['.', '--update-todo'], {
        env: {
          TODO_DAYS_TO_WARN: '30',
        },
      });

      const todos = [...(await readTodos(project.baseDir)).values()];

      expect(result.exitCode).toEqual(0);

      for (const todo of todos) {
        expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(30);
      }
    });

    it('should create todos with correct warn date set via option (overrides env var)', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });
      project.writeTodoConfig({
        warn: 10,
      });

      let result = await run(['.', '--update-todo', '--todo-days-to-warn', '30'], {
        env: {
          TODO_DAYS_TO_WARN: 20,
        },
      });

      const todos = [...(await readTodos(project.baseDir)).values()];

      expect(result.exitCode).toEqual(0);

      for (const todo of todos) {
        expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(30);
      }
    });

    it('should create todos with correct error date set via package.json', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });
      project.writeTodoConfig({
        error: 10,
      });

      let result = await run(['.', '--update-todo']);

      const todos = [...(await readTodos(project.baseDir)).values()];

      expect(result.exitCode).toEqual(0);

      for (const todo of todos) {
        expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(10);
      }
    });

    it('should create todos with correct error date set via env var (overrides package.json)', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });
      project.writeTodoConfig({
        error: 10,
      });

      let result = await run(['.', '--update-todo'], {
        env: {
          TODO_DAYS_TO_ERROR: '30',
        },
      });

      const todos = [...(await readTodos(project.baseDir)).values()];

      expect(result.exitCode).toEqual(0);

      for (const todo of todos) {
        expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(30);
      }
    });

    it('should create todos with correct error date set via option (overrides env var)', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });
      project.writeTodoConfig({
        error: 10,
      });

      let result = await run(['.', '--update-todo', '--todo-days-to-error', '30'], {
        env: {
          TODO_DAYS_TO_ERROR: 20,
        },
      });

      const todos = [...(await readTodos(project.baseDir)).values()];

      expect(result.exitCode).toEqual(0);

      for (const todo of todos) {
        expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(30);
      }
    });

    it('should create todos with correct dates set for warn and error via package.json', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });
      project.writeTodoConfig({
        warn: 5,
        error: 10,
      });

      let result = await run(['.', '--update-todo']);

      const todos = [...(await readTodos(project.baseDir)).values()];

      expect(result.exitCode).toEqual(0);

      for (const todo of todos) {
        expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(5);
        expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(10);
      }
    });

    it('should create todos with correct dates set for warn and error via env vars (overrides package.json)', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });
      project.writeTodoConfig({
        warn: 5,
        error: 10,
      });

      let result = await run(['.', '--update-todo'], {
        env: {
          TODO_DAYS_TO_WARN: 10,
          TODO_DAYS_TO_ERROR: 20,
        },
      });

      const todos = [...(await readTodos(project.baseDir)).values()];

      expect(result.exitCode).toEqual(0);

      for (const todo of todos) {
        expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(10);
        expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(20);
      }
    });

    it('should create todos with correct dates set for warn and error via options (overrides env vars)', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });
      project.writeTodoConfig({
        warn: 5,
        error: 10,
      });

      let result = await run(
        ['.', '--update-todo', '--todo-days-to-warn', '10', '--todo-days-to-error', '20'],
        {
          env: {
            TODO_DAYS_TO_WARN: 7,
            TODO_DAYS_TO_ERROR: 11,
          },
        }
      );

      const todos = [...(await readTodos(project.baseDir)).values()];

      expect(result.exitCode).toEqual(0);

      for (const todo of todos) {
        expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(10);
        expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(20);
      }
    });

    it('should create todos with correct dates set for error while excluding warn', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });
      project.writeTodoConfig({
        warn: 5,
        error: 10,
      });

      let result = await run([
        '.',
        '--update-todo',
        '--no-todo-days-to-warn',
        '--todo-days-to-error',
        '20',
      ]);

      const todos = [...(await readTodos(project.baseDir)).values()];

      expect(result.exitCode).toEqual(0);

      for (const todo of todos) {
        expect(todo.warnDate).toBeFalsy();
        expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(20);
      }
    });

    it('should set to todo if warnDate is not expired', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      project.writeTodoConfig({
        warn: 5,
      });

      let result = await run(['.', '--update-todo']);

      result = await run(['.', '--include-todo']);

      expect(result.exitCode).toEqual(0);
      expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/application.hbs
            1:5  todo  Non-translated string used  no-bare-strings

          ✖ 1 problems (0 errors, 0 warnings, 1 todos)"
        `);
    });

    it('should set to todo if errorDate is not expired', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      project.writeTodoConfig({
        error: 5,
      });

      let result = await run(['.', '--update-todo']);

      result = await run(['.', '--include-todo']);

      expect(result.exitCode).toEqual(0);
      expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/application.hbs
            1:5  todo  Non-translated string used  no-bare-strings

          ✖ 1 problems (0 errors, 0 warnings, 1 todos)"
        `);
    });

    it('should set todo to warn if warnDate has expired via config', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      project.writeTodoConfig({
        warn: 5,
      });

      await run(['.', '--update-todo'], {
        env: {
          TODO_CREATED_DATE: subDays(new Date(), 10).toJSON(),
        },
      });

      const result = await run(['.']);

      expect(result.exitCode).toEqual(0);
      expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/application.hbs
            1:5  warning  Non-translated string used  no-bare-strings

          ✖ 1 problems (0 errors, 1 warnings)"
        `);
    });

    it('should set todo to warn if warnDate has expired via option', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      await run(['.', '--update-todo', '--todo-days-to-warn', '5'], {
        env: {
          TODO_CREATED_DATE: subDays(new Date(), 10).toJSON(),
        },
      });

      const result = await run(['.']);

      expect(result.exitCode).toEqual(0);
      expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/application.hbs
            1:5  warning  Non-translated string used  no-bare-strings

          ✖ 1 problems (0 errors, 1 warnings)"
        `);
    });

    it('should set todo to warn if warnDate has expired but errorDate has not', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      project.writeTodoConfig({
        warn: 5,
        error: 10,
      });

      await run(['.', '--update-todo'], {
        env: {
          TODO_CREATED_DATE: subDays(new Date(), 7).toJSON(),
        },
      });

      const result = await run(['.']);

      expect(result.exitCode).toEqual(0);
      expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/application.hbs
            1:5  warning  Non-translated string used  no-bare-strings

          ✖ 1 problems (0 errors, 1 warnings)"
        `);
    });

    it('should set todo to error if errorDate has expired via config', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      project.writeTodoConfig({
        error: 5,
      });

      await run(['.', '--update-todo'], {
        env: {
          TODO_CREATED_DATE: subDays(new Date(), 10).toJSON(),
        },
      });

      const result = await run(['.']);

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/application.hbs
            1:5  error  Non-translated string used  no-bare-strings

          ✖ 1 problems (1 errors, 0 warnings)"
        `);
    });

    it('should set todo to error if errorDate has expired via env var', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      await run(['.', '--update-todo'], {
        env: {
          TODO_CREATED_DATE: subDays(new Date(), 10).toJSON(),
          TODO_DAYS_TO_ERROR: 5,
        },
      });

      const result = await run(['.']);

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/application.hbs
            1:5  error  Non-translated string used  no-bare-strings

          ✖ 1 problems (1 errors, 0 warnings)"
        `);
    });

    it('should set todo to error if errorDate has expired via option', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      await run(['.', '--update-todo', '--todo-days-to-error', '5'], {
        env: {
          TODO_CREATED_DATE: subDays(new Date(), 10).toJSON(),
        },
      });

      const result = await run(['.']);

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/application.hbs
            1:5  error  Non-translated string used  no-bare-strings

          ✖ 1 problems (1 errors, 0 warnings)"
        `);
    });

    it('should set todo to error if both warnDate and errorDate have expired via config', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      project.writeTodoConfig({
        warn: 5,
        error: 10,
      });

      await run(['.', '--update-todo'], {
        env: {
          TODO_CREATED_DATE: subDays(new Date(), 11).toJSON(),
        },
      });

      const result = await run(['.']);

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/application.hbs
            1:5  error  Non-translated string used  no-bare-strings

          ✖ 1 problems (1 errors, 0 warnings)"
        `);
    });

    it('should set todo to error if both warnDate and errorDate have expired via options', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      await run(['.', '--update-todo', '--todo-days-to-warn', '5', '--todo-days-to-error', '10'], {
        env: {
          TODO_CREATED_DATE: subDays(new Date(), 11).toJSON(),
        },
      });

      const result = await run(['.']);

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/application.hbs
            1:5  error  Non-translated string used  no-bare-strings

          ✖ 1 problems (1 errors, 0 warnings)"
        `);
    });
  });
});
