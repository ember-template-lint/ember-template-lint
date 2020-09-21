# require-each-key

In order to improve rendering speed, Ember will try to reuse the DOM elements where possible. Specifically, if the same item is present in the array both before and after the change, its DOM output will be reused.

The key option is used to tell Ember how to determine if the items in the array being iterated over with {{#each}} has changed between renders. By default the item's object identity is used.

This is usually sufficient, so in most cases, the key option is simply not needed. However, in some rare cases, the objects' identities may change even though they represent the same underlying data.

For example:

```js
people.map(person => {
  return { ...person, type: 'developer' };
});
```

In this case, each time the people array is map-ed over, it will produce an new array with completely different objects between renders. In these cases, you can help Ember determine how these objects related to each other with the key option:

```hbs
<ul>
  {{#each @developers key="name" as |person|}}
    <li>Hello, {{person.name}}!</li>
  {{/each}}
</ul>
```

By doing so, Ember will use the value of the property specified (person.name in the example) to find a "match" from the previous render. That is, if Ember has previously seen an object from the @developers array with a matching name, its DOM elements will be re-used.

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

```hbs
{{#each this.items key="" as |item|}}
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
