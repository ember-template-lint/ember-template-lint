import Project from '../../helpers/fake-project.js';
import run from '../../helpers/run.js';

const ROOT = process.cwd();

describe('JSON formatter', () => {
  let project;
  beforeEach(function () {
    project = Project.defaultSetup();
    project.chdir();
  });

  afterEach(function () {
    process.chdir(ROOT);
    project.dispose();
  });

  it('should format errors', async function () {
    project.setConfig({
      rules: {
        'no-bare-strings': true,
      },
    });
    project.write({
      app: {
        templates: {
          'application.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
          components: {
            'foo.hbs': '{{fooData}}',
          },
        },
      },
    });

    let result = await run(['.', '--format', 'json']);

    expect(result.exitCode).toEqual(1);
    expect(result.stdout).toMatchInlineSnapshot(`
      "{
        \\"app/templates/application.hbs\\": [
          {
            \\"rule\\": \\"no-bare-strings\\",
            \\"severity\\": 2,
            \\"filePath\\": \\"app/templates/application.hbs\\",
            \\"line\\": 1,
            \\"column\\": 4,
            \\"endLine\\": 1,
            \\"endColumn\\": 14,
            \\"source\\": \\"Here too!!\\",
            \\"message\\": \\"Non-translated string used\\"
          },
          {
            \\"rule\\": \\"no-bare-strings\\",
            \\"severity\\": 2,
            \\"filePath\\": \\"app/templates/application.hbs\\",
            \\"line\\": 1,
            \\"column\\": 25,
            \\"endLine\\": 1,
            \\"endColumn\\": 48,
            \\"source\\": \\"Bare strings are bad...\\",
            \\"message\\": \\"Non-translated string used\\"
          }
        ]
      }"
    `);
    expect(result.stderr).toBeFalsy();
  });

  it('should format errors and warnings', async function () {
    project.setConfig({
      rules: {
        'no-bare-strings': true,
        'no-html-comments': 'warn',
      },
    });
    project.write({
      app: {
        templates: {
          'application.hbs':
            '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
        },
      },
    });

    let result = await run(['.', '--format', 'json']);

    expect(result.exitCode).toEqual(1);
    expect(result.stdout).toMatchInlineSnapshot();
    expect(result.stderr).toBeFalsy();
  });

  it('should include information about available fixes', async function () {
    project.setConfig({
      rules: {
        'require-button-type': true,
      },
    });

    project.write({
      app: {
        components: {
          'click-me-button.hbs': '<button>Click me!</button>',
        },
      },
    });

    let result = await run(['.', '--format', 'json']);

    expect(result.exitCode).toEqual(1);
    expect(result.stdout).toMatchInlineSnapshot(`
      "{
        \\"app/components/click-me-button.hbs\\": [
          {
            \\"rule\\": \\"require-button-type\\",
            \\"severity\\": 2,
            \\"filePath\\": \\"app/components/click-me-button.hbs\\",
            \\"line\\": 1,
            \\"column\\": 0,
            \\"endLine\\": 1,
            \\"endColumn\\": 26,
            \\"source\\": \\"<button>Click me!</button>\\",
            \\"message\\": \\"All \`<button>\` elements should have a valid \`type\` attribute\\",
            \\"isFixable\\": true
          }
        ]
      }"
    `);
    expect(result.stderr).toBeFalsy();
  });

  describe('with --quiet option', function () {
    it('should print valid JSON string with errors, omitting warnings', async function () {
      project.setConfig({
        rules: {
          'no-bare-strings': true,
          'no-html-comments': true,
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs':
              '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
          },
        },
      });

      let result = await run(['.', '--format', 'json', '--quiet']);

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toMatchInlineSnapshot(`
        "{
          \\"app/templates/application.hbs\\": [
            {
              \\"rule\\": \\"no-bare-strings\\",
              \\"severity\\": 2,
              \\"filePath\\": \\"app/templates/application.hbs\\",
              \\"line\\": 1,
              \\"column\\": 4,
              \\"endLine\\": 1,
              \\"endColumn\\": 14,
              \\"source\\": \\"Here too!!\\",
              \\"message\\": \\"Non-translated string used\\"
            },
            {
              \\"rule\\": \\"no-bare-strings\\",
              \\"severity\\": 2,
              \\"filePath\\": \\"app/templates/application.hbs\\",
              \\"line\\": 1,
              \\"column\\": 24,
              \\"endLine\\": 1,
              \\"endColumn\\": 47,
              \\"source\\": \\"Bare strings are bad...\\",
              \\"message\\": \\"Non-translated string used\\"
            },
            {
              \\"rule\\": \\"no-html-comments\\",
              \\"severity\\": 2,
              \\"filePath\\": \\"app/templates/application.hbs\\",
              \\"line\\": 1,
              \\"column\\": 53,
              \\"endLine\\": 1,
              \\"endColumn\\": 79,
              \\"source\\": \\"<!-- bad html comment! -->\\",
              \\"message\\": \\"HTML comment detected\\",
              \\"fix\\": {
                \\"text\\": \\"{{! bad html comment! }}\\"
              }
            }
          ]
        }"
      `);
      expect(result.stderr).toBeFalsy();
    });

    it('should exit without error and empty errors array', async function () {
      project.setConfig({
        rules: {
          'no-html-comments': 'warn',
        },
      });
      project.write({
        app: {
          templates: {
            'application.hbs':
              '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
          },
        },
      });
      let result = await run(['.', '--format', 'json', '--quiet']);

      expect(result.exitCode).toEqual(0);
      expect(result.stdout).toMatchInlineSnapshot(`
        "{
          \\"app/templates/application.hbs\\": []
        }"
      `);
      expect(result.stderr).toBeFalsy();
    });
});
