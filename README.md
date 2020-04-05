# ember-template-lint

[![npm version](https://badge.fury.io/js/ember-template-lint.svg)](https://badge.fury.io/js/ember-template-lint)
[![Build Status](https://github.com/ember-template-lint/ember-template-lint/workflows/CI/badge.svg)](https://github.com/ember-template-lint/ember-template-lint/actions?query=workflow%3ACI)

ember-template-lint will lint your template and return error results.

For example, given the rule [`no-bare-strings`](docs/rule/no-bare-strings.md) is enabled, this template would be
in violation:

```hbs
{{!-- app/components/my-thing/template.hbs  --}}
<div>A bare string</div>
```

When ran through the linter's `verify` method, we would have a single result indicating that
the `no-bare-strings` rule found an error.

## Install

To install ember-template-lint

```shell
npm install --save-dev ember-template-lint
```

Node.js `10 || 12 || 13` is required.

## Usage

### Direct usage

Run templates through the linter's `verify` method like so:

```js
var TemplateLinter = require('ember-template-lint');

var linter = new TemplateLinter();
var template = fs.readFileSync('some/path/to/template.hbs', { encoding: 'utf8' });
var results = linter.verify({ source: template, moduleId: 'template.hbs' });
```

`results` will be an array of objects which have the following properties:

* `rule` - The name of the rule that triggered this warning/error.
* `message` - The message that should be output.
* `line` - The line on which the error occurred.
* `column` - The column on which the error occurred.
* `moduleId` - The module path for the file containing the error.
* `source` - The source that caused the error.
* `fix` - An object describing how to fix the error.

### CLI executable

Basic `ember-template-lint` executable is provided, allowing for easy use within i.e. Git pre-commit/push hooks and development of appropriate plugins for text editors.

Example usage:

```bash
# basic usage
./node_modules/.bin/ember-template-lint app/templates/application.hbs

# output errors with source description
./node_modules/.bin/ember-template-lint app/templates/application.hbs --verbose

# multiple file/directory/wildcard paths are accepted
./node_modules/.bin/ember-template-lint app/templates/components/**/* app/templates/application.hbs

# output errors as pretty-printed JSON string
./node_modules/.bin/ember-template-lint app/templates/application.hbs --json

# ignore warnings / only report errors
./node_modules/.bin/ember-template-lint app/templates/application.hbs --quiet

# define custom config path
./node_modules/.bin/ember-template-lint app/templates/application.hbs --config-path .my-template-lintrc.js

# read from stdin
./node_modules/.bin/ember-template-lint --filename app/templates/application.hbs < app/templates/application.hbs

# print list of formated rules for use with `pending` in config file
./node_modules/.bin/ember-template-lint app/templates/application.hbs --print-pending

# specify custom ignore pattern `['**/dist/**', '**/tmp/**', '**/node_modules/**']` by default
./node_modules/.bin/ember-template-lint /tmp/template.hbs --ignore-pattern "**/foo/**" --ignore-pattern "**/bar/**"

# disable ignore pattern entirely
./node_modules/.bin/ember-template-lint /tmp/template.hbs --no-ignore-pattern
```

### ESLint

If you are using templates inlined into your JS files, you can leverage
[eslint-plugin-hbs](https://github.com/psbanka/eslint-plugin-hbs) to integrate
ember-template-lint into your normal eslint workflow.

## Configuration

### Presets

|    | Name   | Description |
|:---|:-----|:------------|
| :white_check_mark: | [recommended](lib/config/recommended.js) | enables the recommended rules |
| :car: | [octane](lib/config/octane.js) | extends the `recommended` preset by enabling Ember Octane rules |
| :dress: | [stylistic](lib/config/stylistic.js) | enables stylistic rules for those who aren't ready to adopt [ember-template-lint-plugin-prettier](https://github.com/ember-template-lint/ember-template-lint-plugin-prettier) (including stylistic rules that were previously in the `recommended` preset in ember-template-lint v1) |

### Project Wide

You can turn on specific rules by toggling them in a
`.template-lintrc.js` file at the base of your project, or at a custom relative
path which may be identified using the CLI:

```javascript
module.exports = {
  extends: 'recommended',

  rules: {
    'no-bare-strings': true
  }
}
```

This extends from the builtin recommended configuration ([lib/config/recommended.js](lib/config/recommended.js)),
and also enables the `no-bare-strings` rule (see [here](docs/rule/no-bare-strings.md)).

Using this mechanism allows you to extend from the builtin, and modify specific rules as needed.

Some rules also allow setting additional configuration, for example if you would like to configure
some "bare strings" that are allowed you might have:

```javascript
module.exports = {
  rules: {
    'no-bare-strings': ['ZOMG THIS IS ALLOWED!!!!']
  }
};
```

### Configuration Keys

The following properties are allowed in the root of the `.template-lintrc.js` configuration file:

* `rules` -- `Object`
  This is an object containing rule specific configuration (see details for each rule below).
* `extends` -- `string|string[]`
  Either a string or an array of strings. Each string allows you to specify an internally curated list of rules (we suggest `recommended` here).
* `pending` -- `string[]`
  An array of module id's that are still pending. The goal of this array is to allow incorporating template linting
  into an existing project, without changing every single template file. You can add all existing templates to this `pending` listing
  and slowly work through them, while at the same time ensuring that new templates added to the project pass all defined rules.
  * You can generate this list with the: `./node_modules/.bin/ember-template-lint * --print-pending`
* `ignore` -- `string[]|glob[]`
  An array of module id's that are to be completely ignored. See [ignore documentation](docs/ignore.md) for more details.
* `plugins` -- `(string|Object)[]`
  An array of plugin objects, or strings that resolve to files that export plugin objects. See [plugin documentation](docs/plugins.md) for more details.
* `overrides` -- `Array`
  An array of overrides that would allow overriding of specific rules for user specified files/folders. See [overrides documentation](docs/overrides.md) for more details.

## Rules

Each rule can have its own severity level which can be a string or could be the first element of the array that contains the custom rule configuration.
Supported severity levels are `off`, `warn`, `error`.
You can define a severity level directly on the rule:
Eg: `'no-bare-strings': 'warn'`
OR
If your rule has a custom configuration, and you want to define the severity level you would need to add the `severity` as the first element of the array.
Eg:

```js
{
   "no-implicit-this": ['warn', { "allow": [ "fooData" ] }
}
```

Current list of rules and deprecations can be found in [docs/rules.md](docs/rules.md).

### Per Template File

It is also possible to disable specific rules (or all rules) in a template itself:

```hbs
<!-- disable all rules -->
{{!-- template-lint-disable  --}}

<!-- disable no-bare-strings -->
{{!-- template-lint-disable no-bare-strings  --}}

<!-- disable no-bare-strings and no-triple-curlies -->
{{!-- template-lint-disable no-bare-strings no-triple-curlies  --}}

<!-- enable all rules -->
{{!-- template-lint-enable  --}}

<!-- enable no-bare-strings -->
{{!-- template-lint-enable no-bare-strings  --}}

<!-- enable no-bare-strings and no-triple-curlies -->
{{!-- template-lint-enable no-bare-strings no-triple-curlies  --}}
```

and to configure rules in the template:

```hbs
{{!-- template-lint-configure no-bare-strings ["ZOMG THIS IS ALLOWED!!!!"]  --}}

{{!-- template-lint-configure no-bare-strings {"whitelist": "(),.", "globalAttributes": ["title"]}  --}}

{{!-- template-lint-configure no-bare-strings ["warn", ["ZOMG THIS IS ALLOWED!!!!"]]  --}}

{{!-- template-lint-configure no-bare-strings "warn"  --}}

```

The configure instruction can only configure a single rule, and the configuration value must be valid JSON that parses into a configuration for that rule.

These configuration instructions do not modify the rule for the rest of the template, but instead modify it within whatever DOM scope the comment instruction appears.

An instruction will apply to all later siblings and their descendants:

```hbs
<!-- disable for <p> and <span> and their contents, but not for <div> or <hr> -->
<div>
  <hr>
  {{!-- template-lint-disable  --}}
  <p>
    <span>Hello!</span>
  </p>
</div>
```

An in-element instruction will apply to only that element:

```hbs
<!-- enable for <p>, but not for <div>, <hr> or <span> -->
<div>
  <hr>
  <p {{!-- template-lint-enable  --}}>
    <span>Hello!</span>
  </p>
</div>
```

An in-element instruction with the `-tree` suffix will apply to that element and all its descendants:

```hbs
<!-- configure for <p>, <span> and their contents, but not for <div> or <hr> -->
<div>
  <hr>
  <p {{!-- template-lint-configure-tree block-indentation "tab"  --}}>
    <span>Hello!</span>
  </p>
</div>
```

Note that enabling a rule (`{{!-- template-lint-enable --}}`) that has been configured in-template (`{{!-- template-lint-configure --}}`), will restore it to its default configuration rather than the modified in-template configuration for the scope of the `{{!-- template-lint-enable --}}` instruction.

### Defining your own rules

You can define and use your own custom rules using the plugin system. See [plugin documentation](docs/plugins.md) for more details.

### Sharing configs

It is possible to share a config (`extends`) or plugin (custom rules) across projects. See [ember-template-lint-plugin-peopleconnect](https://github.com/peopleconnectus/ember-template-lint-plugin-peopleconnect) for an example.

## Semantic Versioning Policy

The semver policy for this addon can be read here: [semver policy](dev/versioning.md).

## Contributing

A few ideas for where to take this in the future:

* The list of rules should be configurable
* This addon should use a test printer shared with jshint, eslint and jscs addons
* A command-line version of the linter should be provided so IDEs and editors
  can provide feedback to devs during development

See the [Contributing Guidelines](CONTRIBUTING.md) for information on how to help out.
