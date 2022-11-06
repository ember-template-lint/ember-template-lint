# attributes-order

Element attributes must be ordered. By default, the order is:

- arguments
- attributes
- element modifiers

Note that this ordering only applies to angle bracket invocation syntax, as mustache/curly invocation syntax only includes a single type `attributes`.

## Configuration

The following values are valid configuration:

- boolean -- `true` to enable / `false` to disable
- object -- An object with the following keys:
  - `attributeOrder` -- An array of attribute types (defaults to `['arguments', 'attributes', 'modifiers']`
    - Note that curly component invocations will default to `['attributes']` since they don’t have other attribute types
- `alphabetize` -- `true` to enforce ordering attributes alphabetically (defaults to `true`)

Note that the position of `...attributes` (“splattributes”) is significant: attributes that appear _before_ `...attributes` can be overridden by values present in `...attributes` but attributes appearing _after_ `...attributes` will always take precedence and cannot be overridden by `...attributes`.
For this reason, nodes which contain `...attributes` surrounded by other attribute types cannot be safely reordered without causing breakages. If `...attributes` is the first or last attribute of a node however, it will be left as-is and sorting will occur as normal.

## Examples

This rule **forbids** the following (in the default ordering):

```hbs
<MyComponent data-test-id='Hello' @name='World' />
```

```hbs
<MyComponent {{did-render this.someAction}} @name='Hello' />
```

```hbs
<MyComponent {{did-render this.someAction}} data-test-id='World' />
```

```hbs
<MyComponent a='2' @b='1' />
```

This rule **allows** the following:

```hbs
<MyComponent @name='1' bar='baz' {{did-render this.someAction}} ...attributes aria-role='button' />
<MyComponent @name='1' aria-role='button' />
```

```hbs
<MyComponent @name='1' ...attributes />
<MyComponent @name='1' {{did-render this.someAction}} />
<MyComponent @name='1' bar='baz' />
```

## References

- [eslint-plugin-vue/rules/attributes-order](https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/attributes-order.md)
- [Ember guides on the `...attributes` syntax](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/#toc_html-attributes).)
