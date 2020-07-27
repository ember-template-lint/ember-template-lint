'use strict';

const path = require('path');
const fs = require('fs');
const Linter = require('../../lib');
const buildFakeConsole = require('./../helpers/console');
const Project = require('../helpers/fake-project');
const chalk = require('chalk');

const fixturePath = path.join(__dirname, '..', '/fixtures');

describe('public api', function () {
  let project;
  let mockConsole;

  beforeEach(function () {
    mockConsole = buildFakeConsole();

    project = new Project();
    project.chdir();
  });

  afterEach(async function () {
    await project.dispose();
  });

  describe('Linter.prototype.loadConfig', function () {
    it('throws an error if the config file has an error on parsing', function () {
      project.write({
        '.template-lintrc.js': "throw Error('error happening during config loading');\n",
      });

      expect(() => {
        new Linter({
          console: mockConsole,
        });
      }).toThrow(/error happening during config loading/);
    });

    it('uses an empty set of rules if no .template-lintrc is present', function () {
      let linter = new Linter({
        console: mockConsole,
      });

      expect(linter.config.rules).toEqual({});
    });

    it('uses provided config', function () {
      let expected = {
        rules: {
          foo: 'bar',
          baz: 'derp',
        },
      };
      project.setConfig(expected);

      let linter = new Linter({
        console: mockConsole,
        config: expected,
      });

      expect(linter.config.rules).toEqual({
        foo: { config: 'bar', severity: 2 },
        baz: { config: 'derp', severity: 2 },
      });
    });

    it('uses .template-lintrc.js in cwd if present', function () {
      let expected = {
        rules: {
          foo: 'bar',
          baz: 'derp',
        },
      };

      project.setConfig(expected);

      let linter = new Linter({
        console: mockConsole,
      });

      expect(linter.config.rules).toEqual({
        foo: { config: 'bar', severity: 2 },
        baz: { config: 'derp', severity: 2 },
      });
    });

    it('uses .template-lintrc in provided configPath', function () {
      let someOtherPathConfig = {
        rules: {
          foo: 'bar',
          baz: 'derp',
        },
      };
      project.files['some-other-path.js'] = `module.exports = ${JSON.stringify(
        someOtherPathConfig
      )};`;
      project.writeSync();

      let linter = new Linter({
        console: mockConsole,
        configPath: project.path('some-other-path.js'),
      });

      expect(linter.config.rules).toEqual({
        foo: { config: 'bar', severity: 2 },
        baz: { config: 'derp', severity: 2 },
      });
    });

    it('uses .template-lintrc from upper folder structure if file does not exists in cwd', function () {
      let expected = {
        rules: {
          foo: 'bar',
          baz: 'derp',
        },
      };

      project.setConfig(expected);
      project.write({
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

      expect(linter.config.rules).toEqual({
        foo: { config: 'bar', severity: 2 },
        baz: { config: 'derp', severity: 2 },
      });
    });

    it('uses first .template-lintrc from upper folder structure if file does not exists in cwd', function () {
      let appPathConfig = {
        rules: {
          foo: 'bar',
          baz: 'derp',
        },
      };

      project.write({
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

      expect(linter.config.rules).toEqual({
        foo: { config: 'bar', severity: 2 },
        baz: { config: 'derp', severity: 2 },
      });
    });

    it('breaks if the specified configPath does not exist', function () {
      expect(() => {
        new Linter({
          console: mockConsole,
          configPath: 'does/not/exist',
        });
      }).toThrow('The configuration file specified (does/not/exist) could not be found. Aborting.');
    });

    it('with deprecated rule config', function () {
      let expected = {
        rules: {
          'no-bare-strings': 'error',
        },
      };
      project.setConfig(expected);

      let linter = new Linter({
        console: mockConsole,
        config: expected,
      });

      expect(linter.config.rules).toEqual({ 'no-bare-strings': { config: true, severity: 2 } });
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
  });

  describe('Linter.prototype.verifyAndFix', function () {
    let linter;

    beforeEach(function () {
      project.setConfig({
        rules: {
          quotes: ['error', 'double'],
          'require-button-type': 'error',
        },
      });

      project.write({
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

    afterEach(async function () {
      await project.dispose();
    });

    it('returns whether the source has been fixed + an array of remaining issues with the provided template', function () {
      let templatePath = project.path('app/templates/application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [
        {
          column: 7,
          line: 1,
          message: 'you must use double quotes in templates',
          filePath: templatePath,
          moduleId: templatePath.slice(0, -4),
          rule: 'quotes',
          severity: 2,
          source: "class='mb4'",
        },
      ];

      let result = linter.verifyAndFix({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result.messages).toEqual(expected);
      expect(result.output).toEqual(templateContents);
      expect(result.isFixed).toEqual(false);
    });

    it('ensures template parsing errors are only reported once (not once per-rule)', function () {
      let templateContents = '{{#ach this.foo as |bar|}}{{/each}}';
      project.write({
        app: {
          templates: {
            'other.hbs': templateContents,
          },
        },
      });

      let templatePath = project.path('app/templates/other.hbs');

      let result = linter.verifyAndFix({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result.messages.length).toEqual(1);
      expect(result.messages[0].message).toEqual("ach doesn't match each - 1:3");
      expect(result.messages[0].fatal).toEqual(true);
    });

    it('includes updated output when fixable', function () {
      let templateContents = '<button>LOL, Click me!</button>';

      project.write({
        app: {
          templates: {
            'other.hbs': templateContents,
          },
        },
      });

      let templatePath = project.path('app/templates/other.hbs');

      let result = linter.verifyAndFix({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result.messages).toEqual([]);
      expect(result.output).toEqual('<button type="button">LOL, Click me!</button>');
      expect(result.isFixed).toEqual(true);
    });

    it('updated output includes byte order mark if input source includes it', function () {
      let templateContents = '\uFEFF<button>LOL, Click me!</button>';

      project.write({
        app: {
          templates: {
            'other.hbs': templateContents,
          },
        },
      });

      let templatePath = project.path('app/templates/other.hbs');

      let result = linter.verifyAndFix({
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
    beforeEach(function () {
      project.setConfig({
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

      project.write({
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

    afterEach(async function () {
      await project.dispose();
    });

    it('returns an array of issues with the provided template', function () {
      let templatePath = project.path('app/templates/application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [
        {
          message: 'Non-translated string used',
          filePath: templatePath,
          moduleId: templatePath.slice(0, -4),
          line: 1,
          column: 4,
          source: 'Here too!!',
          rule: 'no-bare-strings',
          severity: 2,
        },
        {
          message: 'Non-translated string used',
          filePath: templatePath,
          moduleId: templatePath.slice(0, -4),
          line: 2,
          column: 5,
          source: 'Bare strings are bad...',
          rule: 'no-bare-strings',
          severity: 2,
        },
      ];

      let result = linter.verify({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result).toEqual(expected);
    });

    it('returns a "fatal" result object if an error occurs during parsing', function () {
      let template = '<div>';
      let result = linter.verify({
        source: template,
      });

      expect(result[0].fatal).toBe(true);
    });

    it('triggers warnings when severity is set to warn', function () {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'block-indentation': 'warn' },
        },
      });

      let template = ['<div>', '<p></p>', '</div>'].join('\n');

      let result = linter.verify({
        source: template,
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
      });

      let expected = {
        message:
          'Incorrect indentation for `<p>` beginning at L2:C0. Expected `<p>` to be at an indentation of 2 but was found at 0.',
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
        line: 2,
        column: 0,
        source: '<div>\n<p></p>\n</div>',
        rule: 'block-indentation',
        severity: 1,
      };

      expect(result).toEqual([expected]);
    });

    it('allows custom severity level for rules along with custom config', function () {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'no-implicit-this': ['warn', { allow: ['fooData'] }] },
        },
      });

      let template = ['<div>', '{{fooData}}{{barData}}', '</div>'].join('\n');

      let result = linter.verify({
        source: template,
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
      });

      let expected = {
        message:
          "Ambiguous path 'barData' is not allowed. Use '@barData' if it is a named argument or 'this.barData' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['barData'] }.",
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
        line: 2,
        column: 13,
        source: 'barData',
        rule: 'no-implicit-this',
        severity: 1,
      };

      expect(result).toEqual([expected]);
    });

    it('defaults all messages to warning severity level when module listed in pending', function () {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'no-bare-strings': 'error' },
          pending: ['some/path/here'],
        },
      });

      let template = '<div>bare string</div>';
      let result = linter.verify({
        source: template,
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
      });

      let expected = {
        message: 'Non-translated string used',
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
        line: 1,
        column: 5,
        source: 'bare string',
        rule: 'no-bare-strings',
        severity: 1,
      };

      expect(result).toEqual([expected]);
    });

    it('does not exclude errors when other rules are marked as pending', function () {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'no-bare-strings': 'error', 'block-indentation': 'error' },
          pending: [{ moduleId: 'some/path/here', only: ['block-indentation'] }],
        },
      });

      let template = '<div>bare string</div>';
      let result = linter.verify({
        source: template,
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
      });

      let expected = [
        {
          message: 'Non-translated string used',
          filePath: 'some/path/here.hbs',
          moduleId: 'some/path/here',
          line: 1,
          column: 5,
          source: 'bare string',
          rule: 'no-bare-strings',
          severity: 2,
        },
        {
          message:
            'Pending module (`some/path/here`) passes `block-indentation` rule. Please remove `block-indentation` from pending rules list.',
          filePath: 'some/path/here.hbs',
          moduleId: 'some/path/here',
          rule: 'invalid-pending-module-rule',
          severity: 2,
        },
      ];

      expect(result).toEqual(expected);
    });

    it('Works with overrides - base case', function () {
      let templatePath = project.path('app/templates/components/foo.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });

      let result = linter.verify({
        source: templateContents,
        moduleId: templatePath.slice(0, -4),
        filePath: templatePath,
      });

      let expected = [
        {
          column: 2,
          filePath: templatePath,
          line: 1,
          message:
            "Ambiguous path 'fooData' is not allowed. Use '@fooData' if it is a named argument or 'this.fooData' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['fooData'] }.",
          moduleId: templatePath.slice(0, -4),
          rule: 'no-implicit-this',
          severity: 2,
          source: 'fooData',
        },
      ];

      expect(result).toEqual(expected);
    });

    it('Works with overrides with custom warning severity', function () {
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

      let result = linter.verify({
        source: templateContents,
        moduleId: templatePath.slice(0, -4),
        filePath: templatePath,
      });

      let expected = [
        {
          column: 2,
          filePath: templatePath,
          line: 1,
          message:
            "Ambiguous path 'fooData' is not allowed. Use '@fooData' if it is a named argument or 'this.fooData' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['fooData'] }.",
          moduleId: templatePath.slice(0, -4),
          rule: 'no-implicit-this',
          severity: 2,
          source: 'fooData',
        },
      ];

      expect(result).toEqual(expected);
    });

    it('Works for older syntax without custom severity', function () {
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
      let result = linter.verify({
        source: template,
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
      });

      let expected = [
        {
          rule: 'no-restricted-invocations',
          severity: 2,
          filePath: 'some/path/here.hbs',
          moduleId: 'some/path/here',
          message: "Cannot use disallowed helper or component '{{foo}}'",
          line: 1,
          column: 17,
          source: '{{foo}}',
        },
        {
          rule: 'no-implicit-this',
          severity: 2,
          filePath: 'some/path/here.hbs',
          moduleId: 'some/path/here',
          message:
            "Ambiguous path 'foo' is not allowed. Use '@foo' if it is a named argument or 'this.foo' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['foo'] }.",
          line: 1,
          column: 19,
          source: 'foo',
        },
        {
          rule: 'no-bare-strings',
          severity: 2,
          filePath: 'some/path/here.hbs',
          moduleId: 'some/path/here',
          message: 'Non-translated string used',
          line: 1,
          column: 5,
          source: 'bare string ',
        },
      ];

      expect(result).toEqual(expected);
    });

    it('Works with overrides with custom warning severity object', function () {
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

      let result = linter.verify({
        source: templateContents,
        moduleId: templatePath.slice(0, -4),
        filePath: templatePath,
      });

      let expected = [
        {
          column: 2,
          line: 1,
          filePath: templatePath,
          message:
            "Ambiguous path 'fooData' is not allowed. Use '@fooData' if it is a named argument or 'this.fooData' if it is a property on 'this'. If it is a helper or component that has no arguments, you must either convert it to an angle bracket invocation or manually add it to the 'no-implicit-this' rule configuration, e.g. 'no-implicit-this': { allow: ['fooData'] }.",
          moduleId: templatePath.slice(0, -4),
          rule: 'no-implicit-this',
          severity: 2,
          source: 'fooData',
        },
      ];

      expect(result).toEqual(expected);
    });

    it('Should not trigger the lint error over custom overrides', function () {
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

      let result = linter.verify({
        source: templateContents,
        moduleId: templatePath.slice(0, -4),
        filePath: templatePath,
      });

      expect(result).toEqual([]);
    });

    it('triggers warnings when specific rule is marked as pending', function () {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'no-bare-strings': 'error', 'block-indentation': 'error' },
          pending: [{ moduleId: 'some/path/here', only: ['block-indentation'] }],
        },
      });

      let template = ['<div>', '<p></p>', '</div>'].join('\n');

      let result = linter.verify({
        source: template,
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
      });

      let expected = {
        message:
          'Incorrect indentation for `<p>` beginning at L2:C0. Expected `<p>` to be at an indentation of 2 but was found at 0.',
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
        line: 2,
        column: 0,
        source: '<div>\n<p></p>\n</div>',
        rule: 'block-indentation',
        severity: 1,
      };

      expect(result).toEqual([expected]);
    });

    it('module listed via moduleId in pending passes an error results', function () {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'no-bare-strings': 'error' },
          pending: ['some/path/here'],
        },
      });

      let template = '<div></div>';
      let result = linter.verify({
        source: template,
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
      });

      let expected = {
        rule: 'invalid-pending-module',
        message:
          'Pending module (`some/path/here`) passes all rules. Please remove `some/path/here` from pending list.',
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
        severity: 2,
      };

      expect(result).toEqual([expected]);
    });

    it('module listed as object via rule exclusion in pending passes an error results', function () {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'no-bare-strings': 'error' },
          pending: [{ moduleId: 'some/path/here', only: ['no-bare-strings'] }],
        },
      });

      let template = '<div></div>';
      let result = linter.verify({
        source: template,
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
      });

      let expected = {
        rule: 'invalid-pending-module',
        message:
          'Pending module (`some/path/here`) passes all rules. Please remove `some/path/here` from pending list.',
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
        severity: 2,
      };

      expect(result).toEqual([expected]);
    });

    it('triggers error if pending rule is passing', function () {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'no-bare-strings': 'error', 'no-html-comments': 'error' },
          pending: [{ moduleId: 'some/path/here', only: ['no-bare-strings', 'no-html-comments'] }],
        },
      });

      let template = '<div>Bare strings are bad</div>';
      let result = linter.verify({
        source: template,
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
      });

      let expected = [
        {
          column: 5,
          line: 1,
          message: 'Non-translated string used',
          filePath: 'some/path/here.hbs',
          moduleId: 'some/path/here',
          rule: 'no-bare-strings',
          severity: 1,
          source: 'Bare strings are bad',
        },
        {
          message:
            'Pending module (`some/path/here`) passes `no-html-comments` rule. Please remove `no-html-comments` from pending rules list.',
          filePath: 'some/path/here.hbs',
          moduleId: 'some/path/here',
          rule: 'invalid-pending-module-rule',
          severity: 2,
        },
      ];

      expect(result).toEqual(expected);
    });

    it('does not include errors when marked as ignored', function () {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'no-bare-strings': 'error', 'block-indentation': 'error' },
          ignore: ['some/path/here'],
        },
      });

      let template = '<div>bare string</div>';
      let result = linter.verify({
        source: template,
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
      });

      expect(result).toEqual([]);
    });

    it('does not include errors when marked as ignored using glob', function () {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'no-bare-strings': 'error', 'block-indentation': 'error' },
          ignore: ['some/path/*'],
        },
      });

      let template = '<div>bare string</div>';
      let result = linter.verify({
        source: template,
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
      });

      expect(result).toEqual([]);
    });

    it('shows a "rule not found" error if a rule definition is not found"', function () {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'missing-rule': 'error' },
        },
      });

      let template = '';
      let result = linter.verify({
        source: template,
        filePath: 'some/path/here.hbs',
        moduleId: 'some/path/here',
      });

      expect(result).toEqual([
        {
          message: "Definition for rule 'missing-rule' was not found",
          filePath: 'some/path/here.hbs',
          moduleId: 'some/path/here',
          severity: 2,
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
        configPath: path.join(basePath, '.template-lintrc.js'),
      });
    });

    it('returns plugin rule issues', function () {
      let templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [
        {
          message: 'The inline form of component is not allowed',
          filePath: templatePath,
          moduleId: templatePath.slice(0, -4),
          line: 1,
          column: 4,
          source: '{{component value="Hej"}}',
          rule: 'inline-component',
          severity: 2,
        },
      ];

      let result = linter.verify({
        source: templateContents,
        filePath: templatePath,
        moduleId: templatePath.slice(0, -4),
      });

      expect(result).toEqual(expected);
    });

    it('allow you to disable plugin rules inline', function () {
      let templatePath = path.join(basePath, 'app', 'templates', 'disabled-rule.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [];

      let result = linter.verify({
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
        configPath: path.join(basePath, '.template-lintrc.js'),
      });
    });

    it('returns plugin rule issues', function () {
      let templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [
        {
          message: 'The inline form of component is not allowed',
          filePath: templatePath,
          moduleId: templatePath.slice(0, -4),
          line: 1,
          column: 4,
          source: '{{component value="Hej"}}',
          rule: 'inline-component',
          severity: 2,
        },
      ];

      let result = linter.verify({
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
        configPath: path.join(basePath, '.template-lintrc.js'),
      });
    });

    it('returns plugin rule issues', function () {
      let templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [
        {
          message: 'The inline form of component is not allowed',
          filePath: templatePath,
          moduleId: templatePath.slice(0, -4),
          line: 1,
          column: 4,
          source: '{{component value="Hej"}}',
          rule: 'inline-component',
          severity: 2,
        },
        {
          message: 'Usage of triple curly brackets is unsafe',
          filePath: templatePath,
          moduleId: templatePath.slice(0, -4),
          line: 2,
          column: 2,
          source: '{{{this.myVar}}}',
          rule: 'no-triple-curlies',
          severity: 2,
        },
      ];

      let result = linter.verify({
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

    it('returns plugin rule issues', function () {
      let templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [
        {
          message: 'The inline form of component is not allowed',
          filePath: templatePath,
          moduleId: templatePath.slice(0, -4),
          line: 1,
          column: 4,
          source: '{{component value="Hej"}}',
          rule: 'inline-component',
          severity: 2,
        },
      ];

      let result = linter.verify({
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
        configPath: path.join(basePath, '.template-lintrc.js'),
      });
    });

    it('returns plugin rule issues', function () {
      let templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [];

      let result = linter.verify({
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
});
