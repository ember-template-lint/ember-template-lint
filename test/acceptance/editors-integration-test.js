import { execa } from 'execa';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Project from '../helpers/fake-project.js';
import setupEnvVar from '../helpers/setup-env-var.js';

function run(project, args, options = {}) {
  options.reject = false;
  options.cwd = options.cwd || project.path('.');

  return execa(
    process.execPath,
    [fileURLToPath(new URL('../../bin/ember-template-lint.js', import.meta.url)), ...args],
    options
  );
}

describe('editors integration', function () {
  setupEnvVar('FORCE_COLOR', '0');
  setupEnvVar('LC_ALL', 'en_US');

  // Fake project
  let project;
  beforeEach(function () {
    project = Project.defaultSetup();
    project.chdir();
  });

  afterEach(function () {
    project.dispose();
  });

  describe('reading from stdin', function () {
    it('has exit code 1 and reports errors to stdout', async function () {
      project.setConfig({ rules: { 'no-debugger': true } });
      project.write({ 'template.hbs': '{{debugger}}' });

      let result = await run(project, ['--format', 'json', '--filename', 'template.hbs'], {
        shell: false,
        input: fs.readFileSync(path.resolve('template.hbs')),
      });

      let expectedOutputData = {};
      expectedOutputData['template.hbs'] = [
        {
          column: 0,
          endColumn: 12,
          endLine: 1,
          line: 1,
          message: 'Unexpected {{debugger}} usage.',
          filePath: 'template.hbs',
          rule: 'no-debugger',
          severity: 2,
          source: '{{debugger}}',
        },
      ];

      expect(result.exitCode).toEqual(1);
      expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
      expect(result.stderr).toBeFalsy();
    });

    it('has exit code 0 and writes fixes if --filename is provided', async function () {
      project.setConfig({ rules: { 'require-button-type': true } });
      project.write({ 'template.hbs': '<button></button>' });

      let result = await run(project, ['--format', 'json', '--filename', 'template.hbs', '--fix'], {
        shell: false,
        input: fs.readFileSync(path.resolve('template.hbs')),
      });

      expect(result.exitCode).toEqual(0);
      expect(result.stdout).toBeFalsy();
      expect(result.stderr).toBeFalsy();

      let template = fs.readFileSync(path.resolve('template.hbs'), { encoding: 'utf8' });
      expect(template).toBe('<button type="button"></button>');
    });
  });
});
