import { parseImports, clearImportCache } from '../../../lib/helpers/import-handler.js';

describe('import-handler', function () {
  describe('parseImports', function () {
    const COMPONENTS = new Set(['Input', 'Textarea', 'LinkTo']);

    beforeEach(() => {
      clearImportCache();
    });

    it('parses direct imports from @ember/component', function () {
      const source = `
        import { Input, Textarea } from '@ember/component';
      `;

      const result = parseImports(source, COMPONENTS);

      expect(result.size).toBe(2);
      expect(result.get('Input')).toBe('Input');
      expect(result.get('Textarea')).toBe('Textarea');
    });

    it('parses aliased imports from @ember/component', function () {
      const source = `
        import { Input as CustomInput, Textarea as CustomTextarea } from '@ember/component';
      `;

      const result = parseImports(source, COMPONENTS);

      expect(result.size).toBe(2);
      expect(result.get('CustomInput')).toBe('Input');
      expect(result.get('CustomTextarea')).toBe('Textarea');
    });

    it('parses imports from @ember/routing', function () {
      const source = `
        import { LinkTo } from '@ember/routing';
      `;

      const result = parseImports(source, COMPONENTS);

      expect(result.size).toBe(1);
      expect(result.get('LinkTo')).toBe('LinkTo');
    });

    it('parses aliased imports from @ember/routing', function () {
      const source = `
        import { LinkTo as CustomLink } from '@ember/routing';
      `;

      const result = parseImports(source, COMPONENTS);

      expect(result.size).toBe(1);
      expect(result.get('CustomLink')).toBe('LinkTo');
    });

    it('handles mixed imports from both modules', function () {
      const source = `
        import { Input } from '@ember/component';
        import { LinkTo as CustomLink } from '@ember/routing';
      `;

      const result = parseImports(source, COMPONENTS);

      expect(result.size).toBe(2);
      expect(result.get('Input')).toBe('Input');
      expect(result.get('CustomLink')).toBe('LinkTo');
    });

    it('ignores imports not in the component set', function () {
      const source = `
        import { Component, Input, Textarea, LinkTo } from '@ember/component';
      `;

      const result = parseImports(source, COMPONENTS);

      expect(result.size).toBe(2);
      expect(result.get('Input')).toBe('Input');
      expect(result.get('Textarea')).toBe('Textarea');
      expect(result.has('Component')).toBe(false);
    });

    it('handles malformed imports gracefully', function () {
      const source = `
        import { Input, Textarea from '@ember/component';
        import { LinkTo as } from '@ember/routing';
      `;

      const result = parseImports(source, COMPONENTS);

      expect(result.size).toBe(0);
    });

    it('returns empty map when no imports match', function () {
      const source = `
        import { Component } from '@ember/component';
        import { Router } from '@ember/routing';
      `;

      const result = parseImports(source, COMPONENTS);

      expect(result.size).toBe(0);
    });

    describe('caching', () => {
      it('caches results when filePath is provided', function () {
        const source = `
          import { Input, Textarea } from '@ember/component';
        `;
        const filePath = 'app/components/my-component.js';

        // First call should parse
        const result1 = parseImports(source, COMPONENTS, filePath);
        expect(result1.size).toBe(2);

        // Second call should use cache
        const result2 = parseImports(source, COMPONENTS, filePath);
        expect(result2.size).toBe(2);
        expect(result2.get('Input')).toBe('Input');
        expect(result2.get('Textarea')).toBe('Textarea');
      });

      it('invalidates cache when source changes', function () {
        const source1 = `
          import { Input } from '@ember/component';
        `;
        const source2 = `
          import { Textarea } from '@ember/component';
        `;
        const filePath = 'app/components/my-component.js';

        // First call with source1
        const result1 = parseImports(source1, COMPONENTS, filePath);
        expect(result1.size).toBe(1);
        expect(result1.get('Input')).toBe('Input');

        // Second call with source2 should parse again
        const result2 = parseImports(source2, COMPONENTS, filePath);
        expect(result2.size).toBe(1);
        expect(result2.get('Textarea')).toBe('Textarea');
      });

      it('does not cache when filePath is not provided', function () {
        const source = `
          import { Input } from '@ember/component';
        `;

        // Both calls should parse
        const result1 = parseImports(source, COMPONENTS);
        const result2 = parseImports(source, COMPONENTS);

        expect(result1.size).toBe(1);
        expect(result2.size).toBe(1);
      });

      it('clears specific file from cache', function () {
        const source = `
          import { Input } from '@ember/component';
        `;
        const filePath = 'app/components/my-component.js';

        // First call should parse and cache
        parseImports(source, COMPONENTS, filePath);

        // Clear cache for this file
        clearImportCache(filePath);

        // Should parse again
        const result = parseImports(source, COMPONENTS, filePath);
        expect(result.size).toBe(1);
        expect(result.get('Input')).toBe('Input');
      });

      it('clears entire cache', function () {
        const source1 = `
          import { Input } from '@ember/component';
        `;
        const source2 = `
          import { Textarea } from '@ember/component';
        `;
        const filePath1 = 'app/components/component1.js';
        const filePath2 = 'app/components/component2.js';

        // Cache two different files
        parseImports(source1, COMPONENTS, filePath1);
        parseImports(source2, COMPONENTS, filePath2);

        // Clear entire cache
        clearImportCache();

        // Both should parse again
        const result1 = parseImports(source1, COMPONENTS, filePath1);
        const result2 = parseImports(source2, COMPONENTS, filePath2);

        expect(result1.size).toBe(1);
        expect(result2.size).toBe(1);
      });
    });
  });
});
