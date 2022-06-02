import fs from 'node:fs';
import path from 'node:path';

import { setupProject, teardownProject, runBin } from '../helpers/bin-tester.js';
import setupEnvVar from '../helpers/setup-env-var.js';

describe('editors integration', function () {
  setupEnvVar('FORCE_COLOR', '0');
  setupEnvVar('LC_ALL', 'en_US');

  // Fake project
  let project;
  beforeEach(async function () {
    project = await setupProject();
    await project.chdir();
  });

  afterEach(function () {
    teardownProject();
  });

  describe('reading from stdin', function () {
    it('has exit code 1 and reports errors to stdout', async function () {
      await project.setConfig({ rules: { 'no-debugger': true } });
      await project.write({ 'template.hbs': '{{debugger}}' });

      let result = await runBin('--format', 'json', '--filename', 'template.hbs', {
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
      await project.setConfig({ rules: { 'require-button-type': true } });
      await project.write({ 'template.hbs': '<button></button>' });

      let result = await runBin('--format', 'json', '--filename', 'template.hbs', '--fix', {
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
