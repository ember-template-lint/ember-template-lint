# no-duplicate-id

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

Valid HTML requires that `id` attribute values are unique.

This rule does a basic check to ensure that `id` attribute values are not the same.

## Examples

This rule **forbids** the following:

```hbs
<div id="id-00"></div><div id="id-00"></div>
```

This rule **allows** the following:

```hbs
<div id={{this.divId}}></div>
```

```hbs
<div id="concat-{{this.divId}}"></div>
```

```hbs
<MyComponent as |inputProperties|>
  <Input id={{inputProperties.id}} />
  <div id={{inputProperties.abc}} />
</MyComponent>

<MyComponent as |inputProperties|>
  <Input id={{inputProperties.id}} />
</MyComponent>
```

## Migration

For best results, it is recommended to generate `id` attribute values when they are needed, to ensure that they are not duplicates.

## References

* <https://www.w3.org/TR/2011/WD-html5-20110525/elements.html#the-id-attribute>
