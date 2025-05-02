# no-nested-splattributes

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

Having `...attributes` on multiple elements nested within each other in a
component can cause unintended results.

This rule prevent you from running into this issue by disallowing
`...attributes` if any of the parent elements already has `...attributes` on it.

## Examples

This rule **forbids** the following:

```hbs
<div ...attributes>
  <div ...attributes>
    ...
  </div>
</div>
```

This rule **allows** the following:

```hbs
<div ...attributes>...</div>
<div ...attributes>...</div>
```

## Migration

- Remove the inner `...attributes` declaration

## References

- [rfcs/angle bracket invocation](https://emberjs.github.io/rfcs/0311-angle-bracket-invocation.html#html-attributes)
- [rfcs/modifier splattributes](https://emberjs.github.io/rfcs/0435-modifier-splattributes.html)
