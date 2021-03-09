const fs = require('fs');
const path = require('path');

const Sarif = require('../../lib/formatters/sarif');
const Project = require('../helpers/fake-project');

const RESULTS = {
  files: {
    'app/templates/application.hbs': {
      filePath: 'app/templates/application.hbs',
      messages: [
        {
          rule: 'no-bare-strings',
          severity: 2,
          filePath: 'app/templates/application.hbs',
          message: 'Non-translated string used',
          line: 1,
          column: 4,
          source: 'Here too!!',
        },
        {
          rule: 'no-bare-strings',
          severity: 2,
          filePath: 'app/templates/application.hbs',
          message: 'Non-translated string used',
          line: 1,
          column: 24,
          source: 'Bare strings are bad...',
        },
        {
          rule: 'no-html-comments',
          severity: 1,
          filePath: 'app/templates/application.hbs',
          message: 'HTML comment detected',
          line: 1,
          column: 53,
          source: '<!-- bad html comment! -->',
          fix: {
            text: '{{! bad html comment! }}',
          },
        },
      ],
      errorCount: 2,
      warningCount: 1,
      todoCount: 0,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      fixableTodoCount: 0,
    },
  },
  errorCount: 2,
  warningCount: 1,
  todoCount: 0,
  fixableErrorCount: 0,
  fixableWarningCount: 0,
  fixableTodoCount: 0,
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
  workingDirectory: undefined,
};

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

  it('should output sarif log to default path (in project working directory)', function () {
    let sarifOutputPattern = /Report\swrit{2}en\sto\s(.*\/ember-template-lint-report-\d{4}(?:-\d{2}){3}(?:_\d{2}){2}\.sarif)/;
    let formatter = new Sarif(
      Object.assign(DEFAULT_OPTIONS, {
        console: {
          log(str) {
            let sarifLog = JSON.parse(
              fs.readFileSync(str.match(sarifOutputPattern)[1], {
                encoding: 'utf-8',
              })
            );
            debugger;

            expect(str).toMatch(sarifOutputPattern);
            expect(sarifLog).toEqual(expect.objectContaining(SARIF_LOG_MATCHER));
          },
        },
        workingDirectory: project.baseDir,
      })
    );

    formatter.print(RESULTS);
  });

  it('should output sarif log to custom relative path', function () {
    let sarifOutputPattern = /Report\swrit{2}en\sto\s(.*\/my-custom-file.sarif)/;
    let formatter = new Sarif(
      Object.assign(DEFAULT_OPTIONS, {
        console: {
          log(str) {
            let sarifLog = JSON.parse(
              fs.readFileSync(str.match(sarifOutputPattern)[1], {
                encoding: 'utf-8',
              })
            );

            expect(str).toMatch(sarifOutputPattern);
            expect(sarifLog).toEqual(expect.objectContaining(SARIF_LOG_MATCHER));
          },
        },

        outputFile: 'my-custom-file.sarif',
        workingDirectory: project.baseDir,
      })
    );

    formatter.print(RESULTS);
  });

  it('should output sarif log to custom absolute path', function () {
    let sarifOutputPattern = /Report\swrit{2}en\sto\s(.*\/subdir\/my-custom-file.sarif)/;
    let formatter = new Sarif(
      Object.assign(DEFAULT_OPTIONS, {
        console: {
          log(str) {
            let sarifLog = JSON.parse(
              fs.readFileSync(str.match(sarifOutputPattern)[1], {
                encoding: 'utf-8',
              })
            );

            expect(str).toMatch(sarifOutputPattern);
            expect(sarifLog).toEqual(expect.objectContaining(SARIF_LOG_MATCHER));
          },
        },

        outputFile: path.join(project.baseDir, 'subdir', 'my-custom-file.sarif'),
        workingDirectory: project.baseDir,
      })
    );

    formatter.print(RESULTS);
  });

  it('should output sarif log JSON not using TTY', function () {
    let formatter = new Sarif(
      Object.assign(DEFAULT_OPTIONS, {
        console: {
          log(str) {
            expect(JSON.parse(str)).toEqual(expect.objectContaining(SARIF_LOG_MATCHER));
          },
        },

        isInteractive: false,
        workingDirectory: project.baseDir,
      })
    );

    formatter.print(RESULTS);
  });
});
