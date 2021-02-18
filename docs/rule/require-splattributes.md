# require-splattributes

Splattributes (`...attributes`) make it possible to use attributes on component
invocations (e.g. `<SomeComponent class="blue">`). Forgetting to add
`...attributes` however makes it impossible to apply attributes like `class` to
a component.

This rule warns about templates that don't have `...attributes` in them.

Please note that this rule is only useful for Glimmer components or tagless
(`tagName: ''`) classic components, because regular classic components have
this functionality built into the root element, which is not part of their
templates.

This rule also should not be used for route/controller templates, because those
don't support `...attributes`. Instead of unconditionally enabling this rule in
your `.template-lintrc.js` file, you might want to consider using
[`overrides`](../overrides.md) to only enable it for component templates (see
below).

## Examples

This rule **forbids** the following:

```hbs
<div>
  component content
</div>
```

```hbs
<SomeOtherComponent>
  component content
</SomeOtherComponent>
```

This rule **allows** the following:

```hbs
<div ...attributes>
  component content
</div>
```

```hbs
<div class="foo">
  <SomeOtherComponent ...attributes />
</div>
```

## Example configuration

```javascript
module.exports = {
  extends: 'recommended',
  rules: {
    // ...
  },
  overrides: [
    {
      files: ['app/components/**/*.hbs'],
      rules: { 'require-splattributes': 'error' },
    },
  ],
};
```

## Migration

* Add `...attributes` on at least one element or component invocation in the template (usually the root element)
* Use `{{! template-lint-disable require-splattributes }}` where you explicitly don't want or need `...attributes`

## Related Rules

* [no-nested-splattributes](no-nested-splattributes.md)
* [splat-attributes-only](splat-attributes-only.md)

## References

* [Splattributes](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/#toc_html-attributes) in the Ember.js guides
