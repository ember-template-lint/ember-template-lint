import chalk from 'chalk';

import PrettyFormatter from '../../../lib/formatters/pretty.js';
import { TODO_SEVERITY } from '../../../lib/helpers/severity.js';
import Project from '../../helpers/fake-project.js';
import run from '../../helpers/run.js';
import setupEnvVar from '../../helpers/setup-env-var.js';

const ROOT = process.cwd();

describe('pretty formatter', () => {
  setupEnvVar('FORCE_COLOR', '0');

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

    let result = await run(['.']);

    expect(result.exitCode).toEqual(1);
    expect(result.stdout.split('\n')).toEqual([
      'app/templates/application.hbs',
      '  1:4  error  Non-translated string used  no-bare-strings',
      '  1:25  error  Non-translated string used  no-bare-strings',
      '',
      '✖ 2 problems (2 errors, 0 warnings)',
    ]);
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

    let result = await run(['.']);

    expect(result.exitCode).toEqual(1);
    expect(result.stdout.split('\n')).toEqual([
      'app/templates/application.hbs',
      '  1:4  error  Non-translated string used  no-bare-strings',
      '  1:24  error  Non-translated string used  no-bare-strings',
      '  1:53  warning  HTML comment detected  no-html-comments',
      '',
      '✖ 3 problems (2 errors, 1 warnings)',
    ]);
    expect(result.stderr).toBeFalsy();
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
