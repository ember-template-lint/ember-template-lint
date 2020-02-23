## Overrides support

You can tell the linter to override certain aspects for individual files or entire directories with the `overrides` option.

The overrides option would enable the user to do the following:

- Allows the user to pass an array exact modules/glob patterns
- Enable overriding of rules for a specific set of files

This option takes an array of objects where each object would support 2 keys:

- `files`: Array of glob patterns (that would either match the exact modules or glob-match multiple modules)
- `rules`: An object of lint rules that the user wants to override for the specific files

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
        'no-implicit-this': 'warn',
        'no-bare-strings': true,
      },
    },
    {
      files: ['**/item-main/**/templates/components/**/*.hbs'],
      rules: {
        'no-input-block': 'error',
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
        'no-implicit-this': {
          severity: 'warn',
          config: {
            allow: ['fooData'],
          },
        },
        'no-bare-strings': {
          severity: 'off'
        },
      },
    },
  ],
};
```
