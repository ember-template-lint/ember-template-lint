import { setupProject, teardownProject, runBin } from '../../helpers/bin-tester.js';
import { getOutputFileContents, setupEnvVar } from '../../helpers/index.js';

describe('multi formatter', () => {
  setupEnvVar('FORCE_COLOR', '0');

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
      format: {
        formatters: [
          {
            name: 'pretty',
          },
          {
            name: 'json',
            outputFile: 'my-results.json',
          },
        ],
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

    let result = await runBin('.', '--format', 'multi');

    expect(result.exitCode).toEqual(1);
    expect(result.stdout.replace(project.baseDir, '')).toMatchInlineSnapshot(`
      "app/templates/application.hbs
        1:4  error  Non-translated string used  no-bare-strings
        1:25  error  Non-translated string used  no-bare-strings

      ✖ 2 problems (2 errors, 0 warnings)
      Report written to /my-results.json
      "
    `);
    expect(getOutputFileContents(result.stdout)).toMatchInlineSnapshot(`
      "{
        "app/templates/application.hbs": [
          {
            "rule": "no-bare-strings",
            "severity": 2,
            "filePath": "app/templates/application.hbs",
            "line": 1,
            "column": 4,
            "endLine": 1,
            "endColumn": 14,
            "source": "Here too!!",
            "message": "Non-translated string used"
          },
          {
            "rule": "no-bare-strings",
            "severity": 2,
            "filePath": "app/templates/application.hbs",
            "line": 1,
            "column": 25,
            "endLine": 1,
            "endColumn": 48,
            "source": "Bare strings are bad...",
            "message": "Non-translated string used"
          }
        ]
      }"
    `);
    expect(result.stderr).toBeFalsy();
  });
});
