Changelog
=========

## v0.5.5

- Fix invalid rule name in `recommended` configuration.
- Add ability to mark files as `pending` in the `.template-lintrc.js` configuration file.  When a module is listed in the `pending` list, it will be checked but any errors detected will be marked as warnings (and will not trigger a failing test when using ember-cli-template-lint). If there are no errors detected when checking a pending file, a new error will be triggered. The goal of this process is to allow large existing projects begin utilizing `ember-template-lint` / `ember-cli-template-lint` and slowly fix their template files to comply with the rules here.  Feedback welcome on this idea/process...

## v0.5.4

- Move rule configuration into `rules` property inside `.tempalte-lintrc.js`. Configuration in the root is still supported,
  but triggers a deprecation warning. Migration should be very straigtforward.

  Before:

  ```js
  // .template-lintrc.js
  module.exports = {
    'bare-strings': true
  }
  ```

  After:

  ```js
  // .template-lintrc.js
  module.exports = {
    rules: {
      'bare-strings': true
    }
  }
  ```

## v0.5.3

- Add ability to extend from internally managed configurations.
- Add `recommended` configuration, which can be used via the following in your `.template-lintrc.js`:

```js
module.exports = {
  extends: 'recommended'
}
```

## v0.5.2

- Add `fix` information to the results object for:
  - `html-comments`
  - `self-closing-void-elements`
  - `deprecated-each-syntax`
- Add support for context shifting `{{#each` (i.e. `{{#each posts}}`) to the `deprecated-each-syntax`.

## v0.5.1

- Bring back rules lost during migration from ember-cli-template-lint (deprecated-each, self-closing-void-elements).

## v0.5.0

- Initial migration of plugins from ember-cli-template-lint.
- Implement new node API for the Linter.
- Implement new result objects.
