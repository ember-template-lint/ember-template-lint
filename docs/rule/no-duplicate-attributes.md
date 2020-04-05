# no-duplicate-attributes

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

This rule forbids multiple attributes passed to a Component, Helper, or an ElementNode with the same name.

## Examples

This rule **forbids** the following:

```hbs
{{employee-details name=name age=age name=name}}
```

This rule **allows** the following:

```hbs
{{employee-details name=name age=age}}
```
