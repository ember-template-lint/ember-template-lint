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

      let typescript =
        `import { hbs } from 'ember-cli-htmlbars';\n` +
        `import { setComponentTemplate } from '@ember/component';\n` +
        `import Component from '@glimmer/component';\n` +
        '\n' +
        'interface Args {}\n' +
        '\n' +
        'export const SomeComponent = setComponentTemplate(hbs`\n' +
        '  {{debugger}}\n' +
        '  `,\n' +
        '  class Some extends Component<Args> {}\n' +
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

      const templateThatShouldNotBeParsed =
        'export default class Foo extends Service {\n' +
        '  indentedThing = stripIndent`\n' +
        '  Hahaha, this is just a plain string. Definitely not a template.\n' +
        '`\n' +
        '}';

      it('does not parse regular strings as a template', async function () {
        project.setConfig({ rules: { 'no-bare-strings': true } });
        project.write({ 'some-module.gjs': templateThatShouldNotBeParsed });

        let result = await runBin('--format', 'json', '--filename', 'some-module.gjs', {
          shell: false,
          input: fs.readFileSync(path.resolve('some-module.gjs')),
        });

        expect(result.exitCode).toEqual(0);
        expect(result.stdout).toBeFalsy();
        expect(result.stderr).toBeFalsy();
      });

      it('for multiple components in one module, it has exit code 1 and reports errors to stdout', async function () {
        project.setConfig({ rules: { 'no-debugger': true } });
        project.write({ 'some-module.js': multipleComponents });

        let result = await runBin('--format', 'json', '--filename', 'some-module.js', {
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

      it('for typescript files, it has exit code 1 and reports errors to stdout', async function () {
        project.setConfig({ rules: { 'no-debugger': true } });
        project.write({ 'some-module.ts': typescript });

        let result = await runBin('--format', 'json', '--filename', 'some-module.ts', {
          shell: false,
          input: fs.readFileSync(path.resolve('some-module.ts')),
        });

        let expectedOutputData = {};
        /**
         * Indentation is adjusted for the whole file, and not
         * scoped to the template
         */
        expectedOutputData['some-module.ts'] = [
          {
            column: 2,
            endColumn: 14,
            endLine: 8,
            line: 8,
            message: 'Unexpected {{debugger}} usage.',
            filePath: 'some-module.ts',
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

        let result = await runBin('--format', 'json', '--filename', 'some-module.js', '--fix', {
          shell: false,
          input: fs.readFileSync(path.resolve('some-module.js')),
        });

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

      it('for typescript files, it has exit code 1 and reports errors to stdout', async function () {
        let code =
          `import { hbs } from 'ember-cli-htmlbars';\n` +
          `import { setComponentTemplate } from '@ember/component';\n` +
          `import Component from '@glimmer/component';\n` +
          '\n' +
          'interface Args {}\n' +
          '\n' +
          'export const SomeComponent = setComponentTemplate(hbs`\n' +
          '  {{debugger}}\n' +
          '  `,\n' +
          '  class Some extends Component<Args> {});';
        project.setConfig({ rules: { 'no-debugger': true } });
        project.write({ 'some-module.ts': code });

        let result = await runBin('--format', 'json', '--filename', 'some-module.ts', {
          shell: false,
          input: fs.readFileSync(path.resolve('some-module.ts')),
        });

        /**
         * Indentation is adjusted for the whole file, and not
         * scoped to the template
         */
        expect(JSON.parse(result.stdout)).toMatchInlineSnapshot(`
          {
            "some-module.ts": [
              {
                "column": 2,
                "endColumn": 14,
                "endLine": 8,
                "filePath": "some-module.ts",
                "line": 8,
                "message": "Unexpected {{debugger}} usage.",
                "rule": "no-debugger",
                "severity": 2,
                "source": "{{debugger}}",
              },
            ],
          }
        `);

        expect(result.exitCode).toEqual(1);
        expect(result.stderr).toBeFalsy();
      });
    });

    describe('<template>', function () {
      let templateDefinitionOnOneLine =
        'export const SomeComponent = <template>{{debugger}}</template>;';

      let missingButtonType =
        'export const SomeComponent = <template>\n' + '  <button></button>\n' + '</template>;';

      let typescriptWithInlineTemplate =
        `import { hbs } from 'ember-cli-htmlbars';\n` +
        `import { setComponentTemplate } from '@ember/component';\n` +
        `import Component from '@glimmer/component';\n` +
        '\n' +
        'interface Args {}\n' +
        '\n' +
        'export class SomeComponent extends Component<Args> {\n' +
        '  <template>{{debugger}}\n' +
        '  </template>\n' +
        '}\n';

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
        project.write({ 'some-module.gjs': multipleComponents });

        let result = await runBin('--format', 'json', '--filename', 'some-module.gjs', {
          shell: false,
          input: fs.readFileSync(path.resolve('some-module.gjs')),
        });

        let expectedOutputData = {};
        /**
         * Indentation is adjusted for the whole file, and not
         * scoped to the template
         */
        expectedOutputData['some-module.gjs'] = [
          {
            column: 2,
            endColumn: 14,
            endLine: 2,
            line: 2,
            message: 'Unexpected {{debugger}} usage.',
            filePath: 'some-module.gjs',
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
            filePath: 'some-module.gjs',
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
            filePath: 'some-module.gjs',
            rule: 'no-debugger',
            severity: 2,
            source: '{{debugger}}',
          },
        ];

        expect(result.exitCode).toEqual(1);
        expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
        expect(result.stderr).toBeFalsy();
      });

      it('for a template which does not start with a new line, the error location is correct', async function () {
        project.setConfig({ rules: { 'no-debugger': true } });
        project.write({ 'some-module.gts': typescriptWithInlineTemplate });

        let result = await runBin('--format', 'json', '--filename', 'some-module.gts', {
          shell: false,
          input: fs.readFileSync(path.resolve('some-module.gts')),
        });

        let expectedOutputData = {};
        /**
         * Indentation is adjusted for the whole file, and not
         * scoped to the template
         */
        expectedOutputData['some-module.gts'] = [
          {
            column: 12,
            endColumn: 24,
            endLine: 8,
            line: 8,
            message: 'Unexpected {{debugger}} usage.',
            filePath: 'some-module.gts',
            rule: 'no-debugger',
            severity: 2,
            source: '{{debugger}}',
          },
        ];

        expect(result.exitCode).toEqual(1);
        expect(JSON.parse(result.stdout)).toEqual(expectedOutputData);
        expect(result.stderr).toBeFalsy();
      });

      it('for a template defined on one line, the error location is correct', async function () {
        project.setConfig({ rules: { 'no-debugger': true } });
        project.write({ 'some-module.gts': templateDefinitionOnOneLine });

        let result = await runBin('--format', 'json', '--filename', 'some-module.gts', {
          shell: false,
          input: fs.readFileSync(path.resolve('some-module.gts')),
        });

        let expectedOutputData = {};
        /**
         * Indentation is adjusted for the whole file, and not
         * scoped to the template
         */
        expectedOutputData['some-module.gts'] = [
          {
            column: 39,
            endColumn: 51,
            endLine: 1,
            line: 1,
            message: 'Unexpected {{debugger}} usage.',
            filePath: 'some-module.gts',
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
        project.write({ 'some-module.gjs': missingButtonType });

        let result = await runBin('--format', 'json', '--filename', 'some-module.gjs', '--fix', {
          shell: false,
          input: fs.readFileSync(path.resolve('some-module.gjs')),
        });

        expect(result.exitCode).toEqual(0);
        expect(result.stdout).toBeFalsy();
        expect(result.stderr).toBeFalsy();

        let template = fs.readFileSync(path.resolve('some-module.gjs'), { encoding: 'utf8' });
        expect(template).toBe(
          'export const SomeComponent = <template>\n' +
            '  <button type="button"></button>\n' +
            '</template>;'
        );
      });
    });
  });
});
