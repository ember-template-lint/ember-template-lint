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

    return workspace;
  }

  function buildPlugin(name) {
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

    return plugin;
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

    describe('with workspace local config', function () {
      it('sub-projects can leverage plugins installed at the monorepo root', async function () {
        buildPlugin('fail-on-word');

        let foo = await buildWorkspace('packages/foo');

        await foo.setConfig({
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

        await project.write();

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

    describe('multiple sub-projects with single shared .template-lintrc.js file', function () {
      let plugin, foo, bar;
      beforeEach(async function () {
        plugin = buildPlugin('fail-on-word');

        foo = await buildWorkspace('packages/foo');
        bar = await buildWorkspace('packages/bar');

        await foo.write({
          src: {
            'foo.hbs': 'evil deeds',
          },
        });

        await bar.write({
          src: {
            'bar.hbs': 'weevils are here',
          },
        });

        // has to happen after the workspaces are written
        await project.setConfig({
          plugins: ['fail-on-word'],
          rules: {
            'fail-on-word': ['error', 'evil'],
          },
        });
      });

      it('inside packages/bar', async function () {
        let result = await run(['.'], {
          cwd: bar.baseDir,
        });

        expect(result.exitCode).toEqual(1);
        expect(result.stderr).toMatchInlineSnapshot(`""`);
        expect(result.stdout).toMatchInlineSnapshot(`
          "src/bar.hbs
            1:0  error  The string \\"evil\\" is forbidden in templates  fail-on-word

          ✖ 1 problems (1 errors, 0 warnings)"
        `);
      });

      it('inside packages/foo', async function () {
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

      it('inside monorepo root', async function () {
        let result = await run(['.'], {
          cwd: project.baseDir,
        });

        expect(result.exitCode).toEqual(1);
        expect(result.stderr).toMatchInlineSnapshot(`""`);
        expect(result.stdout).toMatchInlineSnapshot(`
          "packages/bar/src/bar.hbs
            1:0  error  The string \\"evil\\" is forbidden in templates  fail-on-word

          packages/foo/src/foo.hbs
            1:0  error  The string \\"evil\\" is forbidden in templates  fail-on-word

          ✖ 2 problems (2 errors, 0 warnings)"
        `);
      });

      it('supports plugins which require `exports` to be honored', async function() {
        plugin.pkg.exports = {
          'import': 'lib/index.js',
        };

        await plugin.write({
          lib: {
            // copy the file forward into lib
            'index.js': plugin.files['index.js'],
          }
        });

        // remove the old `index.js`
        fs.unlinkSync(path.join(plugin.baseDir, 'index.js'));

        let result = await run(['.'], {
          cwd: project.baseDir,
        });

        expect(result.exitCode).toEqual(1);
        expect(result.stderr).toMatchInlineSnapshot(`""`);
        expect(result.stdout).toMatchInlineSnapshot(`
          "packages/bar/src/bar.hbs
            1:0  error  The string \\"evil\\" is forbidden in templates  fail-on-word

          packages/foo/src/foo.hbs
            1:0  error  The string \\"evil\\" is forbidden in templates  fail-on-word

          ✖ 2 problems (2 errors, 0 warnings)"
        `);

      });
    });
  });

  describe('when ran with ember-template-lint from checkout location', function () {
    it('sub-projects can leverage plugins installed at the monorepo root', async function () {
      buildPlugin('fail-on-word');

      let foo = await buildWorkspace('packages/foo');

      await foo.setConfig({
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

      await project.write();

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
