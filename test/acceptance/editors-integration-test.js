'use strict';
const execa = require('execa');
const Project = require('../helpers/fake-project');
const setupEnvVar = require('../helpers/setup-env-var');
const fs = require('fs');
const path = require('path');

function run(project, args, options = {}) {
  options.reject = false;
  options.cwd = options.cwd || project.path('.');

  return execa(
    process.execPath,
    [require.resolve('../../bin/ember-template-lint.js'), ...args],
    options
  );
}

describe('editors integration', function () {
  setupEnvVar('GITHUB_ACTIONS', null);
  setupEnvVar('FORCE_COLOR', '0');
  setupEnvVar('LC_ALL', 'en_US');

  // Fake project
  let project;
  beforeEach(function () {
    project = Project.defaultSetup();
    project.chdir();
  });

  afterEach(async function () {
    await project.dispose();
  });

  describe('reading from stdin', function () {
    it('has exit code 1 and reports errors to stdout', async function () {
      project.setConfig({ rules: { 'no-debugger': true } });
      project.write({ 'template.hbs': '{{debugger}}' });

      let result = await run(project, ['--json', '--filename', 'template.hbs'], {
        shell: false,
        input: fs.readFileSync(path.resolve('template.hbs')),
      });

      let expectedOutputData = {};
      expectedOutputData['template.hbs'] = [
        {
          column: 0,
          line: 1,
          message: 'Unexpected {{debugger}} usage.',
          filePath: 'template.hbs',
          moduleId: 'template',
          rule: 'no-debugger',
          severity: 2,
          source: '{{debugger}}',
        },
      ];

      expect(result.exitCode).toEqual(1);
      expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
      expect(result.stderr).toBeFalsy();
    });
  });
});
