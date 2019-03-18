## Ignore support

You can tell the linter to ignore individual files or entire directories with the `ignore` option.

The ignore option takes an array of strings that either match exact modules or glob-match multiple modules.

* **module** -- `'app/templates/exceptional-page'`
* **glob** -- `'app/templates/components/odd-ones/**'`

### Sample configuration

```javascript
module.exports = {
  extends: 'recommended',

  ignore: [
    'project-name/templates/login',
    'project-name/templates/components/odd-ones/**',
    'app/templates/login',
    'app/templates/components/odd-ones/**',
  ]
};
```

### Why are patterns duplicated?

You may have noticed in the sample configuration that the four patterns are actually two patterns repeated with different prefixes.

This is because `ember-template-lint` needs to work with eslint's filesystem resolver as well
as Ember's module resolver. The `app/...` patterns match the filesystem (app directory). The `project-name/...` patterns match Ember's resolver (`ENV.modulePrefix` in `config/environment.js`).

After [Module Unification](https://github.com/emberjs/ember.js/issues/16373), Ember's internal resolver will match the filesystem, so ignore patterns will no longer need to be repeated.