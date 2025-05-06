# no-yield-block-params-to-else-inverse

Yielding to else block is mainly useful for supporting curly invocation syntax. However, the else block in curly invocation syntax does not support consuming block params.

## Examples

This rule **forbids** the following:

```hbs
{{yield "some" "param" to="else"}}
```

```hbs
{{yield "some" "param" to="inverse"}}
```

This rule **allows** the following:

```hbs
{{yield}}
{{yield to="else"}}
{{yield to="inverse"}}
```

## Migration

We need to remove block params from highlighted yield's and update application logic to not consume it.

In addition, we could use named blocks (slots) to provide values.

## References

- [Ember Guides – Block content](https://guides.emberjs.com/v5.5.0/components/block-content/)

## Related Rules

- [no-yield-only](no-yield-only.md)
- [no-yield-to-default](no-yield-to-default.md)
