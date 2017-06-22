'use strict';

const path = require('path');
const fs = require('fs');
const Linter = require('../lib/index');
const expect = require('chai').expect;

const fixturePath = path.join(__dirname, 'fixtures');
const initialCWD = process.cwd();

describe('public api', function() {
  function buildFakeConsole() {
    return {
      _logLines: [],

      log(data) {
        this._logLines.push(data);
      }
    };
  }

  let mockConsole;
  beforeEach(function() {
    mockConsole = buildFakeConsole();
  });

  afterEach(function() {
    process.chdir(initialCWD);
  });

  describe('Linter.prototype.loadConfig', function() {
    it('uses provided config', function() {
      let config = {};
      let linter = new Linter({
        console: mockConsole,
        config: config
      });

      expect(linter.config).to.equal(config);
    });

    it('uses .template-lintrc.js in cwd if present', function() {
      let basePath = path.join(fixturePath, 'config-in-root');
      let expected = require(path.join(basePath, '.template-lintrc'));

      process.chdir(basePath);

      let linter = new Linter({
        console: mockConsole
      });

      expect(linter.config).to.equal(expected);
    });

    it('uses .template-lintrc in provided configPath', function() {
      let basePath = path.join(fixturePath, 'config-in-root');
      let configPath = path.join(basePath, '.template-lintrc.js');
      let expected = require(configPath);

      process.chdir(basePath);

      let linter = new Linter({
        console: mockConsole,
        configPath: configPath
      });

      expect(linter.config).to.equal(expected);
    });
  });

  describe('Linter.prototype.constructor', function() {
    it('should be able to instantiate without options', function() {
      expect(new Linter()).to.be.ok;
    });

    it('accepts a fake console implementation', function() {
      let linter = new Linter({
        console: {
          log(message) {
            actual = message;
          }
        }
      });
      let expected = 'foo bar widget';
      let actual;

      linter.console.log(expected);
      expect(actual).to.equal(expected);
    });
  });

  describe('Linter.prototype.verify', function() {
    let basePath = path.join(fixturePath, 'with-errors');
    let linter;

    beforeEach(function() {
      linter = new Linter({
        console: mockConsole,
        configPath: path.join(basePath, '.template-lintrc.js')
      });
    });

    it('returns an array of issues with the provided template', function() {
      let templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [
        {
          message: 'Non-translated string used',
          moduleId: templatePath,
          line: 1,
          column: 4,
          source: 'Here too!!',
          rule: 'bare-strings',
          severity: 2
        }, {
          message: 'Non-translated string used',
          moduleId: templatePath,
          line: 2,
          column: 5,
          source: 'Bare strings are bad...',
          rule: 'bare-strings',
          severity: 2
        }
      ];

      let result = linter.verify({
        source: templateContents,
        moduleId: templatePath
      });

      expect(result).to.deep.equal(expected);
    });

    it('returns a "fatal" result object if an error occurs during parsing', function() {
      let template = '<div>';
      let result = linter.verify({
        source: template
      });

      expect(result[0].fatal).to.be.true;
    });

    it('defaults all messages to warning severity level when module listed in pending', function() {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'bare-strings': true },
          pending: ['some/path/here']
        }
      });

      let template = '<div>bare string</div>';
      let result = linter.verify({
        source: template,
        moduleId: 'some/path/here'
      });

      let expected = {
        message: 'Non-translated string used',
        moduleId: 'some/path/here',
        line: 1,
        column: 5,
        source: 'bare string',
        rule: 'bare-strings',
        severity: 1
      };

      expect(result).to.deep.equal([expected]);
    });

    it('does not exclude errors when other rules are marked as pending', function() {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'bare-strings': true, 'block-indentation': true },
          pending: [
            { moduleId: 'some/path/here', only: ['block-indentation'] }
          ]
        }
      });

      let template = '<div>bare string</div>';
      let result = linter.verify({
        source: template,
        moduleId: 'some/path/here'
      });

      let expected = {
        message: 'Non-translated string used',
        moduleId: 'some/path/here',
        line: 1,
        column: 5,
        source: 'bare string',
        rule: 'bare-strings',
        severity: 2
      };

      expect(result).to.deep.equal([expected]);
    });

    it('triggers warnings when specific rule is marked as pending', function() {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'bare-strings': true, 'block-indentation': true },
          pending: [
            { moduleId: 'some/path/here', only: ['block-indentation'] }
          ]
        }
      });

      let template = [
        '<div>',
        '<p></p>',
        '</div>'
      ].join('\n');

      let result = linter.verify({
        source: template,
        moduleId: 'some/path/here'
      });

      let expected = {
        message: 'Incorrect indentation for `<p>` beginning at L2:C0. Expected `<p>` to be at an indentation of 2 but was found at 0.',
        moduleId: 'some/path/here',
        line: 2,
        column: 0,
        source: '<div>\n<p></p>\n</div>',
        rule: 'block-indentation',
        severity: 1
      };

      expect(result).to.deep.equal([expected]);
    });

    it('module listed via moduleId in pending passes an error results', function() {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'bare-strings': true },
          pending: ['some/path/here' ]
        }
      });

      let template = '<div></div>';
      let result = linter.verify({
        source: template,
        moduleId: 'some/path/here'
      });

      let expected = {
        message: 'Pending module (`some/path/here`) passes all rules. Please remove `some/path/here` from pending list.',
        moduleId: 'some/path/here',
        severity: 2
      };

      expect(result).to.deep.equal([expected]);
    });

    it('module listed as object via rule exclusion in pending passes an error results', function() {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'bare-strings': true },
          pending: [
            { moduleId: 'some/path/here', only: ['bare-strings']}
          ]
        }
      });

      let template = '<div></div>';
      let result = linter.verify({
        source: template,
        moduleId: 'some/path/here'
      });

      let expected = {
        message: 'Pending module (`some/path/here`) passes all rules. Please remove `some/path/here` from pending list.',
        moduleId: 'some/path/here',
        severity: 2
      };

      expect(result).to.deep.equal([expected]);
    });

    it('does not include errors when marked as ignored', function() {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'bare-strings': true, 'block-indentation': true },
          ignore: [ 'some/path/here' ]
        }
      });

      let template = '<div>bare string</div>';
      let result = linter.verify({
        source: template,
        moduleId: 'some/path/here'
      });

      expect(result).to.deep.equal([]);
    });

    it('does not include errors when marked as ignored using glob', function() {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'bare-strings': true, 'block-indentation': true },
          ignore: [ 'some/path/*' ]
        }
      });

      let template = '<div>bare string</div>';
      let result = linter.verify({
        source: template,
        moduleId: 'some/path/here'
      });

      expect(result).to.deep.equal([]);
    });

  });

  describe('Linter using plugins', function() {
    let basePath = path.join(fixturePath, 'with-plugins');
    let linter;

    beforeEach(function() {
      linter = new Linter({
        console: mockConsole,
        configPath: path.join(basePath, '.template-lintrc.js')
      });
    });

    it('returns plugin rule issues', function() {
      let templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [
        {
          message: 'The inline form of component is not allowed',
          moduleId: templatePath,
          line: 1,
          column: 4,
          source: '{{component value="Hej"}}',
          rule: 'inline-component',
          severity: 2
        }
      ];

      let result = linter.verify({
        source: templateContents,
        moduleId: templatePath
      });

      expect(result).to.deep.equal(expected);
    });

  });

  describe('Linter using plugin with extends', function() {
    let basePath = path.join(fixturePath, 'with-plugin-with-configurations');
    let linter;

    beforeEach(function() {
      linter = new Linter({
        console: mockConsole,
        configPath: path.join(basePath, '.template-lintrc.js')
      });
    });

    it('returns plugin rule issues', function() {
      let templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [
        {
          message: 'The inline form of component is not allowed',
          moduleId: templatePath,
          line: 1,
          column: 4,
          source: '{{component value="Hej"}}',
          rule: 'inline-component',
          severity: 2
        }
      ];

      let result = linter.verify({
        source: templateContents,
        moduleId: templatePath
      });

      expect(result).to.deep.equal(expected);
    });

  });
  describe('Linter using plugin with multiple extends', function() {
    let basePath = path.join(fixturePath, 'with-multiple-extends');
    let linter;

    beforeEach(function() {
      linter = new Linter({
        console: mockConsole,
        configPath: path.join(basePath, '.template-lintrc.js')
      });
    });

    it('returns plugin rule issues', function() {
      let templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [
        {
          message: 'Usage of triple curly brackets is unsafe',
          moduleId: templatePath,
          line: 2,
          column: 2,
          source: '{{{myVar}}}',
          rule: 'triple-curlies',
          severity: 2
        },
        {
          message: 'The inline form of component is not allowed',
          moduleId: templatePath,
          line: 1,
          column: 4,
          source: '{{component value="Hej"}}',
          rule: 'inline-component',
          severity: 2
        }
      ];

      let result = linter.verify({
        source: templateContents,
        moduleId: templatePath
      });

      expect(result).to.deep.equal(expected);
    });

  });
  describe('Linter using plugins (inline plugins)', function() {
    let basePath = path.join(fixturePath, 'with-inline-plugins');
    let linter;

    beforeEach(function() {
      linter = new Linter({
        console: mockConsole,
        configPath: path.join(basePath, '.template-lintrc.js')
      });
    });

    it('returns plugin rule issues', function() {
      let templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [
        {
          message: 'The inline form of component is not allowed',
          moduleId: templatePath,
          line: 1,
          column: 4,
          source: '{{component value="Hej"}}',
          rule: 'inline-component',
          severity: 2
        }
      ];

      let result = linter.verify({
        source: templateContents,
        moduleId: templatePath
      });

      expect(result).to.deep.equal(expected);
    });

  });

  describe('Linter using plugins loading a configuration that extends from another plugins configuration', function() {
    let basePath = path.join(fixturePath, 'with-plugins-overwriting');
    let linter;

    beforeEach(function() {
      linter = new Linter({
        console: mockConsole,
        configPath: path.join(basePath, '.template-lintrc.js')
      });
    });

    it('returns plugin rule issues', function() {
      let templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      let templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      let expected = [];

      let result = linter.verify({
        source: templateContents,
        moduleId: templatePath
      });

      expect(result).to.deep.equal(expected);
    });

  });

  describe('Linter.prototype.statusForModule', function() {
    it('returns true when the provided moduleId is listed in `pending`', function() {
      let linter = new Linter({
        console: mockConsole,
        config: {
          pending: [
            'some/path/here',
            { moduleId: 'foo/bar/baz', only: ['bare-strings']}
          ]
        }
      });

      expect(linter.statusForModule('pending', 'some/path/here')).to.be.ok;
      expect(linter.statusForModule('pending', 'foo/bar/baz')).to.be.ok;
      expect(linter.statusForModule('pending', 'some/other/path')).to.not.be.ok;
    });
  });

  describe('Linter.errorsToMessages', function() {
    it('formats error with rule, message and moduleId', function() {
      let result = Linter.errorsToMessages([
        { rule: 'some rule', message: 'some message', moduleId: 'some moduleId' }
      ]);

      expect(result).to.equal('some rule: some message (some moduleId)');
    });

    it('formats error with rule, message, moduleId, line and column numbers', function() {
      let result = Linter.errorsToMessages([
        { rule: 'some rule', message: 'some message', moduleId: 'some moduleId', line: 11, column: 12 }
      ]);

      expect(result).to.equal('some rule: some message (some moduleId @ L11:C12)');
    });

    it('formats error with rule, message, moduleId, source', function() {
      let result = Linter.errorsToMessages([
        { rule: 'some rule', message: 'some message', moduleId: 'some moduleId', source: 'some source' }
      ]);

      expect(result).to.equal('some rule: some message (some moduleId):\n`some source`');
    });

    it('formats more than one error', function() {
      let result = Linter.errorsToMessages([
        { rule: 'some rule', message: 'some message', moduleId: 'some moduleId', line: 11, column: 12 },
        { rule: 'some rule2', message: 'some message2', moduleId: 'some moduleId2', source: 'some source2' }
      ]);

      expect(result).to.equal(
        'some rule: some message (some moduleId @ L11:C12)\n' +
        'some rule2: some message2 (some moduleId2):\n`some source2`'
      );
    });
  });
});
