import { createBinTester } from '@scalvert/bin-tester';
import { fileURLToPath } from 'node:url';

import Project from './fake-project.js';

export const { setupProject, teardownProject, runBin } = createBinTester({
  binPath: fileURLToPath(new URL('../../bin/ember-template-lint.js', import.meta.url)),
  projectConstructor: Project,
  createProject: async () => await Project.defaultSetup(),
});
