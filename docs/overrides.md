## Overrides support

You can tell the linter to override certain aspects for individual files or entire directories with the `overrides` option.

The overrides option would enable the user to do the following:

- Allows the user to pass an array exact modules/glob patterns
- Enable overriding of rules for a specific set of files
- Allows to change the severity of rules for a given file glob pattern

This option takes an array of objects where each object would support 3 keys:

- `files`: Array of glob patterns (that would either match the exact modules or glob-match multiple modules)
- `rules`: An object of lint rules that the user wants to override for the specific files
- `severity`: Specifies the level of severity for the overrides (1 -> `warning`, 2 -> `error`) (default is 2)


* **module** -- `'app/templates/exceptional-page'`
* **glob** -- `'app/templates/components/odd-ones/**'`

### Sample configuration

```javascript
'use strict';

module.exports = {
  extends: 'recommended',
  overrides: [
    {
      files: ['**/item-description/**/templates/components/**/*.hbs'],
      rules: {
        'no-implicit-this': true,
        'no-bare-strings': true
      },
      severity: 1
    },
    {
      files: ['**/item-main/**/templates/components/**/*.hbs'],
      rules: {
        'no-input-block': true,
      },
    },
  ],
};
```

```javascript

'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'no-bare-strings': true,
  },
  overrides: [
    {
      files: ['**/item-description/**/templates/components/**/*.hbs'],
      rules: {
        'no-implicit-this': true,
        'no-bare-strings': false
      },
      severity: 1
    },
  ],
};
```
