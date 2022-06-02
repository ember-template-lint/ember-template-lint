import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import SarifFormatter from '../../../lib/formatters/sarif.js';
import { setupProject, teardownProject, runBin } from '../../helpers/bin-tester.js';
import { getOutputFileContents } from '../../helpers/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const EMPTY_SARIF_LOG_MATCHER = {
  version: '2.1.0',
  $schema: 'http://json.schemastore.org/sarif-2.1.0-rtm.5',
  runs: [
    {
      tool: {
        driver: {
          name: 'ember-template-lint',
          informationUri: 'https://github.com/ember-template-lint/ember-template-lint',
          rules: [],
          version: expect.stringMatching('.*'),
        },
      },
      results: [],
    },
  ],
};

const SARIF_LOG_MATCHER = {
  version: '2.1.0',
  $schema: 'http://json.schemastore.org/sarif-2.1.0-rtm.5',
  runs: [
    {
      tool: {
        driver: {
          name: 'ember-template-lint',
          informationUri: 'https://github.com/ember-template-lint/ember-template-lint',
          rules: [
            {
              id: 'no-bare-strings',
              helpUri: expect.stringMatching(
                `https://github.com/ember-template-lint/ember-template-lint/blob/.*/docs/rule/no-bare-strings.md`
              ),
            },
          ],
          version: expect.stringMatching('.*'),
        },
      },
      artifacts: [
        {
          location: {
            uri: expect.stringMatching('file://.*/app/templates/application.hbs'),
          },
        },
      ],
      results: [
        {
          level: 'error',
          message: {
            text: 'Non-translated string used',
          },
          locations: [
            {
              physicalLocation: {
                artifactLocation: {
                  uri: expect.stringMatching('file://.*/app/templates/application.hbs'),
                  index: 0,
                },
                region: {
                  startLine: 1,
                  startColumn: 4,
                  snippet: {
                    text: 'Here too!!',
                  },
                },
              },
            },
          ],
          ruleId: 'no-bare-strings',
          ruleIndex: 0,
        },
        {
          level: 'error',
          message: {
            text: 'Non-translated string used',
          },
          locations: [
            {
              physicalLocation: {
                artifactLocation: {
                  uri: expect.stringMatching('file://.*/app/templates/application.hbs'),
                  index: 0,
                },
                region: {
                  startLine: 1,
                  startColumn: 24,
                  snippet: {
                    text: 'Bare strings are bad...',
                  },
                },
              },
            },
          ],
          ruleId: 'no-bare-strings',
          ruleIndex: 0,
        },
      ],
    },
  ],
};

const SARIF_LOG_MATCHER_WITH_WARNING = {
  version: '2.1.0',
  $schema: 'http://json.schemastore.org/sarif-2.1.0-rtm.5',
  runs: [
    {
      tool: {
        driver: {
          name: 'ember-template-lint',
          informationUri: 'https://github.com/ember-template-lint/ember-template-lint',
          rules: [
            {
              id: 'no-bare-strings',
              helpUri: expect.stringMatching(
                `https://github.com/ember-template-lint/ember-template-lint/blob/.*/docs/rule/no-bare-strings.md`
              ),
            },
            {
              id: 'no-html-comments',
              helpUri: expect.stringMatching(
                `https://github.com/ember-template-lint/ember-template-lint/blob/.*/docs/rule/no-html-comments.md`
              ),
            },
          ],
          version: expect.stringMatching('.*'),
        },
      },
      artifacts: [
        {
          location: {
            uri: expect.stringMatching('file://.*/app/templates/application.hbs'),
          },
        },
      ],
      results: [
        {
          level: 'error',
          message: {
            text: 'Non-translated string used',
          },
          locations: [
            {
              physicalLocation: {
                artifactLocation: {
                  uri: expect.stringMatching('file://.*/app/templates/application.hbs'),
                  index: 0,
                },
                region: {
                  startLine: 1,
                  startColumn: 4,
                  snippet: {
                    text: 'Here too!!',
                  },
                },
              },
            },
          ],
          ruleId: 'no-bare-strings',
          ruleIndex: 0,
        },
        {
          level: 'error',
          message: {
            text: 'Non-translated string used',
          },
          locations: [
            {
              physicalLocation: {
                artifactLocation: {
                  uri: expect.stringMatching('file://.*/app/templates/application.hbs'),
                  index: 0,
                },
                region: {
                  startLine: 1,
                  startColumn: 24,
                  snippet: {
                    text: 'Bare strings are bad...',
                  },
                },
              },
            },
          ],
          ruleId: 'no-bare-strings',
          ruleIndex: 0,
        },
        {
          level: 'warning',
          message: {
            text: 'HTML comment detected',
          },
          locations: [
            {
              physicalLocation: {
                artifactLocation: {
                  uri: expect.stringMatching('file://.*/app/templates/application.hbs'),
                  index: 0,
                },
                region: {
                  startLine: 1,
                  startColumn: 53,
                  snippet: {
                    text: '<!-- bad html comment! -->',
                  },
                },
              },
            },
          ],
          ruleId: 'no-html-comments',
          ruleIndex: 1,
        },
      ],
    },
  ],
};

const DEFAULT_OPTIONS = {
  console: undefined,
  includeTodo: false,
  isInteractive: true,
  outputFile: undefined,
  quiet: false,
  updateTodo: false,
  verbose: false,
  workingDir: undefined,
};

function getFixture(fixtureName) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, '../..', 'fixtures', 'sarif', `${fixtureName}.json`))
  );
}

describe('SARIF formatter', () => {
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
          'application.hbs': '<h2>Here too!!</h2><div>Bare strings are bad...</div>',
        },
      },
    });

    let result = await runBin('.', '--format', 'sarif');
    let sarifLog = JSON.parse(result.stdout);

    expect(result.exitCode).toEqual(1);
    expect(sarifLog).toEqual(expect.objectContaining(SARIF_LOG_MATCHER));
    expect(sarifLog).toBeValidSarifLog();
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

    let result = await runBin('.', '--format', 'sarif');
    let sarifLog = JSON.parse(result.stdout);

    expect(result.exitCode).toEqual(1);
    expect(sarifLog).toEqual(expect.objectContaining(SARIF_LOG_MATCHER_WITH_WARNING));
    expect(sarifLog).toBeValidSarifLog();
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

    let result = await runBin('.', '--format', 'sarif', '--output-file');

    expect(result.exitCode).toEqual(1);
    expect(JSON.parse(getOutputFileContents(result.stdout))).toEqual(
      expect.objectContaining(SARIF_LOG_MATCHER_WITH_WARNING)
    );
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

    let result = await runBin('.', '--format', 'sarif', '--output-file', 'sarif-output.sarif');

    expect(result.exitCode).toEqual(1);
    expect(result.stdout).toMatch(/.*sarif-output\.sarif/);
    expect(JSON.parse(getOutputFileContents(result.stdout))).toEqual(
      expect.objectContaining(SARIF_LOG_MATCHER_WITH_WARNING)
    );
    expect(result.stderr).toBeFalsy();
  });

  it('should output to a file using --output-file option using custom filename using relative path', async () => {
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

    let result = await runBin('.', '--format', 'sarif', '--output-file', './sarif-output.sarif');

    expect(result.exitCode).toEqual(1);
    expect(result.stdout).toMatch(/.*sarif-output\.sarif/);
    expect(JSON.parse(getOutputFileContents(result.stdout))).toEqual(
      expect.objectContaining(SARIF_LOG_MATCHER_WITH_WARNING)
    );
    expect(result.stderr).toBeFalsy();
  });

  it('should output to a file using --output-file option using custom filename using absolute path', async () => {
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

    let outputFilePath = path.join(project.baseDir, 'subdir', 'my-custom-file.sarif');
    let result = await runBin('.', '--format', 'sarif', '--output-file', outputFilePath);

    expect(result.exitCode).toEqual(1);
    expect(JSON.parse(getOutputFileContents(result.stdout))).toEqual(
      expect.objectContaining(SARIF_LOG_MATCHER_WITH_WARNING)
    );
    expect(result.stderr).toBeFalsy();
  });

  it('should output sarif log JSON not using TTY', function () {
    let formatter = new SarifFormatter(
      Object.assign({}, DEFAULT_OPTIONS, {
        console: {
          log(str) {
            let sarifLog = JSON.parse(str);

            expect(sarifLog).toEqual(expect.objectContaining(SARIF_LOG_MATCHER));
            expect(sarifLog).toBeValidSarifLog();
          },
        },

        isInteractive: false,
        workingDir: project.baseDir,
      })
    );

    let results = getFixture('results-errors-warnings');
    formatter.format(results);
  });

  it('should always emit a SARIF file even when there are no errors/warnings', async function () {
    await project.setConfig({
      rules: {
        'no-bare-strings': true,
        'no-html-comments': true,
      },
    });
    await project.write({
      app: {
        templates: {
          'application.hbs': '<div></div>',
        },
      },
    });

    let result = await runBin('.', '--format', 'sarif', '--output-file', 'my-results.sarif', {
      env: {
        IS_TTY: '1',
      },
    });

    expect(result.exitCode).toEqual(0);
    expect(JSON.parse(getOutputFileContents(result.stdout))).toEqual(
      expect.objectContaining(EMPTY_SARIF_LOG_MATCHER)
    );
  });
});
