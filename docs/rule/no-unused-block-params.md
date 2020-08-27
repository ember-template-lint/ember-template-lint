# no-unused-block-params

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

This rule forbids unused block parameters except when they are needed to access a later parameter.

## Examples

This rule **forbids** the following (unused parameters):

```hbs
{{#each users as |user index|}}
  {{user.name}}
{{/each}}
```

This rule **allows** the following:

Allowed (used parameters):

```hbs
{{#each users as |user|}}
  {{user.name}}
{{/each}}
```

```hbs
{{#each users as |user index|}}
  {{index}} {{user.name}}
{{/each}}
```

Allowed (later parameter used):

```hbs
{{#each users as |user index|}}
  {{index}}
{{/each}}
```

## Related rules

* [eslint/no-unused-vars](https://eslint.org/docs/rules/no-unused-vars)

## References

* [Ember guides/block content](https://guides.emberjs.com/release/components/block-content/)
* [rfcs/angle bracket invocation](https://emberjs.github.io/rfcs/0311-angle-bracket-invocation.html)
* [rfcs/named blocks](https://emberjs.github.io/rfcs/0226-named-blocks.html)
