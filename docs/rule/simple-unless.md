## simple-unless (default === true)

This rule strongly advises against `{{unless}}` blocks used in conjunction with other
block helpers (e.g. `{{else}}`, `{{else if}}`), and template helpers.

For example, the rule forbids against the following:

``` hbs
{{! `if` template helper}}

{{unless (if true) "This is not recommended"}}
```

``` hbs
{{! `else` block}}

{{#unless bandwagoner}}
  Go Niners!
{{else}}
  Go Seahawks!
{{/unless}}
```

Common solutions are to use an `{{if}}` block, or refactor potentially confusing
logic within the template.

``` hbs
{{#if bandwagoner}}
  Go Blue Jays!
{{else}}
  Go Mariners!
{{/if}}
```

The following values are valid configuration:

  * boolean -- `true` for enabled / `false` for disabled
  * object --
    * `whitelist` -- array - `['or']` for specific helpers / `[]` for wildcard
    * `maxHelpers` -- number
