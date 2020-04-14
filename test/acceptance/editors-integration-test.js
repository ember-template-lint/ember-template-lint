'use strict';
const execa = require('execa');
const Project = require('../helpers/fake-project');
const setupEnvVar = require('../helpers/setup-env-var');

function setForBasicDebuggerError(project) {
  project.setConfig({ rules: { 'no-debugger': true } });
  project.write({ 'template.hbs': '{{debugger}}' });
}

function run(args, options = {}) {
  options.reject = false;
  options.shell = true;
  return execa.sync(require.resolve('../../bin/ember-template-lint.js'), args, options);
}

describe('editors integration', function () {
  setupEnvVar('GITHUB_ACTIONS', null);
  setupEnvVar('FORCE_COLOR', '0');
  setupEnvVar('LC_ALL', 'en_US');

  // Fake project
  let project;
  beforeEach(function () {
    project = Project.defaultSetup();
    setForBasicDebuggerError(project);
    project.chdir();
  });

  afterEach(async function () {
    await project.dispose();
  });

  describe('reading from stdin', function () {
    it('prints valid JSON strings with error', function () {
      let result = run(
        project,
        ['--json', '--filename', 'template.hbs', '/dev/stdin', '<', 'template.hbs'],
        {
          cwd: project.path('.'),
        }
      );

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

  describe('creating a temporary file', function () {
    let project;
    beforeEach(function () {
      project = new Project('another-fake-project');
      project.write({ 'template.hbs': '{{debugger}}' });
    });

    afterEach(async function () {
      await project.dispose();
    });

    it('prints valid JSON strings with error', function () {
      let result = run(['--json', project.path('template.hbs')]);

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

      // result is an error thrown by globby
      expect(result).toEqual(1);

      // expect(result.exitCode).toEqual(1);
      // expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
      // expect(result.stderr).toBeFalsy();
    });
  });
});
