## no-trailing-dot-in-path-expression

This rule doesn't allow trailing dot(s) on a path expression.

Forbidden:

```hbs

{{contact.contact_name.}}

{{#if contact.contact_name.}}
  {{displayName}}
{{/if}}

{{if. contact.contact_name}}
  {{displayName}}
{{/if}}

{{contact-details contact=(hash. name=name. age=age)}}
```

Allowed:

```hbs

{{contact.contact_name}}

{{#if contact.contact_name}}
  {{displayName}}
{{/if}}

{{if contact.contact_name}}
  {{displayName}}
{{/if}}

{{contact-details contact=(hash name=name age=age)}}
```

This rule is configured with one boolean value:

  * boolean - `true` for enabled / `false` for disabled
