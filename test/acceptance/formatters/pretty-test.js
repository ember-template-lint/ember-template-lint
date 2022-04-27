import chalk from 'chalk';

import PrettyFormatter from '../../../lib/formatters/pretty.js';
import { TODO_SEVERITY } from '../../../lib/helpers/severity.js';
import { setupProject, teardownProject, runBin } from '../../helpers/bin-tester.js';
import { getOutputFileContents, setupEnvVar } from '../../helpers/index.js';

describe('pretty formatter', () => {
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

    let result = await runBin('.');

    expect(result.exitCode).toEqual(1);
    expect(result.stdout.split('\n')).toMatchInlineSnapshot(`
      [
        "Linting 2 Total Files with TemplateLint",
        "	.hbs: 2",
        "",
        "app/templates/application.hbs",
        "  1:4  error  Non-translated string used  no-bare-strings",
        "  1:25  error  Non-translated string used  no-bare-strings",
        "",
        "✖ 2 problems (2 errors, 0 warnings)",
      ]
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

    let result = await runBin('.');

    expect(result.exitCode).toEqual(1);
    expect(result.stdout.split('\n')).toMatchInlineSnapshot(`
      [
        "Linting 1 Total Files with TemplateLint",
        "	.hbs: 1",
        "",
        "app/templates/application.hbs",
        "  1:4  error  Non-translated string used  no-bare-strings",
        "  1:24  error  Non-translated string used  no-bare-strings",
        "  1:53  warning  HTML comment detected  no-html-comments",
        "",
        "✖ 3 problems (2 errors, 1 warnings)",
        "  0 errors and 1 warnings potentially fixable with the \`--fix\` option.",
      ]
    `);
    expect(result.stderr).toBeFalsy();
  });

  it('should include information about available fixes', async function () {
    await project.setConfig({
      rules: {
        'require-button-type': true,
      },
    });

    await project.write({
      app: {
        components: {
          'click-me-button.hbs': '<button>Click me!</button>',
        },
      },
    });

    let result = await runBin('.');

    expect(result.exitCode).toEqual(1);

    expect(result.stdout.split('\n')).toMatchInlineSnapshot(`
      [
        "Linting 1 Total Files with TemplateLint",
        "	.hbs: 1",
        "",
        "app/components/click-me-button.hbs",
        "  1:0  error  All \`<button>\` elements should have a valid \`type\` attribute  require-button-type",
        "",
        "✖ 1 problems (1 errors, 0 warnings)",
        "  1 errors and 0 warnings potentially fixable with the \`--fix\` option.",
      ]
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

    let result = await runBin('.', '--output-file');

    expect(result.exitCode).toEqual(1);
    expect(getOutputFileContents(result.stdout)).toMatchInlineSnapshot(`
      "app/templates/application.hbs
        1:4  error  Non-translated string used  no-bare-strings
        1:24  error  Non-translated string used  no-bare-strings
        1:53  warning  HTML comment detected  no-html-comments

      ✖ 3 problems (2 errors, 1 warnings)
        0 errors and 1 warnings potentially fixable with the \`--fix\` option."
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

    let result = await runBin('.', '--output-file', 'pretty-output.txt');

    expect(result.exitCode).toEqual(1);
    expect(result.stdout).toMatch(/.*pretty-output\.txt/);
    expect(getOutputFileContents(result.stdout)).toMatchInlineSnapshot(`
      "app/templates/application.hbs
        1:4  error  Non-translated string used  no-bare-strings
        1:24  error  Non-translated string used  no-bare-strings
        1:53  warning  HTML comment detected  no-html-comments

      ✖ 3 problems (2 errors, 1 warnings)
        0 errors and 1 warnings potentially fixable with the \`--fix\` option."
    `);
    expect(result.stderr).toBeFalsy();
  });

  describe('with --print-full-path option', function () {
    it('should print properly formatted error messages, with full path printed', async function () {
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

      let result = await runBin('.', '--print-full-path');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout.split('\n')).toEqual([
        `${project.baseDir}/app/templates/application.hbs`,
        '  1:4  error  Non-translated string used  no-bare-strings',
        '  1:25  error  Non-translated string used  no-bare-strings',
        '',
        '✖ 2 problems (2 errors, 0 warnings)',
      ]);
      expect(result.stderr).toBeFalsy();
    });
  });

  describe('with --quiet option', function () {
    it('should print properly formatted error messages, omitting any warnings', async function () {
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

      let result = await runBin('.', '--quiet');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout.split('\n')).toMatchInlineSnapshot(`
        [
          "app/templates/application.hbs",
          "  1:4  error  Non-translated string used  no-bare-strings",
          "  1:24  error  Non-translated string used  no-bare-strings",
          "",
          "✖ 2 problems (2 errors, 0 warnings)",
          "  0 errors and 1 warnings potentially fixable with the \`--fix\` option.",
        ]
      `);
      expect(result.stderr).toBeFalsy();
    });

    it('should exit without error and any console output', async function () {
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
      let result = await runBin('.', '--quiet');

      expect(result.exitCode).toEqual(0);
      expect(result.stdout).toBeFalsy();
      expect(result.stderr).toBeFalsy();
    });
  });
});

describe('Linter.errorsToMessages', function () {
  beforeEach(() => {
    chalk.level = 0;
  });

  it('formats error with rule, message and moduleId', function () {
    let result = PrettyFormatter.errorsToMessages('file/path', [
      { rule: 'some rule', message: 'some message' },
    ]);

    expect(result).toEqual('file/path\n' + '  -:-  error  some message  some rule\n');
  });

  it('formats error with rule, message, line and column numbers even when they are "falsey"', function () {
    let result = PrettyFormatter.errorsToMessages('file/path', [
      { rule: 'some rule', message: 'some message', line: 1, column: 0 },
    ]);

    expect(result).toEqual('file/path\n' + '  1:0  error  some message  some rule\n');
  });

  it('formats error with rule, message, line and column numbers', function () {
    let result = PrettyFormatter.errorsToMessages('file/path', [
      { rule: 'some rule', message: 'some message', line: 11, column: 12 },
    ]);

    expect(result).toEqual('file/path\n' + '  11:12  error  some message  some rule\n');
  });

  it('formats error with rule, message, source', function () {
    let result = PrettyFormatter.errorsToMessages(
      'file/path',
      [{ rule: 'some rule', message: 'some message', source: 'some source' }],
      { verbose: true }
    );

    expect(result).toEqual(
      'file/path\n' + '  -:-  error  some message  some rule\n' + 'some source\n'
    );
  });

  it('formats more than one error', function () {
    let result = PrettyFormatter.errorsToMessages('file/path', [
      { rule: 'some rule', message: 'some message', line: 11, column: 12 },
      {
        rule: 'some rule2',
        message: 'some message2',
        moduleId: 'some moduleId2',
        source: 'some source2',
      },
    ]);

    expect(result).toEqual(
      'file/path\n' +
        '  11:12  error  some message  some rule\n' +
        '  -:-  error  some message2  some rule2\n'
    );
  });

  it('formats empty errors', function () {
    let result = PrettyFormatter.errorsToMessages('file/path', []);

    expect(result).toEqual('');
  });

  it('does not format todos if options to include them are not passed', function () {
    let result = PrettyFormatter.errorsToMessages('file/path', [
      { rule: 'some rule', message: 'some message', line: 11, column: 12, severity: TODO_SEVERITY },
    ]);

    expect(result).toEqual('');
  });

  it('format todos if options to include them are passed', function () {
    let result = PrettyFormatter.errorsToMessages(
      'file/path',
      [
        {
          rule: 'some rule',
          message: 'some message',
          line: 11,
          column: 12,
          severity: TODO_SEVERITY,
        },
      ],
      { includeTodo: true }
    );

    expect(result).toEqual('file/path\n' + '  11:12  todo  some message  some rule\n');
  });
});
