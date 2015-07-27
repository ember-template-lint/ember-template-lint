# ember-cli-template-lint

This addon allows you to move template compilation deprecations into browser deprecations. This is useful if you would like to use the `ember-cli-deprecation-workflow` addon or just to throw errors on template compilation deprecations (via `EmberENV.RAISE_ON_DEPRECATE` flag).

## Configuration

By default, the console based deprecations are suppressed in favor of browser deprecations ran during the test suite.  If you would prefer to still have the deprecations in the console, add
the following to your `config/environment.js`:

```javascript
module.exports = function(env) {
  var ENV = { };

  // normal things here

  ENV.logTemplateLintToConsole = true;
}
```

## Contributing

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
