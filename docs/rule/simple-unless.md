# simple-unless

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

This rule strongly advises against `{{unless}}` blocks in the following situations:

* With other block helpers (e.g. `{{else}}`, `{{else if}}`)
* With template helpers in the condition

Common solutions are to use an `{{if}}` block, or refactor potentially confusing logic within the template.

## Examples

This rule **forbids** the following:

```hbs
{{!-- `unless` condition has a template helper  --}}

{{unless (if true) "This is not recommended"}}
```

```hbs
{{!-- `unless` statement has an `else` block  --}}

{{#unless bandwagoner}}
  Go Niners!
{{else}}
  Go Seahawks!
{{/unless}}
```

```hbs
{{!-- conditional statement has an `else unless` block  --}}

{{#if condition}}
  Hello
{{else unless otherCondition}}
  World
{{/unless}}
```

This rule **allows** the following:

```hbs
{{#if bandwagoner}}
  Go Blue Jays!
{{else}}
  Go Mariners!
{{/if}}
```

```hbs
{{#unless condition}}
  Hello World
{{/unless}}
```

## Configuration

The following values are valid configuration:

* boolean -- `true` for enabled / `false` for disabled
* object --
  * `allowlist` -- array - `['or']` for specific helpers / `[]` for wildcard
  * `whitelist` -- deprecated, use `allowlist`. If both are provided, `whitelist` will be ignored.
  * `denylist` -- array - `['or']` for specific helpers / `[]` for none
  * `blacklist` -- deprecated, use `denylist`. If both are provided, `blacklist` will be ignored.
  * `maxHelpers` -- number - use -1 for no limit

## Related Rules

* [no-negated-condition](no-negated-condition.md)

## References

* [Wikipedia/boolean algebra](https://en.wikipedia.org/wiki/Boolean_algebra)
