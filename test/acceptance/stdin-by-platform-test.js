'use strict';

const fs = require('fs');
const path = require('path');

const execa = require('execa');

const Project = require('../helpers/fake-project');
const setupEnvVar = require('../helpers/setup-env-var');

describe('ember-template-lint executable', function () {
  setupEnvVar('GITHUB_ACTIONS', null);
  setupEnvVar('FORCE_COLOR', '0');
  setupEnvVar('LC_ALL', 'en_US');

  // Fake project
  let project;
  beforeEach(function () {
    project = Project.defaultSetup();
    project.setConfig({
      rules: {
        'no-bare-strings': true,
      },
    });
    project.write({
      'template.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
      components: {
        'foo.hbs': '{{fooData}}',
      },
    });
    project.chdir();
  });

  afterEach(async function () {
    await project.dispose();
  });

  describe('command: `node ember-template-lint --filename template.hbs < template.hbs`', function () {
    it('reports errors to stdout', async function () {
      let result = await execa(
        process.execPath,
        [
          require.resolve('../../bin/ember-template-lint.js'),
          '--filename',
          'template.hbs',
          '<',
          'template.hbs',
        ],
        { shell: true, reject: false, cwd: project.path('.') }
      );

      expect(result.stdout).toMatchInlineSnapshot(`
            "template.hbs
              1:4  error  Non-translated string used  no-bare-strings
              1:25  error  Non-translated string used  no-bare-strings

            ✖ 2 problems (2 errors, 0 warnings)"
          `);
      expect(result.stderr).toBeFalsy();
    });

    it('has exit code 1 and reports errors to stdout', async function () {
      let result = await execa(
        process.execPath,
        [require.resolve('../../bin/ember-template-lint.js'), '--filename', 'template.hbs'],
        {
          shell: false,
          reject: false,
          cwd: project.path('.'),
          input: fs.readFileSync(path.resolve('template.hbs')),
        }
      );

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toMatchInlineSnapshot(`
            "template.hbs
              1:4  error  Non-translated string used  no-bare-strings
              1:25  error  Non-translated string used  no-bare-strings

            ✖ 2 problems (2 errors, 0 warnings)"
          `);
      expect(result.stderr).toBeFalsy();
    });
  });

  if (process.platform !== 'win32') {
    describe('posix environments', function () {
      describe('command: `cat template.hbs | ember-template-lint --filename template.hbs -`', function () {
        it('has exit code 1 and reports errors to stdout', async function () {
          let result = await execa(
            'cat',
            [
              'template.hbs',
              '|',
              require.resolve('../../bin/ember-template-lint.js'),
              '--filename',
              'template.hbs',
              '-',
            ],
            { shell: true, reject: false, cwd: project.path('.') }
          );

          expect(result.exitCode).toEqual(1);
          expect(result.stdout).toMatchInlineSnapshot(`
            "template.hbs
              1:4  error  Non-translated string used  no-bare-strings
              1:25  error  Non-translated string used  no-bare-strings

            ✖ 2 problems (2 errors, 0 warnings)"
          `);
          expect(result.stderr).toBeFalsy();
        });
      });
    });
  }
});
