import { execa } from 'execa';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { setupProject, teardownProject, runBin } from '../helpers/bin-tester.js';
import setupEnvVar from '../helpers/setup-env-var.js';

describe('ember-template-lint executable', function () {
  setupEnvVar('FORCE_COLOR', '0');
  setupEnvVar('LC_ALL', 'en_US');

  // Fake project
  let project;
  beforeEach(async function () {
    project = await setupProject();
    await project.setConfig({
      rules: {
        'no-bare-strings': true,
      },
    });
    await project.write({
      'template.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
      components: {
        'foo.hbs': '{{fooData}}',
      },
    });
    project.chdir();
  });

  afterEach(function () {
    teardownProject();
  });

  describe('command: `node ember-template-lint --filename template.hbs < template.hbs`', function () {
    it('reports errors to stdout', async function () {
      let result = await runBin('--filename', 'template.hbs', '<', 'template.hbs', {
        shell: true,
        reject: false,
        cwd: project.path('.'),
      });

      expect(result.stdout).toMatchInlineSnapshot(`
        "Linting 1 Total Files with TemplateLint
        	: 1

        template.hbs
          1:4  error  Non-translated string used  no-bare-strings
          1:25  error  Non-translated string used  no-bare-strings

        ✖ 2 problems (2 errors, 0 warnings)"
      `);
      expect(result.stderr).toBeFalsy();
    });

    it('has exit code 1 and reports errors to stdout', async function () {
      let result = await runBin('--filename', 'template.hbs', {
        shell: false,
        reject: false,
        cwd: project.path('.'),
        input: fs.readFileSync(path.resolve('template.hbs')),
      });

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toMatchInlineSnapshot(`
        "Linting 1 Total Files with TemplateLint
        	: 1

        template.hbs
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
          const binPath = fileURLToPath(
            new URL('../../bin/ember-template-lint.js', import.meta.url)
          );
          let result = await execa(
            'cat',
            ['template.hbs', '|', binPath, '--filename', 'template.hbs', '-'],
            { shell: true, reject: false, cwd: project.path('.') }
          );

          expect(result.exitCode).toEqual(1);
          expect(result.stdout).toMatchInlineSnapshot(`
            "Linting 1 Total Files with TemplateLint
            	: 1

            template.hbs
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
