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
```
