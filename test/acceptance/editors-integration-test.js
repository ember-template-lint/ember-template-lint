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

  describe('with embedded templates', function () {
    describe('hbs (tests and manual low-level usage)', function () {
      let missingButtonType =
        `import { hbs } from 'ember-cli-htmlbars';\n` +
        `import { setComponentTemplate } from '@ember/component';\n` +
        `import templateOnly from '@ember/component/template-only';\n` +
        '\n' +
        'export const SomeComponent = setComponentTemplate(hbs`\n' +
        '  <button></button>\n' +
        '  `,\n' +
        '  templateOnly()\n' +
        ');';

      let multipleComponents =
        `import { hbs } from 'ember-cli-htmlbars';\n` +
        `import { setComponentTemplate } from '@ember/component';\n` +
        `import templateOnly from '@ember/component/template-only';\n` +
        '\n' +
        'export const SomeComponent = setComponentTemplate(hbs`\n' +
        '  {{debugger}}\n' +
        '  `,\n' +
        '  templateOnly()\n' +
        ');\n' +
        '\n' +
        'export const AnotherComponent = setComponentTemplate(hbs`\n' +
        '  {{debugger}}\n' +
        '  `,\n' +
        '  templateOnly()\n' +
        ');\n';

      it('for multiple components in one module, it has exit code 1 and reports errors to stdout', async function () {
        project.setConfig({ rules: { 'no-debugger': true } });
        project.write({ 'some-module.js': multipleComponents });

        let result = await run(project, ['--format', 'json', '--filename', 'some-module.js'], {
          shell: false,
          input: fs.readFileSync(path.resolve('some-module.js')),
        });

        let expectedOutputData = {};
        /**
         * Indentation is adjusted for the whole file, and not
         * scoped to the template
         */
        expectedOutputData['some-module.js'] = [
          {
            column: 2,
            endColumn: 14,
            endLine: 6,
            line: 6,
            message: 'Unexpected {{debugger}} usage.',
            filePath: 'some-module.js',
            rule: 'no-debugger',
            severity: 2,
            source: '{{debugger}}',
          },
          {
            column: 2,
            endColumn: 14,
            endLine: 12,
            line: 12,
            message: 'Unexpected {{debugger}} usage.',
            filePath: 'some-module.js',
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
        project.write({ 'some-module.js': missingButtonType });

        let result = await run(
          project,
          ['--format', 'json', '--filename', 'some-module.js', '--fix'],
          {
            shell: false,
            input: fs.readFileSync(path.resolve('some-module.js')),
          }
        );

        expect(result.exitCode).toEqual(0);
        expect(result.stdout).toBeFalsy();
        expect(result.stderr).toBeFalsy();

        let template = fs.readFileSync(path.resolve('some-module.js'), { encoding: 'utf8' });
        expect(template).toBe(
          `import { hbs } from 'ember-cli-htmlbars';\n` +
            `import { setComponentTemplate } from '@ember/component';\n` +
            `import templateOnly from '@ember/component/template-only';\n` +
            '\n' +
            'export const SomeComponent = setComponentTemplate(hbs`\n' +
            '  <button type="button"></button>\n' +
            '  `,\n' +
            '  templateOnly()\n' +
            ');'
        );
      });
    });

    describe('<template>', function () {
      let missingButtonType =
        'export const SomeComponent = <template>\n' + '  <button></button>\n' + '</template>';

      let multipleComponents =
        'export const SomeComponent = <template>\n' +
        '  {{debugger}}\n' +
        '</template>\n' +
        '\n' +
        'export const AnotherComponent = <template>\n' +
        '  {{debugger}}\n' +
        '</template>\n' +
        '\n' +
        // default export
        '<template>\n' +
        '  <SomeComponent>\n' +
        '    {{debugger}}\n' +
        '  </SomeComponent>\n' +
        '</template>\n' +
        '\n';

      it('for multiple components in one module, it has exit code 1 and reports errors to stdout', async function () {
        project.setConfig({ rules: { 'no-debugger': true } });
        project.write({ 'some-module.js': multipleComponents });

        let result = await run(project, ['--format', 'json', '--filename', 'some-module.js'], {
          shell: false,
          input: fs.readFileSync(path.resolve('some-module.js')),
        });

        let expectedOutputData = {};
        /**
         * Indentation is adjusted for the whole file, and not
         * scoped to the template
         */
        expectedOutputData['some-module.js'] = [
          {
            column: 2,
            endColumn: 14,
            endLine: 2,
            line: 2,
            message: 'Unexpected {{debugger}} usage.',
            filePath: 'some-module.js',
            rule: 'no-debugger',
            severity: 2,
            source: '{{debugger}}',
          },
          {
            column: 2,
            endColumn: 14,
            endLine: 6,
            line: 6,
            message: 'Unexpected {{debugger}} usage.',
            filePath: 'some-module.js',
            rule: 'no-debugger',
            severity: 2,
            source: '{{debugger}}',
          },
          {
            column: 4,
            endColumn: 16,
            endLine: 11,
            line: 11,
            message: 'Unexpected {{debugger}} usage.',
            filePath: 'some-module.js',
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
        project.write({ 'some-module.js': missingButtonType });

        let result = await run(
          project,
          ['--format', 'json', '--filename', 'some-module.js', '--fix'],
          {
            shell: false,
            input: fs.readFileSync(path.resolve('some-module.js')),
          }
        );

        expect(result.exitCode).toEqual(0);
        expect(result.stdout).toBeFalsy();
        expect(result.stderr).toBeFalsy();

        let template = fs.readFileSync(path.resolve('some-module.js'), { encoding: 'utf8' });
        expect(template).toBe(
          'export const SomeComponent = <template>\n' +
            '  <button type="button"></button>\n' +
            '</template>'
        );
      });
    });
  });
});
