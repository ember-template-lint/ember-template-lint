## no-duplicate-attributes

This rule forbids multiple attributes passed to a Component, Helper or an ElementNode with the same name.

For Instance:

Forbidden (multiple attributes with the same name):

```hbs
{{employee-details name=name age=age name=name}}
```

Allowed:

```hbs
{{employee-details name=name age=age}}
```

This rule is configured with one boolean value:

  * boolean -- `true` for enabled / `false` for disabled
