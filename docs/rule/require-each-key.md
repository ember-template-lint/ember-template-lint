# require-each-key

You might be having huge performance issues when rendering large data-sets with `{{#each}}`

In order to avoid that, it is recommended to use `key` with `{{#each}}` because, Ember will not rerendering all items, but only the ones that actually needed to be updated.

This rule will require to always use `key` with `{{#each}}`.

## Examples

This rule **forbids** the following:

```hbs
{{#each this.items as |item|}}
  {{item.name}}
{{/each}}
```

```hbs
{{#each this.items key="@invalid" as |item|}}
  {{item.name}}
{{/each}}
```

This rule **allows** the following:

```hbs
{{#each this.items key="id" as |item|}}
  {{item.name}}
{{/each}}
```

```hbs
{{#each this.items key="deeply.nested.id" as |item|}}
  {{item.name}}
{{/each}}
```

```hbs
{{#each this.items key="@index" as |item|}}
  {{item.name}}
{{/each}}
```

```hbs
{{#each this.items key="@identity" as |item|}}
  {{item.name}}
{{/each}}
```

## References

* [Specifying Keys](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each#specifying-keys)
* [The Immutable Pattern in Tracked Properties](https://glimmerjs.com/guides/tracked-properties)
