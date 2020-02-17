'use strict';

const execa = require('execa');
const path = require('path');

describe('ember-template-lint executable', function() {
  describe('basic usage', function() {
    describe('without any parameters', function() {
      it.skip('should emit help text', function() {});
    });

    describe('given path to non-existing file', function() {
      it('should exit without error and any console output', function() {
        let result = run(['app/templates/application-1.hbs'], {
          cwd: './test/fixtures/with-errors',
        });

        expect(result.code).toEqual(0, 'exits without error');
        expect(result.stdout).toBeFalsy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given path to single file with errors', function() {
      it('should print errors', function() {
        let result = run(['app/templates/application.hbs'], {
          cwd: './test/fixtures/with-errors',
        });

        expect(result.code).toEqual(1);
        expect(result.stdout).toBeTruthy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given wildcard path resolving to single file', function() {
      it('should print errors', function() {
        let result = run(['app/templates/*'], {
          cwd: './test/fixtures/with-errors',
        });

        expect(result.code).toEqual(1);
        expect(result.stdout).toBeTruthy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given directory path', function() {
      it('should print errors', function() {
        let result = run(['app'], {
          cwd: './test/fixtures/with-errors',
        });

        expect(result.code).toEqual(1);
        expect(result.stdout).toBeTruthy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given no path', function() {
      it('should print errors', function() {
        let result = run(['<', 'app/templates/application.hbs'], {
          cwd: './test/fixtures/with-errors',
          shell: true,
        });

        expect(result.code).toEqual(1);
        expect(result.stdout).toBeTruthy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given no path with --filename', function() {
      it('should print errors', function() {
        let result = run(
          ['--filename', 'app/templates/application.hbs', '<', 'app/templates/application.hbs'],
          {
            cwd: './test/fixtures/with-errors',
            shell: true,
          }
        );

        expect(result.code).toEqual(1);
        expect(result.stdout).toBeTruthy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given - (stdin) path', function() {
      it('should print errors', function() {
        let result = run(['-', '<', 'app/templates/application.hbs'], {
          cwd: './test/fixtures/stdin-with-errors',
          shell: true,
        });

        expect(result.code).toEqual(1);
        expect(result.stdout).toBeTruthy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given /dev/stdin path', function() {
      it('should print errors', function() {
        let result = run(['/dev/stdin', '<', 'app/templates/application.hbs'], {
          cwd: './test/fixtures/stdin-with-errors',
          shell: true,
        });

        expect(result.code).toEqual(1);
        expect(result.stdout).toBeTruthy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('given path to single file without errors', function() {
      it('should exit without error and any console output', function() {
        let result = run(['app/templates/application.hbs'], {
          cwd: './test/fixtures/without-errors',
        });

        expect(result.code).toEqual(0);
        expect(result.stdout).toBeFalsy();
        expect(result.stderr).toBeFalsy();
      });
    });
  });

  describe('errors and warnings formatting', function() {
    setupEnvVar('GITHUB_ACTIONS', null);

    describe('without --json param', function() {
      it('should print properly formatted error messages', function() {
        let result = run(['.'], {
          cwd: './test/fixtures/with-errors',
        });

        expect(result.code).toEqual(1);
        expect(result.stdout.split('\n')).toEqual([
          path.resolve('./test/fixtures/with-errors/app/templates/application.hbs'),
          '  1:4  error  Non-translated string used  no-bare-strings',
          '  2:5  error  Non-translated string used  no-bare-strings',
          '',
          path.resolve('./test/fixtures/with-errors/app/templates/components/foo.hbs'),
          "  1:2  error  Ambiguous path 'fooData' is not allowed. Use '@fooData' if it is a named argument or 'this.fooData' if it is a property on 'this'. If it is a helper or component that has no arguments you must manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['fooData'] }.  no-implicit-this",
          '',
          '✖ 3 problems (3 errors, 0 warnings)',
          '',
        ]);
        expect(result.stderr).toBeFalsy();
      });

      it('should print properly formatted error and warning messages', function() {
        let result = run(['.'], {
          cwd: './test/fixtures/with-errors-and-warnings',
        });

        expect(result.code).toEqual(1);
        expect(result.stdout.split('\n')).toEqual([
          path.resolve('./test/fixtures/with-errors-and-warnings/app/templates/application.hbs'),
          '  1:4  error  Non-translated string used  no-bare-strings',
          '  2:5  error  Non-translated string used  no-bare-strings',
          '  3:0  warning  HTML comment detected  no-html-comments',
          '',
          '✖ 3 problems (2 errors, 1 warnings)',
          '',
        ]);
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('with --quiet param', function() {
      it('should print properly formatted error messages, omitting any warnings', function() {
        let result = run(['.', '--quiet'], {
          cwd: './test/fixtures/with-errors-and-warnings',
        });

        expect(result.code).toEqual(1);
        expect(result.stdout.split('\n')).toEqual([
          path.resolve('./test/fixtures/with-errors-and-warnings/app/templates/application.hbs'),
          '  1:4  error  Non-translated string used  no-bare-strings',
          '  2:5  error  Non-translated string used  no-bare-strings',
          '',
          '✖ 2 problems (2 errors, 0 warnings)',
          '',
        ]);
        expect(result.stderr).toBeFalsy();
      });

      it('should exit without error and any console output', function() {
        let result = run(['.', '--quiet'], {
          cwd: './test/fixtures/with-warnings',
        });

        expect(result.code).toEqual(0);
        expect(result.stdout).toBeFalsy();
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('with --json param', function() {
      it('should print valid JSON string with errors', function() {
        let result = run(['.', '--json'], {
          cwd: './test/fixtures/with-errors',
        });

        let fullApplicationTemplateFilePath = path.resolve(
          './test/fixtures/with-errors/app/templates/application.hbs'
        );
        let fullFooTemplateFilePath = path.resolve(
          './test/fixtures/with-errors/app/templates/components/foo.hbs'
        );
        let expectedOutputData = {};
        expectedOutputData[fullApplicationTemplateFilePath] = [
          {
            column: 4,
            line: 1,
            message: 'Non-translated string used',
            moduleId: 'app/templates/application',
            rule: 'no-bare-strings',
            severity: 2,
            source: 'Here too!!',
          },
          {
            column: 5,
            line: 2,
            message: 'Non-translated string used',
            moduleId: 'app/templates/application',
            rule: 'no-bare-strings',
            severity: 2,
            source: 'Bare strings are bad...',
          },
        ];
        expectedOutputData[fullFooTemplateFilePath] = [
          {
            column: 2,
            line: 1,
            message:
              "Ambiguous path 'fooData' is not allowed. Use '@fooData' if it is a named argument or 'this.fooData' if it is a property on 'this'. If it is a helper or component that has no arguments you must manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['fooData'] }.",
            moduleId: 'app/templates/components/foo',
            rule: 'no-implicit-this',
            severity: 2,
            source: 'fooData',
          },
        ];

        expect(result.code).toEqual(1);
        expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('with --json param and --quiet', function() {
      it('should print valid JSON string with errors, omitting warnings', function() {
        let result = run(['.', '--json', '--quiet'], {
          cwd: './test/fixtures/with-errors-and-warnings',
        });

        let fullTemplateFilePath = path.resolve(
          './test/fixtures/with-errors-and-warnings/app/templates/application.hbs'
        );
        let expectedOutputData = {};
        expectedOutputData[fullTemplateFilePath] = [
          {
            column: 4,
            line: 1,
            message: 'Non-translated string used',
            moduleId: 'app/templates/application',
            rule: 'no-bare-strings',
            severity: 2,
            source: 'Here too!!',
          },
          {
            column: 5,
            line: 2,
            message: 'Non-translated string used',
            moduleId: 'app/templates/application',
            rule: 'no-bare-strings',
            severity: 2,
            source: 'Bare strings are bad...',
          },
        ];

        expect(result.code).toEqual(1);
        expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
        expect(result.stderr).toBeFalsy();
      });

      it('should exit without error and empty errors array', function() {
        let result = run(['.', '--json', '--quiet'], {
          cwd: './test/fixtures/with-warnings',
        });

        let fullTemplateFilePath = path.resolve(
          './test/fixtures/with-warnings/app/templates/application.hbs'
        );
        let expectedOutputData = {};
        expectedOutputData[fullTemplateFilePath] = [];

        expect(result.code).toEqual(0);
        expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('with --config-path param', function() {
      describe('able to run only limited subset of rules', function() {
        it('should skip disabled rules from subset', function() {
          let result = run(
            ['.', '--config-path', '../rules-subset-disabled/temp-templatelint-rc.js'],
            {
              cwd: './test/fixtures/rules-subset-disabled',
            }
          );

          expect(result.code).toEqual(0);
          expect(result.stdout).toBeFalsy();
          expect(result.stderr).toBeFalsy();
        });

        it('should load only one rule and print error message', function() {
          let result = run(['.', '--config-path', '../rules-subset/temp-templatelint-rc.js'], {
            cwd: './test/fixtures/rules-subset',
          });

          expect(result.code).toEqual(1);
          expect(result.stdout.split('\n')).toEqual([
            path.resolve('./test/fixtures/rules-subset/template.hbs'),
            '  2:4  error  Ambiguous element used (`div`)  no-shadowed-elements',
            '',
            '✖ 1 problems (1 errors, 0 warnings)',
            '',
          ]);
          expect(result.stderr).toBeFalsy();
        });
      });

      describe('given a directory with errors and a lintrc with rules', function() {
        it('should print properly formatted error messages', function() {
          let result = run(['.', '--config-path', '../with-errors/.template-lintrc'], {
            cwd: './test/fixtures/without-errors',
          });

          expect(result.code).toEqual(1);
          expect(result.stdout.split('\n')).toEqual([
            path.resolve('./test/fixtures/without-errors/app/templates/application.hbs'),
            '  1:4  error  Non-translated string used  no-bare-strings',
            '  2:5  error  Non-translated string used  no-bare-strings',
            '',
            '✖ 2 problems (2 errors, 0 warnings)',
            '',
          ]);
          expect(result.stderr).toBeFalsy();
        });
      });

      describe('given a directory with errors but a lintrc without any rules', function() {
        it('should exit without error and any console output', function() {
          let result = run(['.', '--config-path', '../without-errors/.template-lintrc'], {
            cwd: './test/fixtures/with-errors',
          });

          expect(result.code).toEqual(0);
          expect(result.stdout).toBeFalsy();
          expect(result.stderr).toBeFalsy();
        });
      });
    });

    describe('with --print-pending param', function() {
      it('should print a list of pending modules', function() {
        let result = run(['.', '--print-pending'], {
          cwd: './test/fixtures/with-errors-and-warnings',
        });

        let expectedOutputData =
          'Add the following to your `.template-lintrc.js` file to mark these files as pending.\n\n\npending: [\n  {\n    "moduleId": "app/templates/application",\n    "only": [\n      "no-bare-strings",\n      "no-html-comments"\n    ]\n  }\n]\n';

        expect(result.code).toEqual(1);
        expect(result.stdout).toEqual(expectedOutputData);
        expect(result.stderr).toBeFalsy();
      });

      it('should ignore existing pending modules that have no lint errors', function() {
        let result = run(['.', '--print-pending'], {
          cwd: './test/fixtures/with-passing-pending-modules',
        });

        let expectedOutputData =
          'Add the following to your `.template-lintrc.js` file to mark these files as pending.\n\n\npending: []\n';

        expect(result.code).toEqual(1);
        expect(result.stdout).toEqual(expectedOutputData);
        expect(result.stderr).toBeFalsy();
      });

      it('should ignore existing pending modules that have partially passing rules', function() {
        let result = run(['.', '--print-pending'], {
          cwd: './test/fixtures/with-partially-passing-pending-modules',
        });

        let expectedOutputData =
          'Add the following to your `.template-lintrc.js` file to mark these files as pending.\n\n\npending: [\n  {\n    "moduleId": "app/templates/application",\n    "only": [\n      "no-bare-strings"\n    ]\n  }\n]\n';

        expect(result.code).toEqual(1);
        expect(result.stdout).toEqual(expectedOutputData);
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('with --print-pending and --json params', function() {
      it('should print json of pending modules', function() {
        let result = run(['.', '--print-pending', '--json'], {
          cwd: './test/fixtures/with-errors-and-warnings',
        });

        let expectedOutputData = [
          {
            moduleId: 'app/templates/application',
            only: ['no-bare-strings', 'no-html-comments'],
          },
        ];

        expect(result.code).toEqual(1);
        expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('with GITHUB_ACTIONS env var', function() {
      setupEnvVar('GITHUB_ACTIONS', 'true');

      it('should print GitHub Actions annotations', function() {
        let applicationFilePath = path.resolve(
          './test/fixtures/with-errors/app/templates/application.hbs'
        );
        let fooFilePath = path.resolve(
          './test/fixtures/with-errors/app/templates/components/foo.hbs'
        );

        let result = run(['.'], {
          cwd: './test/fixtures/with-errors',
          env: { GITHUB_ACTIONS: 'true' },
        });

        expect(result.code).toEqual(1);
        expect(result.stdout.split('\n')).toEqual([
          applicationFilePath,
          '  1:4  error  Non-translated string used  no-bare-strings',
          '  2:5  error  Non-translated string used  no-bare-strings',
          '',
          fooFilePath,
          "  1:2  error  Ambiguous path 'fooData' is not allowed. Use '@fooData' if it is a named argument or 'this.fooData' if it is a property on 'this'. If it is a helper or component that has no arguments you must manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['fooData'] }.  no-implicit-this",
          '',
          '✖ 3 problems (3 errors, 0 warnings)',
          `::error file=${applicationFilePath},line=1,col=4::Non-translated string used`,
          `::error file=${applicationFilePath},line=2,col=5::Non-translated string used`,
          `::error file=${fooFilePath},line=1,col=2::Ambiguous path 'fooData' is not allowed. Use '@fooData' if it is a named argument or 'this.fooData' if it is a property on 'this'. If it is a helper or component that has no arguments you must manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['fooData'] }.`,
          '',
        ]);
        expect(result.stderr).toBeFalsy();
      });
    });
  });
});

function run(args, options) {
  options.reject = false;
  return execa.sync('../../../bin/ember-template-lint.js', args, options);
}

function setupEnvVar(name, value) {
  let oldValue;

  beforeEach(function() {
    oldValue = name in process.env ? process.env[name] : null;

    if (value === null) {
      delete process.env[name];
    } else {
      process.env[name] = value;
    }
  });

  afterEach(function() {
    if (oldValue === null) {
      delete process.env[name];
    } else {
      process.env[name] = oldValue;
    }
  });
}
