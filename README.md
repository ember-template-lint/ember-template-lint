# ember-cli-template-lint

[![Build Status](https://travis-ci.org/rwjblue/ember-cli-template-lint.svg?branch=master)](https://travis-ci.org/rwjblue/ember-cli-template-lint)

To install ember-cli-template-lint

```
ember install ember-cli-template-lint
```

Once installed, ember-cli-template-lint will add one test for each template
in an
application's codebase, and assert that all style rules are fulfilled. For example, given
the rule `bare-strings` is enabled, this template would be in violation:

```hbs
{{! app/components/my-thing/template.hbs }}
<div>A bare string</div>
```

Thus a the test `TemplateLint: app/components/my-thing/template.hbs` would
fail with the assertion "A bare string was found (0:5)".

This addon also allows you to move template compilation deprecations into browser
deprecations. This is useful if you would like to use the
`ember-cli-deprecation-workflow` addon or just to throw errors on template
compilation deprecations (via `EmberENV.RAISE_ON_DEPRECATE` flag).

## Configuration

By default, the console based deprecations are suppressed in favor of browser
deprecations ran during the test suite. If you would prefer to still have the
deprecations in the console, add the following to your `config/environment.js`:

```javascript
module.exports = function(env) {
  var ENV = { };

  // normal things here

  ENV.logTemplateLintToConsole = true;
}
```

Plugins are included by default. You can turn off plugins by toggling them in a
`.template-lintrc` file at the base of your project:

```javascript
module.exports = {
  'bare-strings': false
}
```

## Plugins
Checkout the `ext/plugins/index.js` for a list of all linting plugins.

## Contributing

A few ideas for where to take this in the future:

* The list of rules should be configurable
* This addon should use a test printer shared with jshint, eslint and jscs addons
* A command-line version of the linter should be provided so IDEs and editors
  can provide feedback to devs during development

### Installation

* `git clone` this repository
* `npm install`
* `bower install`

### Running

* `ember server`
* Visit your app at http://localhost:4200.

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
