# no-yield-to-default

The `yield` keyword can be used for invoking blocks passed into a component. The `to` named argument specifies which of the blocks to yield too. Specifying `{{yield to="default"}}` is unnecessary, as that is the default behavior. Likewise, `{{has-block}}` and `{{has-block-params}}` also defaults to checking the "default" block.

This rule disallow yield to named blocks with the name "default".

## Examples

This rule **forbids** the following:

```hbs
{{yield to="default"}}
```

```hbs
{{has-block "default"}}
```

```hbs
{{has-block-params "default"}}
```

```hbs
{{hasBlock "default"}}
```

```hbs
{{hasBlockParams "default"}}
```

This rule **allows** the following:

```hbs
{{yield}}
```

```hbs
{{has-block}}
```

```hbs
{{has-block-params}}
```

```hbs
{{hasBlock}}
```

```hbs
{{hasBlockParams}}
```

## References
