'use strict';

var exec = require('child_process').exec;
var assert = require('power-assert');
var path = require('path');

describe('ember-template-lint executable', function() {
  describe('basic usage', function() {
    describe('without any parameters', function() {
      it('should exit without error and any console output', function(done) {
        exec('./bin/ember-template-lint', function(err, stdout, stderr) {
          assert.equal(err, null, 'exits without error');
          assert.equal(stdout, '', 'doesn\'t print anything to standard output');
          assert.equal(stderr, '', 'doesn\'t print anything to error output');
          done();
        });
      });
    });

    describe('given path to non-existing file', function() {
      it('should exit without error and any console output', function(done) {
        exec('../../../bin/ember-template-lint app/templates/application-1.hbs', {
          cwd: './test/fixtures/with-errors'
        }, function(err, stdout, stderr) {
          assert.equal(err, null, 'exits without error');
          assert.equal(stdout, '', 'doesn\'t print anything to standard output');
          assert.equal(stderr, '', 'doesn\'t print anything to error output');
          done();
        });
      });
    });

    describe('given path to single file with errors', function() {
      it('should print errors', function(done) {
        exec('../../../bin/ember-template-lint app/templates/application.hbs', {
          cwd: './test/fixtures/with-errors'
        }, function(err, stdout, stderr) {
          assert.ok(err, 'exits with error');
          assert.ok(stdout, 'prints errors to standard output');
          assert.equal(stderr, '', 'doesn\'t print anything to error output');
          done();
        });
      });
    });

    describe('given wildcard path resolving to single file', function() {
      it('should print errors', function(done) {
        exec('../../../bin/ember-template-lint app/templates/*', {
          cwd: './test/fixtures/with-errors'
        }, function(err, stdout, stderr) {
          assert.ok(err, 'exits with error');
          assert.ok(stdout, 'print linting errors to standard output');
          assert.equal(stderr, '', 'doesn\'t print anything to error output');
          done();
        });
      });
    });

    describe('given directory path', function() {
      it('should print errors', function(done) {
        exec('../../../bin/ember-template-lint app', {
          cwd: './test/fixtures/with-errors'
        }, function(err, stdout, stderr) {
          assert.ok(err, 'exits with error');
          assert.ok(stdout, 'print linting errors to standard output');
          assert.equal(stderr, '', 'doesn\'t print anything to error output');
          done();
        });
      });
    });

    describe('given path to single file without errors', function() {
      it('should exit without error and any console output', function(done) {
        exec('../../../bin/ember-template-lint app/templates/application.hbs', {
          cwd: './test/fixtures/without-errors'
        }, function(err, stdout, stderr) {
          assert.equal(err, null, 'exits without an error');
          assert.equal(stdout, '', 'doesn\'t print anything to standard output');
          assert.equal(stderr, '', 'doesn\'t print anything to error output');
          done();
        });
      });
    });
  });

  describe('errors formatting', function() {
    describe('without --json param', function() {
      it('should print properly formatted verbose error messages', function(done) {
        exec('../../../bin/ember-template-lint .', {
          cwd: './test/fixtures/with-errors'
        }, function(err, stdout, stderr) {
          assert.ok(err, 'exits with an error');
          assert.deepEqual(
            stdout.split('\n'),
            [
              'bare-strings: Non-translated string used (./app/templates/application @ L1:C4):',
              '`Here too!!`',
              'bare-strings: Non-translated string used (./app/templates/application @ L2:C5):',
              '`Bare strings are bad...`',
              ''
            ],
            'prints properly formatted error messages to standard output'
          );
          assert.equal(stderr, '', 'doesn\'t print anything to error output');
          done();
        });
      });
    });

    describe('with --json param', function() {
      it('should print valid JSON string with errors', function(done) {
        exec('../../../bin/ember-template-lint . --json', {
          cwd: './test/fixtures/with-errors'
        }, function(err, stdout, stderr) {
          var fullTemplateFilePath = path.resolve('./test/fixtures/with-errors/app/templates/application.hbs');
          var expectedOutputData = {};
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

          assert.ok(err, 'exits with an error');
          assert.deepEqual(
            JSON.parse(stdout),
            expectedOutputData,
            'prints errors as valid JSON string to standard output'
          );
          assert.equal(stderr, '', 'doesn\'t print anything to error output');
          done();
        });
      });
    });
  });
});
