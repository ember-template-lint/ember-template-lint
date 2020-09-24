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

This addon is installed by default with new Ember apps, so check your package.json before installing to see if you need to install it.

To install ember-template-lint

```shell
npm install --save-dev ember-template-lint
```

Node.js `10 || >=12` is required.

## Usage

### Direct usage

Run templates through the linter's `verify` method like so:

```js
let TemplateLinter = require('ember-template-lint');

let linter = new TemplateLinter();
let template = fs.readFileSync('some/path/to/template.hbs', {
  encoding: 'utf8',
});
let results = linter.verify({ source: template, moduleId: 'template.hbs' });
```

`results` will be an array of objects which have the following properties:

- `rule` - The name of the rule that triggered this warning/error.
- `message` - The message that should be output.
- `line` - The line on which the error occurred.
- `column` - The column on which the error occurred.
- `moduleId` - The module path for the file containing the error.
- `source` - The source that caused the error.
- `fix` - An object describing how to fix the error.

### CLI executable

Basic `ember-template-lint` executable is provided, allowing for easy use within i.e. Git pre-commit/push hooks and development of appropriate plugins for text editors.

> Ensure you wrap all glob patterns in quotes so that it won't be interpreted by the CLI. `yarn ember-template-lint app/templates/**` (this will expand all paths in app/templates) and `yarn ember-template-lint "app/templates/**"` (this will pass the glob to ember-template-lint and not interpret the glob).

**Important** note for those running `ember-template-lint` in Github Actions:
There is an additional printer always used for Github Actions, if you'd like to disable it set the `DISABLE_GITHUB_ACTIONS_ANNOTATIONS` env var to `true`.

Example usage:

```bash
# basic usage
yarn ember-template-lint "app/templates/application.hbs"

# output errors with source description
yarn ember-template-lint "app/templates/application.hbs" --verbose

# multiple file/directory/wildcard paths are accepted
yarn ember-template-lint "app/templates/components/**/*" "app/templates/application.hbs"

# output errors as pretty-printed JSON string
yarn ember-template-lint "app/templates/application.hbs" --json

# ignore warnings / only report errors
yarn ember-template-lint "app/templates/application.hbs" --quiet

# define custom config path
yarn ember-template-lint "app/templates/application.hbs" --config-path .my-template-lintrc.js

# read from stdin
yarn ember-template-lint --filename app/templates/application.hbs < app/templates/application.hbs

# print list of formatted rules for use with `pending` in config file
yarn ember-template-lint "app/templates/application.hbs" --print-pending

# specify custom ignore pattern `['**/dist/**', '**/tmp/**', '**/node_modules/**']` by default
yarn ember-template-lint "/tmp/template.hbs" --ignore-pattern "**/foo/**" --ignore-pattern "**/bar/**"

# disable ignore pattern entirely
yarn ember-template-lint "/tmp/template.hbs" --no-ignore-pattern

# running a single rule without options
yarn ember-template-lint --no-config-path app/templates --rule 'no-implicit-this:error'

# running a single rule with options
yarn ember-template-lint --no-config-path app/templates --rule 'no-implicit-this:["error", { "allow": ["some-helper"] }]'

# running a single rule, disabling inline configuration
yarn ember-template-lint --no-config-path app/templates --rule 'no-implicit-this:error' --no-inline-config

# specify a config object to use instead of what exists locally
yarn ember-template-lint --config '{ "rules": { "no-implicit-this": { "severity": 2, "config": true } } }' test/fixtures/no-implicit-this-allow-with-regexp/app/templates

# disable Github Actions custom printer (only relevant when running in Github Actions)
DISABLE_GITHUB_ACTIONS_ANNOTATIONS=true yarn ember-template-lint "app/templates/application.hbs"
```

### ESLint

If you are using templates inlined into your JS files, you can leverage
[eslint-plugin-hbs](https://github.com/psbanka/eslint-plugin-hbs) to integrate
ember-template-lint into your normal eslint workflow.

## Configuration

### Project Wide

You can turn on specific rules by toggling them in a
`.template-lintrc.js` file at the base of your project, or at a custom relative
path which may be identified using the CLI:

```javascript
module.exports = {
  extends: 'recommended',

  rules: {
    'no-bare-strings': true,
  },
};
```

This extends from the builtin recommended configuration ([lib/config/recommended.js](lib/config/recommended.js)),
and also enables the `no-bare-strings` rule (see [here](docs/rule/no-bare-strings.md)).

Using this mechanism allows you to extend from the builtin, and modify specific rules as needed.

Some rules also allow setting additional configuration, for example if you would like to configure
some "bare strings" that are allowed you might have:

```javascript
module.exports = {
  rules: {
    'no-bare-strings': ['ZOMG THIS IS ALLOWED!!!!'],
  },
};
```

### Configuration Keys

The following properties are allowed in the root of the `.template-lintrc.js` configuration file:

- `rules` -- `Object`
  This is an object containing rule specific configuration (see details for each rule below).
- `extends` -- `string|string[]`
  Either a string or an array of strings. Each string allows you to specify an internally curated list of rules (we suggest `recommended` here).
- `pending` -- `string[]`
  An array of module id's that are still pending. The goal of this array is to allow incorporating template linting
  into an existing project, without changing every single template file. You can add all existing templates to this `pending` listing
  and slowly work through them, while at the same time ensuring that new templates added to the project pass all defined rules.
  - You can generate this list with the: `yarn ember-template-lint * --print-pending`
- `ignore` -- `string[]|glob[]`
  An array of module id's that are to be completely ignored. See [ignore documentation](docs/ignore.md) for more details.
- `plugins` -- `(string|Object)[]`
  An array of plugin objects, or strings that resolve to files that export plugin objects. See [plugin documentation](docs/plugins.md) for more details.
- `overrides` -- `Array`
  An array of overrides that would allow overriding of specific rules for user specified files/folders. See [overrides documentation](docs/overrides.md) for more details.

### Presets

|                    | Name                                     | Description                                                                                                                                                                                                                                                                          |
| :----------------- | :--------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| :white_check_mark: | [recommended](lib/config/recommended.js) | enables the recommended rules                                                                                                                                                                                                                                                        |
| :car:              | [octane](lib/config/octane.js)           | extends the `recommended` preset by enabling Ember Octane rules                                                                                                                                                                                                                      |
| :dress:            | [stylistic](lib/config/stylistic.js)     | enables stylistic rules for those who aren't ready to adopt [ember-template-lint-plugin-prettier](https://github.com/ember-template-lint/ember-template-lint-plugin-prettier) (including stylistic rules that were previously in the `recommended` preset in ember-template-lint v1) |

## Rules

Each rule has emojis denoting:

- what configuration it belongs to
- :wrench: if some problems reported by the rule are automatically fixable by the `--fix` command line option

<!--RULES_TABLE_START-->

|                            | Rule ID                                                                               |
| :------------------------- | :------------------------------------------------------------------------------------ |
|                            | [attribute-indentation](./docs/rule/attribute-indentation.md)                         |
| :dress:                    | [block-indentation](./docs/rule/block-indentation.md)                                 |
|                            | [builtin-component-arguments](./docs/rule/builtin-component-arguments.md)             |
|                            | [deprecated-each-syntax](./docs/rule/deprecated-each-syntax.md)                       |
|                            | [deprecated-inline-view-helper](./docs/rule/deprecated-inline-view-helper.md)         |
| :white_check_mark:         | [deprecated-render-helper](./docs/rule/deprecated-render-helper.md)                   |
| :dress:                    | [eol-last](./docs/rule/eol-last.md)                                                   |
| :wrench:                   | [inline-link-to](./docs/rule/inline-link-to.md)                                       |
| :dress:                    | [linebreak-style](./docs/rule/linebreak-style.md)                                     |
| :white_check_mark:         | [link-href-attributes](./docs/rule/link-href-attributes.md)                           |
| :white_check_mark::wrench: | [link-rel-noopener](./docs/rule/link-rel-noopener.md)                                 |
|                            | [modifier-name-case](./docs/rule/modifier-name-case.md)                               |
| :white_check_mark:         | [no-abstract-roles](./docs/rule/no-abstract-roles.md)                                 |
| :car:                      | [no-action](./docs/rule/no-action.md)                                                 |
|                            | [no-action-modifiers](./docs/rule/no-action-modifiers.md)                             |
| :white_check_mark:         | [no-args-paths](./docs/rule/no-args-paths.md)                                         |
|                            | [no-arguments-for-html-elements](./docs/rule/no-arguments-for-html-elements.md)       |
| :wrench:                   | [no-aria-hidden-body](./docs/rule/no-aria-hidden-body.md)                             |
| :white_check_mark:         | [no-attrs-in-components](./docs/rule/no-attrs-in-components.md)                       |
|                            | [no-bare-strings](./docs/rule/no-bare-strings.md)                                     |
|                            | [no-block-params-for-html-elements](./docs/rule/no-block-params-for-html-elements.md) |
| :car:                      | [no-curly-component-invocation](./docs/rule/no-curly-component-invocation.md)         |
| :white_check_mark:         | [no-debugger](./docs/rule/no-debugger.md)                                             |
| :white_check_mark:         | [no-duplicate-attributes](./docs/rule/no-duplicate-attributes.md)                     |
|                            | [no-duplicate-id](./docs/rule/no-duplicate-id.md)                                     |
|                            | [no-element-event-actions](./docs/rule/no-element-event-actions.md)                   |
| :white_check_mark:         | [no-extra-mut-helper-argument](./docs/rule/no-extra-mut-helper-argument.md)           |
|                            | [no-forbidden-elements](./docs/rule/no-forbidden-elements.md)                         |
|                            | [no-heading-inside-button](./docs/rule/no-heading-inside-button.md)                   |
| :white_check_mark:         | [no-html-comments](./docs/rule/no-html-comments.md)                                   |
| :car:                      | [no-implicit-this](./docs/rule/no-implicit-this.md)                                   |
| :white_check_mark:         | [no-index-component-invocation](./docs/rule/no-index-component-invocation.md)         |
| :white_check_mark:         | [no-inline-styles](./docs/rule/no-inline-styles.md)                                   |
| :white_check_mark:         | [no-input-block](./docs/rule/no-input-block.md)                                       |
| :white_check_mark:         | [no-input-tagname](./docs/rule/no-input-tagname.md)                                   |
|                            | [no-invalid-block-param-definition](./docs/rule/no-invalid-block-param-definition.md) |
| :white_check_mark:         | [no-invalid-interactive](./docs/rule/no-invalid-interactive.md)                       |
| :white_check_mark:         | [no-invalid-link-text](./docs/rule/no-invalid-link-text.md)                           |
|                            | [no-invalid-link-title](./docs/rule/no-invalid-link-title.md)                         |
| :white_check_mark:         | [no-invalid-meta](./docs/rule/no-invalid-meta.md)                                     |
| :white_check_mark:         | [no-invalid-role](./docs/rule/no-invalid-role.md)                                     |
|                            | [no-link-to-tagname](./docs/rule/no-link-to-tagname.md)                               |
| :white_check_mark:         | [no-log](./docs/rule/no-log.md)                                                       |
| :dress:                    | [no-multiple-empty-lines](./docs/rule/no-multiple-empty-lines.md)                     |
| :white_check_mark:         | [no-negated-condition](./docs/rule/no-negated-condition.md)                           |
| :white_check_mark:         | [no-nested-interactive](./docs/rule/no-nested-interactive.md)                         |
|                            | [no-nested-landmark](./docs/rule/no-nested-landmark.md)                               |
|                            | [no-nested-splattributes](./docs/rule/no-nested-splattributes.md)                     |
| :white_check_mark:         | [no-obsolete-elements](./docs/rule/no-obsolete-elements.md)                           |
| :white_check_mark:         | [no-outlet-outside-routes](./docs/rule/no-outlet-outside-routes.md)                   |
| :white_check_mark:         | [no-partial](./docs/rule/no-partial.md)                                               |
|                            | [no-passed-in-event-handlers](./docs/rule/no-passed-in-event-handlers.md)             |
| :wrench:                   | [no-positional-data-test-selectors](./docs/rule/no-positional-data-test-selectors.md) |
| :white_check_mark:         | [no-positive-tabindex](./docs/rule/no-positive-tabindex.md)                           |
|                            | [no-potential-path-strings](./docs/rule/no-potential-path-strings.md)                 |
| :white_check_mark:         | [no-quoteless-attributes](./docs/rule/no-quoteless-attributes.md)                     |
| :wrench:                   | [no-redundant-fn](./docs/rule/no-redundant-fn.md)                                     |
|                            | [no-redundant-landmark-role](./docs/rule/no-redundant-landmark-role.md)               |
|                            | [no-restricted-invocations](./docs/rule/no-restricted-invocations.md)                 |
| :white_check_mark:         | [no-shadowed-elements](./docs/rule/no-shadowed-elements.md)                           |
| :dress:                    | [no-trailing-spaces](./docs/rule/no-trailing-spaces.md)                               |
| :white_check_mark:         | [no-triple-curlies](./docs/rule/no-triple-curlies.md)                                 |
|                            | [no-unbalanced-curlies](./docs/rule/no-unbalanced-curlies.md)                         |
| :white_check_mark:         | [no-unbound](./docs/rule/no-unbound.md)                                               |
| :white_check_mark:         | [no-unnecessary-component-helper](./docs/rule/no-unnecessary-component-helper.md)     |
| :dress:                    | [no-unnecessary-concat](./docs/rule/no-unnecessary-concat.md)                         |
| :white_check_mark:         | [no-unused-block-params](./docs/rule/no-unused-block-params.md)                       |
|                            | [no-whitespace-for-layout](./docs/rule/no-whitespace-for-layout.md)                   |
|                            | [no-whitespace-within-word](./docs/rule/no-whitespace-within-word.md)                 |
|                            | [no-yield-only](./docs/rule/no-yield-only.md)                                         |
| :dress:                    | [quotes](./docs/rule/quotes.md)                                                       |
| :white_check_mark::wrench: | [require-button-type](./docs/rule/require-button-type.md)                             |
|                            | [require-each-key](./docs/rule/require-each-key.md)                                   |
|                            | [require-form-method](./docs/rule/require-form-method.md)                             |
| :white_check_mark:         | [require-iframe-title](./docs/rule/require-iframe-title.md)                           |
|                            | [require-input-label](./docs/rule/require-input-label.md)                             |
|                            | [require-lang-attribute](./docs/rule/require-lang-attribute.md)                       |
| :white_check_mark:         | [require-valid-alt-text](./docs/rule/require-valid-alt-text.md)                       |
| :dress:                    | [self-closing-void-elements](./docs/rule/self-closing-void-elements.md)               |
| :white_check_mark:         | [simple-unless](./docs/rule/simple-unless.md)                                         |
| :white_check_mark:         | [style-concatenation](./docs/rule/style-concatenation.md)                             |
| :white_check_mark:         | [table-groups](./docs/rule/table-groups.md)                                           |
|                            | [template-length](./docs/rule/template-length.md)                                     |

<!--RULES_TABLE_END-->

### Severity Levels

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

### Supporting the --fix option

You can add a fixer to a rule. See [fixer documentation](docs/fixer.md) for more details.

### Sharing configs

It is possible to share a config (`extends`) or plugin (custom rules) across projects. See [ember-template-lint-plugin-peopleconnect](https://github.com/peopleconnectus/ember-template-lint-plugin-peopleconnect) for an example.

## Semantic Versioning Policy

The semver policy for this addon can be read here: [semver policy](dev/versioning.md).

## Contributing

See the [Contributing Guidelines](CONTRIBUTING.md) for information on how to help out.

## License

This project is licensed under the [MIT License](LICENSE.md).
