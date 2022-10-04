# attributes-order

Element attributes must be ordered. By default, the order is:

- arguments
- attributes
- element modifiers
- ...attributes
- ?attributes

Note that this ordering only applies to angle bracket invocation syntax, as mustache/curly invocation syntax only includes a single type `attributes`.

## Configuration

The following values are valid configuration:

- attributeOrder: default [`arguments`, `attributes`, `modifiers`]
  - [`attributes`] for curly invocation
- alphabetize: default `true` - `true` to enforce alphabetically ordered values within attributes

Note that the position of ...attributes is significant in that the other attributes will override or be overridden by anything in ...attributes depending on whether it comes before or after.
For a particular node, if splattributes(...attributes) are already in the first position or last position then they will be left as-is and sorting will occur as normal. Nodes which contain splattributes that are surrounded by other attribute types cannot be ordered easily in a way that does not cause breakage and thus will not be checked.

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
