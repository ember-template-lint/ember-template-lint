# eol-last

💅 The `extends: 'stylistic'` property in a configuration file enables this rule.

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

Require or disallow newline at the end of template files. This rule doesn't apply to embedded templates (e.g. a rendered template in a -test.js file).

## Examples

Enforce either (without newline at end):

```hbs
<div>test</div>
```

or this (with newline at end):

```hbs
<div>test</div>
{{! newline would be here  }}
```

## Configuration

The following values are valid configuration:

- "always" - enforces that template files end with a newline
- "editorconfig" - requires or disallows final newlines based your projects `.editorconfig` settings (via `insert_final_newline`)
- "never" - enforces that template files do not end with a newline'

## Related Rules

- [eol-last](https://eslint.org/docs/rules/eol-last) from eslint

## References

- [POSIX standard/line](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap03.html#tag_03_206)
- [Wikipedia/newline](https://en.wikipedia.org/wiki/Newline#Interpretation)
