# no-yield-only

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

Templates that only contain a single `{{yield}}` instruction are not required
and increase the total template payload size.

This rule warns about templates that only contain a single `{{yield}}`
instruction.

## Examples

This rule **forbids** the following:

```hbs
{{yield}}
```

```hbs

   {{yield}}


```

This rule **allows** the following:

```hbs
{{yield something}}
```

```hbs
<div>{{yield}}</div>
```

## Migration

* delete all files that are flagged by this rule

## References

* <https://github.com/ember-template-lint/ember-template-lint/issues/29>
