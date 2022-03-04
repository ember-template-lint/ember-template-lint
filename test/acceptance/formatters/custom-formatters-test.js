import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import Project from '../../helpers/fake-project.js';
import run from '../../helpers/run.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('custom formatters', () => {
  let project;
  beforeEach(function () {
    project = Project.defaultSetup();
    project.chdir();
  });

  afterEach(function () {
    project.dispose();
  });

  it('should be able to load relative formatter', async function () {
    project.setConfig({
      rules: {
        'no-bare-strings': true,
        'no-html-comments': true,
      },
    });
    project.write({
      app: {
        templates: {
          'application.hbs':
            '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
        },
      },
      'custom-formatter.js': `
  class CustomFormatter {
    constructor(options = {}) {
      this.options = options;
    }

    format(results) {
      let output = [];

      output.push(
        \`errors: \${results.errorCount}\`,
        \`warnings: \${results.warningCount}\`,
        \`fixable: \${results.fixableErrorCount + results.fixableWarningCount}\`
      );

      return output.join('\\n');
    }
  }

  module.exports = CustomFormatter;
            `,
    });

    let result = await run(['.', '--format', './custom-formatter.js']);

    expect(result.stdout).toMatchInlineSnapshot(`
      "errors: 3
      warnings: 0
      fixable: 0"
    `);
    expect(result.stderr).toBeFalsy();
  });

  it('should be able to load formatter from node_modules', async function () {
    project.setConfig({
      rules: {
        'no-bare-strings': true,
        'no-html-comments': true,
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

    let fixturePath = path.resolve(
      __dirname,
      '../..',
      'fixtures',
      'ember-template-lint-formatter-test'
    );
    let formatterDirPath = path.join(
      project.baseDir,
      'node_modules',
      'ember-template-lint-formatter-test'
    );

    fs.mkdirSync(formatterDirPath, { recursive: true });
    fs.copyFileSync(path.join(fixturePath, 'index.cjs'), path.join(formatterDirPath, 'index.js'));
    fs.copyFileSync(
      path.join(fixturePath, 'package.json'),
      path.join(formatterDirPath, 'package.json')
    );

    let result = await run(['.', '--format', 'ember-template-lint-formatter-test']);

    expect(result.stdout).toMatchInlineSnapshot(`
      "Custom Formatter Header
      errors: 3
      warnings: 0
      fixable: 0"
    `);
    expect(result.stderr).toBeFalsy();
  });

  it('should be able use legacy formatters using .print()', async function () {
    project.setConfig({
      rules: {
        'no-bare-strings': true,
        'no-html-comments': true,
      },
    });
    project.write({
      app: {
        templates: {
          'application.hbs':
            '<h2>Here too!!</h2><div>Bare strings are bad...</div><!-- bad html comment! -->',
        },
      },
      'legacy-formatter.js': `
            class LegacyFormatter {
              constructor(options = {}) {
                this.options = options;
                this.console = options.console || console;
              }

              print(results) {
                this.console.log(\`errors: \${results.errorCount}\`);
                this.console.log(\`warnings: \${results.warningCount}\`);
                this.console.log(\`fixable: \${(results.fixableErrorCount + results.fixableWarningCount)}\`);
              }
            }

            module.exports = LegacyFormatter;
          `,
    });

    let result = await run(['.', '--format', './legacy-formatter.js']);

    expect(result.stdout).toMatchInlineSnapshot(`
      "errors: 3
      warnings: 0
      fixable: 0"
    `);
    expect(result.stderr).toBeFalsy();
  });
});
