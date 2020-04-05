# no-trailing-spaces

:dress: The `extends: 'stylistic'` property in a configuration file enables this rule.

Disallow trailing whitespace at the end of lines.

## Examples

This rule **forbids** the following:

```hbs
<div>test</div>//••
//•••••
```

This rule **allows** the following:

```hbs
<div>test</div>//
//
```

## Related Rules

* [no-trailing-spaces](https://eslint.org/docs/rules/no-trailing-spaces) from eslint
