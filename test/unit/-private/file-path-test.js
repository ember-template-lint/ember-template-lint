import {
  parseFilePath,
  canProcessFile,
  processFile,
  isDTS,
} from '../../../lib/-private/file-path.js';
import { vi } from 'vitest';

describe('file-path', function () {
  describe('parseFilePath', function () {
    it('correctly parses .hbs file paths', function () {
      const { base, dir, ext, name } = parseFilePath('src/components/button.hbs');
      expect(base).toBe('button.hbs');
      expect(dir).toBe('src/components');
      expect(ext).toBe('.hbs');
      expect(name).toBe('button');
    });

    it('correctly parses nested .hbs file paths', function () {
      const { base, dir, ext, name } = parseFilePath(
        'app/templates/components/nested/path/button.hbs'
      );
      expect(base).toBe('button.hbs');
      expect(dir).toBe('app/templates/components/nested/path');
      expect(ext).toBe('.hbs');
      expect(name).toBe('button');
    });

    it('correctly parses compound .hbs file paths', function () {
      const { base, dir, ext, name } = parseFilePath('src/components/button.test.hbs');
      expect(base).toBe('button.test.hbs');
      expect(dir).toBe('src/components');
      expect(ext).toBe('.test.hbs');
      expect(name).toBe('button');
    });

    it('correctly parses deeply nested compound .hbs file paths', function () {
      const { base, dir, ext, name } = parseFilePath(
        'app/templates/components/button.special.test.hbs'
      );
      expect(base).toBe('button.special.test.hbs');
      expect(dir).toBe('app/templates/components');
      expect(ext).toBe('.special.test.hbs');
      expect(name).toBe('button');
    });
  });

  describe('canProcessFile', function () {
    it('returns false for empty file paths', function () {
      expect(canProcessFile('')).toBe(false);
      expect(canProcessFile(null)).toBe(false);
      expect(canProcessFile(undefined)).toBe(false);
    });

    it('returns true for .hbs files', function () {
      expect(canProcessFile('template.hbs')).toBe(true);
      expect(canProcessFile('path/to/template.hbs')).toBe(true);
      expect(canProcessFile('app/templates/components/button.hbs')).toBe(true);
    });

    it('returns true for compound .hbs files', function () {
      expect(canProcessFile('template.test.hbs')).toBe(true);
      expect(canProcessFile('path/to/template.special.hbs')).toBe(true);
      expect(canProcessFile('app/templates/components/button.test.hbs')).toBe(true);
      expect(canProcessFile('app/templates/components/button.special.test.hbs')).toBe(true);
    });

    it('returns true for other supported file types', function () {
      // Glimmer script files
      expect(canProcessFile('component.gjs')).toBe(true);
      expect(canProcessFile('component.gts')).toBe(true);

      // HTML files
      expect(canProcessFile('template.html')).toBe(true);

      // JavaScript and TypeScript files (soon deprecated)
      expect(canProcessFile('script.js')).toBe(true);
      expect(canProcessFile('script.ts')).toBe(true);

      // TypeScript declaration files
      expect(canProcessFile('types.d.ts')).toBe(true);
      expect(canProcessFile('app.css.d.ts')).toBe(true);
    });

    it('returns false for unsupported file extensions', function () {
      expect(canProcessFile('file.txt')).toBe(false);
      expect(canProcessFile('file.css')).toBe(false);
      expect(canProcessFile('file.json')).toBe(false);
      expect(canProcessFile('file.md')).toBe(false);
      expect(canProcessFile('file.xml')).toBe(false);
    });
  });

  describe('processFile', function () {
    it('execute script task .ts file has complex extension', async function () {
      const tasks = {
        template: vi.fn(),
        glimmerScript: vi.fn(),
        script: vi.fn().mockResolvedValue('template result'),
        default: vi.fn(),
      };

      const result = await processFile('image.helper.ts', tasks);
      expect(result).toBe('template result');
      expect(tasks.template).not.toHaveBeenCalled();
      expect(tasks.glimmerScript).not.toHaveBeenCalled();
      expect(tasks.script).toHaveBeenCalled();
      expect(tasks.default).not.toHaveBeenCalled();
    });
    it('processes .hbs files as templates', async function () {
      const tasks = {
        template: vi.fn().mockResolvedValue('template result'),
        glimmerScript: vi.fn(),
        script: vi.fn(),
        default: vi.fn(),
      };

      const result = await processFile('template.hbs', tasks);
      expect(result).toBe('template result');
      expect(tasks.template).toHaveBeenCalled();
      expect(tasks.glimmerScript).not.toHaveBeenCalled();
      expect(tasks.script).not.toHaveBeenCalled();
      expect(tasks.default).not.toHaveBeenCalled();
    });

    it('processes nested .hbs files as templates', async function () {
      const tasks = {
        template: vi.fn().mockResolvedValue('template result'),
        glimmerScript: vi.fn(),
        script: vi.fn(),
        default: vi.fn(),
      };

      const result = await processFile('app/templates/components/button.hbs', tasks);
      expect(result).toBe('template result');
      expect(tasks.template).toHaveBeenCalled();
      expect(tasks.glimmerScript).not.toHaveBeenCalled();
      expect(tasks.script).not.toHaveBeenCalled();
      expect(tasks.default).not.toHaveBeenCalled();
    });

    it('processes compound .hbs files as templates', async function () {
      const tasks = {
        template: vi.fn().mockResolvedValue('template result'),
        glimmerScript: vi.fn(),
        script: vi.fn(),
        default: vi.fn(),
      };

      const result = await processFile('app/templates/components/button.test.hbs', tasks);
      expect(result).toBe('template result');
      expect(tasks.template).toHaveBeenCalled();
      expect(tasks.glimmerScript).not.toHaveBeenCalled();
      expect(tasks.script).not.toHaveBeenCalled();
      expect(tasks.default).not.toHaveBeenCalled();
    });

    it('processes deeply nested compound .hbs files as templates', async function () {
      const tasks = {
        template: vi.fn().mockResolvedValue('template result'),
        glimmerScript: vi.fn(),
        script: vi.fn(),
        default: vi.fn(),
      };

      const result = await processFile('app/templates/components/button.special.test.hbs', tasks);
      expect(result).toBe('template result');
      expect(tasks.template).toHaveBeenCalled();
      expect(tasks.glimmerScript).not.toHaveBeenCalled();
      expect(tasks.script).not.toHaveBeenCalled();
      expect(tasks.default).not.toHaveBeenCalled();
    });
  });

  describe('isDTS', function () {
    it('matches extensions ending in .d.ts', () => {
      expect(isDTS('.d.ts')).toBe(true);
      expect(isDTS('.compound.d.ts')).toBe(true);
      expect(isDTS('.ts')).toBe(false);
      expect(isDTS('.d.js')).toBe(false);
    });
  });
});
