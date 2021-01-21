# no-trailing-spaces

:nail_care: The `extends: 'stylistic'` property in a configuration file enables this rule.

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

## References

* [git/formatting and whitespace](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration#_formatting_and_whitespace)
