import { setupProject, teardownProject, runBin } from '../../helpers/bin-tester.js';
import { getOutputFileContents } from '../../helpers/index.js';

describe('Kakoune formatter', () => {
  let project;
  beforeEach(async function () {
    project = await setupProject();
    await project.chdir();
  });

  afterEach(function () {
    teardownProject();
  });

  it('should format errors', async function () {
    await project.setConfig({
      rules: {
        'no-bare-strings': true,
      },
    });
    await project.write({
      app: {
        templates: {
          'application.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
          components: {
            'foo.hbs': '{{fooData}}',
          },
        },
      },
    });

    let result = await runBin('.', '--format', 'kakoune');

    expect(result.exitCode).toEqual(1);
    expect(result.stdout).toMatchInlineSnapshot(`
      "app/templates/application.hbs:1:5: Error: Non-translated string used (no-bare-strings) 
      app/templates/application.hbs:1:26: Error: Non-translated string used (no-bare-strings) 

      2 problems"
    `);
    expect(result.stderr).toBeFalsy();
  });

  it('should format errors and warnings', async function () {
    await project.setConfig({
      rules: {
        'no-bare-strings': true,
        'no-html-comments': 'warn',
      },
    });
    await project.write({
      app: {
        templates: {
          'application.hbs':
            '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
        },
      },
    });

    let result = await runBin('.', '--format', 'kakoune');

    expect(result.exitCode).toEqual(1);
    expect(result.stdout).toMatchInlineSnapshot(`
      "app/templates/application.hbs:1:5: Error: Non-translated string used (no-bare-strings) 
      app/templates/application.hbs:1:25: Error: Non-translated string used (no-bare-strings) 
      app/templates/application.hbs:1:54: Warning: HTML comment detected (no-html-comments) 

      3 problems"
    `);

    expect(result.stderr).toBeFalsy();
  });

  it('should output to a file using --output-file option using default filename', async () => {
    await project.setConfig({
      rules: {
        'no-bare-strings': true,
        'no-html-comments': 'warn',
      },
    });
    await project.write({
      app: {
        templates: {
          'application.hbs':
            '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
        },
      },
    });

    let result = await runBin('.', '--format', 'kakoune', '--output-file');

    expect(result.exitCode).toEqual(1);
    expect(getOutputFileContents(result.stdout)).toMatchInlineSnapshot(`
      "app/templates/application.hbs:1:5: Error: Non-translated string used (no-bare-strings) 
      app/templates/application.hbs:1:25: Error: Non-translated string used (no-bare-strings) 
      app/templates/application.hbs:1:54: Warning: HTML comment detected (no-html-comments) 

      3 problems"
    `);
    expect(result.stderr).toBeFalsy();
  });

  it('should output to a file using --output-file option using custom filename', async () => {
    await project.setConfig({
      rules: {
        'no-bare-strings': true,
        'no-html-comments': 'warn',
      },
    });
    await project.write({
      app: {
        templates: {
          'application.hbs':
            '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
        },
      },
    });

    let result = await runBin(
      '.',
      '--format',
      'kakoune',
      '--output-file',
      'kakoune-output.kakoune'
    );

    expect(result.exitCode).toEqual(1);
    expect(result.stdout).toMatch(/.*kakoune-output\.kakoune/);
    expect(getOutputFileContents(result.stdout)).toMatchInlineSnapshot(`
      "app/templates/application.hbs:1:5: Error: Non-translated string used (no-bare-strings) 
      app/templates/application.hbs:1:25: Error: Non-translated string used (no-bare-strings) 
      app/templates/application.hbs:1:54: Warning: HTML comment detected (no-html-comments) 

      3 problems"
    `);
    expect(result.stderr).toBeFalsy();
  });

  describe('with --quiet option', function () {
    it('should print string with errors, omitting warnings', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': 'warn',
          'no-html-comments': true,
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs':
              '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
          },
        },
      });

      let result = await runBin('.', '--format', 'kakoune', '--quiet');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toMatchInlineSnapshot(`
        "app/templates/application.hbs:1:54: Error: HTML comment detected (no-html-comments) 

        1 problem"
      `);
      expect(result.stderr).toBeFalsy();
    });

    it('should exit without error and empty errors array', async function () {
      await project.setConfig({
        rules: {
          'no-html-comments': 'warn',
        },
      });
      await project.write({
        app: {
          templates: {
            'application.hbs':
              '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
          },
        },
      });
      let result = await runBin('.', '--format', 'kakoune', '--quiet');

      expect(result.exitCode).toEqual(0);
      expect(result.stdout).toMatchInlineSnapshot(`""`);
      expect(result.stderr).toBeFalsy();
    });
  });
});
