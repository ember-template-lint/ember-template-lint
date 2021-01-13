'use strict';
const { readFileSync } = require('fs');
const fs = require('fs');
const path = require('path');

const {
  ensureTodoStorageDir,
  todoStorageDirExists,
  readTodos,
  getTodoStorageDirPath,
} = require('@ember-template-lint/todo-utils');
const { differenceInDays, subDays } = require('date-fns');
const execa = require('execa');

const Project = require('../helpers/fake-project');
const setupEnvVar = require('../helpers/setup-env-var');

const ROOT = process.cwd();

describe('ember-template-lint executable', function () {
  setupEnvVar('FORCE_COLOR', '0');
  setupEnvVar('LC_ALL', 'en_US');

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

  describe('basic usage', function () {
    describe('without any parameters', function () {
      it('should emit help text', async function () {
        let result = await run([]);

        expect(result.exitCode).toEqual(1);
        expect(result.stderr).toMatchInlineSnapshot(`
          "ember-template-lint [options] [files..]

          Options:
            --config-path               Define a custom config path
                                                 [string] [default: \\".template-lintrc.js\\"]
            --config                    Define a custom configuration to be used - (e.g.
                                        '{ \\"rules\\": { \\"no-implicit-this\\": \\"error\\" } }')
                                                                                  [string]
            --quiet                     Ignore warnings and only show errors     [boolean]
            --rule                      Specify a rule and its severity to add that rule
                                        to loaded rules - (e.g. \`no-implicit-this:error\`
                                        or \`rule:[\\"error\\", { \\"allow\\": [\\"some-helper\\"] }]\`)
                                                                                  [string]
            --filename                  Used to indicate the filename to be assumed for
                                        contents from STDIN                       [string]
            --fix                       Fix any errors that are reported as fixable
                                                                [boolean] [default: false]
            --json                      Format output as json                    [boolean]
            --verbose                   Output errors with source description    [boolean]
            --working-directory, --cwd  Path to a directory that should be considered as
                                        the current working directory.
                                                                   [string] [default: \\".\\"]
            --no-config-path            Does not use the local template-lintrc, will use a
                                        blank template-lintrc instead            [boolean]
            --update-todo               Update list of linting todos by transforming lint
                                        errors to todos         [boolean] [default: false]
            --include-todo              Include todos in the results
                                                                [boolean] [default: false]
            --todo-days-to-warn         Number of days after its creation date that a todo
                                        transitions into a warning                [number]
            --todo-days-to-error        Number of days after its creation date that a todo
                                        transitions into an error                 [number]
            --ignore-pattern            Specify custom ignore pattern (can be disabled
                                        with --no-ignore-pattern)
                        [array] [default: [\\"**/dist/**\\",\\"**/tmp/**\\",\\"**/node_modules/**\\"]]
            --no-inline-config          Prevent inline configuration comments from
                                        changing config or rules                 [boolean]
            --help                      Show help                                [boolean]
            --version                   Show version number                      [boolean]"
        `);
      });
    });

    describe('with --help', function () {
      it('should emit help text', async function () {
        let result = await run(['--help']);

        expect(result.exitCode).toEqual(0);
        expect(result.stdout).toMatchInlineSnapshot(`
          "ember-template-lint [options] [files..]

          Options:
            --config-path               Define a custom config path
                                                 [string] [default: \\".template-lintrc.js\\"]
            --config                    Define a custom configuration to be used - (e.g.
                                        '{ \\"rules\\": { \\"no-implicit-this\\": \\"error\\" } }')
                                                                                  [string]
            --quiet                     Ignore warnings and only show errors     [boolean]
            --rule                      Specify a rule and its severity to add that rule
                                        to loaded rules - (e.g. \`no-implicit-this:error\`
                                        or \`rule:[\\"error\\", { \\"allow\\": [\\"some-helper\\"] }]\`)
                                                                                  [string]
            --filename                  Used to indicate the filename to be assumed for
                                        contents from STDIN                       [string]
            --fix                       Fix any errors that are reported as fixable
                                                                [boolean] [default: false]
            --json                      Format output as json                    [boolean]
            --verbose                   Output errors with source description    [boolean]
            --working-directory, --cwd  Path to a directory that should be considered as
                                        the current working directory.
                                                                   [string] [default: \\".\\"]
            --no-config-path            Does not use the local template-lintrc, will use a
                                        blank template-lintrc instead            [boolean]
            --update-todo               Update list of linting todos by transforming lint
                                        errors to todos         [boolean] [default: false]
            --include-todo              Include todos in the results
                                                                [boolean] [default: false]
            --todo-days-to-warn         Number of days after its creation date that a todo
                                        transitions into a warning                [number]
            --todo-days-to-error        Number of days after its creation date that a todo
                                        transitions into an error                 [number]
            --ignore-pattern            Specify custom ignore pattern (can be disabled
                                        with --no-ignore-pattern)
                        [array] [default: [\\"**/dist/**\\",\\"**/tmp/**\\",\\"**/node_modules/**\\"]]
            --no-inline-config          Prevent inline configuration comments from
                                        changing config or rules                 [boolean]
            --help                      Show help                                [boolean]
            --version                   Show version number                      [boolean]"
        `);
      });
    });
  });

  describe('reading files', function () {
    describe('given path to non-existing file', function () {
      it('should exit without error and any console output', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
          },
        });
        project.write({
          app: {
            templates: {
              'application.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
              components: {
                'foo.hbs': '{{fooData}}',
              },
            },
          },
        });

        let result = await run(['app/templates/application-1.hbs']);

        expect(result.exitCode).toEqual(0, 'exits without error');
        expect(result.stdout).toBeFalsy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given path to single file with errors', function () {
      it('should print errors', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
          },
        });
        project.write({
          app: {
            templates: {
              'application.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
              components: {
                'foo.hbs': '{{fooData}}',
              },
            },
          },
        });

        let result = await run(['app/templates/application.hbs']);

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toBeTruthy();
        expect(result.stderr).toBeFalsy();
      });

      it('when using custom working directory', async function () {
        process.chdir(ROOT);

        project.setConfig({
          rules: {
            'no-bare-strings': true,
          },
        });

        project.write({
          app: {
            templates: {
              'application.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
              components: {
                'foo.hbs': '{{fooData}}',
              },
            },
          },
        });

        let result = await run(
          ['--working-directory', project.baseDir, 'app/templates/application.hbs'],
          {
            // run from ember-template-lint's root (forces `--working-directory` to be used)
            cwd: ROOT,
          }
        );

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/application.hbs
            1:4  error  Non-translated string used  no-bare-strings
            1:25  error  Non-translated string used  no-bare-strings

          ✖ 2 problems (2 errors, 0 warnings)"
        `);
        expect(result.stderr).toMatchInlineSnapshot('""');
      });
    });

    describe('given path to single file with custom extension with errors', function () {
      it('should print errors', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
          },
        });
        project.write({
          app: {
            templates: {
              'application.fizzle': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
            },
          },
        });

        let result = await run(['app/templates/application.fizzle']);

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toBeTruthy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given wildcard path resolving to single file', function () {
      it('should print errors', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
          },
        });
        project.write({
          app: {
            templates: {
              'application.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
              components: {
                'foo.hbs': '{{fooData}}',
              },
            },
          },
        });

        let result = await run(['app/templates/*']);

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toBeTruthy();
        expect(result.stderr).toBeFalsy();
      });

      it('when using custom working directory', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
          },
        });

        project.write({
          app: {
            templates: {
              'application.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
              components: {
                'foo.hbs': '{{fooData}}',
              },
            },
          },
        });

        let result = await run(['--working-directory', project.baseDir, 'app/templates/*'], {
          // run from ember-template-lint's root (forces `--working-directory` to be used)
          cwd: ROOT,
        });

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/application.hbs
            1:4  error  Non-translated string used  no-bare-strings
            1:25  error  Non-translated string used  no-bare-strings

          ✖ 2 problems (2 errors, 0 warnings)"
        `);
        expect(result.stderr).toMatchInlineSnapshot('""');
      });
    });

    describe('given directory path', function () {
      it('should print errors', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
          },
        });
        project.write({
          app: {
            templates: {
              'application.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
              components: {
                'foo.hbs': '{{fooData}}',
              },
            },
          },
        });

        let result = await run(['app']);

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/application.hbs
            1:4  error  Non-translated string used  no-bare-strings
            1:25  error  Non-translated string used  no-bare-strings

          ✖ 2 problems (2 errors, 0 warnings)"
        `);
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given path to single file without errors', function () {
      it('should exit without error and any console output', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': false,
          },
        });
        project.write({
          app: {
            templates: {
              'application.hbs':
                '<h2>Love for bare strings!!!</h2> <div>Bare strings are great!</div>',
            },
          },
        });

        let result = await run(['app/templates/application.hbs']);

        expect(result.exitCode).toEqual(0);
        expect(result.stdout).toBeFalsy();
        expect(result.stderr).toBeFalsy();
      });
    });
  });

  describe('reading from stdin', function () {
    describe('given no path', function () {
      it('should print errors', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
          },
        });
        project.write({
          app: {
            templates: {
              'application.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
              components: {
                'foo.hbs': '{{fooData}}',
              },
            },
          },
        });

        let result = await run([], {
          shell: false,
          input: fs.readFileSync(path.resolve('app/templates/application.hbs')),
        });

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toBeFalsy();
        expect(result.stderr).toMatchInlineSnapshot(`
          "ember-template-lint [options] [files..]

          Options:
            --config-path               Define a custom config path
                                                 [string] [default: \\".template-lintrc.js\\"]
            --config                    Define a custom configuration to be used - (e.g.
                                        '{ \\"rules\\": { \\"no-implicit-this\\": \\"error\\" } }')
                                                                                  [string]
            --quiet                     Ignore warnings and only show errors     [boolean]
            --rule                      Specify a rule and its severity to add that rule
                                        to loaded rules - (e.g. \`no-implicit-this:error\`
                                        or \`rule:[\\"error\\", { \\"allow\\": [\\"some-helper\\"] }]\`)
                                                                                  [string]
            --filename                  Used to indicate the filename to be assumed for
                                        contents from STDIN                       [string]
            --fix                       Fix any errors that are reported as fixable
                                                                [boolean] [default: false]
            --json                      Format output as json                    [boolean]
            --verbose                   Output errors with source description    [boolean]
            --working-directory, --cwd  Path to a directory that should be considered as
                                        the current working directory.
                                                                   [string] [default: \\".\\"]
            --no-config-path            Does not use the local template-lintrc, will use a
                                        blank template-lintrc instead            [boolean]
            --update-todo               Update list of linting todos by transforming lint
                                        errors to todos         [boolean] [default: false]
            --include-todo              Include todos in the results
                                                                [boolean] [default: false]
            --todo-days-to-warn         Number of days after its creation date that a todo
                                        transitions into a warning                [number]
            --todo-days-to-error        Number of days after its creation date that a todo
                                        transitions into an error                 [number]
            --ignore-pattern            Specify custom ignore pattern (can be disabled
                                        with --no-ignore-pattern)
                        [array] [default: [\\"**/dist/**\\",\\"**/tmp/**\\",\\"**/node_modules/**\\"]]
            --no-inline-config          Prevent inline configuration comments from
                                        changing config or rules                 [boolean]
            --help                      Show help                                [boolean]
            --version                   Show version number                      [boolean]"
        `);
      });
    });

    describe('given no path with --filename', function () {
      it('should print errors', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
          },
        });
        project.write({
          app: {
            templates: {
              'application.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
              components: {
                'foo.hbs': '{{fooData}}',
              },
            },
          },
        });

        let result = await run(['--filename', 'app/templates/application.hbs'], {
          shell: false,
          input: fs.readFileSync(path.resolve('app/templates/application.hbs')),
        });

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toBeTruthy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given - (stdin) path', function () {
      // there is no such path on Windows OS
      if (process.platform === 'win32') {
        return;
      }

      it('should print errors', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
          },
        });
        project.write({
          app: {
            templates: {
              'application.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
              components: {
                'foo.hbs': '{{fooData}}',
              },
            },
          },
        });

        let result = await run(['-', '<', 'app/templates/application.hbs'], {
          shell: true,
        });

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toBeTruthy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given /dev/stdin path', function () {
      // there is no such path on Windows OS
      if (process.platform === 'win32') {
        return;
      }

      it('should print errors', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
          },
        });
        project.write({
          app: {
            templates: {
              'application.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
              components: {
                'foo.hbs': '{{fooData}}',
              },
            },
          },
        });

        let result = await run(['/dev/stdin', '<', 'app/templates/application.hbs'], {
          shell: true,
        });

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toBeTruthy();
        expect(result.stderr).toBeFalsy();
      });
    });
  });

  describe('errors and warnings formatting', function () {
    describe('without --json param', function () {
      it('should print properly formatted error messages', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
          },
        });
        project.write({
          app: {
            templates: {
              'application.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
              components: {
                'foo.hbs': '{{fooData}}',
              },
            },
          },
        });

        let result = await run(['.']);

        expect(result.exitCode).toEqual(1);
        expect(result.stdout.split('\n')).toEqual([
          'app/templates/application.hbs',
          '  1:4  error  Non-translated string used  no-bare-strings',
          '  1:25  error  Non-translated string used  no-bare-strings',
          '',
          '✖ 2 problems (2 errors, 0 warnings)',
        ]);
        expect(result.stderr).toBeFalsy();
      });

      it('should print properly formatted error and warning messages', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
            'no-html-comments': true,
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
              'application.hbs':
                '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
            },
          },
        });

        let result = await run(['.']);

        expect(result.exitCode).toEqual(1);
        expect(result.stdout.split('\n')).toEqual([
          'app/templates/application.hbs',
          '  1:4  error  Non-translated string used  no-bare-strings',
          '  1:24  error  Non-translated string used  no-bare-strings',
          '  1:53  warning  HTML comment detected  no-html-comments',
          '',
          '✖ 3 problems (2 errors, 1 warnings)',
        ]);
        expect(result.stderr).toBeFalsy();
      });

      it('should be able run a rule passed in (rule:warn)', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
            'no-html-comments': true,
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
              'application.hbs':
                '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
            },
          },
        });

        let result = await run(['.', '--no-config-path', '--rule', 'no-html-comments:warn']);

        expect(result.exitCode).toEqual(0);
        expect(result.stdout.split('\n')).toEqual([
          'app/templates/application.hbs',
          '  1:53  warning  HTML comment detected  no-html-comments',
          '',
          '✖ 1 problems (0 errors, 1 warnings)',
        ]);
        expect(result.stderr).toBeFalsy();
      });

      it('should be able run a rule passed in (rule:error)', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
            'no-html-comments': true,
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
              'application.hbs':
                '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
            },
          },
        });

        let result = await run(['.', '--no-config-path', '--rule', 'no-html-comments:error']);

        expect(result.exitCode).toEqual(1);
        expect(result.stdout.split('\n')).toEqual([
          'app/templates/application.hbs',
          '  1:53  error  HTML comment detected  no-html-comments',
          '',
          '✖ 1 problems (1 errors, 0 warnings)',
        ]);
        expect(result.stderr).toBeFalsy();
      });

      it('should be able run a rule passed in (rule:[warn, config])', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
            'no-html-comments': true,
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
              'application.hbs':
                '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
            },
          },
        });

        let result = await run([
          '.',
          '--no-config-path',
          '--rule',
          'no-html-comments:["warn", true]',
        ]);

        expect(result.exitCode).toEqual(0);
        expect(result.stdout.split('\n')).toEqual([
          'app/templates/application.hbs',
          '  1:53  warning  HTML comment detected  no-html-comments',
          '',
          '✖ 1 problems (0 errors, 1 warnings)',
        ]);
        expect(result.stderr).toBeFalsy();
      });

      it('should be able run a rule passed in (rule:[error, config])', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
            'no-html-comments': true,
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
              'application.hbs':
                '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
            },
          },
        });

        let result = await run([
          '.',
          '--no-config-path',
          '--rule',
          'no-html-comments:["error", true]',
        ]);

        expect(result.exitCode).toEqual(1);
        expect(result.stdout.split('\n')).toEqual([
          'app/templates/application.hbs',
          '  1:53  error  HTML comment detected  no-html-comments',
          '',
          '✖ 1 problems (1 errors, 0 warnings)',
        ]);
        expect(result.stderr).toBeFalsy();
      });

      it('should include information about available fixes', async function () {
        project.setConfig({
          rules: {
            'require-button-type': true,
          },
        });

        project.write({
          app: {
            components: {
              'click-me-button.hbs': '<button>Click me!</button>',
            },
          },
        });

        let result = await run(['.']);

        expect(result.exitCode).toEqual(1);

        expect(result.stdout.split('\n')).toEqual([
          'app/components/click-me-button.hbs',
          '  1:0  error  All `<button>` elements should have a valid `type` attribute  require-button-type',
          '',
          '✖ 1 problems (1 errors, 0 warnings)',
          '  1 errors and 0 warnings potentially fixable with the `--fix` option.',
        ]);
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('with --quiet param', function () {
      it('should print properly formatted error messages, omitting any warnings', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
            'no-html-comments': true,
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
              'application.hbs':
                '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
            },
          },
        });

        let result = await run(['.', '--quiet']);

        expect(result.exitCode).toEqual(1);
        expect(result.stdout.split('\n')).toEqual([
          'app/templates/application.hbs',
          '  1:4  error  Non-translated string used  no-bare-strings',
          '  1:24  error  Non-translated string used  no-bare-strings',
          '',
          '✖ 2 problems (2 errors, 0 warnings)',
        ]);
        expect(result.stderr).toBeFalsy();
      });

      it('should exit without error and any console output', async function () {
        project.setConfig({
          rules: {
            'no-html-comments': true,
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
              'application.hbs':
                '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
            },
          },
        });
        let result = await run(['.', '--quiet']);

        expect(result.exitCode).toEqual(0);
        expect(result.stdout).toBeFalsy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('with/without --ignore-pattern', function () {
      it('should respect dirs ignored by default', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
            'no-html-comments': true,
          },
        });
        project.write({
          app: {
            dist: {
              'application.hbs':
                '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
            },
          },
        });

        let result = await run(['app/**/*']);

        expect(result.exitCode).toEqual(0);
        expect(result.stdout).toEqual('');
        expect(result.stderr).toBeFalsy();
      });

      it('should allow to pass custom ignore pattern', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
            'no-html-comments': true,
          },
        });
        project.write({
          app: {
            foo: {
              'application.hbs':
                '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
            },
            bar: {
              'application.hbs':
                '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
            },
          },
        });

        let result = await run([
          'app/**/*',
          '--ignore-pattern',
          '"**/foo/**"',
          '--ignore-pattern',
          '"**/bar/**"',
        ]);

        expect(result.exitCode).toEqual(0);
        expect(result.stdout).toEqual('');
        expect(result.stderr).toBeFalsy();
      });

      it('should allow to disable dirs ignored by default', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
            'no-html-comments': true,
          },
        });
        project.write({
          app: {
            dist: {
              'application.hbs':
                '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
            },
          },
        });

        let result = await run(['app/**/*', '--no-ignore-pattern']);

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toEqual(
          `app/dist/application.hbs
  1:4  error  Non-translated string used  no-bare-strings
  1:24  error  Non-translated string used  no-bare-strings
  1:53  error  HTML comment detected  no-html-comments

✖ 3 problems (3 errors, 0 warnings)`
        );

        expect(result.stderr).toBeFalsy();
      });
    });

    describe('with --json param', function () {
      it('should print valid JSON string with errors', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
          },
        });
        project.write({
          app: {
            templates: {
              'application.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
              components: {
                'foo.hbs': '{{fooData}}',
              },
            },
          },
        });

        let result = await run(['--json', '.']);

        let expectedOutputData = {};
        expectedOutputData['app/templates/application.hbs'] = [
          {
            column: 4,
            line: 1,
            message: 'Non-translated string used',
            filePath: 'app/templates/application.hbs',
            moduleId: 'app/templates/application',
            rule: 'no-bare-strings',
            severity: 2,
            source: 'Here too!!',
          },
          {
            column: 25,
            line: 1,
            message: 'Non-translated string used',
            filePath: 'app/templates/application.hbs',
            moduleId: 'app/templates/application',
            rule: 'no-bare-strings',
            severity: 2,
            source: 'Bare strings are bad...',
          },
        ];

        expect(result.exitCode).toEqual(1);
        expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
        expect(result.stderr).toBeFalsy();
      });

      it('should include information about fixing', async function () {
        project.setConfig({
          rules: {
            'require-button-type': true,
          },
        });

        project.write({
          app: {
            components: {
              'click-me-button.hbs': '<button>Click me!</button>',
            },
          },
        });

        let result = await run(['.', '--json']);

        let expectedOutputData = {};
        expectedOutputData['app/components/click-me-button.hbs'] = [
          {
            column: 0,
            line: 1,
            isFixable: true,
            message: 'All `<button>` elements should have a valid `type` attribute',
            filePath: 'app/components/click-me-button.hbs',
            moduleId: 'app/components/click-me-button',
            rule: 'require-button-type',
            severity: 2,
            source: '<button>Click me!</button>',
          },
        ];

        expect(result.exitCode).toEqual(1);
        expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('with --json param and --quiet', function () {
      it('should print valid JSON string with errors, omitting warnings', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
            'no-html-comments': true,
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
              'application.hbs':
                '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
            },
          },
        });

        let result = await run(['.', '--json', '--quiet']);

        let expectedOutputData = {};
        expectedOutputData['app/templates/application.hbs'] = [
          {
            column: 4,
            line: 1,
            message: 'Non-translated string used',
            filePath: 'app/templates/application.hbs',
            moduleId: 'app/templates/application',
            rule: 'no-bare-strings',
            severity: 2,
            source: 'Here too!!',
          },
          {
            column: 24,
            line: 1,
            message: 'Non-translated string used',
            filePath: 'app/templates/application.hbs',
            moduleId: 'app/templates/application',
            rule: 'no-bare-strings',
            severity: 2,
            source: 'Bare strings are bad...',
          },
        ];

        expect(result.exitCode).toEqual(1);
        expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
        expect(result.stderr).toBeFalsy();
      });

      it('should exit without error and empty errors array', async function () {
        project.setConfig({
          rules: {
            'no-html-comments': true,
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
              'application.hbs':
                '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
            },
          },
        });
        let result = await run(['.', '--json', '--quiet']);

        let expectedOutputData = {};
        expectedOutputData['app/templates/application.hbs'] = [];

        expect(result.exitCode).toEqual(0);
        expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('with --config-path param', function () {
      describe('able to await run only limited subset of rules', function () {
        it('should skip disabled rules from subset', async function () {
          project.write({
            'temp-templatelint-rc.js':
              'module.exports = { rules: { "no-shadowed-elements": false } };',
            'application.hbs': '{{#let "foo" as |div|}}<div>boo</div>{{/let}}',
          });
          let result = await run(['.', '--config-path', 'temp-templatelint-rc.js']);

          expect(result.exitCode).toEqual(0);
          expect(result.stdout).toBeFalsy();
          expect(result.stderr).toBeFalsy();
        });

        it('should load only one rule and print error message', async function () {
          project.write({
            'temp-templatelint-rc.js':
              'module.exports = { rules: { "no-shadowed-elements": true } };',
            'template.hbs': '{{#let "foo" as |div|}}<div>boo</div>{{/let}}',
          });
          let result = await run(['.', '--config-path', 'temp-templatelint-rc.js']);

          expect(result.exitCode).toEqual(1);
          expect(result.stdout.split('\n')).toEqual([
            'template.hbs',
            '  1:23  error  Ambiguous element used (`div`)  no-shadowed-elements',
            '',
            '✖ 1 problems (1 errors, 0 warnings)',
          ]);
          expect(result.stderr).toBeFalsy();
        });
      });

      describe('given a working-directory with errors and a lintrc with rules', function () {
        it('should print properly formatted error messages', async function () {
          project.setConfig({
            rules: {
              'no-bare-strings': false,
            },
          });
          project.write({
            app: {
              templates: {
                'application.hbs':
                  '<h2>Love for bare strings!!!</h2> <div>Bare strings are great!</div>',
              },
            },
            'other-file.js': "module.exports = { rules: { 'no-bare-strings': true } };",
          });

          let result = await run(
            [
              '--working-directory',
              project.baseDir,
              '--config-path',
              project.path('other-file.js'),
              '.',
            ],
            {
              // run from ember-template-lint's root (forces `--working-directory` to be used)
              cwd: ROOT,
            }
          );

          expect(result.exitCode).toEqual(1);
          expect(result.stdout.split('\n')).toEqual([
            'app/templates/application.hbs',
            '  1:4  error  Non-translated string used  no-bare-strings',
            '  1:39  error  Non-translated string used  no-bare-strings',
            '',
            '✖ 2 problems (2 errors, 0 warnings)',
          ]);
          expect(result.stderr).toBeFalsy();
        });
      });

      describe('given a directory with errors and a lintrc with rules', function () {
        it('should print properly formatted error messages', async function () {
          project.setConfig({
            rules: {
              'no-bare-strings': false,
            },
          });
          project.write({
            app: {
              templates: {
                'application.hbs':
                  '<h2>Love for bare strings!!!</h2> <div>Bare strings are great!</div>',
              },
            },
            'other-file.js': "module.exports = { rules: { 'no-bare-strings': true } };",
          });

          let result = await run(['.', '--config-path', project.path('other-file.js')]);

          expect(result.exitCode).toEqual(1);
          expect(result.stdout.split('\n')).toEqual([
            'app/templates/application.hbs',
            '  1:4  error  Non-translated string used  no-bare-strings',
            '  1:39  error  Non-translated string used  no-bare-strings',
            '',
            '✖ 2 problems (2 errors, 0 warnings)',
          ]);
          expect(result.stderr).toBeFalsy();
        });
      });

      describe('given a directory with errors but a lintrc without any rules', function () {
        it('should exit without error and any console output', async function () {
          project.setConfig({
            rules: {
              'no-bare-strings': true,
            },
          });
          project.write({
            app: {
              templates: {
                'application.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
                components: {
                  'foo.hbs': '{{fooData}}',
                },
              },
            },
            'other-file.js': "module.exports = { rules: { 'no-bare-strings': false } };",
          });

          let result = await run(['.', '--config-path', project.path('other-file.js')]);

          expect(result.exitCode).toEqual(0);
          expect(result.stdout).toBeFalsy();
          expect(result.stderr).toBeFalsy();
        });
      });
    });

    describe('with --print-pending param', function () {
      it('should print a list of pending modules', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
            'no-html-comments': true,
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
              'application.hbs':
                '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
            },
          },
        });

        let result = await run(['.', '--print-pending']);

        expect(result.stdout).toMatchInlineSnapshot(`
          "WARNING: Print pending is deprecated. Use --update-todo instead.

          Add the following to your \`.template-lintrc.js\` file to mark these files as pending.


          pending: [
            {
              \\"moduleId\\": \\"app/templates/application\\",
              \\"only\\": [
                \\"no-bare-strings\\",
                \\"no-html-comments\\"
              ]
            }
          ]"
        `);
        expect(result.stderr).toBeFalsy();
      });

      it('should ignore existing pending modules that have no lint errors', async function () {
        project.setConfig({
          rules: {
            'no-html-comments': false,
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
              'application.hbs':
                '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
            },
          },
        });

        let result = await run(['.', '--print-pending']);

        expect(result.stdout).toMatchInlineSnapshot(`
          "WARNING: Print pending is deprecated. Use --update-todo instead.

          Add the following to your \`.template-lintrc.js\` file to mark these files as pending.


          pending: []"
        `);
        expect(result.stderr).toBeFalsy();
      });

      it('should ignore existing pending modules that have partially passing rules', async function () {
        project.setConfig({
          rules: {
            'no-html-comments': true,
            'no-bare-strings': true,
          },
          pending: [
            {
              moduleId: 'app/templates/application',
              only: ['no-html-comments', 'no-bare-strings'],
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
        let result = await run(['.', '--print-pending']);

        expect(result.stdout).toMatchInlineSnapshot(`
          "WARNING: Print pending is deprecated. Use --update-todo instead.

          Add the following to your \`.template-lintrc.js\` file to mark these files as pending.


          pending: [
            {
              \\"moduleId\\": \\"app/templates/application\\",
              \\"only\\": [
                \\"no-bare-strings\\"
              ]
            }
          ]"
        `);
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('with --print-pending and --json params', function () {
      it('should print json of pending modules', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
            'no-html-comments': true,
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
              'application.hbs':
                '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
            },
          },
        });

        let result = await run(['.', '--print-pending', '--json']);

        let expectedOutputData = [
          {
            moduleId: 'app/templates/application',
            only: ['no-bare-strings', 'no-html-comments'],
          },
        ];

        expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
        expect(result.stderr).toBeFalsy();
      });
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

      it('errors if a todo item is no longer valid when running without params', async function () {
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
            -:-  error  Todo violation passes \`require-button-type\` rule. Please run \`--update-todo\` to remove this todo from the todo list.  invalid-todo-violation-rule

          ✖ 1 problems (1 errors, 0 warnings)
            1 errors and 0 warnings potentially fixable with the \`--fix\` option."
        `);

        // run fix, and expect that this will delete the outstanding todo item
        await run(['.', '--fix']);

        // run normally again and expect no error
        result = await run(['.']);

        let todoDirs = fs.readdirSync(getTodoStorageDirPath(project.baseDir));

        expect(result.exitCode).toEqual(0);
        expect(result.stdout).toEqual('');
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

        expect(result.stdout).toMatchInlineSnapshot(`"✔ 0 todos created, 0 todos removed"`);
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

        expect(result.stdout).toMatchInlineSnapshot(`"✔ 0 todos created, 0 todos removed"`);
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

        expect(result.stdout).toMatchInlineSnapshot(`"✔ 1 todos created, 0 todos removed"`);
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
          ✔ 1 todos created, 0 todos removed"
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
          'The provided TODO configuration contains invalid values. The `warn` value (10) must be less than the `error` value (5).'
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

        todos.forEach((todo) => {
          expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(10);
        });
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

        todos.forEach((todo) => {
          expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(30);
        });
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

        todos.forEach((todo) => {
          expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(30);
        });
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

        todos.forEach((todo) => {
          expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(
            10
          );
        });
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

        todos.forEach((todo) => {
          expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(
            30
          );
        });
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

        todos.forEach((todo) => {
          expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(
            30
          );
        });
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

        todos.forEach((todo) => {
          expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(5);
          expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(
            10
          );
        });
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

        todos.forEach((todo) => {
          expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(10);
          expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(
            20
          );
        });
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

        todos.forEach((todo) => {
          expect(differenceInDays(new Date(todo.warnDate), new Date(todo.createdDate))).toEqual(10);
          expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(
            20
          );
        });
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

        todos.forEach((todo) => {
          expect(todo.warnDate).toBeFalsy();
          expect(differenceInDays(new Date(todo.errorDate), new Date(todo.createdDate))).toEqual(
            20
          );
        });
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

        await run(
          ['.', '--update-todo', '--todo-days-to-warn', '5', '--todo-days-to-error', '10'],
          {
            env: {
              TODO_CREATED_DATE: subDays(new Date(), 11).toJSON(),
            },
          }
        );

        const result = await run(['.']);

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toMatchInlineSnapshot(`
          "app/templates/application.hbs
            1:5  error  Non-translated string used  no-bare-strings

          ✖ 1 problems (1 errors, 0 warnings)"
        `);
      });
    });

    describe('with GITHUB_ACTIONS env var', function () {
      setupEnvVar('GITHUB_ACTIONS', 'true');

      it('should print GitHub Actions annotations', async function () {
        project.setConfig({
          rules: {
            'no-bare-strings': true,
            'no-html-comments': true,
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
              'application.hbs':
                '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
            },
          },
        });

        let result = await run(['.'], {
          env: { GITHUB_ACTIONS: 'true' },
        });

        expect(result.exitCode).toEqual(1);
        expect(result.stdout.split('\n')).toEqual([
          'app/templates/application.hbs',
          '  1:4  error  Non-translated string used  no-bare-strings',
          '  1:24  error  Non-translated string used  no-bare-strings',
          '  1:53  warning  HTML comment detected  no-html-comments',
          '',
          '✖ 3 problems (2 errors, 1 warnings)',
          '::error file=app/templates/application.hbs,line=1,col=4::Non-translated string used',
          '::error file=app/templates/application.hbs,line=1,col=24::Non-translated string used',
          '::warning file=app/templates/application.hbs,line=1,col=53::HTML comment detected',
        ]);
        expect(result.stderr).toBeFalsy();
      });

      describe('with --quiet param', function () {
        it('should print GitHub Actions annotations', async function () {
          project.setConfig({
            rules: {
              'no-bare-strings': true,
              'no-html-comments': true,
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
                'application.hbs':
                  '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
              },
            },
          });

          let result = await run(['.', '--quiet'], {
            env: { GITHUB_ACTIONS: 'true' },
          });

          expect(result.exitCode).toEqual(1);
          expect(result.stdout.split('\n')).toEqual([
            'app/templates/application.hbs',
            '  1:4  error  Non-translated string used  no-bare-strings',
            '  1:24  error  Non-translated string used  no-bare-strings',
            '',
            '✖ 2 problems (2 errors, 0 warnings)',
            '::error file=app/templates/application.hbs,line=1,col=4::Non-translated string used',
            '::error file=app/templates/application.hbs,line=1,col=24::Non-translated string used',
          ]);
          expect(result.stderr).toBeFalsy();
        });
      });
    });
  });

  describe('autofixing files', function () {
    it('should write fixed file to fs', async function () {
      let config = { rules: { 'require-button-type': true } };
      project.setConfig(config);
      project.write({ 'require-button-type.hbs': '<button>Klikk</button>' });

      let result = await run(['.', '--fix']);

      expect(result.exitCode).toEqual(0);
      expect(result.stdout).toBeFalsy();
      expect(result.stderr).toBeFalsy();

      let fileContents = readFileSync(project.path('require-button-type.hbs'), {
        encoding: 'utf8',
      });

      expect(fileContents).toEqual('<button type="button">Klikk</button>');
    });
  });

  function run(args, options = {}) {
    options.reject = false;
    options.cwd = options.cwd || project.path('.');

    return execa(
      process.execPath,
      [require.resolve('../../bin/ember-template-lint.js'), ...args],
      options
    );
  }
});
