'use strict';

const execFile = require('child_process').execFile;
const expect = require('chai').expect;
const path = require('path');

describe('ember-template-lint executable', function() {
  describe('basic usage', function() {
    describe('without any parameters', function() {
      it('should exit without error and any console output', function(done) {
        execFile('node', ['./bin/ember-template-lint.js'], function(err, stdout, stderr) {
          expect(err).to.be.null;
          expect(stdout).to.be.empty;
          expect(stderr).to.be.empty;
          done();
        });
      });
    });

    describe('given path to non-existing file', function() {
      it('should exit without error and any console output', function(done) {
        execFile(
          'node',
          ['../../../bin/ember-template-lint.js', 'app/templates/application-1.hbs'],
          {
            cwd: './test/fixtures/with-errors',
          },
          function(err, stdout, stderr) {
            expect(err).to.equal(null, 'exits without error');
            expect(stdout).to.be.empty;
            expect(stderr).to.be.empty;
            done();
          }
        );
      });
    });

    describe('given path to single file with errors', function() {
      it('should print errors', function(done) {
        execFile(
          'node',
          ['../../../bin/ember-template-lint.js', 'app/templates/application.hbs'],
          {
            cwd: './test/fixtures/with-errors',
          },
          function(err, stdout, stderr) {
            expect(err).to.be.ok;
            expect(stdout).to.be.ok;
            expect(stderr).to.be.empty;
            done();
          }
        );
      });
    });

    describe('given wildcard path resolving to single file', function() {
      it('should print errors', function(done) {
        execFile(
          'node',
          ['../../../bin/ember-template-lint.js', 'app/templates/*'],
          {
            cwd: './test/fixtures/with-errors',
          },
          function(err, stdout, stderr) {
            expect(err).to.be.ok;
            expect(stdout).to.be.ok;
            expect(stderr).to.be.empty;
            done();
          }
        );
      });
    });

    describe('given directory path', function() {
      it('should print errors', function(done) {
        execFile(
          'node',
          ['../../../bin/ember-template-lint.js', 'app'],
          {
            cwd: './test/fixtures/with-errors',
          },
          function(err, stdout, stderr) {
            expect(err).to.be.ok;
            expect(stdout).to.be.ok;
            expect(stderr).to.be.empty;
            done();
          }
        );
      });
    });

    describe('given no path', function() {
      it('should print errors', function(done) {
        execFile(
          'node',
          ['../../../bin/ember-template-lint.js', '<', 'app/templates/application.hbs'],
          {
            cwd: './test/fixtures/with-errors',
            shell: true,
          },
          function(err, stdout, stderr) {
            expect(err).to.be.ok;
            expect(stdout).to.be.ok;
            expect(stderr).to.be.empty;
            done();
          }
        );
      });
    });

    describe('given no path with --filename', function() {
      it('should print errors', function(done) {
        execFile(
          'node',
          [
            '../../../bin/ember-template-lint.js',
            '--filename',
            'app/templates/application.hbs',
            '<',
            'app/templates/application.hbs',
          ],
          {
            cwd: './test/fixtures/with-errors',
            shell: true,
          },
          function(err, stdout, stderr) {
            expect(err).to.be.ok;
            expect(stdout).to.be.ok;
            expect(stderr).to.be.empty;
            done();
          }
        );
      });
    });

    describe('given - (stdin) path', function() {
      it('should print errors', function(done) {
        execFile(
          'node',
          ['../../../bin/ember-template-lint.js', '-', '<', 'app/templates/application.hbs'],
          {
            cwd: './test/fixtures/with-errors',
            shell: true,
          },
          function(err, stdout, stderr) {
            expect(err).to.be.ok;
            expect(stdout).to.be.ok;
            expect(stderr).to.be.empty;
            done();
          }
        );
      });
    });

    describe('given /dev/stdin path', function() {
      it('should print errors', function(done) {
        execFile(
          'node',
          [
            '../../../bin/ember-template-lint.js',
            '/dev/stdin',
            '<',
            'app/templates/application.hbs',
          ],
          {
            cwd: './test/fixtures/with-errors',
            shell: true,
          },
          function(err, stdout, stderr) {
            expect(err).to.be.ok;
            expect(stdout).to.be.ok;
            expect(stderr).to.be.empty;
            done();
          }
        );
      });
    });

    describe('given path to single file without errors', function() {
      it('should exit without error and any console output', function(done) {
        execFile(
          'node',
          ['../../../bin/ember-template-lint.js', 'app/templates/application.hbs'],
          {
            cwd: './test/fixtures/without-errors',
          },
          function(err, stdout, stderr) {
            expect(err).to.be.null;
            expect(stdout).to.be.empty;
            expect(stderr).to.be.empty;
            done();
          }
        );
      });
    });
  });

  describe('errors and warnings formatting', function() {
    describe('without --json param', function() {
      it('should print properly formatted error messages', function(done) {
        execFile(
          'node',
          ['../../../bin/ember-template-lint.js', '.'],
          {
            cwd: './test/fixtures/with-errors',
          },
          function(err, stdout, stderr) {
            expect(err).to.be.ok;
            expect(stdout.split('\n')).to.deep.equal([
              path.resolve('./test/fixtures/with-errors/app/templates/application.hbs'),
              '  1:4  error  Non-translated string used  no-bare-strings',
              '  2:5  error  Non-translated string used  no-bare-strings',
              '',
              '✖ 2 problems (2 errors, 0 warnings)',
              '',
            ]);
            expect(stderr).to.be.empty;
            done();
          }
        );
      });

      it('should print properly formatted error and warning messages', function(done) {
        execFile(
          'node',
          ['../../../bin/ember-template-lint.js', '.'],
          {
            cwd: './test/fixtures/with-errors-and-warnings',
          },
          function(err, stdout, stderr) {
            expect(err).to.be.ok;
            expect(stdout.split('\n')).to.deep.equal([
              path.resolve(
                './test/fixtures/with-errors-and-warnings/app/templates/application.hbs'
              ),
              '  1:4  error  Non-translated string used  no-bare-strings',
              '  2:5  error  Non-translated string used  no-bare-strings',
              '  3:0  warning  HTML comment detected  no-html-comments',
              '',
              '✖ 3 problems (2 errors, 1 warnings)',
              '',
            ]);
            expect(stderr).to.be.empty;
            done();
          }
        );
      });
    });

    describe('with --quiet param', function() {
      it('should print properly formatted error messages, omitting any warnings', function(done) {
        execFile(
          'node',
          ['../../../bin/ember-template-lint.js', '.', '--quiet'],
          {
            cwd: './test/fixtures/with-errors-and-warnings',
          },
          function(err, stdout, stderr) {
            expect(err).to.be.ok;
            expect(stdout.split('\n')).to.deep.equal([
              path.resolve(
                './test/fixtures/with-errors-and-warnings/app/templates/application.hbs'
              ),
              '  1:4  error  Non-translated string used  no-bare-strings',
              '  2:5  error  Non-translated string used  no-bare-strings',
              '',
              '✖ 2 problems (2 errors, 0 warnings)',
              '',
            ]);
            expect(stderr).to.be.empty;
            done();
          }
        );
      });

      it('should exit without error and any console output', function(done) {
        execFile(
          'node',
          ['../../../bin/ember-template-lint.js', '.', '--quiet'],
          {
            cwd: './test/fixtures/with-warnings',
          },
          function(err, stdout, stderr) {
            expect(err).to.be.null;
            expect(stdout).to.be.empty;
            expect(stderr).to.be.empty;
            done();
          }
        );
      });
    });

    describe('with --json param', function() {
      it('should print valid JSON string with errors', function(done) {
        execFile(
          'node',
          ['../../../bin/ember-template-lint.js', '.', '--json'],
          {
            cwd: './test/fixtures/with-errors',
          },
          function(err, stdout, stderr) {
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

            expect(err).to.be.ok;
            expect(JSON.parse(stdout)).to.deep.equal(expectedOutputData);
            expect(stderr).to.be.empty;
            done();
          }
        );
      });
    });

    describe('with --json param and --quiet', function() {
      it('should print valid JSON string with errors, omitting warnings', function(done) {
        execFile(
          'node',
          ['../../../bin/ember-template-lint.js', '.', '--json', '--quiet'],
          {
            cwd: './test/fixtures/with-errors-and-warnings',
          },
          function(err, stdout, stderr) {
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

            expect(err).to.be.ok;
            expect(JSON.parse(stdout)).to.deep.equal(expectedOutputData);
            expect(stderr).to.be.empty;
            done();
          }
        );
      });

      it('should exit without error and empty errors array', function(done) {
        execFile(
          'node',
          ['../../../bin/ember-template-lint.js', '.', '--json', '--quiet'],
          {
            cwd: './test/fixtures/with-warnings',
          },
          function(err, stdout, stderr) {
            let fullTemplateFilePath = path.resolve(
              './test/fixtures/with-warnings/app/templates/application.hbs'
            );
            let expectedOutputData = {};
            expectedOutputData[fullTemplateFilePath] = [];

            expect(err).to.be.null;
            expect(JSON.parse(stdout)).to.deep.equal(expectedOutputData);
            expect(stderr).to.be.empty;
            done();
          }
        );
      });
    });

    describe('with --config-path param', function() {
      describe('given a directory with errors and a lintrc with rules', function() {
        it('should print properly formatted error messages', function(done) {
          execFile(
            'node',
            [
              '../../../bin/ember-template-lint.js',
              '.',
              '--config-path',
              '../with-errors/.template-lintrc',
            ],
            {
              cwd: './test/fixtures/without-errors',
            },
            function(err, stdout, stderr) {
              expect(err).to.be.ok;
              expect(stdout.split('\n')).to.deep.equal([
                path.resolve('./test/fixtures/without-errors/app/templates/application.hbs'),
                '  1:4  error  Non-translated string used  no-bare-strings',
                '  2:5  error  Non-translated string used  no-bare-strings',
                '',
                '✖ 2 problems (2 errors, 0 warnings)',
                '',
              ]);
              expect(stderr).to.be.empty;
              done();
            }
          );
        });
      });

      describe('given a directory with errors but a lintrc without any rules', function() {
        it('should exit without error and any console output', function(done) {
          execFile(
            'node',
            [
              '../../../bin/ember-template-lint.js',
              '.',
              '--config-path',
              '../without-errors/.template-lintrc',
            ],
            {
              cwd: './test/fixtures/with-errors',
            },
            function(err, stdout, stderr) {
              expect(err).to.be.null;
              expect(stdout).to.be.empty;
              expect(stderr).to.be.empty;
              done();
            }
          );
        });
      });
    });
  });
});
