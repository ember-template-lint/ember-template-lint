import chalk from 'chalk';
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import Linter from '../../lib/linter.js';
import buildFakeConsole from '../helpers/console.js';
import failurePlugin from '../helpers/failure-plugin.js';
import Project from '../helpers/fake-project.js';

const fixturePath = path.join(dirname(fileURLToPath(import.meta.url)), '..', '/fixtures');

describe('public api', function () {
  let project;
  let mockConsole;

  beforeEach(function () {
    mockConsole = buildFakeConsole();

    project = new Project();
    project.chdir();
  });

  afterEach(function () {
    project.dispose();
  });

  describe('Linter.prototype.loadConfig', function () {
    it('throws an error if the config file has an error on parsing', async function () {
      await project.write({
        '.template-lintrc.js': "throw Error('error happening during config loading');\n",
      });

      const linter = new Linter({
        console: mockConsole,
      });

      await expect(async () => await linter.loadConfig()).rejects.toThrow(
        /error happening during config loading/
      );
    });

    it('throws the correct error if the config file has an error on parsing - ESM', async function () {
      await project.write({
        '.template-lintrc.mjs': "import foo from '../foo/bar';\n export {};\n",
      });

      const linter = new Linter({
        console: mockConsole,
        configPath: path.join(project.baseDir, '.template-lintrc.mjs'),
      });

      await expect(async () => await linter.loadConfig()).rejects.toThrow(
        /Cannot find module '..\/foo\/bar'/
      );
    });

    it('uses an empty set of rules if no .template-lintrc is present', async function () {
      let linter = new Linter({
        console: mockConsole,
      });
      const config = await linter.getConfig();

      expect(config.rules).toEqual({});
    });

    it('uses provided config', async function () {
      let expected = {
        rules: {
          foo: 'bar',
          baz: 'derp',
        },
      };
      await project.setConfig(expected);

      let linter = new Linter({
        console: mockConsole,
        config: expected,
      });
      const config = await linter.getConfig();

      expect(config.rules).toEqual({
        foo: { config: 'bar', severity: 2 },
        baz: { config: 'derp', severity: 2 },
      });
    });

    it('uses .template-lintrc.js in cwd if present', async function () {
      let expected = {
        rules: {
          foo: 'bar',
          baz: 'derp',
        },
      };

      await project.setConfig(expected);

      let linter = new Linter({
        console: mockConsole,
      });
      const config = await linter.getConfig();

      expect(config.rules).toEqual({
        foo: { config: 'bar', severity: 2 },
        baz: { config: 'derp', severity: 2 },
      });
    });

    it('uses .template-lintrc in provided configPath', async function () {
      let someOtherPathConfig = {
        rules: {
          foo: 'bar',
          baz: 'derp',
        },
      };

      await project.write({
        'some-other-path.js': `module.exports = ${JSON.stringify(someOtherPathConfig)};`,
      });

      let linter = new Linter({
        console: mockConsole,
        configPath: project.path('some-other-path.js'),
      });
      const config = await linter.getConfig();

      expect(config.rules).toEqual({
        foo: { config: 'bar', severity: 2 },
        baz: { config: 'derp', severity: 2 },
      });
    });

    it('uses .template-lintrc from upper folder structure if file does not exists in cwd', async function () {
      let expected = {
        rules: {
          foo: 'bar',
          baz: 'derp',
        },
      };

      await project.setConfig(expected);
      await project.write({
        app: {
          templates: {
            'application.hbs': '',
          },
        },
      });

      process.chdir(project.path('app/templates'));

      let linter = new Linter({
        console: mockConsole,
      });
      const config = await linter.getConfig();

      expect(config.rules).toEqual({
        foo: { config: 'bar', severity: 2 },
        baz: { config: 'derp', severity: 2 },
      });
    });

    it('uses first .template-lintrc from upper folder structure if file does not exists in cwd', async function () {
      let appPathConfig = {
        rules: {
          foo: 'bar',
          baz: 'derp',
        },
      };

      await project.write({
        '.template-lintrc.js': `module.exports = ${JSON.stringify({ rules: { boo: 'baz' } })};`,
        app: {
          '.template-lintrc.js': `module.exports = ${JSON.stringify(appPathConfig)};`,
          templates: {
            'application.hbs': '',
          },
        },
      });

      process.chdir(project.path('app/templates'));

      let linter = new Linter({
        console: mockConsole,
      });
      const config = await linter.getConfig();

      expect(config.rules).toEqual({
        foo: { config: 'bar', severity: 2 },
        baz: { config: 'derp', severity: 2 },
      });
    });

    it('breaks if the specified configPath does not exist', async function () {
      const linter = new Linter({
        console: mockConsole,
        configPath: 'does/not/exist',
      });
      await expect(async () => await linter.loadConfig()).rejects.toThrow(
        'The configuration file specified (does/not/exist) could not be found. Aborting.'
      );
    });

    it('with deprecated rule config', async function () {
      let expected = {
        rules: {
          'no-bare-strings': 'error',
        },
      };
      await project.setConfig(expected);

      let linter = new Linter({
        console: mockConsole,
        config: expected,
      });
      const config = await linter.getConfig();

      expect(config.rules).toEqual({ 'no-bare-strings': { config: true, severity: 2 } });
    });
  });

  describe('Linter.prototype.constructor', function () {
    it('should be able to instantiate without options', function () {
      expect(new Linter()).toBeTruthy();
    });

    it('accepts a fake console implementation', function () {
      let expected = 'foo bar widget';
      let actual;

      let linter = new Linter({
        console: {
          log(message) {
            actual = message;
          },
        },
      });

      linter.console.log(expected);
      expect(actual).toEqual(expected);
    });

    it('instantiating linter is idempotent', async function () {
      await project.setConfig({
        rules: {
          'require-button-type': 'error',
        },
        overrides: [{ files: '**/templates/*.hbs', rules: { 'require-button-type': 'off' } }],
      });

      let linterA = new Linter({
        console: mockConsole,
        configPath: project.path('.template-lintrc.js'),
      });

      let linterB = new Linter({
        console: mockConsole,
        configPath: project.path('.template-lintrc.js'),
      });
      const linterAConfig = await linterA.getConfig();
      const linterBConfig = await linterB.getConfig();

      expect(linterAConfig.rules['require-button-type']).toEqual({
        config: true,
        severity: 2,
      });

      expect(linterAConfig.overrides).toEqual([
        {
          files: '**/templates/*.hbs',
          rules: {
            'require-button-type': {
              config: false,
              severity: 0,
            },
          },
        },
      ]);

      expect(linterAConfig).toEqual(linterBConfig);
    });
  });

  describe('Linter.prototype.verifyAndFix', function () {
    let linter;

    beforeEach(async function () {
      await project.setConfig({
        rules: {
          quotes: ['error', 'double'],
          'require-button-type': 'error',
        },
      });

      await project.write({
        app: {
          templates: {
            'application.hbs': "<input class='mb4'>",
            'other.hbs': '<button>LOL, Click me!</button>',
          },
        },
      });

      linter = new Linter({
        console: mockConsole,
        configPath: project.path('.template-lintrc.js'),
      });
    });

    afterEach(function () {
      project.dispose();
    });

    it('returns whether the source has been fixed + an array of remaining issues with the provided template', async function () {
      await project.write({
        app: {
          templates: {
            'application.hbs': '<div>FORBIDDEN</div>',
          },
        },
      });
      linter = new Linter({
        console: mockConsole,
        config: {
          plugins: [failurePlugin],
          rules: {
            'fail-on-word': 'FORBIDDEN',
          },
        },
      });

      let templatePath = project.path('app/templates/application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });

      let result = await linter.verifyAndFix({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result).toMatchInlineSnapshot(
        { messages: [{ filePath: expect.any(String) }] },
        `
        {
          "isFixed": false,
          "messages": [
            {
              "column": 5,
              "endColumn": 14,
              "endLine": 1,
              "filePath": Any<String>,
              "line": 1,
              "message": "The string \\"FORBIDDEN\\" is forbidden in templates",
              "rule": "fail-on-word",
              "severity": 2,
              "source": "FORBIDDEN",
            },
          ],
          "output": "<div>FORBIDDEN</div>",
        }
      `
      );
    });

    it('ensures template parsing errors are only reported once (not once per-rule)', async function () {
      let templateContents = '{{#ach this.foo as |bar|}}{{/each}}';
      await project.write({
        app: {
          templates: {
            'other.hbs': templateContents,
          },
        },
      });

      let templatePath = project.path('app/templates/other.hbs');

      let result = await linter.verifyAndFix({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result.messages.length).toEqual(1);
      expect(result.messages[0].message).toEqual("ach doesn't match each - 1:3");
      expect(result.messages[0].fatal).toEqual(true);
    });

    it('includes updated output when fixable', async function () {
      let templateContents = '<button>LOL, Click me!</button>';

      await project.write({
        app: {
          templates: {
            'other.hbs': templateContents,
          },
        },
      });

      let templatePath = project.path('app/templates/other.hbs');

      let result = await linter.verifyAndFix({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result.messages).toEqual([]);
      expect(result.output).toEqual('<button type="button">LOL, Click me!</button>');
      expect(result.isFixed).toEqual(true);
    });

    it('updated output includes byte order mark if input source includes it', async function () {
      let templateContents = '\uFEFF<button>LOL, Click me!</button>';

      await project.write({
        app: {
          templates: {
            'other.hbs': templateContents,
          },
        },
      });

      let templatePath = project.path('app/templates/other.hbs');

      let result = await linter.verifyAndFix({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result.messages).toEqual([]);
      expect(result.output).toEqual('\uFEFF<button type="button">LOL, Click me!</button>');
      expect(result.isFixed).toEqual(true);
    });
  });

  describe('Linter.prototype.verify', function () {
    let linter;
    beforeEach(async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': 'error',
        },
        overrides: [
          {
            files: ['**/templates/**/*.hbs'],
            rules: {
              'no-implicit-this': 'error',
            },
          },
        ],
      });

      await project.write({
        app: {
          templates: {
            'application.hbs': '<h2>Here too!!</h2>\n<div>Bare strings are bad...</div>\n',
            components: {
              'foo.hbs': '{{fooData}}',
            },
          },
        },
      });

      linter = new Linter({
        console: mockConsole,
        configPath: project.path('.template-lintrc.js'),
      });
    });

    afterEach(function () {
      project.dispose();
    });

    it('parses gts templates correctly', async function () {
      project.setConfig({
        rules: {
          'no-debugger': 'error',
        },
      });

      project.write({
        app: {
          components: {
            'bar.gts':
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
              ');\n' +
              '\n' +
              '<template>\n' +
              '  {{debugger}}\n' +
              '</template>',
          },
        },
      });

      let componentPath = project.path('app/components/bar.gts');
      let templateContents = fs.readFileSync(componentPath, { encoding: 'utf8' });
      let expected = [
        {
          message: 'Unexpected {{debugger}} usage.',
          filePath: componentPath,
          line: 8,
          column: 2,
          endColumn: 14,
          endLine: 8,
          source: '{{debugger}}',
          rule: 'no-debugger',
          severity: 2,
        },
        {
          message: 'Unexpected {{debugger}} usage.',
          filePath: componentPath,
          line: 14,
          column: 2,
          endColumn: 14,
          endLine: 14,
          source: '{{debugger}}',
          rule: 'no-debugger',
          severity: 2,
        },
      ];

      let result = await linter.verify({
        source: templateContents,
        filePath: componentPath,
        moduleId: componentPath.slice(0, -4),
      });

      expect(result).toEqual(expected);
    });

    it('returns an array of issues with the provided template', async function () {
      let templatePath = project.path('app/templates/application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [
        {
          message: 'Non-translated string used',
          filePath: templatePath,
          line: 1,
          column: 4,
          endColumn: 14,
          endLine: 1,
          source: 'Here too!!',
          rule: 'no-bare-strings',
          severity: 2,
        },
        {
          message: 'Non-translated string used',
          filePath: templatePath,
          line: 2,
          column: 5,
          endColumn: 28,
          endLine: 2,
          source: 'Bare strings are bad...',
          rule: 'no-bare-strings',
          severity: 2,
        },
      ];

      let result = await linter.verify({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result).toEqual(expected);
    });

    it('returns a "fatal" result object if an error occurs during parsing', async function () {
      let template = '<div>';
      let result = await linter.verify({
        source: template,
      });

      expect(result[0].fatal).toBe(true);
    });

    it('triggers warnings when severity is set to warn', async function () {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'block-indentation': 'warn' },
        },
      });

      let template = ['<div>', '<p></p>', '</div>'].join('\n');

      let result = await linter.verify({
        source: template,
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
      });

      let expected = {
        message:
          'Incorrect indentation for `<p>` beginning at L2:C0. Expected `<p>` to be at an indentation of 2 but was found at 0.',
        filePath: 'some/path/here.hbs',
        isFixable: true,
        line: 2,
        column: 0,
        endColumn: 6,
        endLine: 3,
        source: '<div>\n<p></p>\n</div>',
        rule: 'block-indentation',
        severity: 1,
      };

      expect(result).toEqual([expected]);
    });

    it('allows custom severity level for rules along with custom config', async function () {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'no-implicit-this': ['warn', { allow: ['fooData'] }] },
        },
      });

      let template = ['<div>', '{{fooData}}{{barData}}', '</div>'].join('\n');

      let result = await linter.verify({
        source: template,
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
      });

      let expected = {
        message:
          "Ambiguous path 'barData' is not allowed. Use '@barData' if it is a named argument or 'this.barData' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['barData'] }.",
        filePath: 'some/path/here.hbs',
        line: 2,
        column: 13,
        endColumn: 20,
        endLine: 2,
        source: 'barData',
        rule: 'no-implicit-this',
        severity: 1,
      };

      expect(result).toEqual([expected]);
    });

    it('Works with overrides - base case', async function () {
      let templatePath = project.path('app/templates/components/foo.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });

      let result = await linter.verify({
        source: templateContents,
        moduleId: templatePath.slice(0, -4),
        filePath: templatePath,
      });

      let expected = [
        {
          column: 2,
          filePath: templatePath,
          line: 1,
          endColumn: 9,
          endLine: 1,
          message:
            "Ambiguous path 'fooData' is not allowed. Use '@fooData' if it is a named argument or 'this.fooData' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['fooData'] }.",
          rule: 'no-implicit-this',
          severity: 2,
          source: 'fooData',
        },
      ];

      expect(result).toEqual(expected);
    });

    it('Works with overrides with custom warning severity', async function () {
      let templatePath = project.path('app/templates/components/foo.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });

      linter = new Linter({
        console: mockConsole,
        config: {
          overrides: [
            {
              files: ['**/components/**'],
              rules: {
                'no-implicit-this': 'error',
              },
            },
          ],
        },
      });

      let result = await linter.verify({
        source: templateContents,
        moduleId: templatePath.slice(0, -4),
        filePath: templatePath,
      });

      let expected = [
        {
          column: 2,
          filePath: templatePath,
          line: 1,
          endColumn: 9,
          endLine: 1,
          message:
            "Ambiguous path 'fooData' is not allowed. Use '@fooData' if it is a named argument or 'this.fooData' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['fooData'] }.",
          rule: 'no-implicit-this',
          severity: 2,
          source: 'fooData',
        },
      ];

      expect(result).toEqual(expected);
    });

    it('Works for older syntax without custom severity', async function () {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: {
            'no-restricted-invocations': ['foo', 'bar'],
            'no-implicit-this': { allow: ['baz'] },
            'no-bare-strings': true,
          },
        },
      });

      let template = '<div>bare string {{foo}} {{baz}}</div>';
      let result = await linter.verify({
        source: template,
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
      });

      let expected = [
        {
          rule: 'no-restricted-invocations',
          severity: 2,
          filePath: 'some/path/here.hbs',
          message: "Cannot use disallowed helper, component or modifier '{{foo}}'",
          line: 1,
          column: 17,
          endColumn: 24,
          endLine: 1,
          source: '{{foo}}',
        },
        {
          rule: 'no-implicit-this',
          severity: 2,
          filePath: 'some/path/here.hbs',
          message:
            "Ambiguous path 'foo' is not allowed. Use '@foo' if it is a named argument or 'this.foo' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['foo'] }.",
          line: 1,
          column: 19,
          endColumn: 22,
          endLine: 1,
          source: 'foo',
        },
        {
          rule: 'no-bare-strings',
          severity: 2,
          filePath: 'some/path/here.hbs',
          message: 'Non-translated string used',
          line: 1,
          column: 5,
          endColumn: 17,
          endLine: 1,
          source: 'bare string ',
        },
      ];

      expect(result).toEqual(expected);
    });

    it('Works with overrides with custom warning severity object', async function () {
      let templatePath = project.path('app/templates/components/foo.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });

      linter = new Linter({
        console: mockConsole,
        config: {
          overrides: [
            {
              files: ['**/components/**'],
              rules: {
                'no-implicit-this': 'error',
              },
            },
          ],
        },
      });

      let result = await linter.verify({
        source: templateContents,
        moduleId: templatePath.slice(0, -4),
        filePath: templatePath,
      });

      let expected = [
        {
          column: 2,
          line: 1,
          endColumn: 9,
          endLine: 1,
          filePath: templatePath,
          message:
            "Ambiguous path 'fooData' is not allowed. Use '@fooData' if it is a named argument or 'this.fooData' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['fooData'] }.",
          rule: 'no-implicit-this',
          severity: 2,
          source: 'fooData',
        },
      ];

      expect(result).toEqual(expected);
    });

    it('Should not trigger the lint error over custom overrides', async function () {
      let templatePath = project.path('app/templates/components/foo.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });

      linter = new Linter({
        console: mockConsole,
        config: {
          rules: {
            'no-implicit-this': 'error',
          },
          overrides: [
            {
              files: ['**/components/**'],
              rules: {
                'no-implicit-this': 'off',
              },
            },
          ],
        },
      });

      let result = await linter.verify({
        source: templateContents,
        moduleId: templatePath.slice(0, -4),
        filePath: templatePath,
      });

      expect(result).toEqual([]);
    });

    it('does not include errors when marked as ignored', async function () {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'no-bare-strings': 'error', 'block-indentation': 'error' },
          ignore: ['some/path/here'],
        },
      });

      let template = '<div>bare string</div>';
      let result = await linter.verify({
        source: template,
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
      });

      expect(result).toEqual([]);
    });

    it('does not include errors when marked as ignored using glob', async function () {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'no-bare-strings': 'error', 'block-indentation': 'error' },
          ignore: ['some/path/*'],
        },
      });

      let template = '<div>bare string</div>';
      let result = await linter.verify({
        source: template,
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
      });

      expect(result).toEqual([]);
    });

    it('shows a "rule not found" error if a rule definition is not found"', async function () {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'missing-rule': 'error' },
        },
      });

      let template = '';
      let result = await linter.verify({
        source: template,
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
      });

      expect(result).toEqual([
        {
          message: "Definition for rule 'missing-rule' was not found",
          filePath: 'some/path/here.hbs',
          severity: 2,
        },
      ]);
    });

    it('looks for embedded templates if no filePath was given', async function () {
      linter = new Linter({
        config: {
          rules: { 'no-debugger': true },
        },
      });

      let template =
        'export const SomeComponent = <template>\n' + '  {{debugger}}\n' + '</template>';
      let result = await linter.verify({
        source: template,
      });

      expect(result).toEqual([
        {
          column: 2,
          endColumn: 14,
          endLine: 2,
          line: 2,
          message: 'Unexpected {{debugger}} usage.',
          rule: 'no-debugger',
          severity: 2,
          source: '{{debugger}}',
        },
      ]);
    });
  });

  describe('Linter using plugins', function () {
    let basePath = path.join(fixturePath, 'with-plugins');
    let linter;

    beforeEach(function () {
      linter = new Linter({
        console: mockConsole,
        configPath: path.join(basePath, '.template-lintrc.cjs'),
      });
    });

    it('returns plugin rule issues', async function () {
      let templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [
        {
          message: 'The inline form of component is not allowed',
          filePath: templatePath,
          line: 1,
          column: 4,
          endColumn: 29,
          endLine: 1,
          source: '{{component value="Hej"}}',
          rule: 'inline-component',
          severity: 2,
        },
      ];

      let result = await linter.verify({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result).toEqual(expected);
    });

    it('allow you to disable plugin rules inline', async function () {
      let templatePath = path.join(basePath, 'app', 'templates', 'disabled-rule.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [];

      let result = await linter.verify({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result).toEqual(expected);
    });
  });

  describe('Linter using plugin with extends', function () {
    let basePath = path.join(fixturePath, 'with-plugin-with-configurations');
    let linter;

    beforeEach(function () {
      linter = new Linter({
        console: mockConsole,
        configPath: path.join(basePath, '.template-lintrc.cjs'),
      });
    });

    it('returns plugin rule issues', async function () {
      let templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [
        {
          message: 'The inline form of component is not allowed',
          filePath: templatePath,
          line: 1,
          column: 4,
          endColumn: 29,
          endLine: 1,
          source: '{{component value="Hej"}}',
          rule: 'inline-component',
          severity: 2,
        },
      ];

      let result = await linter.verify({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result).toEqual(expected);
    });
  });
  describe('Linter using plugin with multiple extends', function () {
    let basePath = path.join(fixturePath, 'with-multiple-extends');
    let linter;

    beforeEach(function () {
      linter = new Linter({
        console: mockConsole,
        configPath: path.join(basePath, '.template-lintrc.cjs'),
      });
    });

    it('returns plugin rule issues', async function () {
      let templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [
        {
          message: 'The inline form of component is not allowed',
          filePath: templatePath,
          line: 1,
          column: 4,
          endColumn: 29,
          endLine: 1,
          source: '{{component value="Hej"}}',
          rule: 'inline-component',
          severity: 2,
        },
        {
          message: 'Usage of triple curly brackets is unsafe',
          filePath: templatePath,
          line: 2,
          column: 2,
          endColumn: 18,
          endLine: 2,
          source: '{{{this.myVar}}}',
          rule: 'no-triple-curlies',
          severity: 2,
        },
      ];

      let result = await linter.verify({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result).toEqual(expected);
    });
  });

  describe('Linter using plugins (inline plugins)', function () {
    let basePath = path.join(fixturePath, 'with-inline-plugins');
    let linter;

    beforeEach(function () {
      linter = new Linter({
        console: mockConsole,
        configPath: path.join(basePath, '.template-lintrc.js'),
      });
    });

    it('returns plugin rule issues', async function () {
      let templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [
        {
          message: 'The inline form of component is not allowed',
          filePath: templatePath,
          line: 1,
          column: 4,
          endColumn: 29,
          endLine: 1,
          source: '{{component value="Hej"}}',
          rule: 'inline-component',
          severity: 2,
        },
      ];

      let result = await linter.verify({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result).toEqual(expected);
    });
  });

  describe('Linter using plugins (mjs file extension)', function () {
    let basePath = path.join(fixturePath, 'with-mjs-plugin');
    let linter;

    beforeEach(function () {
      linter = new Linter({
        console: mockConsole,
        configPath: path.join(basePath, '.template-lintrc.mjs'),
      });
    });

    it('returns plugin rule issues', async function () {
      let templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [
        {
          message: 'The inline form of component is not allowed',
          filePath: templatePath,
          line: 1,
          column: 4,
          endColumn: 29,
          endLine: 1,
          source: '{{component value="Hej"}}',
          rule: 'inline-component',
          severity: 2,
        },
      ];

      let result = await linter.verify({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result).toEqual(expected);
    });
  });

  describe('Linter using plugins loading a configuration that extends from another plugins configuration', function () {
    let basePath = path.join(fixturePath, 'with-plugins-overwriting');
    let linter;

    beforeEach(function () {
      linter = new Linter({
        console: mockConsole,
        configPath: path.join(basePath, '.template-lintrc.cjs'),
      });
    });

    it('returns plugin rule issues', async function () {
      let templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [];

      let result = await linter.verify({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result).toEqual(expected);
    });
  });

  describe('Linter.errorsToMessages', function () {
    beforeEach(() => {
      chalk.level = 0;
    });

    it('formats error with rule, message and moduleId', function () {
      let result = Linter.errorsToMessages('file/path', [
        { rule: 'some rule', message: 'some message' },
      ]);

      expect(result).toEqual('file/path\n' + '  -:-  error  some message  some rule\n');
    });

    it('formats error with rule, message, line and column numbers even when they are "falsey"', function () {
      let result = Linter.errorsToMessages('file/path', [
        { rule: 'some rule', message: 'some message', line: 1, column: 0 },
      ]);

      expect(result).toEqual('file/path\n' + '  1:0  error  some message  some rule\n');
    });

    it('formats error with rule, message, line and column numbers', function () {
      let result = Linter.errorsToMessages('file/path', [
        { rule: 'some rule', message: 'some message', line: 11, column: 12 },
      ]);

      expect(result).toEqual('file/path\n' + '  11:12  error  some message  some rule\n');
    });

    it('formats error with rule, message, source', function () {
      let result = Linter.errorsToMessages(
        'file/path',
        [{ rule: 'some rule', message: 'some message', source: 'some source' }],
        { verbose: true }
      );

      expect(result).toEqual(
        'file/path\n' + '  -:-  error  some message  some rule\n' + 'some source\n'
      );
    });

    it('formats more than one error', function () {
      let result = Linter.errorsToMessages('file/path', [
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
      let result = Linter.errorsToMessages('file/path', []);

      expect(result).toEqual('');
    });
  });

  describe('Linter able to lint and fix .html files', function () {
    let linter;

    beforeEach(async function () {
      await project.setConfig({
        rules: {
          quotes: ['error', 'double'],
          'require-button-type': 'error',
        },
      });

      await project.write({
        app: {
          templates: {
            'application.html': "<input class='mb4'>",
            'other.html': '<button>LOL, Click me!</button>',
          },
        },
      });

      linter = new Linter({
        console: mockConsole,
        configPath: project.path('.template-lintrc.js'),
      });
    });

    afterEach(function () {
      project.dispose();
    });

    it('[.html] does not identify errors (except for no-forbidden-elements) for ember-cli default app/index.html (3.20)', async function () {
      // reset config to default value
      await project.setConfig();

      await project.write({
        app: {
          'index.html': `
{{!template-lint-disable no-forbidden-elements}}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>MyApp</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{content-for "head"}}

    <link integrity="" rel="stylesheet" href="{{rootURL}}assets/vendor.css">
    <link integrity="" rel="stylesheet" href="{{rootURL}}assets/my-app.css">

    {{content-for "head-footer"}}
  </head>
  <body>
    {{content-for "body"}}

    <script src="{{rootURL}}assets/vendor.js"></script>
    <script src="{{rootURL}}assets/my-app.js"></script>

    {{content-for "body-footer"}}
  </body>
</html>`,
        },
      });

      let templatePath = project.path('app/index.html');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let results = await linter.verify({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(results).toEqual([]);
    });

    it('[.html] does not identify errors (except for no-forbidden-elements) for ember-cli default tests/index.html (3.20)', async function () {
      // reset config to default value
      await project.setConfig();

      await project.write({
        tests: {
          'index.html': `
{{!template-lint-disable no-forbidden-elements}}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>MyApp Tests</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{content-for "head"}}
    {{content-for "test-head"}}

    <link rel="stylesheet" href="{{rootURL}}assets/vendor.css">
    <link rel="stylesheet" href="{{rootURL}}assets/my-app.css">
    <link rel="stylesheet" href="{{rootURL}}assets/test-support.css">

    {{content-for "head-footer"}}
    {{content-for "test-head-footer"}}
  </head>
  <body>
    {{content-for "body"}}
    {{content-for "test-body"}}

    <script src="/testem.js" integrity=""></script>
    <script src="{{rootURL}}assets/vendor.js"></script>
    <script src="{{rootURL}}assets/test-support.js"></script>
    <script src="{{rootURL}}assets/my-app.js"></script>
    <script src="{{rootURL}}assets/tests.js"></script>

    {{content-for "body-footer"}}
    {{content-for "test-body-footer"}}
  </body>
</html>`,
        },
      });

      let templatePath = project.path('tests/index.html');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let results = await linter.verify({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(results).toEqual([]);
    });

    it('[.html] returns whether the source has been fixed + an array of remaining issues with the provided template', async function () {
      await project.write({
        app: {
          templates: {
            'application.html': '<div>FORBIDDEN</div>',
          },
        },
      });
      linter = new Linter({
        console: mockConsole,
        config: {
          plugins: [failurePlugin],
          rules: {
            'fail-on-word': 'FORBIDDEN',
          },
        },
      });

      let templatePath = project.path('app/templates/application.html');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });

      let result = await linter.verifyAndFix({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result).toMatchInlineSnapshot(
        { messages: [{ filePath: expect.any(String) }] },
        `
        {
          "isFixed": false,
          "messages": [
            {
              "column": 5,
              "endColumn": 14,
              "endLine": 1,
              "filePath": Any<String>,
              "line": 1,
              "message": "The string \\"FORBIDDEN\\" is forbidden in templates",
              "rule": "fail-on-word",
              "severity": 2,
              "source": "FORBIDDEN",
            },
          ],
          "output": "<div>FORBIDDEN</div>",
        }
      `
      );
    });

    it('[.html] ensures template parsing errors are only reported once (not once per-rule)', async function () {
      let templateContents = '{{#ach this.foo as |bar|}}{{/each}}';
      await project.write({
        app: {
          templates: {
            'other.html': templateContents,
          },
        },
      });

      let templatePath = project.path('app/templates/other.html');

      let result = await linter.verifyAndFix({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result.messages.length).toEqual(1);
      expect(result.messages[0].message).toEqual("ach doesn't match each - 1:3");
      expect(result.messages[0].fatal).toEqual(true);
    });

    it('[.html] includes updated output when fixable', async function () {
      let templateContents = '<button>LOL, Click me!</button>';

      await project.write({
        app: {
          templates: {
            'other.html': templateContents,
          },
        },
      });

      let templatePath = project.path('app/templates/other.html');

      let result = await linter.verifyAndFix({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result.messages).toEqual([]);
      expect(result.output).toEqual('<button type="button">LOL, Click me!</button>');
      expect(result.isFixed).toEqual(true);
    });

    it('[.html] updated output includes byte order mark if input source includes it', async function () {
      let templateContents = '\uFEFF<button>LOL, Click me!</button>';

      await project.write({
        app: {
          templates: {
            'other.html': templateContents,
          },
        },
      });

      let templatePath = project.path('app/templates/other.html');

      let result = await linter.verifyAndFix({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result.messages).toEqual([]);
      expect(result.output).toEqual('\uFEFF<button type="button">LOL, Click me!</button>');
      expect(result.isFixed).toEqual(true);
    });
  });
});
