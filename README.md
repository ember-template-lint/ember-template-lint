# ember-template-lint

[![npm version](https://badge.fury.io/js/ember-template-lint.svg)](https://badge.fury.io/js/ember-template-lint)
[![Build Status](https://github.com/ember-template-lint/ember-template-lint/workflows/CI/badge.svg)](https://github.com/ember-template-lint/ember-template-lint/actions?query=workflow%3ACI)

`ember-template-lint` is a library that will lint your handlebars template and return error results.

For example, if the rule [`no-bare-strings`](docs/rule/no-bare-strings.md) is enabled, this template would be
in violation:

```hbs
{{! app/components/my-thing/template.hbs  }}
<div>A bare string</div>
```

When the `ember-template-lint` executable is run, we would have a single result indicating that
the `no-bare-strings` rule found an error.

## Requirements

- [Node.js](https://nodejs.org/) `^18.18.0 || ^20.9.0 || >=21.1.0`

## Installation

```bash
npm install --save-dev ember-template-lint
```

```bash
yarn add --dev ember-template-lint
```

Note: this library is installed by default with new Ember apps.

## Usage

While `ember-template-lint` does have a [Node API](docs/node-api.md), the main way to use it is through its executable, which is intended to be installed locally within a project.

Basic usage is as straightforward as

```bash
ember-template-lint .
```

### Workflow Examples

See documentation on [workflow examples](docs/workflow.md).

See documentation on the [todo functionality](docs/todos.md).

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

|     | Name                                     | Description                                                                                                                                                                                                                                                                                     |
| :-- | :--------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅  | [recommended](lib/config/recommended.js) | Enables the recommended rules.                                                                                                                                                                                                                                                                  |
| 💅  | [stylistic](lib/config/stylistic.js)     | Enables stylistic rules for those who aren't ready to adopt [ember-template-lint-plugin-prettier](https://github.com/ember-template-lint/ember-template-lint-plugin-prettier) (including stylistic rules that were previously in the `recommended` preset in ember-template-lint v1).           |
| ⌨️  | [a11y](lib/config/a11y.js)               | Enables A11Y rules. Its goal is to include **all** A11Y related rules, therefore it does not follow the same SemVer policy as the other presets. Please see [versioning](https://github.com/ember-template-lint/ember-template-lint/blob/master/dev/versioning.md#exemptions) for more details. |

## Rules

Each rule has emojis denoting:

- what configuration it belongs to
- 🔧 if some problems reported by the rule are automatically fixable by the `--fix` command line option

<!--RULES_TABLE_START-->

| Name                                                                                                      | ✅  | 💅  | ⌨️  | 🔧  |
| :-------------------------------------------------------------------------------------------------------- | :-- | :-- | :-- | --- |
| [attribute-indentation](./docs/rule/attribute-indentation.md)                                             |     |     |     |     |
| [attribute-order](./docs/rule/attribute-order.md)                                                         |     |     |     | 🔧  |
| [block-indentation](./docs/rule/block-indentation.md)                                                     |     | 💅  |     | 🔧  |
| [builtin-component-arguments](./docs/rule/builtin-component-arguments.md)                                 | ✅  |     |     |     |
| [deprecated-inline-view-helper](./docs/rule/deprecated-inline-view-helper.md)                             | ✅  |     |     |     |
| [deprecated-render-helper](./docs/rule/deprecated-render-helper.md)                                       | ✅  |     |     |     |
| [eol-last](./docs/rule/eol-last.md)                                                                       |     | 💅  |     | 🔧  |
| [inline-link-to](./docs/rule/inline-link-to.md)                                                           |     |     |     | 🔧  |
| [linebreak-style](./docs/rule/linebreak-style.md)                                                         |     | 💅  |     |     |
| [link-href-attributes](./docs/rule/link-href-attributes.md)                                               | ✅  |     | ⌨️  |     |
| [link-rel-noopener](./docs/rule/link-rel-noopener.md)                                                     | ✅  |     |     | 🔧  |
| [modifier-name-case](./docs/rule/modifier-name-case.md)                                                   |     | 💅  |     | 🔧  |
| [no-abstract-roles](./docs/rule/no-abstract-roles.md)                                                     | ✅  |     | ⌨️  |     |
| [no-accesskey-attribute](./docs/rule/no-accesskey-attribute.md)                                           | ✅  |     | ⌨️  | 🔧  |
| [no-action](./docs/rule/no-action.md)                                                                     | ✅  |     |     |     |
| [no-action-modifiers](./docs/rule/no-action-modifiers.md)                                                 |     |     |     |     |
| [no-action-on-submit-button](./docs/rule/no-action-on-submit-button.md)                                   | ✅  |     |     |     |
| [no-args-paths](./docs/rule/no-args-paths.md)                                                             | ✅  |     |     |     |
| [no-arguments-for-html-elements](./docs/rule/no-arguments-for-html-elements.md)                           | ✅  |     |     |     |
| [no-aria-hidden-body](./docs/rule/no-aria-hidden-body.md)                                                 | ✅  |     | ⌨️  | 🔧  |
| [no-aria-unsupported-elements](./docs/rule/no-aria-unsupported-elements.md)                               | ✅  |     | ⌨️  |     |
| [no-array-prototype-extensions](./docs/rule/no-array-prototype-extensions.md)                             | ✅  |     |     | 🔧  |
| [no-at-ember-render-modifiers](./docs/rule/no-at-ember-render-modifiers.md)                               | ✅  |     |     |     |
| [no-attrs-in-components](./docs/rule/no-attrs-in-components.md)                                           | ✅  |     |     |     |
| [no-autofocus-attribute](./docs/rule/no-autofocus-attribute.md)                                           | ✅  |     | ⌨️  |     |
| [no-bare-strings](./docs/rule/no-bare-strings.md)                                                         |     |     |     |     |
| [no-block-params-for-html-elements](./docs/rule/no-block-params-for-html-elements.md)                     | ✅  |     |     |     |
| [no-builtin-form-components](./docs/rule/no-builtin-form-components.md)                                   | ✅  |     |     |     |
| [no-capital-arguments](./docs/rule/no-capital-arguments.md)                                               | ✅  |     |     |     |
| [no-class-bindings](./docs/rule/no-class-bindings.md)                                                     | ✅  |     |     |     |
| [no-curly-component-invocation](./docs/rule/no-curly-component-invocation.md)                             | ✅  |     |     | 🔧  |
| [no-debugger](./docs/rule/no-debugger.md)                                                                 | ✅  |     |     |     |
| [no-duplicate-attributes](./docs/rule/no-duplicate-attributes.md)                                         | ✅  |     | ⌨️  | 🔧  |
| [no-duplicate-id](./docs/rule/no-duplicate-id.md)                                                         | ✅  |     | ⌨️  |     |
| [no-duplicate-landmark-elements](./docs/rule/no-duplicate-landmark-elements.md)                           | ✅  |     | ⌨️  |     |
| [no-dynamic-subexpression-invocations](./docs/rule/no-dynamic-subexpression-invocations.md)               |     |     |     |     |
| [no-element-event-actions](./docs/rule/no-element-event-actions.md)                                       |     |     |     |     |
| [no-empty-headings](./docs/rule/no-empty-headings.md)                                                     | ✅  |     | ⌨️  |     |
| [no-extra-mut-helper-argument](./docs/rule/no-extra-mut-helper-argument.md)                               | ✅  |     |     |     |
| [no-forbidden-elements](./docs/rule/no-forbidden-elements.md)                                             | ✅  |     |     |     |
| [no-heading-inside-button](./docs/rule/no-heading-inside-button.md)                                       | ✅  |     | ⌨️  |     |
| [no-html-comments](./docs/rule/no-html-comments.md)                                                       | ✅  |     |     | 🔧  |
| [no-implicit-this](./docs/rule/no-implicit-this.md)                                                       | ✅  |     |     |     |
| [no-index-component-invocation](./docs/rule/no-index-component-invocation.md)                             | ✅  |     |     |     |
| [no-inline-styles](./docs/rule/no-inline-styles.md)                                                       | ✅  |     |     |     |
| [no-input-block](./docs/rule/no-input-block.md)                                                           | ✅  |     |     |     |
| [no-input-tagname](./docs/rule/no-input-tagname.md)                                                       | ✅  |     |     |     |
| [no-invalid-aria-attributes](./docs/rule/no-invalid-aria-attributes.md)                                   | ✅  |     | ⌨️  |     |
| [no-invalid-interactive](./docs/rule/no-invalid-interactive.md)                                           | ✅  |     | ⌨️  |     |
| [no-invalid-link-text](./docs/rule/no-invalid-link-text.md)                                               | ✅  |     | ⌨️  |     |
| [no-invalid-link-title](./docs/rule/no-invalid-link-title.md)                                             | ✅  |     | ⌨️  |     |
| [no-invalid-meta](./docs/rule/no-invalid-meta.md)                                                         | ✅  |     | ⌨️  |     |
| [no-invalid-role](./docs/rule/no-invalid-role.md)                                                         | ✅  |     | ⌨️  |     |
| [no-jsx-attributes](./docs/rule/no-jsx-attributes.md)                                                     |     |     |     |     |
| [no-link-to-positional-params](./docs/rule/no-link-to-positional-params.md)                               | ✅  |     |     |     |
| [no-link-to-tagname](./docs/rule/no-link-to-tagname.md)                                                   | ✅  |     |     |     |
| [no-log](./docs/rule/no-log.md)                                                                           | ✅  |     |     |     |
| [no-model-argument-in-route-templates](./docs/rule/no-model-argument-in-route-templates.md)               |     |     |     | 🔧  |
| [no-multiple-empty-lines](./docs/rule/no-multiple-empty-lines.md)                                         |     | 💅  |     | 🔧  |
| [no-mut-helper](./docs/rule/no-mut-helper.md)                                                             |     |     |     |     |
| [no-negated-condition](./docs/rule/no-negated-condition.md)                                               | ✅  |     |     | 🔧  |
| [no-nested-interactive](./docs/rule/no-nested-interactive.md)                                             | ✅  |     | ⌨️  |     |
| [no-nested-landmark](./docs/rule/no-nested-landmark.md)                                                   | ✅  |     | ⌨️  |     |
| [no-nested-splattributes](./docs/rule/no-nested-splattributes.md)                                         | ✅  |     |     |     |
| [no-obscure-array-access](./docs/rule/no-obscure-array-access.md)                                         | ✅  |     |     | 🔧  |
| [no-obsolete-elements](./docs/rule/no-obsolete-elements.md)                                               | ✅  |     | ⌨️  |     |
| [no-outlet-outside-routes](./docs/rule/no-outlet-outside-routes.md)                                       | ✅  |     |     |     |
| [no-partial](./docs/rule/no-partial.md)                                                                   | ✅  |     |     |     |
| [no-passed-in-event-handlers](./docs/rule/no-passed-in-event-handlers.md)                                 | ✅  |     |     |     |
| [no-pointer-down-event-binding](./docs/rule/no-pointer-down-event-binding.md)                             | ✅  |     | ⌨️  |     |
| [no-positional-data-test-selectors](./docs/rule/no-positional-data-test-selectors.md)                     | ✅  |     |     | 🔧  |
| [no-positive-tabindex](./docs/rule/no-positive-tabindex.md)                                               | ✅  |     | ⌨️  |     |
| [no-potential-path-strings](./docs/rule/no-potential-path-strings.md)                                     | ✅  |     |     |     |
| [no-quoteless-attributes](./docs/rule/no-quoteless-attributes.md)                                         | ✅  |     |     | 🔧  |
| [no-redundant-fn](./docs/rule/no-redundant-fn.md)                                                         | ✅  |     |     | 🔧  |
| [no-redundant-role](./docs/rule/no-redundant-role.md)                                                     | ✅  |     | ⌨️  | 🔧  |
| [no-restricted-invocations](./docs/rule/no-restricted-invocations.md)                                     |     |     |     |     |
| [no-route-action](./docs/rule/no-route-action.md)                                                         | ✅  |     |     |     |
| [no-scope-outside-table-headings](./docs/rule/no-scope-outside-table-headings.md)                         | ✅  |     | ⌨️  |     |
| [no-shadowed-elements](./docs/rule/no-shadowed-elements.md)                                               | ✅  |     |     |     |
| [no-this-in-template-only-components](./docs/rule/no-this-in-template-only-components.md)                 |     |     |     | 🔧  |
| [no-trailing-spaces](./docs/rule/no-trailing-spaces.md)                                                   |     | 💅  |     | 🔧  |
| [no-triple-curlies](./docs/rule/no-triple-curlies.md)                                                     | ✅  |     |     |     |
| [no-unbalanced-curlies](./docs/rule/no-unbalanced-curlies.md)                                             | ✅  |     |     |     |
| [no-unbound](./docs/rule/no-unbound.md)                                                                   | ✅  |     |     |     |
| [no-unknown-arguments-for-builtin-components](./docs/rule/no-unknown-arguments-for-builtin-components.md) | ✅  |     |     | 🔧  |
| [no-unnecessary-component-helper](./docs/rule/no-unnecessary-component-helper.md)                         | ✅  |     |     | 🔧  |
| [no-unnecessary-concat](./docs/rule/no-unnecessary-concat.md)                                             |     | 💅  |     | 🔧  |
| [no-unnecessary-curly-parens](./docs/rule/no-unnecessary-curly-parens.md)                                 | ✅  |     |     | 🔧  |
| [no-unnecessary-curly-strings](./docs/rule/no-unnecessary-curly-strings.md)                               | ✅  |     |     | 🔧  |
| [no-unsupported-role-attributes](./docs/rule/no-unsupported-role-attributes.md)                           | ✅  |     | ⌨️  | 🔧  |
| [no-unused-block-params](./docs/rule/no-unused-block-params.md)                                           | ✅  |     |     |     |
| [no-valueless-arguments](./docs/rule/no-valueless-arguments.md)                                           | ✅  |     |     |     |
| [no-whitespace-for-layout](./docs/rule/no-whitespace-for-layout.md)                                       | ✅  |     | ⌨️  |     |
| [no-whitespace-within-word](./docs/rule/no-whitespace-within-word.md)                                     | ✅  |     | ⌨️  |     |
| [no-with](./docs/rule/no-with.md)                                                                         | ✅  |     |     |     |
| [no-yield-only](./docs/rule/no-yield-only.md)                                                             | ✅  |     |     |     |
| [no-yield-to-default](./docs/rule/no-yield-to-default.md)                                                 | ✅  |     |     |     |
| [quotes](./docs/rule/quotes.md)                                                                           |     | 💅  |     | 🔧  |
| [require-aria-activedescendant-tabindex](./docs/rule/require-aria-activedescendant-tabindex.md)           | ✅  |     | ⌨️  |     |
| [require-button-type](./docs/rule/require-button-type.md)                                                 | ✅  |     |     | 🔧  |
| [require-context-role](./docs/rule/require-context-role.md)                                               | ✅  |     | ⌨️  |     |
| [require-each-key](./docs/rule/require-each-key.md)                                                       |     |     |     |     |
| [require-form-method](./docs/rule/require-form-method.md)                                                 |     |     |     |     |
| [require-has-block-helper](./docs/rule/require-has-block-helper.md)                                       | ✅  |     |     | 🔧  |
| [require-iframe-title](./docs/rule/require-iframe-title.md)                                               | ✅  |     | ⌨️  |     |
| [require-input-label](./docs/rule/require-input-label.md)                                                 | ✅  |     | ⌨️  |     |
| [require-lang-attribute](./docs/rule/require-lang-attribute.md)                                           | ✅  |     | ⌨️  |     |
| [require-mandatory-role-attributes](./docs/rule/require-mandatory-role-attributes.md)                     | ✅  |     | ⌨️  |     |
| [require-media-caption](./docs/rule/require-media-caption.md)                                             | ✅  |     | ⌨️  |     |
| [require-presentational-children](./docs/rule/require-presentational-children.md)                         | ✅  |     | ⌨️  |     |
| [require-splattributes](./docs/rule/require-splattributes.md)                                             |     |     |     |     |
| [require-strict-mode](./docs/rule/require-strict-mode.md)                                                 |     |     |     |     |
| [require-valid-alt-text](./docs/rule/require-valid-alt-text.md)                                           | ✅  |     | ⌨️  |     |
| [require-valid-named-block-naming-format](./docs/rule/require-valid-named-block-naming-format.md)         | ✅  |     |     | 🔧  |
| [self-closing-void-elements](./docs/rule/self-closing-void-elements.md)                                   |     | 💅  |     | 🔧  |
| [simple-modifiers](./docs/rule/simple-modifiers.md)                                                       | ✅  |     |     |     |
| [simple-unless](./docs/rule/simple-unless.md)                                                             | ✅  |     |     | 🔧  |
| [splat-attributes-only](./docs/rule/splat-attributes-only.md)                                             | ✅  |     |     |     |
| [style-concatenation](./docs/rule/style-concatenation.md)                                                 | ✅  |     |     |     |
| [table-groups](./docs/rule/table-groups.md)                                                               | ✅  |     | ⌨️  |     |
| [template-length](./docs/rule/template-length.md)                                                         |     |     |     |     |

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
