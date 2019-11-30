'use strict';

const execa = require('execa');
const path = require('path');
const BinScript = require('../../../bin/ember-template-lint');

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
    let oldValue;

    beforeEach(function() {
      oldValue = process.env.GITHUB_ACTIONS;
      delete process.env.GITHUB_ACTIONS;
    });

    afterEach(function() {
      process.env.GITHUB_ACTIONS = oldValue;
    });

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
          '✖ 2 problems (2 errors, 0 warnings)',
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

        let fullTemplateFilePath = path.resolve(
          './test/fixtures/with-errors/app/templates/application.hbs'
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
      let oldValue;

      beforeEach(function() {
        oldValue = process.env.GITHUB_ACTIONS;
        process.env.GITHUB_ACTIONS = 'true';
      });

      afterEach(function() {
        process.env.GITHUB_ACTIONS = oldValue;
      });

      it('should print GitHub Actions annotations', function() {
        let filePath = path.resolve('./test/fixtures/with-errors/app/templates/application.hbs');

        let result = run(['.'], {
          cwd: './test/fixtures/with-errors',
          env: { GITHUB_ACTIONS: 'true' },
        });

        expect(result.code).toEqual(1);
        expect(result.stdout.split('\n')).toEqual([
          filePath,
          '  1:4  error  Non-translated string used  no-bare-strings',
          '  2:5  error  Non-translated string used  no-bare-strings',
          '',
          '✖ 2 problems (2 errors, 0 warnings)',
          `::error file=${filePath},line=1,col=4::Non-translated string used`,
          `::error file=${filePath},line=2,col=5::Non-translated string used`,
          '',
        ]);
        expect(result.stderr).toBeFalsy();
      });
    });
  });

  describe('parseArgv', function() {
    it('handles --config-path', function() {
      let argv = ['--config-path', 'foo.js'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { configPath: 'foo.js' }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('handles --filename', function() {
      let argv = ['--filename', 'foo.hbs'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { filename: 'foo.hbs' }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('handles --quiet', function() {
      let argv = ['--quiet'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { quiet: true }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('handles --verbose', function() {
      let argv = ['--verbose'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { verbose: true }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('handles --json', function() {
      let argv = ['--json'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { json: true }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('handles --print-pending', function() {
      let argv = ['--print-pending'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { printPending: true }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('processes a single "--flag value" properly', function() {
      let argv = ['--config-path', 'foo.js'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { configPath: 'foo.js' }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('processes a multiple "--flag value" properly', function() {
      let argv = ['--config-path', 'foo.js', '--filename', 'baz.hbs'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { configPath: 'foo.js', filename: 'baz.hbs' }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('processes a single "--flag=value" properly', function() {
      let argv = ['--config-path=foo.js'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { configPath: 'foo.js' }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('processes multiple "--flag=value" properly', function() {
      let argv = ['--config-path=foo.js', '--filename=foo.hbs'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { configPath: 'foo.js', filename: 'foo.hbs' }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('processes "--flag=value --other-flag value" properly', function() {
      let argv = ['--config-path', 'foo.js', '--filename=foo.hbs'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { configPath: 'foo.js', filename: 'foo.hbs' }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('processes positional arguments', function() {
      let argv = ['foo/bar.hbs', 'baz/qux.hbs'];

      let actual = BinScript._parseArgv(argv);
      let expected = {
        named: {},
        positional: ['foo/bar.hbs', 'baz/qux.hbs'],
      };

      expect(actual).toEqual(expected);
    });

    it('does not add -- to the list of positional arguments', function() {
      let argv = ['--config-path', 'foo.js', '--', 'foo/bar.hbs', 'baz/qux.hbs'];

      let actual = BinScript._parseArgv(argv);
      let expected = {
        named: { configPath: 'foo.js' },
        positional: ['foo/bar.hbs', 'baz/qux.hbs'],
      };

      expect(actual).toEqual(expected);
    });

    it('named arguments are not allowed after `--`', function() {
      let argv = [
        '--config-path',
        'foo.js',
        '--',
        'foo/bar.hbs',
        'baz/qux.hbs',
        '--filename',
        'bar.hbs',
      ];

      let actual = BinScript._parseArgv(argv);
      let expected = {
        named: { configPath: 'foo.js' },
        positional: ['foo/bar.hbs', 'baz/qux.hbs', '--filename', 'bar.hbs'],
      };

      expect(actual).toEqual(expected);
    });
  });
});

function run(args, options) {
  options.reject = false;
  return execa.sync('../../../bin/ember-template-lint.js', args, options);
}
