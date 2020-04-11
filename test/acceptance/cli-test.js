'use strict';
const { readFileSync } = require('fs');

const execa = require('execa');
const Project = require('../helpers/fake-project');

describe('ember-template-lint executable', function () {
  setupEnvVar('GITHUB_ACTIONS', null);
  setupEnvVar('FORCE_COLOR', '0');

  // Fake project
  let project;
  beforeEach(function () {
    project = Project.defaultSetup();
    project.chdir();
  });

  afterEach(async function () {
    await project.dispose();
  });

  describe('basic usage', function () {
    describe('without any parameters', function () {
      it('should emit help text', function () {
        let result = run([]);

        expect(result.exitCode).toEqual(1);
        expect(result.stderr).toMatchInlineSnapshot(`
          "ember-template-lint [options] [files..]

          Options:
            --config-path     Define a custom config path
                                                 [string] [default: \\".template-lintrc.js\\"]
            --quiet           Ignore warnings and only show errors               [boolean]
            --filename        Used to indicate the filename to be assumed for contents
                              from STDIN                                          [string]
            --fix             Fix any errors that are reported as fixable
                                                                [boolean] [default: false]
            --json            Format output as json
            --verbose         Output errors with source description              [boolean]
            --print-pending   Print list of formated rules for use with \`pending\` in
                              config file                                        [boolean]
            --ignore-pattern  Specify custom ignore pattern (can be disabled with
                              --no-ignore-pattern)
                        [array] [default: [\\"**/dist/**\\",\\"**/tmp/**\\",\\"**/node_modules/**\\"]]
            --help            Show help                                          [boolean]
            --version         Show version number                                [boolean]"
        `);
      });
    });

    describe('with --help', function () {
      it('should emit help text', function () {
        let result = run(['--help']);

        expect(result.exitCode).toEqual(0);
        expect(result.stdout).toMatchInlineSnapshot(`
          "ember-template-lint [options] [files..]

          Options:
            --config-path     Define a custom config path
                                                 [string] [default: \\".template-lintrc.js\\"]
            --quiet           Ignore warnings and only show errors               [boolean]
            --filename        Used to indicate the filename to be assumed for contents
                              from STDIN                                          [string]
            --fix             Fix any errors that are reported as fixable
                                                                [boolean] [default: false]
            --json            Format output as json
            --verbose         Output errors with source description              [boolean]
            --print-pending   Print list of formated rules for use with \`pending\` in
                              config file                                        [boolean]
            --ignore-pattern  Specify custom ignore pattern (can be disabled with
                              --no-ignore-pattern)
                        [array] [default: [\\"**/dist/**\\",\\"**/tmp/**\\",\\"**/node_modules/**\\"]]
            --help            Show help                                          [boolean]
            --version         Show version number                                [boolean]"
        `);
      });
    });

    describe('given path to non-existing file', function () {
      it('should exit without error and any console output', function () {
        setProjectConfigForErrors();
        let result = run(['app/templates/application-1.hbs']);

        expect(result.exitCode).toEqual(0, 'exits without error');
        expect(result.stdout).toBeFalsy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given path to single file with errors', function () {
      it('should print errors', function () {
        setProjectConfigForErrors();
        let result = run(['app/templates/application.hbs']);

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toBeTruthy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given wildcard path resolving to single file', function () {
      it('should print errors', function () {
        setProjectConfigForErrors();
        let result = run(['app/templates/*']);

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toBeTruthy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given directory path', function () {
      it('should print errors', function () {
        setProjectConfigForErrors();
        let result = run(['app']);

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

    describe('given no path', function () {
      it('should print errors', function () {
        setProjectConfigForErrors();
        let result = run(['<', 'app/templates/application.hbs'], {
          shell: true,
        });

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toBeFalsy();
        expect(result.stderr).toMatchInlineSnapshot(`
"ember-template-lint [options] [files..]

Options:
  --config-path     Define a custom config path
                                       [string] [default: \\".template-lintrc.js\\"]
  --quiet           Ignore warnings and only show errors               [boolean]
  --filename        Used to indicate the filename to be assumed for contents
                    from STDIN                                          [string]
  --fix             Fix any errors that are reported as fixable
                                                      [boolean] [default: false]
  --json            Format output as json
  --verbose         Output errors with source description              [boolean]
  --print-pending   Print list of formated rules for use with \`pending\` in
                    config file                                        [boolean]
  --ignore-pattern  Specify custom ignore pattern (can be disabled with
                    --no-ignore-pattern)
              [array] [default: [\\"**/dist/**\\",\\"**/tmp/**\\",\\"**/node_modules/**\\"]]
  --help            Show help                                          [boolean]
  --version         Show version number                                [boolean]"
`);
      });
    });

    describe('given no path with --filename', function () {
      it('should print errors', function () {
        setProjectConfigForErrors();
        let result = run(
          ['--filename', 'app/templates/application.hbs', '<', 'app/templates/application.hbs'],
          {
            shell: true,
          }
        );

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toBeTruthy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given - (stdin) path', function () {
      it('should print errors', function () {
        setProjectConfigForErrors();
        let result = run(['-', '<', 'app/templates/application.hbs'], {
          shell: true,
        });

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toBeTruthy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given /dev/stdin path', function () {
      it('should print errors', function () {
        setProjectConfigForErrors();
        let result = run(['/dev/stdin', '<', 'app/templates/application.hbs'], {
          shell: true,
        });

        expect(result.exitCode).toEqual(1);
        expect(result.stdout).toBeTruthy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given path to single file without errors', function () {
      it('should exit without error and any console output', function () {
        setProjectConfigWithoutErrors();
        let result = run(['app/templates/application.hbs']);

        expect(result.exitCode).toEqual(0);
        expect(result.stdout).toBeFalsy();
        expect(result.stderr).toBeFalsy();
      });
    });
  });

  describe('errors and warnings formatting', function () {
    describe('without --json param', function () {
      it('should print properly formatted error messages', function () {
        setProjectConfigForErrors();
        let result = run(['.']);

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

      it('should print properly formatted error and warning messages', function () {
        setProjectConfigForErrorsAndWarning();
        let result = run(['.']);

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

      it('should include information about available fixes', function () {
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

        let result = run(['.']);

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
      it('should print properly formatted error messages, omitting any warnings', function () {
        setProjectConfigForErrorsAndWarning();
        let result = run(['.', '--quiet']);

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

      it('should exit without error and any console output', function () {
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
        let result = run(['.', '--quiet']);

        expect(result.exitCode).toEqual(0);
        expect(result.stdout).toBeFalsy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('with/without --ignore-pattern', function () {
      it('should respect dirs ignored by default', function () {
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

        let result = run(['app/**/*']);

        expect(result.exitCode).toEqual(0);
        expect(result.stdout).toEqual('');
        expect(result.stderr).toBeFalsy();
      });

      it('should allow to pass custom ignore pattern', function () {
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

        let result = run([
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

      it('should allow to disable dirs ignored by default', function () {
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

        let result = run(['app/**/*', '--no-ignore-pattern']);

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
      it('should print valid JSON string with errors', function () {
        setProjectConfigForErrors();
        let result = run(['--json', '.']);

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

      it('should include information about fixing', function () {
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

        let result = run(['.', '--json']);

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
      it('should print valid JSON string with errors, omitting warnings', function () {
        setProjectConfigForErrorsAndWarning();
        let result = run(['.', '--json', '--quiet']);

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

      it('should exit without error and empty errors array', function () {
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
        let result = run(['.', '--json', '--quiet']);

        let expectedOutputData = {};
        expectedOutputData['app/templates/application.hbs'] = [];

        expect(result.exitCode).toEqual(0);
        expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('with --config-path param', function () {
      describe('able to run only limited subset of rules', function () {
        it('should skip disabled rules from subset', function () {
          project.write({
            'temp-templatelint-rc.js':
              'module.exports = { rules: { "no-shadowed-elements": false } };',
            'application.hbs': '{{#let "foo" as |div|}}<div>boo</div>{{/let}}',
          });
          let result = run(['.', '--config-path', 'temp-templatelint-rc.js']);

          expect(result.exitCode).toEqual(0);
          expect(result.stdout).toBeFalsy();
          expect(result.stderr).toBeFalsy();
        });

        it('should load only one rule and print error message', function () {
          project.write({
            'temp-templatelint-rc.js':
              'module.exports = { rules: { "no-shadowed-elements": true } };',
            'template.hbs': '{{#let "foo" as |div|}}<div>boo</div>{{/let}}',
          });
          let result = run(['.', '--config-path', 'temp-templatelint-rc.js']);

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

      describe('given a directory with errors and a lintrc with rules', function () {
        it('should print properly formatted error messages', function () {
          setProjectConfigWithoutErrors();

          let overrideConfig = {
            rules: {
              'no-bare-strings': true,
            },
          };
          project.files['other-file.js'] = `module.exports = ${JSON.stringify(overrideConfig)};`;
          project.writeSync();

          let result = run(['.', '--config-path', project.path('other-file.js')]);

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
        it('should exit without error and any console output', function () {
          setProjectConfigForErrors();

          let overrideConfig = {
            rules: {
              'no-bare-strings': false,
            },
          };
          project.files['other-file.js'] = `module.exports = ${JSON.stringify(overrideConfig)};`;
          project.writeSync();

          let result = run(['.', '--config-path', project.path('other-file.js')]);

          expect(result.exitCode).toEqual(0);
          expect(result.stdout).toBeFalsy();
          expect(result.stderr).toBeFalsy();
        });
      });
    });

    describe('with --print-pending param', function () {
      it('should print a list of pending modules', function () {
        setProjectConfigForErrorsAndWarning();

        let result = run(['.', '--print-pending']);

        let expectedOutputData =
          'Add the following to your `.template-lintrc.js` file to mark these files as pending.\n\n\npending: [\n  {\n    "moduleId": "app/templates/application",\n    "only": [\n      "no-bare-strings",\n      "no-html-comments"\n    ]\n  }\n]';

        expect(result.stdout).toEqual(expectedOutputData);
        expect(result.stderr).toBeFalsy();
      });

      it('should ignore existing pending modules that have no lint errors', function () {
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

        let result = run(['.', '--print-pending']);

        let expectedOutputData =
          'Add the following to your `.template-lintrc.js` file to mark these files as pending.\n\n\npending: []';

        expect(result.stdout).toEqual(expectedOutputData);
        expect(result.stderr).toBeFalsy();
      });

      it('should ignore existing pending modules that have partially passing rules', function () {
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
        let result = run(['.', '--print-pending']);

        let expectedOutputData =
          'Add the following to your `.template-lintrc.js` file to mark these files as pending.\n\n\npending: [\n  {\n    "moduleId": "app/templates/application",\n    "only": [\n      "no-bare-strings"\n    ]\n  }\n]';

        expect(result.stdout).toEqual(expectedOutputData);
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('with --print-pending and --json params', function () {
      it('should print json of pending modules', function () {
        setProjectConfigForErrorsAndWarning();

        let result = run(['.', '--print-pending', '--json']);

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

    describe('with GITHUB_ACTIONS env var', function () {
      setupEnvVar('GITHUB_ACTIONS', 'true');

      it('should print GitHub Actions annotations', function () {
        setProjectConfigForErrorsAndWarning();

        let result = run(['.'], {
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
        it('should print GitHub Actions annotations', function () {
          setProjectConfigForErrorsAndWarning();

          let result = run(['.', '--quiet'], {
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

  describe('--fix usage', function () {
    it('should write fixed file to fs', function () {
      let config = { rules: { 'require-button-type': true } };
      project.setConfig(config);
      project.write({ 'require-button-type.hbs': '<button>Klikk</button>' });

      let result = run(['.', '--fix']);

      expect(result.exitCode).toEqual(0);
      expect(result.stdout).toBeFalsy();
      expect(result.stderr).toBeFalsy();

      let fileContents = readFileSync(project.path('require-button-type.hbs'), {
        encoding: 'utf8',
      });

      expect(fileContents).toEqual('<button type="button">Klikk</button>');
    });
  });

  // set specific project configuration for test cases.
  function setProjectConfigForErrors() {
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
  }

  function setProjectConfigWithoutErrors() {
    project.setConfig({
      rules: {
        'no-bare-strings': false,
      },
    });

    project.write({
      app: {
        templates: {
          'application.hbs': '<h2>Love for bare strings!!!</h2> <div>Bare strings are great!</div>',
        },
      },
    });
  }

  function setProjectConfigForErrorsAndWarning() {
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
  }
  function run(args, options = {}) {
    options.reject = false;
    options.cwd = options.cwd || project.path('.');
    return execa.sync(require.resolve('../../bin/ember-template-lint.js'), args, options);
  }
});

function setupEnvVar(name, value) {
  let oldValue;

  beforeEach(function () {
    oldValue = name in process.env ? process.env[name] : null;

    if (value === null) {
      delete process.env[name];
    } else {
      process.env[name] = value;
    }
  });

  afterEach(function () {
    if (oldValue === null) {
      delete process.env[name];
    } else {
      process.env[name] = oldValue;
    }
  });
}
