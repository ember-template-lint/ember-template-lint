import { createBinTester } from '@scalvert/bin-tester';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Project from '../helpers/fake-project.js';
import setupEnvVar from '../helpers/setup-env-var.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('monorepo setups', function () {
  setupEnvVar('FORCE_COLOR', '0');
  setupEnvVar('LC_ALL', 'en_US');

  const { setupProject, teardownProject, runBin } = createBinTester({
    binPath: (project) =>
      path.join(project.baseDir, 'node_modules/ember-template-lint/bin/ember-template-lint.js'),
    createProject: async () => await Project.defaultSetup(),
  });

  let project;
  beforeEach(async function () {
    project = await setupProject();

    project.linkDependency('ember-template-lint', { target: path.join(__dirname, '../../') });

    await project.chdir();
  });

  afterEach(function () {
    teardownProject();
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
    describe('with workspace local config', function () {
      it('sub-projects can leverage plugins installed at the monorepo root', async function () {
        buildPlugin('fail-on-word');

        let foo = buildWorkspace('packages/foo');

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

        let result = await runBin('.', {
          cwd: foo.baseDir,
        });

        expect(result.exitCode).toEqual(1);
        expect(result.stderr).toMatchInlineSnapshot(`""`);
        expect(result.stdout).toMatchInlineSnapshot(`
          "Linting 2 Total Files with TemplateLint
          	.js: 1
          	.hbs: 1

          src/foo.hbs
            1:0  error  The string "evil" is forbidden in templates  fail-on-word

          ✖ 1 problems (1 errors, 0 warnings)"
        `);
      });

      it('ignores based on the config', async function () {
        buildPlugin('fail-on-word');

        let foo = buildWorkspace('packages/foo');

        await foo.setConfig({
          plugins: ['fail-on-word'],
          ignore: ['**/foo.hbs'],
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

        let result = await runBin('.', {
          cwd: foo.baseDir,
        });

        expect(result.exitCode).toEqual(0);
        expect(result.stderr).toMatchInlineSnapshot(`""`);
        expect(result.stdout).toMatchInlineSnapshot(`
          "Linting 1 Total Files with TemplateLint
          	.js: 1

          "
        `);
      });
    });

    describe('multiple sub-projects can share a single .template-lintrc.js file', function () {
      let foo, bar;
      beforeEach(async function () {
        buildPlugin('fail-on-word');

        foo = buildWorkspace('packages/foo');
        bar = buildWorkspace('packages/bar');

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
        let result = await runBin('.', {
          cwd: bar.baseDir,
        });

        expect(result.exitCode).toEqual(1);
        expect(result.stderr).toMatchInlineSnapshot(`""`);
        expect(result.stdout).toMatchInlineSnapshot(`
          "Linting 2 Total Files with TemplateLint
          	.js: 1
          	.hbs: 1

          src/bar.hbs
            1:0  error  The string "evil" is forbidden in templates  fail-on-word

          ✖ 1 problems (1 errors, 0 warnings)"
        `);
      });

      it('inside packages/foo', async function () {
        let result = await runBin(['.'], {
          cwd: foo.baseDir,
        });

        expect(result.exitCode).toEqual(1);
        expect(result.stderr).toMatchInlineSnapshot(`""`);
        expect(result.stdout).toMatchInlineSnapshot(`
          "Linting 2 Total Files with TemplateLint
          	.js: 1
          	.hbs: 1

          src/foo.hbs
            1:0  error  The string "evil" is forbidden in templates  fail-on-word

          ✖ 1 problems (1 errors, 0 warnings)"
        `);
      });

      it('inside monorepo root', async function () {
        let result = await runBin('.', {
          cwd: project.baseDir,
        });

        expect(result.exitCode).toEqual(1);
        expect(result.stderr).toMatchInlineSnapshot(`""`);
        expect(result.stdout).toMatchInlineSnapshot(`
          "Linting 4 Total Files with TemplateLint
          	.js: 2
          	.hbs: 2

          packages/bar/src/bar.hbs
            1:0  error  The string "evil" is forbidden in templates  fail-on-word

          packages/foo/src/foo.hbs
            1:0  error  The string "evil" is forbidden in templates  fail-on-word

          ✖ 2 problems (2 errors, 0 warnings)"
        `);
      });
    });
  });

  describe('when ran with ember-template-lint from checkout location', function () {
    it('sub-projects can leverage plugins installed at the monorepo root', async function () {
      buildPlugin('fail-on-word');

      let foo = buildWorkspace('packages/foo');

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

      let result = await runBin('.', {
        cwd: foo.baseDir,
      });

      expect(result.exitCode).toEqual(1);
      expect(result.stderr).toMatchInlineSnapshot(`""`);
      expect(result.stdout).toMatchInlineSnapshot(`
        "Linting 2 Total Files with TemplateLint
        	.js: 1
        	.hbs: 1

        src/foo.hbs
          1:0  error  The string "evil" is forbidden in templates  fail-on-word

        ✖ 1 problems (1 errors, 0 warnings)"
      `);
    });
  });
});
