## no-unused-block-params

This rule forbids unused block parameters except when they are needed to access a later parameter.

Forbidden (unused parameters):

``` hbs
{{#each users as |user index|}}
  {{user.name}}
{{/each}}
```

Allowed (used parameters):

``` hbs
{{#each users as |user|}}
  {{user.name}}
{{/each}}
```

``` hbs
{{#each users as |user index|}}
  {{index}} {{user.name}}
{{/each}}
```

Allowed (later parameter used):

``` hbs
{{#each users as |user index|}}
  {{index}}
{{/each}}
```
