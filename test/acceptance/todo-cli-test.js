import { vi } from 'vitest';

import { todoStorageFileExists, writeTodos, readTodoData } from '@lint-todo/utils';
import { differenceInDays, subDays } from 'date-fns';

import { setupProject, teardownProject, runBin } from '../helpers/bin-tester.js';
import setupEnvVar from '../helpers/setup-env-var.js';

vi.setConfig({ testTimeout: 10_000 })

function buildReadOptions() {
  return { engine: 'ember-template-lint' };
}

describe('todo usage', () => {
  setupEnvVar('FORCE_COLOR', '0');

  // Fake project
  let project;
  beforeEach(async function () {
    project = await setupProject();
    await project.chdir();
  });

  afterEach(function () {
    teardownProject();
  });

  describe('with/without --update-todo and --include-todo params', function () {
    it('errors if todo config exists in both package.json and .lint-todorc.js', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs': '<h2>Here too!!</h2><div>Bare strings are bad...</div>',
          },
        },
      });

      await project.setShorthandPackageJsonTodoConfig({
        warn: 5,
        error: 10,
      });

      await project.setLintTodorc({
        warn: 5,
        error: 10,
      });

      let result = await runBin('.');

      expect(result.exitCode).toEqual(1);
      expect(result.stderr).toMatchInlineSnapshot(
        `"You cannot have todo configurations in both package.json and .lint-todorc.js. Please move the configuration from the package.json to the .lint-todorc.js"`
      );
    });

    it('does not create `.lint-todo` file without --update-todo param', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs': '<h2>Here too!!</h2><div>Bare strings are bad...</div>',
          },
        },
      });

      let result = await runBin('.');

      expect(todoStorageFileExists(project.baseDir)).toEqual(false);
      expect(result.stdout).toBeTruthy();
    });

    it('errors if using either --todo-days-to-warn or --todo-days-to-error without --update-todo', async function () {
      let result = await runBin('.', '--todo-days-to-warn', '10');

      expect(result.exitCode).toEqual(1);
      expect(result.stderr).toContain(
        'Using `--todo-days-to-warn` or `--todo-days-to-error` is only valid when the `--update-todo` option is being used.'
      );

      result = await runBin('.', '--todo-days-to-error', '10');

      expect(result.exitCode).toEqual(1);
      expect(result.stderr).toContain(
        'Using `--todo-days-to-warn` or `--todo-days-to-error` is only valid when the `--update-todo` option is being used.'
      );
    });

    it('generates no todos for no errors', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs': '<h2>{{@notBare}}</h2>',
          },
        },
      });

      await runBin('.', '--update-todo');

      const result = readTodoData(project.baseDir, buildReadOptions());

      expect(result.size).toEqual(0);
    });

    it('generates todos for existing errors', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
          'no-html-comments': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs':
              '<div>Bare strings are bad...</div><span>Very bad</span><!-- bad comment -->',
          },
        },
      });

      let result = await runBin('.', '--update-todo');

      expect(result.exitCode).toEqual(0);
      expect(todoStorageFileExists(project.baseDir)).toEqual(true);
    });

    it('generates todos for existing errors, and correctly reports todo severity when file is edited to trigger fuzzy match', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
          'no-html-comments': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs':
              '<div>Bare strings are bad...</div><span>Very bad</span><!-- bad comment -->',
          },
        },
      });

      let result = await runBin('.', '--update-todo');

      expect(result.exitCode).toEqual(0);
      expect(todoStorageFileExists(project.baseDir)).toEqual(true);
      expect(readTodoData(project.baseDir, buildReadOptions()).size).toEqual(3);

      await project.write({
        app: {
          templates: {
            'application.hbs': `

              <div>Bare strings are bad...</div><span>Very bad</span>

              <!-- bad comment -->`,
          },
        },
      });

      result = await runBin('.');

      expect(result.exitCode).toEqual(0);
      expect(result.stdout).toEqual('');
    });

    it('does not remove todos from another engine', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
          'no-html-comments': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs':
              '<div>Bare strings are bad...</div><span>Very bad</span><!-- bad comment -->',
          },
        },
      });

      writeTodos(project.baseDir, [
        {
          engine: 'ember-template-lint',
          filePath: '{{path}}/app/controllers/settings.js',
          ruleId: 'no-prototype-builtins',
          range: {
            start: {
              line: 25,
              column: 21,
            },
            end: {
              line: 25,
              column: 35,
            },
          },
          source: '',
        },
      ]);

      const result = await runBin('.', '--update-todo');

      expect(result.exitCode).toEqual(0);
      expect(result.stdout).toMatch(/.*✔ 3 todos created, 0 todos removed/);
    });

    it('does not remove todos if custom config params are used', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
            'foo.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      await runBin('.', '--update-todo');

      let todos = readTodoData(project.baseDir, buildReadOptions());

      expect(todos.size).toEqual(2);

      await project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
            'foo.hbs': '<div>{{foo}}</div><!-- such comment -->',
          },
        },
      });

      await runBin(
        '.',
        '--rule',
        'no-html-comments:error',
        '--update-todo',
        '--no-inline-config',
        '--no-config-path'
      );

      todos = readTodoData(project.baseDir, buildReadOptions());

      expect(todos.size).toEqual(3);
    });

    it('does not remove todos if custom config params are used with subsequent invocations', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
          'no-html-comments': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
            'foo.hbs': '<div>Bare strings are bad...</div><!-- violation -->',
          },
        },
      });

      await runBin('.', '--update-todo');

      let todos = readTodoData(project.baseDir, buildReadOptions());

      expect(todos.size).toEqual(3);

      let result = await runBin(
        '.',
        '--rule',
        'no-html-comments:error',
        '--update-todo',
        '--no-inline-config',
        '--no-config-path'
      );

      todos = readTodoData(project.baseDir, buildReadOptions());

      expect(result.exitCode).toEqual(0);
      expect(todos.size).toEqual(3);
    });

    describe('cleaning todos in CI', () => {
      setupEnvVar('CI', true);
      setupEnvVar('GITHUB_ACTIONS', true);

      it('errors if a todo item is no longer valid when running without params, and cleans using --fix', async function () {
        await project.setConfig({
          rules: {
            'require-button-type': true,
          },
        });

        await project.write({
          app: {
            templates: {
              'require-button-type.hbs': '<button>Klikk</button>',
            },
          },
        });

        // generate todo based on existing error
        await runBin('.', '--update-todo');

        // mimic fixing the error manually via user interaction
        await project.write({
          app: {
            templates: {
              'require-button-type.hbs': '<button type="submit">Klikk</button>',
            },
          },
        });

        // run normally and expect an error for not running --fix
        let result = await runBin('.');

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/require-button-type.hbs
            -:-  error  Todo violation passes \`require-button-type\` rule. Please run \`npx ember-template-lint app/templates/require-button-type.hbs --clean-todo\` to remove this todo from the todo list.  invalid-todo-violation-rule

          ✖ 1 problems (1 errors, 0 warnings)
            1 errors and 0 warnings potentially fixable with the \`--fix\` option."
        `);

        // run fix, and expect that this will delete the outstanding todo item
        await runBin('app/templates/require-button-type.hbs', '--fix');

        // run normally again and expect no error
        result = await runBin('.');

        expect(result.exitCode).toEqual(0);
        expect(result.stdout).toEqual('');
        expect(readTodoData(project.baseDir, buildReadOptions()).size).toEqual(0);
      });

      it('errors if a todo item is no longer valid when running without params, and cleans using --clean-todo', async function () {
        await project.setConfig({
          rules: {
            'require-button-type': true,
          },
        });

        await project.write({
          app: {
            templates: {
              'require-button-type.hbs': '<button>Klikk</button>',
            },
          },
        });

        // generate todo based on existing error
        await runBin('.', '--update-todo');

        // mimic fixing the error manually via user interaction
        await project.write({
          app: {
            templates: {
              'require-button-type.hbs': '<button type="submit">Klikk</button>',
            },
          },
        });

        // run normally and expect an error for not running --fix
        let result = await runBin('.');

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/require-button-type.hbs
            -:-  error  Todo violation passes \`require-button-type\` rule. Please run \`npx ember-template-lint app/templates/require-button-type.hbs --clean-todo\` to remove this todo from the todo list.  invalid-todo-violation-rule

          ✖ 1 problems (1 errors, 0 warnings)
            1 errors and 0 warnings potentially fixable with the \`--fix\` option."
        `);

        // run fix, and expect that this will delete the outstanding todo item
        await runBin('app/templates/require-button-type.hbs', '--clean-todo');

        // run normally again and expect no error
        result = await runBin('.');

        expect(result.exitCode).toEqual(0);
        expect(result.stdout).toEqual('');
        expect(readTodoData(project.baseDir, buildReadOptions()).size).toEqual(0);
      });
    });

    describe('cleaning todos not in CI', () => {
      setupEnvVar('CI', null);
      setupEnvVar('GITHUB_ACTIONS', null);

      it('errors if a todo item is no longer valid when running with --no-clean-todo, and cleans using --fix', async function () {
        await project.setConfig({
          rules: {
            'require-button-type': true,
          },
        });

        await project.write({
          app: {
            templates: {
              'require-button-type.hbs': '<button>Klikk</button>',
            },
          },
        });

        // generate todo based on existing error
        await runBin('.', '--update-todo');

        // mimic fixing the error manually via user interaction
        await project.write({
          app: {
            templates: {
              'require-button-type.hbs': '<button type="submit">Klikk</button>',
            },
          },
        });

        // run normally with --no-clean-todo and expect an error for not running --fix
        let result = await runBin('.', '--no-clean-todo');

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/require-button-type.hbs
            -:-  error  Todo violation passes \`require-button-type\` rule. Please run \`npx ember-template-lint app/templates/require-button-type.hbs --clean-todo\` to remove this todo from the todo list.  invalid-todo-violation-rule

          ✖ 1 problems (1 errors, 0 warnings)
            1 errors and 0 warnings potentially fixable with the \`--fix\` option."
        `);

        // run fix, and expect that this will delete the outstanding todo item
        await runBin('app/templates/require-button-type.hbs', '--fix');

        // run normally again and expect no error
        result = await runBin('.');

        expect(result.exitCode).toEqual(0);
        expect(result.stdout).toEqual('');
        expect(readTodoData(project.baseDir, buildReadOptions()).size).toEqual(0);
      });

      it('errors if a todo item is no longer valid when running with --no-clean-todo, and cleans without --no-clean-todo', async function () {
        await project.setConfig({
          rules: {
            'require-button-type': true,
          },
        });

        await project.write({
          app: {
            templates: {
              'require-button-type.hbs': '<button>Klikk</button>',
            },
          },
        });

        // generate todo based on existing error
        await runBin('.', '--update-todo');

        // mimic fixing the error manually via user interaction
        await project.write({
          app: {
            templates: {
              'require-button-type.hbs': '<button type="submit">Klikk</button>',
            },
          },
        });

        // run normally with --no-clean-todo and expect an error for not running --fix
        let result = await runBin('.', '--no-clean-todo');

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/require-button-type.hbs
            -:-  error  Todo violation passes \`require-button-type\` rule. Please run \`npx ember-template-lint app/templates/require-button-type.hbs --clean-todo\` to remove this todo from the todo list.  invalid-todo-violation-rule

          ✖ 1 problems (1 errors, 0 warnings)
            1 errors and 0 warnings potentially fixable with the \`--fix\` option."
        `);

        // run fix, and expect that this will delete the outstanding todo item
        await runBin('app/templates/require-button-type.hbs');

        // run normally again and expect no error
        result = await runBin('.');

        expect(result.exitCode).toEqual(0);
        expect(result.stdout).toEqual('');
        expect(readTodoData(project.baseDir, buildReadOptions()).size).toEqual(0);
      });
    });

    it('outputs empty summary for no todos or errors', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs': '<div>{{@foo}}</div>',
          },
        },
      });

      let result = await runBin('.', '--update-todo');

      expect(result.stdout).toMatchInlineSnapshot(
        `"✔ 0 todos created, 0 todos removed (warn after 30, error after 60 days)"`
      );
    });

    it('outputs empty summary for existing todos', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      // generate todos
      await runBin('.', '--update-todo');

      // running again should return no results
      let result = await runBin('.');

      expect(result.stdout).toEqual('');
    });

    it('with --update-todo but no todos, outputs todos created summary', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs': '<div>{{someString}}</div>',
          },
        },
      });

      let result = await runBin('.', '--update-todo');

      expect(result.stdout).toMatchInlineSnapshot(
        `"✔ 0 todos created, 0 todos removed (warn after 30, error after 60 days)"`
      );
    });

    it('with --update-todo, outputs todos created summary', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      let result = await runBin('.', '--update-todo');

      expect(result.stdout).toMatchInlineSnapshot(
        `"✔ 1 todos created, 0 todos removed (warn after 30, error after 60 days)"`
      );
    });

    it('with --update-todo, outputs todos created summary for multiple errors', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
            'foo.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      let result = await runBin('.', '--update-todo');

      expect(result.stdout).toMatchInlineSnapshot(
        `"✔ 2 todos created, 0 todos removed (warn after 30, error after 60 days)"`
      );
    });

    it('with --update-todo, outputs todos created summary with warn info', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      let result = await runBin('.', '--update-todo', '--todo-days-to-warn', '10');

      expect(result.stdout).toMatchInlineSnapshot(
        `"✔ 1 todos created, 0 todos removed (warn after 10 days)"`
      );
    });

    it('with --update-todo, outputs todos created summary with error info', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      let result = await runBin('.', '--update-todo', '--todo-days-to-error', '10');

      expect(result.stdout).toMatchInlineSnapshot(
        `"✔ 1 todos created, 0 todos removed (error after 10 days)"`
      );
    });

    it('with --update-todo, outputs todos created summary with warn and error info', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      let result = await runBin(
        '.',
        '--update-todo',
        '--todo-days-to-warn',
        '5',
        '--todo-days-to-error',
        '10'
      );

      expect(result.stdout).toMatchInlineSnapshot(
        `"✔ 1 todos created, 0 todos removed (warn after 5, error after 10 days)"`
      );
    });

    it('with --include-todo param and --update-todo, outputs todos in results', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      let result = await runBin('.', '--update-todo', '--include-todo');

      expect(result.stdout).toMatchInlineSnapshot(`
        "app/templates/application.hbs
          1:5  todo  Non-translated string used  no-bare-strings

        ✖ 1 problems (0 errors, 0 warnings, 1 todos)
        ✔ 1 todos created, 0 todos removed (warn after 30, error after 60 days)"
      `);
    });

    it('with --include-todo param and existing todos, outputs todos in results', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      // generate todos
      await runBin('.', '--update-todo');

      // running again with --include-todo should return todo summary
      let result = await runBin('.', '--include-todo');

      expect(result.stdout).toMatchInlineSnapshot(`
        "app/templates/application.hbs
          1:5  todo  Non-translated string used  no-bare-strings

        ✖ 1 problems (0 errors, 0 warnings, 1 todos)"
      `);
    });

    it('should set todo to error if errorDate has expired via env var', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      await runBin('.', '--update-todo', {
        env: {
          TODO_CREATED_DATE: subDays(new Date(), 10).toJSON(),
          TODO_DAYS_TO_ERROR: 5,
        },
      });

      const result = await runBin('.');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toMatchInlineSnapshot(`
        "app/templates/application.hbs
          1:5  error  Non-translated string used  no-bare-strings

        ✖ 1 problems (1 errors, 0 warnings)"
      `);
    });

    it('should set todo to error if errorDate has expired via option', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      await runBin('.', '--update-todo', '--todo-days-to-error', '5', {
        env: {
          TODO_CREATED_DATE: subDays(new Date(), 10).toJSON(),
        },
      });

      const result = await runBin('.');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toMatchInlineSnapshot(`
        "app/templates/application.hbs
          1:5  error  Non-translated string used  no-bare-strings

        ✖ 1 problems (1 errors, 0 warnings)"
      `);
    });

    it('should set todo to error if both warnDate and errorDate have expired via options', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs': '<div>Bare strings are bad...</div>',
          },
        },
      });

      await runBin('.', '--update-todo', '--todo-days-to-warn', '5', '--todo-days-to-error', '10', {
        env: {
          TODO_CREATED_DATE: subDays(new Date(), 11).toJSON(),
        },
      });

      const result = await runBin('.');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toMatchInlineSnapshot(`
        "app/templates/application.hbs
          1:5  error  Non-translated string used  no-bare-strings

        ✖ 1 problems (1 errors, 0 warnings)"
      `);
    });

    describe.each([
      {
        name: 'Shorthand todo configuration',
        isLegacy: true,
        setTodoConfig: async (daysToDecay) =>
          await project.setShorthandPackageJsonTodoConfig(daysToDecay),
      },
      {
        name: 'Package.json todo configuration',
        isLegacy: false,
        setTodoConfig: async (daysToDecay, daysToDecayByRule) =>
          await project.setPackageJsonTodoConfig(daysToDecay, daysToDecayByRule),
      },
      {
        name: '.lint-todorc.js todo configuration',
        isLegacy: false,
        setTodoConfig: async (daysToDecay, daysToDecayByRule) =>
          await project.setLintTodorc(daysToDecay, daysToDecayByRule),
      },
    ])(
      '$name',
      ({
        /* eslint-disable-line no-unused-vars -- used in test name */ name,
        isLegacy,
        setTodoConfig,
      }) => {
        it('removes expired todo file if a todo item has expired when running with --clean-todo', async function () {
          await project.setConfig({
            rules: {
              'require-button-type': true,
            },
          });

          await project.write({
            app: {
              templates: {
                'require-button-type.hbs': '<button>Check Expiration</button>',
              },
            },
          });

          await setTodoConfig({
            error: 5,
          });

          // generate todo based on existing error
          await runBin('.', '--update-todo', {
            // change the date so errorDate is before today
            env: {
              TODO_CREATED_DATE: subDays(new Date(), 10).toJSON(),
            },
          });

          // run normally and expect the issue to be back in the error state and there to be no todo
          let result = await runBin('.', '--clean-todo');

          expect(result.exitCode).toEqual(1);
          expect(result.stdout).toMatchInlineSnapshot(`
            "app/templates/require-button-type.hbs
              1:0  error  All \`<button>\` elements should have a valid \`type\` attribute  require-button-type

            ✖ 1 problems (1 errors, 0 warnings)
              1 errors and 0 warnings potentially fixable with the \`--fix\` option."
          `);
          expect(readTodoData(project.baseDir, buildReadOptions()).size).toEqual(0);
        });

        it('should error if daysToDecay.error is less than daysToDecay.warn in config', async function () {
          await project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          await project.write({
            app: {
              templates: {
                'application.hbs': '<div>Bare strings are bad...</div>',
              },
            },
          });
          await setTodoConfig({
            warn: 10,
            error: 5,
          });

          let result = await runBin('.', '--update-todo');

          expect(result.stderr).toMatch(
            'The provided todo configuration contains invalid values. The `warn` value (10) must be less than the `error` value (5).'
          );
        });

        it('should create todos with correct warn date set via config', async function () {
          await project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          await project.write({
            app: {
              templates: {
                'application.hbs': '<div>Bare strings are bad...</div>',
              },
            },
          });
          await setTodoConfig({
            warn: 10,
          });

          let result = await runBin('.', '--update-todo');

          const todos = readTodoData(project.baseDir, buildReadOptions());

          expect(result.exitCode).toEqual(0);

          for (const todo of todos) {
            expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(
              10
            );
          }
        });

        it('should create todos with correct warn date set via env var (overrides config)', async function () {
          await project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          await project.write({
            app: {
              templates: {
                'application.hbs': '<div>Bare strings are bad...</div>',
              },
            },
          });
          await setTodoConfig({
            warn: 10,
          });

          let result = await runBin('.', '--update-todo', {
            env: {
              TODO_DAYS_TO_WARN: '30',
            },
          });

          const todos = readTodoData(project.baseDir, buildReadOptions());

          expect(result.exitCode).toEqual(0);

          for (const todo of todos) {
            expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(
              30
            );
          }
        });

        it('should create todos with correct warn date set via option (overrides env var)', async function () {
          await project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          await project.write({
            app: {
              templates: {
                'application.hbs': '<div>Bare strings are bad...</div>',
              },
            },
          });
          await setTodoConfig({
            warn: 10,
          });

          let result = await runBin('.', '--update-todo', '--todo-days-to-warn', '30', {
            env: {
              TODO_DAYS_TO_WARN: 20,
            },
          });

          const todos = readTodoData(project.baseDir, buildReadOptions());

          expect(result.exitCode).toEqual(0);

          for (const todo of todos) {
            expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(
              30
            );
          }
        });

        it('should create todos with correct error date set via config', async function () {
          await project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          await project.write({
            app: {
              templates: {
                'application.hbs': '<div>Bare strings are bad...</div>',
              },
            },
          });
          await setTodoConfig({
            error: 10,
          });

          let result = await runBin('.', '--update-todo');

          const todos = readTodoData(project.baseDir, buildReadOptions());

          expect(result.exitCode).toEqual(0);

          for (const todo of todos) {
            expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(
              10
            );
          }
        });

        it('should create todos with correct error date set via env var (overrides config)', async function () {
          await project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          await project.write({
            app: {
              templates: {
                'application.hbs': '<div>Bare strings are bad...</div>',
              },
            },
          });
          await setTodoConfig({
            error: 10,
          });

          let result = await runBin('.', '--update-todo', {
            env: {
              TODO_DAYS_TO_ERROR: '30',
            },
          });

          const todos = readTodoData(project.baseDir, buildReadOptions());

          expect(result.exitCode).toEqual(0);

          for (const todo of todos) {
            expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(
              30
            );
          }
        });

        it('should create todos with correct error date set via option (overrides env var)', async function () {
          await project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          await project.write({
            app: {
              templates: {
                'application.hbs': '<div>Bare strings are bad...</div>',
              },
            },
          });
          await setTodoConfig({
            error: 10,
          });

          let result = await runBin('.', '--update-todo', '--todo-days-to-error', '30', {
            env: {
              TODO_DAYS_TO_ERROR: 20,
            },
          });

          const todos = readTodoData(project.baseDir, buildReadOptions());

          expect(result.exitCode).toEqual(0);

          for (const todo of todos) {
            expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(
              30
            );
          }
        });

        it('should create todos with correct dates set for warn and error via config', async function () {
          await project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          await project.write({
            app: {
              templates: {
                'application.hbs': '<div>Bare strings are bad...</div>',
              },
            },
          });
          await setTodoConfig({
            warn: 5,
            error: 10,
          });

          let result = await runBin('.', '--update-todo');

          const todos = readTodoData(project.baseDir, buildReadOptions());

          expect(result.exitCode).toEqual(0);

          for (const todo of todos) {
            expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(
              5
            );
            expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(
              10
            );
          }
        });

        it('should create todos with correct dates set for warn and error via env vars (overrides config)', async function () {
          await project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          await project.write({
            app: {
              templates: {
                'application.hbs': '<div>Bare strings are bad...</div>',
              },
            },
          });
          await setTodoConfig({
            warn: 5,
            error: 10,
          });

          let result = await runBin('.', '--update-todo', {
            env: {
              TODO_DAYS_TO_WARN: 10,
              TODO_DAYS_TO_ERROR: 20,
            },
          });

          const todos = readTodoData(project.baseDir, buildReadOptions());

          expect(result.exitCode).toEqual(0);

          for (const todo of todos) {
            expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(
              10
            );
            expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(
              20
            );
          }
        });

        it('should create todos with correct dates set for warn and error via options (overrides env vars)', async function () {
          await project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          await project.write({
            app: {
              templates: {
                'application.hbs': '<div>Bare strings are bad...</div>',
              },
            },
          });
          await setTodoConfig({
            warn: 5,
            error: 10,
          });

          let result = await runBin(
            '.',
            '--update-todo',
            '--todo-days-to-warn',
            '10',
            '--todo-days-to-error',
            '20',
            {
              env: {
                TODO_DAYS_TO_WARN: 7,
                TODO_DAYS_TO_ERROR: 11,
              },
            }
          );

          const todos = readTodoData(project.baseDir, buildReadOptions());

          expect(result.exitCode).toEqual(0);

          for (const todo of todos) {
            expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(
              10
            );
            expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(
              20
            );
          }
        });

        it('should create todos with correct dates set for error while excluding warn', async function () {
          await project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          await project.write({
            app: {
              templates: {
                'application.hbs': '<div>Bare strings are bad...</div>',
              },
            },
          });
          await setTodoConfig({
            warn: 5,
            error: 10,
          });

          let result = await runBin(
            '.',
            '--update-todo',
            '--no-todo-days-to-warn',
            '--todo-days-to-error',
            '20'
          );

          const todos = readTodoData(project.baseDir, buildReadOptions());

          expect(result.exitCode).toEqual(0);

          for (const todo of todos) {
            expect(todo.warnDate).toBeFalsy();
            expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(
              20
            );
          }
        });

        it('should set to todo if warnDate is not expired', async function () {
          await project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          await project.write({
            app: {
              templates: {
                'application.hbs': '<div>Bare strings are bad...</div>',
              },
            },
          });

          await setTodoConfig({
            warn: 5,
          });

          let result = await runBin('.', '--update-todo');

          result = await runBin('.', '--include-todo');

          expect(result.exitCode).toEqual(0);
          expect(result.stdout).toMatchInlineSnapshot(`
            "app/templates/application.hbs
              1:5  todo  Non-translated string used  no-bare-strings

            ✖ 1 problems (0 errors, 0 warnings, 1 todos)"
          `);
        });

        it('should set to todo if errorDate is not expired', async function () {
          await project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          await project.write({
            app: {
              templates: {
                'application.hbs': '<div>Bare strings are bad...</div>',
              },
            },
          });

          await setTodoConfig({
            error: 5,
          });

          let result = await runBin('.', '--update-todo');

          result = await runBin('.', '--include-todo');

          expect(result.exitCode).toEqual(0);
          expect(result.stdout).toMatchInlineSnapshot(`
            "app/templates/application.hbs
              1:5  todo  Non-translated string used  no-bare-strings

            ✖ 1 problems (0 errors, 0 warnings, 1 todos)"
          `);
        });

        it('should set todo to warn if warnDate has expired via config', async function () {
          await project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          await project.write({
            app: {
              templates: {
                'application.hbs': '<div>Bare strings are bad...</div>',
              },
            },
          });

          await setTodoConfig({
            warn: 5,
          });

          await runBin('.', '--update-todo', {
            env: {
              TODO_CREATED_DATE: subDays(new Date(), 10).toJSON(),
            },
          });

          const result = await runBin('.');

          expect(result.exitCode).toEqual(0);
          expect(result.stdout).toMatchInlineSnapshot(`
            "app/templates/application.hbs
              1:5  warning  Non-translated string used  no-bare-strings

            ✖ 1 problems (0 errors, 1 warnings)"
          `);
        });

        it('should set todo to warn if warnDate has expired via option', async function () {
          await project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          await project.write({
            app: {
              templates: {
                'application.hbs': '<div>Bare strings are bad...</div>',
              },
            },
          });

          await runBin('.', '--update-todo', '--todo-days-to-warn', '5', {
            env: {
              TODO_CREATED_DATE: subDays(new Date(), 10).toJSON(),
            },
          });

          const result = await runBin('.');

          expect(result.exitCode).toEqual(0);
          expect(result.stdout).toMatchInlineSnapshot(`
            "app/templates/application.hbs
              1:5  warning  Non-translated string used  no-bare-strings

            ✖ 1 problems (0 errors, 1 warnings)"
          `);
        });

        it('should set todo to warn if warnDate has expired but errorDate has not', async function () {
          await project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          await project.write({
            app: {
              templates: {
                'application.hbs': '<div>Bare strings are bad...</div>',
              },
            },
          });

          await setTodoConfig({
            warn: 5,
            error: 10,
          });

          await runBin('.', '--update-todo', {
            env: {
              TODO_CREATED_DATE: subDays(new Date(), 7).toJSON(),
            },
          });

          const result = await runBin('.');

          expect(result.exitCode).toEqual(0);
          expect(result.stdout).toMatchInlineSnapshot(`
            "app/templates/application.hbs
              1:5  warning  Non-translated string used  no-bare-strings

            ✖ 1 problems (0 errors, 1 warnings)"
          `);
        });

        it('should set todo to error if errorDate has expired via config', async function () {
          await project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          await project.write({
            app: {
              templates: {
                'application.hbs': '<div>Bare strings are bad...</div>',
              },
            },
          });

          await setTodoConfig({
            error: 5,
          });

          await runBin('.', '--update-todo', {
            env: {
              TODO_CREATED_DATE: subDays(new Date(), 10).toJSON(),
            },
          });

          const result = await runBin('.');

          expect(result.exitCode).toEqual(1);
          expect(result.stdout).toMatchInlineSnapshot(`
            "app/templates/application.hbs
              1:5  error  Non-translated string used  no-bare-strings

            ✖ 1 problems (1 errors, 0 warnings)"
          `);
        });

        it('should set todo to error if both warnDate and errorDate have expired via config', async function () {
          await project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          await project.write({
            app: {
              templates: {
                'application.hbs': '<div>Bare strings are bad...</div>',
              },
            },
          });

          await setTodoConfig({
            warn: 5,
            error: 10,
          });

          await runBin('.', '--update-todo', {
            env: {
              TODO_CREATED_DATE: subDays(new Date(), 11).toJSON(),
            },
          });

          const result = await runBin('.');

          expect(result.exitCode).toEqual(1);
          expect(result.stdout).toMatchInlineSnapshot(`
            "app/templates/application.hbs
              1:5  error  Non-translated string used  no-bare-strings

            ✖ 1 problems (1 errors, 0 warnings)"
          `);
        });

        if (!isLegacy) {
          it('should set todos to correct dates for specific rules', async () => {
            await project.setConfig({
              rules: {
                'no-bare-strings': true,
              },
            });
            await project.write({
              app: {
                templates: {
                  'application.hbs': '<div>Bare strings are bad...</div>',
                },
              },
            });

            await setTodoConfig(
              {
                warn: 5,
                error: 10,
              },
              {
                'no-bare-strings': {
                  warn: 10,
                  error: 20,
                },
              }
            );

            let result = await runBin('.', '--update-todo');

            const todos = readTodoData(project.baseDir, buildReadOptions());

            expect(result.exitCode).toEqual(0);

            for (const todo of todos) {
              expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(
                10
              );
              expect(
                differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))
              ).toEqual(20);
            }
          });
        }
      }
    );
  });
});
