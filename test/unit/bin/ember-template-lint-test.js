'use strict';

const execa = require('execa');
const path = require('path');

describe('ember-template-lint executable', function() {
  describe('basic usage', function() {
    describe('without any parameters', function() {
      it('should exit without error and any console output', function() {
        return execa('node', ['./bin/ember-template-lint.js']).then(result => {
          expect(result.code).toBe(0);
          expect(result.stdout).toEqual('');
          expect(result.stderr).toEqual('');
        });
      });
    });

    describe('given path to non-existing file', function() {
      it('should exit without error and any console output', function() {
        let cwd = './test/fixtures/with-errors';
        return execa('node', ['../../../bin/ember-template-lint.js', 'app/templates/application-1.hbs'], { cwd }).then(result => {
          expect(result.code).toBe(0);
          expect(result.stdout).toEqual('');
          expect(result.stderr).toEqual('');
        });
      });
    });

    describe('given path to single file with errors', function() {
      it('should print errors', function() {
        let cwd = './test/fixtures/with-errors';
        return execa('node', ['../../../bin/ember-template-lint.js', 'app/templates/application.hbs'], { cwd, reject: false }).then(result => {
          expect(result.code).toBeTruthy();
          expect(result.stdout).toBeTruthy();
          expect(result.stderr).toEqual('');
        });
      });
    });

    describe('given wildcard path resolving to single file', function() {
      it('should print errors', function() {
        let cwd = './test/fixtures/with-errors';
        return execa('node', ['../../../bin/ember-template-lint.js', 'app/templates/*'], { cwd, reject: false }).then(result => {
          expect(result.code).toBeTruthy();
          expect(result.stdout).toBeTruthy();
          expect(result.stderr).toEqual('');
        });
      });
    });

    describe('given directory path', function() {
      it('should print errors', function() {
        let cwd = './test/fixtures/with-errors';
        return execa('node', ['../../../bin/ember-template-lint.js', 'app'], { cwd, reject: false }).then(result => {
          expect(result.code).toBeTruthy();
          expect(result.stdout).toBeTruthy();
          expect(result.stderr).toEqual('');
        });
      });
    });

    describe('given path to single file without errors', function() {
      it('should exit without error and any console output', function() {
        let cwd = './test/fixtures/without-errors';
        return execa('node', ['../../../bin/ember-template-lint.js', 'app/templates/application.hbs'], { cwd }).then(result => {
          expect(result.code).toBe(0);
          expect(result.stdout).toEqual('');
          expect(result.stderr).toEqual('');
        });
      });
    });
  });

  describe('errors formatting', function() {
    describe('without --json param', function() {
      it('should print properly formatted verbose error messages', function() {
        let cwd = './test/fixtures/with-errors';
        return execa('node', ['../../../bin/ember-template-lint.js', '.'], { cwd, reject: false }).then(result => {
          expect(result.code).toBeTruthy();
          expect(result.stdout.split('\n')).toEqual([
            path.resolve('./test/fixtures/with-errors/app/templates/application.hbs'),
            '  1:4  error  Non-translated string used  bare-strings',
            '  2:5  error  Non-translated string used  bare-strings',
            '',
            '✖ 2 problems',
            ''
          ]);
          expect(result.stderr).toEqual('');
        });
      });
    });

    describe('with --json param', function() {
      it('should print valid JSON string with errors', function() {
        let cwd = './test/fixtures/with-errors';
        return execa('node', ['../../../bin/ember-template-lint.js', '.', '--json'], { cwd, reject: false }).then(result => {
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

          expect(result.code).toBeTruthy();
          expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
          expect(result.stderr).toEqual('');
        });
      });
    });
  });
});
