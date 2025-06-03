import { vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import { setupProject, teardownProject, runBin as rawRunBin } from '../helpers/bin-tester.js';
import setupEnvVar from '../helpers/setup-env-var.js';

async function runBin(projectPath, ...params) {
  const envValues = {
    env: {
      DEBUG: 'ember-template-lint',
    },
  };
  if (params.length > 0 && typeof params.at(-1) === 'object') {
    params[params.length - 1] = {
      ...params.at(-1),
      ...envValues,
    };
  } else {
    params.push(envValues);
  }
  return await rawRunBin(projectPath, ...params);
}
vi.setConfig({ testTimeout: 10_000 });

describe('ember-template-lint worker threads', function () {
  setupEnvVar('FORCE_COLOR', '0');
  setupEnvVar('LC_ALL', 'en_US');

  let project;

  beforeEach(async function () {
    project = await setupProject();
    await project.chdir();
  });

  afterEach(function () {
    teardownProject();
  });

  describe('worker thread activation', function () {
    it('should use worker threads when file count exceeds threshold', async function () {
      // MIN_FILES_TO_USE_WORKERS = 100, so we need to create at least 100 files
      await project.setConfig({
        rules: {
          'no-bare-strings': 'error',
        },
      });

      // Create 101 template files with errors to trigger worker usage
      const templateFiles = {};
      for (let i = 0; i < 101; i++) {
        templateFiles[`template-${i}.hbs`] = `<div>Bare string ${i}</div>`;
      }

      await project.write({
        app: {
          templates: templateFiles,
        },
      });

      let result = await runBin('.');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toContain('Linting 101 Total Files with TemplateLint');
      expect(result.stdout).toContain('✖ 101 problems (101 errors, 0 warnings)');
      expect(result.stdout).toContain('Processed 100 files per batch in 2 workers');
      expect(result.stderr).toBeFalsy();
    });

    it('should not use worker threads when file count is below threshold', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': 'error',
        },
      });

      // Create only 5 template files (below the 100 file threshold)
      const templateFiles = {};
      for (let i = 0; i < 5; i++) {
        templateFiles[`template-${i}.hbs`] = `<div>Bare string ${i}</div>`;
      }

      await project.write({
        app: {
          templates: templateFiles,
        },
      });

      let result = await runBin('.');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toContain('Linting 5 Total Files with TemplateLint');
      expect(result.stdout).toContain('✖ 5 problems (5 errors, 0 warnings)');
      expect(result.stdout).not.toContain('Processed');
      expect(result.stderr).toBeFalsy();
    });

    it('should not use worker threads when reading from stdin', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': 'error',
        },
      });

      // Even with many files, stdin should bypass worker threads
      const templateFiles = {};
      for (let i = 0; i < 101; i++) {
        templateFiles[`template-${i}.hbs`] = `<div>Valid content ${i}</div>`;
      }

      await project.write({
        app: {
          templates: templateFiles,
        },
      });

      let result = await runBin('--filename', 'test.hbs', {
        input: '<div>Bare string from stdin</div>',
      });

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toContain('error  Non-translated string used  no-bare-strings');
      expect(result.stdout).not.toContain('Processed');
      expect(result.stderr).toBeFalsy();
    });
  });

  describe('worker thread file distribution', function () {
    it('should distribute files across multiple workers efficiently', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': 'error',
        },
      });

      // Create 150 files to test worker distribution
      const templateFiles = {};
      for (let i = 0; i < 150; i++) {
        templateFiles[`template-${i}.hbs`] = `<div>Bare string ${i}</div>`;
      }

      await project.write({
        app: {
          templates: templateFiles,
        },
      });

      let result = await runBin('.');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toContain('Linting 150 Total Files with TemplateLint');
      expect(result.stdout).toContain('✖ 150 problems (150 errors, 0 warnings)');
      expect(result.stdout).toContain('Processed 100 files per batch in 2 workers');
      expect(result.stderr).toBeFalsy();
    });

    it('should maintain file order in results when using workers', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': 'error',
        },
      });

      // Create files with specific naming to verify order preservation
      const templateFiles = {};
      for (let i = 0; i < 105; i++) {
        const paddedNum = i.toString().padStart(3, '0');
        templateFiles[`file-${paddedNum}.hbs`] = `<div>Error in file ${paddedNum}</div>`;
      }

      await project.write({
        app: {
          templates: templateFiles,
        },
      });

      let result = await runBin('.');

      expect(result.exitCode).toEqual(1);

      // Check that files are reported in correct order
      const lines = result.stdout.split('\n');
      const fileLines = lines.filter((line) => line.includes('app/templates/file-'));

      // Should start with file-000.hbs and be in order
      expect(fileLines[0]).toContain('app/templates/file-000.hbs');
      expect(fileLines[1]).toContain('app/templates/file-001.hbs');
      expect(fileLines[2]).toContain('app/templates/file-002.hbs');

      expect(result.stdout).toContain('Processed 100 files per batch in 2 workers');
      expect(result.stderr).toBeFalsy();
    });
  });

  describe('worker thread error handling', function () {
    it('should handle errors in worker threads gracefully', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': 'error',
        },
      });

      // Create valid files and one problematic file
      const templateFiles = {};
      for (let i = 0; i < 100; i++) {
        templateFiles[`template-${i}.hbs`] = `<div>Bare string ${i}</div>`;
      }

      // Add a file with syntax error that might cause issues
      templateFiles['broken.hbs'] = '{{#if unclosed}}<div>broken</div>';

      await project.write({
        app: {
          templates: templateFiles,
        },
      });

      let result = await runBin('.');

      expect(result.exitCode).toEqual(1);
      // Should still process other files even if one has issues
      expect(result.stdout).toContain('Linting 101 Total Files with TemplateLint');
      expect(result.stdout).toContain('Processed 100 files per batch in 2 workers');
    });

    it('should handle mixed error types across workers', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': 'error',
          'no-html-comments': 'warn',
        },
      });

      const templateFiles = {};
      for (let i = 0; i < 105; i++) {
        if (i % 2 === 0) {
          // Even files have errors
          templateFiles[`template-${i}.hbs`] = `<div>Bare string ${i}</div>`;
        } else {
          // Odd files have warnings
          templateFiles[`template-${i}.hbs`] = `<div>Valid content ${i}</div><!-- comment -->`;
        }
      }

      await project.write({
        app: {
          templates: templateFiles,
        },
      });

      let result = await runBin('.');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toContain('Linting 105 Total Files with TemplateLint');
      // Should have both errors and warnings
      expect(result.stdout).toMatch(/\d+ errors?, \d+ warnings?/);
      expect(result.stdout).toContain('Processed 100 files per batch in 2 workers');
      expect(result.stderr).toBeFalsy();
    });
  });

  describe('worker thread performance with different configurations', function () {
    it('should handle autofixing with worker threads', async function () {
      await project.setConfig({
        rules: {
          'require-button-type': 'error',
        },
      });

      const templateFiles = {};
      for (let i = 0; i < 105; i++) {
        // These can be auto-fixed
        templateFiles[`template-${i}.hbs`] = `<button>Click me ${i}</button>`;
      }

      await project.write({
        app: {
          templates: templateFiles,
        },
      });

      let result = await runBin('.', '--fix');

      expect(result.exitCode).toEqual(0);
      expect(result.stdout).toContain('Linting 105 Total Files with TemplateLint');
      expect(result.stdout).toContain('Processed 100 files per batch in 2 workers');

      // Verify that files were actually fixed
      const fixedContent = fs.readFileSync(path.resolve('app/templates/template-0.hbs'), {
        encoding: 'utf8',
      });
      expect(fixedContent).toContain('type="button"');
      expect(result.stderr).toBeFalsy();
    });

    it('should work with custom rules across workers', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': 'error',
          'attribute-indentation': ['error', { 'open-invocation-max-len': 120 }],
        },
      });

      const templateFiles = {};
      for (let i = 0; i < 105; i++) {
        templateFiles[`template-${i}.hbs`] = `
<div
  class="very-long-class-name-that-exceeds-line-length-${i}"
  data-test="component-${i}">
  Bare string ${i}
</div>`;
      }

      await project.write({
        app: {
          templates: templateFiles,
        },
      });

      let result = await runBin('.');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toContain('Linting 105 Total Files with TemplateLint');
      expect(result.stdout).toContain('Processed 100 files per batch in 2 workers');
      // Should have errors from both rules
      expect(result.stdout).toContain('no-bare-strings');
      expect(result.stderr).toBeFalsy();
    });

    it('should handle ignore patterns with worker threads', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': 'error',
        },
      });

      const templateFiles = {};
      for (let i = 0; i < 105; i++) {
        templateFiles[`template-${i}.hbs`] = `<div>Bare string ${i}</div>`;
      }

      // Add some files that should be ignored
      templateFiles['ignored-1.hbs'] = '<div>This should be ignored</div>';
      templateFiles['ignored-2.hbs'] = '<div>This should be ignored too</div>';

      await project.write({
        app: {
          templates: templateFiles,
        },
      });

      // Use ignore pattern to exclude the ignored files
      let result = await runBin('.', '--ignore-pattern', '**/ignored-*.hbs');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toContain('Linting 105 Total Files with TemplateLint');
      expect(result.stdout).toContain('Processed 100 files per batch in 2 workers');
      // Should not mention ignored files
      expect(result.stdout).not.toContain('ignored-1.hbs');
      expect(result.stdout).not.toContain('ignored-2.hbs');
      expect(result.stderr).toBeFalsy();
    });
  });

  describe('worker thread todo handling', function () {
    it('should handle todo comments with worker threads', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': 'error',
        },
      });

      const templateFiles = {};
      for (let i = 0; i < 105; i++) {
        if (i < 50) {
          // First 50 files have todo comments
          templateFiles[`template-${i}.hbs`] =
            `{{! template-lint-disable no-bare-strings }}<div>Bare string ${i}</div>`;
        } else {
          // Rest have actual errors
          templateFiles[`template-${i}.hbs`] = `<div>Bare string ${i}</div>`;
        }
      }

      await project.write({
        app: {
          templates: templateFiles,
        },
      });

      let result = await runBin('.');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toContain('Linting 105 Total Files with TemplateLint');
      expect(result.stdout).toContain('Processed 100 files per batch in 2 workers');
      // Should have fewer errors due to disabled rules
      expect(result.stdout).toContain('✖ 55 problems (55 errors, 0 warnings)');
      expect(result.stderr).toBeFalsy();
    });
  });

  describe('worker thread integration with different file types', function () {
    it('should handle mixed file extensions with workers', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': 'error',
        },
      });

      const files = {};

      // Create mix of .hbs and .gts files
      for (let i = 0; i < 60; i++) {
        files[`template-${i}.hbs`] = `<div>Bare string ${i}</div>`;
      }

      for (let i = 60; i < 105; i++) {
        files[`component-${i}.gts`] = `
import Component from '@glimmer/component';

export default class TestComponent extends Component {
  <template>
    <div>Bare string ${i}</div>
  </template>
}`;
      }

      await project.write({
        app: {
          components: files,
        },
      });

      let result = await runBin('.');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toContain('Processed 100 files per batch in 2 workers');
      expect(result.stdout).toContain('Linting 105 Total Files with TemplateLint');
      expect(result.stdout).toContain('.hbs: 60');
      expect(result.stdout).toContain('.gts: 45');
      expect(result.stderr).toBeFalsy();
    });

    it('should maintain correct file paths across workers', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': 'error',
        },
      });

      // Create files in nested directory structure
      await project.write({
        app: {
          templates: {
            components: Object.fromEntries(
              Array.from({ length: 55 }, (_, i) => [
                `component-${i}.hbs`,
                `<div>Component ${i} error</div>`,
              ])
            ),
            pages: Object.fromEntries(
              Array.from({ length: 50 }, (_, i) => [`page-${i}.hbs`, `<div>Page ${i} error</div>`])
            ),
          },
        },
      });

      let result = await runBin('.');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toContain('Linting 105 Total Files with TemplateLint');
      expect(result.stdout).toContain('Processed 100 files per batch in 2 workers');

      // Verify correct file paths are shown
      expect(result.stdout).toContain('app/templates/components/component-0.hbs');
      expect(result.stdout).toContain('app/templates/pages/page-0.hbs');
      expect(result.stderr).toBeFalsy();
    });
  });

  describe('worker thread resource management', function () {
    it('should limit worker count based on CPU cores', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': 'error',
        },
      });

      // Create enough files to potentially spawn many workers
      const templateFiles = {};
      for (let i = 0; i < 500; i++) {
        templateFiles[`template-${i}.hbs`] = `<div>Bare string ${i}</div>`;
      }

      await project.write({
        app: {
          templates: templateFiles,
        },
      });

      let result = await runBin('.');

      expect(result.exitCode).toEqual(1);

      expect(result.stdout.split('\n').slice(0, 20).join('\n')).toMatch(
        /Processed \d+ files per batch in \d+ workers/
      );
      expect(result.stdout).toContain('Linting 500 Total Files with TemplateLint');
      expect(result.stdout).toContain('✖ 500 problems (500 errors, 0 warnings)');
      expect(result.stderr).toBeFalsy();
    });

    it('should handle worker batch size correctly', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': 'error',
        },
      });

      // Create exactly 200 files to test batch distribution
      const templateFiles = {};
      for (let i = 0; i < 200; i++) {
        templateFiles[`template-${i}.hbs`] = `<div>Bare string ${i}</div>`;
      }

      await project.write({
        app: {
          templates: templateFiles,
        },
      });

      let result = await runBin('.');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toContain(`Processed 100 files per batch in 2 workers`);
      expect(result.stdout).toContain('Linting 200 Total Files with TemplateLint');
      expect(result.stdout).toContain('✖ 200 problems (200 errors, 0 warnings)');
      expect(result.stderr).toBeFalsy();
    });
  });

  describe('worker thread edge cases', function () {
    it('should handle exactly the minimum file threshold', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': 'error',
        },
      });

      // Create exactly 100 files (the MIN_FILES_TO_USE_WORKERS threshold)
      const templateFiles = {};
      for (let i = 0; i < 100; i++) {
        templateFiles[`template-${i}.hbs`] = `<div>Bare string ${i}</div>`;
      }

      await project.write({
        app: {
          templates: templateFiles,
        },
      });

      let result = await runBin('.');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toContain('Linting 100 Total Files with TemplateLint');
      expect(result.stdout).not.toContain(`Processed`);
      expect(result.stdout).toContain('✖ 100 problems (100 errors, 0 warnings)');
      expect(result.stderr).toBeFalsy();
    });

    it('should handle one file over the threshold', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': 'error',
        },
      });

      // Create 101 files (just over the threshold)
      const templateFiles = {};
      for (let i = 0; i < 101; i++) {
        templateFiles[`template-${i}.hbs`] = `<div>Bare string ${i}</div>`;
      }

      await project.write({
        app: {
          templates: templateFiles,
        },
      });

      let result = await runBin('.');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toContain('Linting 101 Total Files with TemplateLint');
      expect(result.stdout).toContain('✖ 101 problems (101 errors, 0 warnings)');
      expect(result.stdout).toContain(`Processed 100 files per batch in 2 workers`);
      expect(result.stderr).toBeFalsy();
    });

    it('should handle empty files with workers', async function () {
      await project.setConfig({
        rules: {
          'no-bare-strings': 'error',
        },
      });

      const templateFiles = {};
      for (let i = 0; i < 105; i++) {
        if (i % 3 === 0) {
          // Every third file is empty
          templateFiles[`template-${i}.hbs`] = '';
        } else {
          templateFiles[`template-${i}.hbs`] = `<div>Bare string ${i}</div>`;
        }
      }

      await project.write({
        app: {
          templates: templateFiles,
        },
      });

      let result = await runBin('.');

      expect(result.exitCode).toEqual(1);
      expect(result.stdout).toContain('Linting 105 Total Files with TemplateLint');
      expect(result.stdout).toContain(`Processed 100 files per batch in 2 workers`);
      // Should have fewer errors due to empty files
      expect(result.stdout).toMatch(/✖ \d+ problems \(\d+ errors, 0 warnings\)/);
      expect(result.stderr).toBeFalsy();
    });
  });
});
