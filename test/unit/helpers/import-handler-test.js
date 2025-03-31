import { parseImports } from '../../../lib/helpers/import-handler.js';

describe('import-handler', function () {
  describe('parseImports', function () {
    const COMPONENTS = new Set(['Input', 'Textarea', 'LinkTo']);

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
  });
});
