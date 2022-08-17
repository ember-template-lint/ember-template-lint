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

- attributeOrder: default [`arguments`, `attributes`, `modifiers`, `splattributes`]
  - [`attributes`] for curly invocation
- alphabetize: default `true` - `true` to enforce alphabetically ordered values within attributes

Note that the position of ...attributes is significant in that the other attributes will override or be overridden by anything in ...attributes depending on whether it comes before or after.

## Examples

This rule **forbids** the following (in the default ordering):

```hbs
<MyComponent ...attributes @name='Hello' />
```

```hbs
<MyComponent {{did-render this.someAction}} @name='Hello' />
```

```hbs
<MyComponent ...attributes {{did-render this.someAction}} />
```

```hbs
<MyComponent @b='1' a='2' />
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
