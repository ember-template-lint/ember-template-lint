'use strict';

const execFile = require('child_process').execFile;
const path = require('path');

describe('ember-template-lint executable', function() {
  describe('basic usage', function() {
    describe('without any parameters', function() {
      it('should exit without error and any console output', function(done) {
        execFile('node', ['./bin/ember-template-lint.js'], function(err, stdout, stderr) {
          expect(err).toBe(null);
          expect(stdout).toEqual('');
          expect(stderr).toEqual('');
          done();
        });
      });
    });

    describe('given path to non-existing file', function() {
      it('should exit without error and any console output', function(done) {
        execFile('node', ['../../../bin/ember-template-lint.js', 'app/templates/application-1.hbs'], {
          cwd: './test/fixtures/with-errors'
        }, function(err, stdout, stderr) {
          expect(err).toBe(null, 'exits without error');
          expect(stdout).toEqual('');
          expect(stderr).toEqual('');
          done();
        });
      });
    });

    describe('given path to single file with errors', function() {
      it('should print errors', function(done) {
        execFile('node', ['../../../bin/ember-template-lint.js', 'app/templates/application.hbs'], {
          cwd: './test/fixtures/with-errors'
        }, function(err, stdout, stderr) {
          expect(err).toBeTruthy();
          expect(stdout).toBeTruthy();
          expect(stderr).toEqual('');
          done();
        });
      });
    });

    describe('given wildcard path resolving to single file', function() {
      it('should print errors', function(done) {
        execFile('node', ['../../../bin/ember-template-lint.js', 'app/templates/*'], {
          cwd: './test/fixtures/with-errors'
        }, function(err, stdout, stderr) {
          expect(err).toBeTruthy();
          expect(stdout).toBeTruthy();
          expect(stderr).toEqual('');
          done();
        });
      });
    });

    describe('given directory path', function() {
      it('should print errors', function(done) {
        execFile('node', ['../../../bin/ember-template-lint.js', 'app'], {
          cwd: './test/fixtures/with-errors'
        }, function(err, stdout, stderr) {
          expect(err).toBeTruthy();
          expect(stdout).toBeTruthy();
          expect(stderr).toEqual('');
          done();
        });
      });
    });

    describe('given path to single file without errors', function() {
      it('should exit without error and any console output', function(done) {
        execFile('node', ['../../../bin/ember-template-lint.js', 'app/templates/application.hbs'], {
          cwd: './test/fixtures/without-errors'
        }, function(err, stdout, stderr) {
          expect(err).toBe(null);
          expect(stdout).toEqual('');
          expect(stderr).toEqual('');
          done();
        });
      });
    });
  });

  describe('errors formatting', function() {
    describe('without --json param', function() {
      it('should print properly formatted verbose error messages', function(done) {
        execFile('node', ['../../../bin/ember-template-lint.js', '.'], {
          cwd: './test/fixtures/with-errors'
        }, function(err, stdout, stderr) {
          expect(err).toBeTruthy();
          expect(stdout.split('\n')).toEqual([
            path.resolve('./test/fixtures/with-errors/app/templates/application.hbs'),
            '  1:4  error  Non-translated string used  bare-strings',
            '  2:5  error  Non-translated string used  bare-strings',
            '',
            '✖ 2 problems',
            ''
          ]);
          expect(stderr).toEqual('');
          done();
        });
      });
    });

    describe('with --json param', function() {
      it('should print valid JSON string with errors', function(done) {
        execFile('node', ['../../../bin/ember-template-lint.js', '.', '--json'], {
          cwd: './test/fixtures/with-errors'
        }, function(err, stdout, stderr) {
          let fullTemplateFilePath = path.resolve('./test/fixtures/with-errors/app/templates/application.hbs');
          let expectedOutputData = {};
          expectedOutputData[fullTemplateFilePath] = [
            {
              column: 4,
              line: 1,
              message: 'Non-translated string used',
              moduleId: './app/templates/application',
              rule: 'bare-strings',
              severity: 2,
              source: 'Here too!!'
            }, {
              column: 5,
              line: 2,
              message: 'Non-translated string used',
              moduleId: './app/templates/application',
              rule: 'bare-strings',
              severity: 2,
              source: 'Bare strings are bad...'
            }
          ];

          expect(err).toBeTruthy();
          expect(JSON.parse(stdout)).toEqual(expectedOutputData);
          expect(stderr).toEqual('');
          done();
        });
      });
    });
  });
});
