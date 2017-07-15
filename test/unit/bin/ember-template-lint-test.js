'use strict';

const exec = require('child_process').exec;
const expect = require('chai').expect;
const path = require('path');

describe('ember-template-lint executable', function() {
  describe('basic usage', function() {
    describe('without any parameters', function() {
      it('should exit without error and any console output', function(done) {
        exec('./bin/ember-template-lint.js', function(err, stdout, stderr) {
          expect(err).to.be.null;
          expect(stdout).to.be.empty;
          expect(stderr).to.be.empty;
          done();
        });
      });
    });

    describe('given path to non-existing file', function() {
      it('should exit without error and any console output', function(done) {
        exec('../../../bin/ember-template-lint.js app/templates/application-1.hbs', {
          cwd: './test/fixtures/with-errors'
        }, function(err, stdout, stderr) {
          expect(err).to.equal(null, 'exits without error');
          expect(stdout).to.be.empty;
          expect(stderr).to.be.empty;
          done();
        });
      });
    });

    describe('given path to single file with errors', function() {
      it('should print errors', function(done) {
        exec('../../../bin/ember-template-lint.js app/templates/application.hbs', {
          cwd: './test/fixtures/with-errors'
        }, function(err, stdout, stderr) {
          expect(err).to.be.ok;
          expect(stdout).to.be.ok;
          expect(stderr).to.be.empty;
          done();
        });
      });
    });

    describe('given wildcard path resolving to single file', function() {
      it('should print errors', function(done) {
        exec('../../../bin/ember-template-lint.js app/templates/*', {
          cwd: './test/fixtures/with-errors'
        }, function(err, stdout, stderr) {
          expect(err).to.be.ok;
          expect(stdout).to.be.ok;
          expect(stderr).to.be.empty;
          done();
        });
      });
    });

    describe('given directory path', function() {
      it('should print errors', function(done) {
        exec('../../../bin/ember-template-lint.js app', {
          cwd: './test/fixtures/with-errors'
        }, function(err, stdout, stderr) {
          expect(err).to.be.ok;
          expect(stdout).to.be.ok;
          expect(stderr).to.be.empty;
          done();
        });
      });
    });

    describe('given path to single file without errors', function() {
      it('should exit without error and any console output', function(done) {
        exec('../../../bin/ember-template-lint.js app/templates/application.hbs', {
          cwd: './test/fixtures/without-errors'
        }, function(err, stdout, stderr) {
          expect(err).to.be.null;
          expect(stdout).to.be.empty;
          expect(stderr).to.be.empty;
          done();
        });
      });
    });
  });

  describe('errors formatting', function() {
    describe('without --json param', function() {
      it('should print properly formatted verbose error messages', function(done) {
        exec('../../../bin/ember-template-lint.js .', {
          cwd: './test/fixtures/with-errors'
        }, function(err, stdout, stderr) {
          expect(err).to.be.ok;
          expect(stdout.split('\n')).to.deep.equal([
            '/Users/maciej/Developer/ember-template-lint/test/fixtures/with-errors/app/templates/application.hbs',
            '  1:4  error  Non-translated string used  bare-strings',
            '  2:5  error  Non-translated string used  bare-strings',
            '',
            '✖ 2 problems',
            ''
          ]);
          expect(stderr).to.be.empty;
          done();
        });
      });
    });

    describe('with --json param', function() {
      it('should print valid JSON string with errors', function(done) {
        exec('../../../bin/ember-template-lint.js . --json', {
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

          expect(err).to.be.ok;
          expect(JSON.parse(stdout)).to.deep.equal(expectedOutputData);
          expect(stderr).to.be.empty;
          done();
        });
      });
    });
  });
});
