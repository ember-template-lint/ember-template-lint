## eol-last

Require or disallow newline at the end of files.

Enforce either (without newline at end):

```hbs
<div>test</div>
```

or this (with newline at end):

```hbs
<div>test</div>
{{! newline would be here }}
```

### Configuration

The following values are valid configuration:

  * "always" - enforces that files end with a newline
  * "editorconfig" - requires or disallows final newlines based your projects `.editorconfig` settings (via `insert_final_newline`)
  * "never" - enforces that files do not end with a newline'

### Related Rules

* [eol-last](https://eslint.org/docs/rules/eol-last) from eslint
