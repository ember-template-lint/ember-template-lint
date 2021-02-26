# ember-template-lint

[![npm version](https://badge.fury.io/js/ember-template-lint.svg)](https://badge.fury.io/js/ember-template-lint)
[![Build Status](https://github.com/ember-template-lint/ember-template-lint/workflows/CI/badge.svg)](https://github.com/ember-template-lint/ember-template-lint/actions?query=workflow%3ACI)

ember-template-lint will lint your handlebars template and return error results.

For example, given the rule [`no-bare-strings`](docs/rule/no-bare-strings.md) is enabled, this template would be
in violation:

```hbs
{{!-- app/components/my-thing/template.hbs  --}}
<div>A bare string</div>
```

When the `ember-template-lint` executable is run, we would have a single result indicating that
the `no-bare-strings` rule found an error.

## Installation

This addon is installed by default with new Ember apps, so check your package.json before installing to see if you need to install it.

To install ember-template-lint

With npm:

```bash
npm install --save-dev ember-template-lint
```

With yarn:

```bash
yarn add ember-template-lint --dev
```

Node.js `10 || >=12` is required.

## Usage

While `ember-template-lint` does have a [Node API](docs/node-api.md), the main way to use it is through its executable, which is intended to be installed locally within a project.

Basic usage is as straightforward as

```bash
ember-template-lint .
```

### Workflow Examples

Basic usage with a single file

```bash
ember-template-lint "app/templates/application.hbs"
```

Output errors with source description

```bash
ember-template-lint "app/templates/application.hbs" --verbose
```

Multiple file/directory/wildcard paths are accepted

```bash
ember-template-lint "app/templates/components/**/*" "app/templates/application.hbs"
```

Output errors as pretty-printed JSON string

```bash
ember-template-lint "app/templates/application.hbs" --json
```

Ignore warnings / only report errors

```bash
ember-template-lint "app/templates/application.hbs" --quiet
```

Number of warnings to trigger nonzero exit code

```bash
ember-template-lint "app/templates/application.hbs" --max-warnings=2
```

Define custom config path

```bash
ember-template-lint "app/templates/application.hbs" --config-path .my-template-lintrc.js
```

Read from stdin

```bash
ember-template-lint --filename app/templates/application.hbs < app/templates/application.hbs
```

Print list of formatted rules for use with `pending` in config file

```bash
ember-template-lint "app/templates/application.hbs" --print-pending
```

Specify custom ignore pattern `['**/dist/**', '**/tmp/**', '**/node_modules/**']` by default

```bash
ember-template-lint "/tmp/template.hbs" --ignore-pattern "**/foo/**" --ignore-pattern "**/bar/**"
```

Disable ignore pattern entirely

```bash
ember-template-lint "/tmp/template.hbs" --no-ignore-pattern
```

Running a single rule without options

```bash
ember-template-lint --no-config-path app/templates --rule 'no-implicit-this:error'
```

Running a single rule with options

```bash
ember-template-lint --no-config-path app/templates --rule 'no-implicit-this:["error", { "allow": ["some-helper"] }]'
```

Running a single rule, disabling inline configuration

```bash
ember-template-lint --no-config-path app/templates --rule 'no-implicit-this:error' --no-inline-config
```

Specify a config object to use instead of what exists locally

```bash
ember-template-lint --config '{ "rules": { "no-implicit-this": { "severity": 2, "config": true } } }' test/fixtures/no-implicit-this-allow-with-regexp/app/templates
```

:bulb: Ensure you wrap all glob patterns in quotes so that it won't be interpreted by the CLI. `ember-template-lint app/templates/**` (this will expand all paths in app/templates) and `ember-template-lint "app/templates/**"` (this will pass the glob to ember-template-lint and not interpret the glob).

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

For more detailed information see [configuration](docs/configuration.md).

### Presets

|                    | Name                                     | Description                                                                                                                                                                                                                                                                          |
| :----------------- | :--------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| :white_check_mark: | [recommended](lib/config/recommended.js) | enables the recommended rules                                                                                                                                                                                                                                                        |
| :car:              | [octane](lib/config/octane.js)           | extends the `recommended` preset by enabling Ember Octane rules                                                                                                                                                                                                                      |
| :nail_care:        | [stylistic](lib/config/stylistic.js)     | enables stylistic rules for those who aren't ready to adopt [ember-template-lint-plugin-prettier](https://github.com/ember-template-lint/ember-template-lint-plugin-prettier) (including stylistic rules that were previously in the `recommended` preset in ember-template-lint v1) |

## Rules

Each rule has emojis denoting:

- what configuration it belongs to
- :wrench: if some problems reported by the rule are automatically fixable by the `--fix` command line option

<!--RULES_TABLE_START-->

|                            | Rule ID                                                                                                   |
| :------------------------- | :-------------------------------------------------------------------------------------------------------- |
|                            | [attribute-indentation](./docs/rule/attribute-indentation.md)                                             |
| :nail_care:                | [block-indentation](./docs/rule/block-indentation.md)                                                     |
|                            | [builtin-component-arguments](./docs/rule/builtin-component-arguments.md)                                 |
|                            | [deprecated-each-syntax](./docs/rule/deprecated-each-syntax.md)                                           |
|                            | [deprecated-inline-view-helper](./docs/rule/deprecated-inline-view-helper.md)                             |
| :white_check_mark:         | [deprecated-render-helper](./docs/rule/deprecated-render-helper.md)                                       |
| :nail_care:                | [eol-last](./docs/rule/eol-last.md)                                                                       |
| :wrench:                   | [inline-link-to](./docs/rule/inline-link-to.md)                                                           |
| :nail_care:                | [linebreak-style](./docs/rule/linebreak-style.md)                                                         |
| :white_check_mark:         | [link-href-attributes](./docs/rule/link-href-attributes.md)                                               |
| :white_check_mark::wrench: | [link-rel-noopener](./docs/rule/link-rel-noopener.md)                                                     |
|                            | [modifier-name-case](./docs/rule/modifier-name-case.md)                                                   |
| :white_check_mark:         | [no-abstract-roles](./docs/rule/no-abstract-roles.md)                                                     |
| :wrench:                   | [no-accesskey-attribute](./docs/rule/no-accesskey-attribute.md)                                           |
| :car:                      | [no-action](./docs/rule/no-action.md)                                                                     |
|                            | [no-action-modifiers](./docs/rule/no-action-modifiers.md)                                                 |
| :white_check_mark:         | [no-args-paths](./docs/rule/no-args-paths.md)                                                             |
|                            | [no-arguments-for-html-elements](./docs/rule/no-arguments-for-html-elements.md)                           |
| :wrench:                   | [no-aria-hidden-body](./docs/rule/no-aria-hidden-body.md)                                                 |
| :white_check_mark:         | [no-attrs-in-components](./docs/rule/no-attrs-in-components.md)                                           |
|                            | [no-bare-strings](./docs/rule/no-bare-strings.md)                                                         |
|                            | [no-block-params-for-html-elements](./docs/rule/no-block-params-for-html-elements.md)                     |
|                            | [no-capital-arguments](./docs/rule/no-capital-arguments.md)                                               |
|                            | [no-class-bindings](./docs/rule/no-class-bindings.md)                                                     |
| :car::wrench:              | [no-curly-component-invocation](./docs/rule/no-curly-component-invocation.md)                             |
| :white_check_mark:         | [no-debugger](./docs/rule/no-debugger.md)                                                                 |
|                            | [no-down-event-binding](./docs/rule/no-down-event-binding.md)                                             |
| :white_check_mark:         | [no-duplicate-attributes](./docs/rule/no-duplicate-attributes.md)                                         |
|                            | [no-duplicate-id](./docs/rule/no-duplicate-id.md)                                                         |
|                            | [no-duplicate-landmark-elements](./docs/rule/no-duplicate-landmark-elements.md)                           |
|                            | [no-dynamic-subexpression-invocations](./docs/rule/no-dynamic-subexpression-invocations.md)               |
|                            | [no-element-event-actions](./docs/rule/no-element-event-actions.md)                                       |
| :white_check_mark:         | [no-extra-mut-helper-argument](./docs/rule/no-extra-mut-helper-argument.md)                               |
|                            | [no-forbidden-elements](./docs/rule/no-forbidden-elements.md)                                             |
|                            | [no-heading-inside-button](./docs/rule/no-heading-inside-button.md)                                       |
| :white_check_mark:         | [no-html-comments](./docs/rule/no-html-comments.md)                                                       |
| :car:                      | [no-implicit-this](./docs/rule/no-implicit-this.md)                                                       |
| :white_check_mark:         | [no-index-component-invocation](./docs/rule/no-index-component-invocation.md)                             |
| :white_check_mark:         | [no-inline-styles](./docs/rule/no-inline-styles.md)                                                       |
| :white_check_mark:         | [no-input-block](./docs/rule/no-input-block.md)                                                           |
| :white_check_mark:         | [no-input-tagname](./docs/rule/no-input-tagname.md)                                                       |
|                            | [no-invalid-block-param-definition](./docs/rule/no-invalid-block-param-definition.md)                     |
| :white_check_mark:         | [no-invalid-interactive](./docs/rule/no-invalid-interactive.md)                                           |
| :white_check_mark:         | [no-invalid-link-text](./docs/rule/no-invalid-link-text.md)                                               |
|                            | [no-invalid-link-title](./docs/rule/no-invalid-link-title.md)                                             |
| :white_check_mark:         | [no-invalid-meta](./docs/rule/no-invalid-meta.md)                                                         |
| :white_check_mark:         | [no-invalid-role](./docs/rule/no-invalid-role.md)                                                         |
|                            | [no-link-to-positional-params](./docs/rule/no-link-to-positional-params.md)                               |
|                            | [no-link-to-tagname](./docs/rule/no-link-to-tagname.md)                                                   |
| :white_check_mark:         | [no-log](./docs/rule/no-log.md)                                                                           |
| :wrench:                   | [no-model-argument-in-route-templates](./docs/rule/no-model-argument-in-route-templates.md)               |
| :nail_care:                | [no-multiple-empty-lines](./docs/rule/no-multiple-empty-lines.md)                                         |
|                            | [no-mut-helper](./docs/rule/no-mut-helper.md)                                                             |
| :white_check_mark:         | [no-negated-condition](./docs/rule/no-negated-condition.md)                                               |
| :white_check_mark:         | [no-nested-interactive](./docs/rule/no-nested-interactive.md)                                             |
|                            | [no-nested-landmark](./docs/rule/no-nested-landmark.md)                                                   |
|                            | [no-nested-splattributes](./docs/rule/no-nested-splattributes.md)                                         |
| :white_check_mark:         | [no-obsolete-elements](./docs/rule/no-obsolete-elements.md)                                               |
| :white_check_mark:         | [no-outlet-outside-routes](./docs/rule/no-outlet-outside-routes.md)                                       |
| :white_check_mark:         | [no-partial](./docs/rule/no-partial.md)                                                                   |
|                            | [no-passed-in-event-handlers](./docs/rule/no-passed-in-event-handlers.md)                                 |
| :wrench:                   | [no-positional-data-test-selectors](./docs/rule/no-positional-data-test-selectors.md)                     |
| :white_check_mark:         | [no-positive-tabindex](./docs/rule/no-positive-tabindex.md)                                               |
|                            | [no-potential-path-strings](./docs/rule/no-potential-path-strings.md)                                     |
| :white_check_mark:         | [no-quoteless-attributes](./docs/rule/no-quoteless-attributes.md)                                         |
| :wrench:                   | [no-redundant-fn](./docs/rule/no-redundant-fn.md)                                                         |
| :wrench:                   | [no-redundant-landmark-role](./docs/rule/no-redundant-landmark-role.md)                                   |
|                            | [no-restricted-invocations](./docs/rule/no-restricted-invocations.md)                                     |
| :white_check_mark:         | [no-shadowed-elements](./docs/rule/no-shadowed-elements.md)                                               |
| :wrench:                   | [no-this-in-template-only-components](./docs/rule/no-this-in-template-only-components.md)                 |
| :nail_care:                | [no-trailing-spaces](./docs/rule/no-trailing-spaces.md)                                                   |
| :white_check_mark:         | [no-triple-curlies](./docs/rule/no-triple-curlies.md)                                                     |
|                            | [no-unbalanced-curlies](./docs/rule/no-unbalanced-curlies.md)                                             |
| :white_check_mark:         | [no-unbound](./docs/rule/no-unbound.md)                                                                   |
|                            | [no-unknown-arguments-for-builtin-components](./docs/rule/no-unknown-arguments-for-builtin-components.md) |
| :white_check_mark:         | [no-unnecessary-component-helper](./docs/rule/no-unnecessary-component-helper.md)                         |
| :nail_care:                | [no-unnecessary-concat](./docs/rule/no-unnecessary-concat.md)                                             |
| :white_check_mark:         | [no-unused-block-params](./docs/rule/no-unused-block-params.md)                                           |
|                            | [no-whitespace-for-layout](./docs/rule/no-whitespace-for-layout.md)                                       |
|                            | [no-whitespace-within-word](./docs/rule/no-whitespace-within-word.md)                                     |
|                            | [no-yield-only](./docs/rule/no-yield-only.md)                                                             |
|                            | [no-yield-to-default](./docs/rule/no-yield-to-default.md)                                                 |
| :nail_care:                | [quotes](./docs/rule/quotes.md)                                                                           |
| :white_check_mark::wrench: | [require-button-type](./docs/rule/require-button-type.md)                                                 |
|                            | [require-each-key](./docs/rule/require-each-key.md)                                                       |
|                            | [require-form-method](./docs/rule/require-form-method.md)                                                 |
| :wrench:                   | [require-has-block-helper](./docs/rule/require-has-block-helper.md)                                       |
| :white_check_mark:         | [require-iframe-title](./docs/rule/require-iframe-title.md)                                               |
|                            | [require-input-label](./docs/rule/require-input-label.md)                                                 |
|                            | [require-lang-attribute](./docs/rule/require-lang-attribute.md)                                           |
|                            | [require-splattributes](./docs/rule/require-splattributes.md)                                             |
| :white_check_mark:         | [require-valid-alt-text](./docs/rule/require-valid-alt-text.md)                                           |
| :nail_care:                | [self-closing-void-elements](./docs/rule/self-closing-void-elements.md)                                   |
| :white_check_mark:         | [simple-unless](./docs/rule/simple-unless.md)                                                             |
|                            | [splat-attributes-only](./docs/rule/splat-attributes-only.md)                                             |
| :white_check_mark:         | [style-concatenation](./docs/rule/style-concatenation.md)                                                 |
| :white_check_mark:         | [table-groups](./docs/rule/table-groups.md)                                                               |
|                            | [template-length](./docs/rule/template-length.md)                                                         |

<!--RULES_TABLE_END-->

### Supporting the `--fix` option

You can add a fixer to a rule. See [fixer documentation](docs/fixer.md) for more details.

### Sharing configs

It is possible to share a config (`extends`) or plugin (custom rules) across projects. See [ember-template-lint-plugin-peopleconnect](https://github.com/peopleconnectus/ember-template-lint-plugin-peopleconnect) for an example.

## Defining your own rules

You can define and use your own custom rules using the plugin system. See [plugin documentation](docs/plugins.md) for more details.

## Semantic Versioning Policy

The semver policy for this addon can be read here: [semver policy](dev/versioning.md).

## Contributing

See the [Contributing Guidelines](CONTRIBUTING.md) for information on how to help out.

## License

This project is licensed under the [MIT License](LICENSE.md).
