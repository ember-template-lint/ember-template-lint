# no-side-known-syntax

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

Rule to warn about usage of unsupported template syntax from other frameworks and libraries.

## Examples

This rule **forbids** the following:

```hbs
<h1 v-if="awesome">Vue is awesome!</h1>
```

```hbs
<div *[ngIf]="condition">Content to render when condition is true.</div>

```

This rule **allows** the following:

```hbs
{{#if awesome}}
  <h1>Vue is awesome!</h1>
{{/if}}
```

```hbs
{{#if condition}}
  <div>Content to render when condition is true.</div>
{{/if}}
```

## Migration

To properly use Ember template syntax, check out related documentation
- [Templates are HTML](https://guides.emberjs.com/release/components/)
- [Introducing Components](https://guides.emberjs.com/release/components/introducing-components/)
- [Component Arguments and HTML Attributes](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/)
- [Conditional Content](https://guides.emberjs.com/release/components/conditional-content/)
- [Block Content](https://guides.emberjs.com/release/components/block-content/)
- [Helper Functions](https://guides.emberjs.com/release/components/helper-functions/)
- [Looping Through Lists](https://guides.emberjs.com/release/components/looping-through-lists/)

## Related Rules

- [no-jsx-attributes](no-jsx-attributes.md)
- [no-unknown-arguments-for-builtin-components](no-unknown-arguments-for-builtin-components.md)

## References

- [Vue Documentation](https://vuejs.org/guide/introduction.html)
- [Angular Templates Documentation](https://v17.angular.io/guide/template-overview)
- [Lit Element Documentation](https://lit.dev/docs/v1/components/templates/)
