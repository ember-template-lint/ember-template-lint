import { execa } from 'execa';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Project from '../helpers/fake-project.js';
import run from '../helpers/run.js';
import setupEnvVar from '../helpers/setup-env-var.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('monorepo setups', function () {
  setupEnvVar('FORCE_COLOR', '0');
  setupEnvVar('LC_ALL', 'en_US');

  let project;
  beforeEach(async function () {
    project = await Project.defaultSetup();

    project.linkDependency('ember-template-lint', { target: path.join(__dirname, '../../') });

    await project.chdir();
  });

  afterEach(function () {
    project.dispose();
  });

  function buildWorkspace(relativePath) {
    let workspacePath = path.join(project.baseDir, relativePath);
    let workspaceName = path.basename(relativePath);

    fs.mkdirSync(workspacePath, { recursive: true });

    let workspace = new Project(workspaceName);

    workspace.baseDir = workspacePath;
    workspace.populateDefaultSetupFiles();

    return workspace;
  }

  async function buildPlugin(name) {
    let plugin = project.addDependency(name);

    plugin.pkg.type = 'module';
    plugin.pkg.peerDependencies = {
      'ember-template-lint': '*',
    };

    plugin.files = {
      'index.js': `
        import { Rule } from 'ember-template-lint';

        class FailOnWord extends Rule {
          visitor() {
            return {
              TextNode(node) {
                const bad = this.config;
                if (node.chars.includes(bad)) {
                  this.log({
                    message: \`The string "\${bad}" is forbidden in templates\`,
                    node,
                  });
                }
              },
            };
          }
        }

        export default {
          name: '${name}',
          rules: {
            'fail-on-word': FailOnWord,
          },
        };`,
    };

    await project.write();
  }

  describe('when ran with ember-template-lint linked', function () {
    // just like the other version, but running with the monorepo's ember-template-lint
    function run(args, options = {}) {
      options.reject = false;
      options.cwd = options.cwd || process.cwd();

      return execa(
        process.execPath,
        [
          path.join(project.baseDir, 'node_modules/ember-template-lint/bin/ember-template-lint.js'),
          ...args,
        ],
        options
      );
    }

    it('sub-projects can leverage plugins installed at the monorepo root', async function () {
      buildPlugin('fail-on-word');

      let foo = await buildWorkspace('packages/foo');

      foo.setConfig({
        plugins: ['fail-on-word'],
        rules: {
          'fail-on-word': ['error', 'evil'],
        },
      });

      await foo.write({
        src: {
          'foo.hbs': 'evil deeds',
        },
      });

      let result = await run(['.'], {
        cwd: foo.baseDir,
      });

      expect(result.exitCode).toEqual(1);
      expect(result.stderr).toMatchInlineSnapshot(`""`);
      expect(result.stdout).toMatchInlineSnapshot(`
        "src/foo.hbs
          1:0  error  The string \\"evil\\" is forbidden in templates  fail-on-word

        ✖ 1 problems (1 errors, 0 warnings)"
      `);
    });
  });

  describe('when ran with ember-template-lint from checkout location', function () {
    it('sub-projects can leverage plugins installed at the monorepo root', async function () {
      buildPlugin('fail-on-word');

      let foo = await buildWorkspace('packages/foo');

      foo.setConfig({
        plugins: ['fail-on-word'],
        rules: {
          'fail-on-word': ['error', 'evil'],
        },
      });

      await foo.write({
        src: {
          'foo.hbs': 'evil deeds',
        },
      });

      let result = await run(['.'], {
        cwd: foo.baseDir,
      });

      expect(result.exitCode).toEqual(1);
      expect(result.stderr).toMatchInlineSnapshot(`""`);
      expect(result.stdout).toMatchInlineSnapshot(`
        "src/foo.hbs
          1:0  error  The string \\"evil\\" is forbidden in templates  fail-on-word

        ✖ 1 problems (1 errors, 0 warnings)"
      `);
    });
  });
});
