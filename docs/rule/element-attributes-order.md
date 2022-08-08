# element-attributes-order

Element attributes must be ordered, by default the order is:

For angle bracket invocation syntax:

- arguments
- attributes
- element modifiers
- ...attributes
- ?attributes

For mustache/curly invoication syntax:

- attributes

## Configuration

The following values are valid configuration:

- attributeOrder: default [`arguments`, `attributes`, `modifiers`, `splattributes`]
  - [`attributes`] for curly invocation
- alphabetize: default `false` - `true` to enforce alphabetically ordered values within attributes

## Examples

This rule **forbids** the following:

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
