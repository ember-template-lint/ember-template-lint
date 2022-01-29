import { execa } from 'execa';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Project from '../helpers/fake-project.js';
import setupEnvVar from '../helpers/setup-env-var.js';

const cliPath = fileURLToPath(new URL('../..', import.meta.url));
const binPath = path.join(cliPath, 'bin/ember-template-lint.js');

function run(project, args, options = {}) {
  options.reject = false;
  options.cwd = options.cwd || project.path('.');

  return execa(process.execPath, [binPath, ...args], options);
}

export async function newTmpDir() {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), `ember-template-lint-${Date.now()}-`));

  return tmpDir;
}

export async function newMonorepo(workspaces) {
  let root = await newTmpDir();

  await execa('git', ['init'], { cwd: root });

  await fs.writeFile(
    path.join(root, 'package.json'),
    `{ "workspaces": [${workspaces.map((w) => `"${w}"`)}], "private": true }`
  );

  let projects = [];
  for (let workspace of workspaces) {
    let safeName = workspace.replaceAll('/', '-');
    let project = new Project(`test-${safeName}`, '0.0.0');

    project.baseDir = path.join(root, workspace);

    await fs.mkdir(project.baseDir, { recursive: true });

    project.setDefaultFiles();
    project.linkDependency('ember-template-lint', cliPath);
    project.writeSync();
  }

  return { root, projects };
}

describe('monorepos', function () {
  setupEnvVar('FORCE_COLOR', '0');
  setupEnvVar('LC_ALL', 'en_US');

  let root;
  let projects;
  beforeEach(async function () {
    let monorepo = await newMonorepo(['frontend', 'packages/some-addon']);

    root = monorepo.root;
    projects = monorepo.projects;
  });

  afterEach(function () {
    for (const project of projects) {
      project.dispose();
    }
  });

  describe('with a plugin', function () {
    beforeEach(async function () {
      let pluginDir = await newTmpDir();

      await execa(
        'git',
        ['clone', 'https://gitlab.com/NullVoxPopuli/ember-template-lint-plugin-tailwindcss.git'],
        { cwd: pluginDir }
      );
      let pluginRepo = path.join(pluginDir, 'ember-template-lint-plugin-tailwindcss');
      await execa('git', ['checkout', 'vitest'], { cwd: pluginRepo });
      await execa('yarn', ['install'], { cwd: pluginRepo });
      await execa('yarn', ['build'], { cwd: pluginRepo });

      for (let project of projects) {
        project.linkDependency('ember-template-lint-plugin-tailwindcss', pluginRepo);
        project.files['test-template.hbs'] = `<div class="w-4 h-4"></div>`;
        project.files['.template-lintrc.js'] = `'use strict';

module.exports = {
  plugins: [
    'ember-template-lint-plugin-tailwindcss',
  ],

  extends: [
    'recommended',
    'ember-template-lint-plugin-tailwindcss:recommended',
  ],
};
`;
        project.writeSync();
      }

      await execa('yarn', ['install'], { cwd: root });
    });

    it('does not error', async function () {
      for (let project of projects) {
        let { stdout } = await run(project);

        console.log(stdout);
      }
    });
  });
});
