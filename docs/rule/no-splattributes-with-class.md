# no-splattributes-with-class

This rule enforces that when using `...attributes` (spread attributes), you should not also use a `class` attribute. The `...attributes` syntax is used to forward HTML attributes from a parent component to a child component, and it already handles class merging automatically.

## Examples

This rule **forbids** the following:

```hbs
<div ...attributes class="foo">
  content
</div>
```

```hbs
<div class="foo" ...attributes>
  content
</div>
```

This rule **allows** the following:

```hbs
<div ...attributes>
  content
</div>
```

```hbs
<div class="foo">
  content
</div>
```

## Why?

When using `...attributes`, any classes passed from the parent component will be automatically merged with the component's own classes. Adding a `class` attribute alongside `...attributes` can lead to confusion about which classes take precedence and may result in unexpected styling behavior.

For example:

```hbs
{{!-- Parent component --}}
<MyComponent class="parent-class" />

{{!-- MyComponent template --}}
<div ...attributes class="child-class">
  {{!-- This is confusing: which class takes precedence? --}}
</div>
```

Instead, you should either:

1. Use `...attributes` alone to allow class merging from the parent
2. Use `class` alone if you want to enforce specific classes

## References

* [Splattributes](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/#toc_html-attributes) in the Ember.js guides
