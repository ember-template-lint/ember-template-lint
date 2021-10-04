const fs = require('fs');
const path = require('path');

const SarifFormatter = require('../../lib/formatters/sarif');
const Project = require('../helpers/fake-project');

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

const ROOT = process.cwd();
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
    fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'sarif', `${fixtureName}.json`), {
      encoding: 'utf-8',
    })
  );
}

describe('', () => {
  let project;

  beforeEach(function () {
    project = Project.defaultSetup();
    project.chdir();
  });

  afterEach(async function () {
    process.chdir(ROOT);
    await project.dispose();
  });

  it('should output sarif log with errors only', function () {
    let formatter = new SarifFormatter(
      Object.assign({}, DEFAULT_OPTIONS, {
        console: {
          log(str) {
            let sarifLog = JSON.parse(str);

            expect(sarifLog.runs[0].results).toHaveLength(1);
            expect(sarifLog).toBeValidSarifLog();
          },
        },

        quiet: true,
        isInteractive: false,
        workingDir: project.baseDir,
      })
    );

    let results = getFixture('results-errors-warnings-todos');
    formatter.print(results);
  });

  it('should output sarif log with errors and warnings', function () {
    let formatter = new SarifFormatter(
      Object.assign({}, DEFAULT_OPTIONS, {
        console: {
          log(str) {
            let sarifLog = JSON.parse(str);

            expect(sarifLog.runs[0].results).toHaveLength(2);
            expect(sarifLog).toBeValidSarifLog();
          },
        },

        isInteractive: false,
        workingDir: project.baseDir,
      })
    );

    let results = getFixture('results-errors-warnings-todos');
    formatter.print(results);
  });

  it('should output sarif log with errors and warnings and todos', function () {
    let formatter = new SarifFormatter(
      Object.assign({}, DEFAULT_OPTIONS, {
        console: {
          log(str) {
            let sarifLog = JSON.parse(str);

            expect(sarifLog.runs[0].results).toHaveLength(3);
            expect(sarifLog).toBeValidSarifLog();
          },
        },

        includeTodo: true,
        isInteractive: false,
        workingDir: project.baseDir,
      })
    );

    let results = getFixture('results-errors-warnings-todos');
    formatter.print(results);
  });

  it('should output sarif log to default path (in project working directory)', function () {
    let sarifPattern =
      /Report\swrit{2}en\sto\s(.*ember-template-lint-report-\d{4}(?:-\d{2}){3}(?:_\d{2}){2}\.sarif)/;
    let formatter = new SarifFormatter(
      Object.assign({}, DEFAULT_OPTIONS, {
        console: {
          log(str) {
            let sarifLog = JSON.parse(
              fs.readFileSync(str.match(sarifPattern)[1], {
                encoding: 'utf-8',
              })
            );

            expect(str).toMatch(sarifPattern);
            expect(sarifLog).toEqual(expect.objectContaining(SARIF_LOG_MATCHER));
            expect(sarifLog).toBeValidSarifLog();
          },
        },
        workingDir: project.baseDir,
      })
    );

    let results = getFixture('results-errors-warnings');
    formatter.print(results);
  });

  it('should always output a SARIF file if options.outputFile is specified', function () {
    let sarifPattern = /Report\swrit{2}en\sto\s(.*foo\.sarif)/;
    let formatter = new SarifFormatter(
      Object.assign({}, DEFAULT_OPTIONS, {
        console: {
          log(str) {
            let sarifLog = JSON.parse(
              fs.readFileSync(str.match(sarifPattern)[1], {
                encoding: 'utf-8',
              })
            );

            expect(str).toMatch(sarifPattern);
            expect(sarifLog).toEqual(expect.objectContaining(SARIF_LOG_MATCHER));
            expect(sarifLog).toBeValidSarifLog();
          },
        },
        workingDir: project.baseDir,
        outputFile: 'foo.sarif',
      })
    );

    let results = getFixture('results-errors-warnings');
    formatter.print(results);
  });

  it('should output sarif log to custom relative path', function () {
    let sarifPattern = /Report\swrit{2}en\sto\s(.*my-custom-file.sarif)/;
    let formatter = new SarifFormatter(
      Object.assign({}, DEFAULT_OPTIONS, {
        console: {
          log(str) {
            let sarifLog = JSON.parse(
              fs.readFileSync(str.match(sarifPattern)[1], {
                encoding: 'utf-8',
              })
            );

            expect(str).toMatch(sarifPattern);
            expect(sarifLog).toEqual(expect.objectContaining(SARIF_LOG_MATCHER));
            expect(sarifLog).toBeValidSarifLog();
          },
        },

        outputFile: 'my-custom-file.sarif',
        workingDir: project.baseDir,
      })
    );

    let results = getFixture('results-errors-warnings');
    formatter.print(results);
  });

  it('should output sarif log to custom absolute path', function () {
    let sarifPattern = /Report\swrit{2}en\sto\s(.*subdir(\/|\\)my-custom-file.sarif)/;
    let formatter = new SarifFormatter(
      Object.assign({}, DEFAULT_OPTIONS, {
        console: {
          log(str) {
            let sarifLog = JSON.parse(
              fs.readFileSync(str.match(sarifPattern)[1], {
                encoding: 'utf-8',
              })
            );

            expect(str).toMatch(sarifPattern);
            expect(sarifLog).toEqual(expect.objectContaining(SARIF_LOG_MATCHER));
            expect(sarifLog).toBeValidSarifLog();
          },
        },

        outputFile: path.join(project.baseDir, 'subdir', 'my-custom-file.sarif'),
        workingDir: project.baseDir,
      })
    );

    let results = getFixture('results-errors-warnings');
    formatter.print(results);
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
    formatter.print(results);
  });
});
