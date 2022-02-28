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

  it('should print valid JSON string with errors', async function () {
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

    let result = await run(['--format=json', '.']);

    let expectedOutputData = {};
    expectedOutputData['app/templates/application.hbs'] = [
      {
        column: 4,
        line: 1,
        endColumn: 14,
        endLine: 1,
        message: 'Non-translated string used',
        filePath: 'app/templates/application.hbs',
        rule: 'no-bare-strings',
        severity: 2,
        source: 'Here too!!',
      },
      {
        column: 25,
        line: 1,
        endColumn: 48,
        endLine: 1,
        message: 'Non-translated string used',
        filePath: 'app/templates/application.hbs',
        rule: 'no-bare-strings',
        severity: 2,
        source: 'Bare strings are bad...',
      },
    ];

    expect(result.exitCode).toEqual(1);
    expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
    expect(result.stderr).toBeFalsy();
  });

  it('should include information about fixing', async function () {
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

    let result = await run(['.', '--format=json']);

    let expectedOutputData = {};
    expectedOutputData['app/components/click-me-button.hbs'] = [
      {
        column: 0,
        line: 1,
        endColumn: 26,
        endLine: 1,
        isFixable: true,
        message: 'All `<button>` elements should have a valid `type` attribute',
        filePath: 'app/components/click-me-button.hbs',
        rule: 'require-button-type',
        severity: 2,
        source: '<button>Click me!</button>',
      },
    ];

    expect(result.exitCode).toEqual(1);
    expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
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

      let result = await run(['.', '--format=json', '--quiet']);

      let expectedOutputData = {};
      expectedOutputData['app/templates/application.hbs'] = [
        {
          column: 4,
          line: 1,
          endColumn: 14,
          endLine: 1,
          message: 'Non-translated string used',
          filePath: 'app/templates/application.hbs',
          rule: 'no-bare-strings',
          severity: 2,
          source: 'Here too!!',
        },
        {
          column: 24,
          line: 1,
          endColumn: 47,
          endLine: 1,
          message: 'Non-translated string used',
          filePath: 'app/templates/application.hbs',
          rule: 'no-bare-strings',
          severity: 2,
          source: 'Bare strings are bad...',
        },
        {
          column: 53,
          endColumn: 79,
          endLine: 1,
          filePath: 'app/templates/application.hbs',
          fix: {
            text: '{{! bad html comment! }}',
          },
          line: 1,
          message: 'HTML comment detected',
          rule: 'no-html-comments',
          severity: 2,
          source: '<!-- bad html comment! -->',
        },
      ];

      expect(result.exitCode).toEqual(1);
      expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
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
      let result = await run(['.', '--format=json', '--quiet']);

      let expectedOutputData = {};
      expectedOutputData['app/templates/application.hbs'] = [];

      expect(result.exitCode).toEqual(0);
      expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
      expect(result.stderr).toBeFalsy();
    });

    it('should include information about fixing', async function () {
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

      let result = await run(['.', '--format=json']);

      let expectedOutputData = {};
      expectedOutputData['app/components/click-me-button.hbs'] = [
        {
          column: 0,
          line: 1,
          endColumn: 26,
          endLine: 1,
          isFixable: true,
          message: 'All `<button>` elements should have a valid `type` attribute',
          filePath: 'app/components/click-me-button.hbs',
          rule: 'require-button-type',
          severity: 2,
          source: '<button>Click me!</button>',
        },
      ];

      expect(result.exitCode).toEqual(1);
      expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
      expect(result.stderr).toBeFalsy();
    });
  });
});
