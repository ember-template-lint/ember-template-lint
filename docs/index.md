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


## Rules

Each rule has emojis denoting:

- what configuration it belongs to
- :wrench: if some problems reported by the rule are automatically fixable by the `--fix` command line option


|                            | Rule ID                                                                               |
| :------------------------- | :------------------------------------------------------------------------------------ |
|                            | [attribute-indentation](./rule/attribute-indentation.md)                         |
| :dress:                    | [block-indentation](./rule/block-indentation.md)                                 |
|                            | [builtin-component-arguments](./rule/builtin-component-arguments.md)             |
|                            | [deprecated-each-syntax](./rule/deprecated-each-syntax.md)                       |
|                            | [deprecated-inline-view-helper](./rule/deprecated-inline-view-helper.md)         |
| :white_check_mark:         | [deprecated-render-helper](./rule/deprecated-render-helper.md)                   |
| :dress:                    | [eol-last](./rule/eol-last.md)                                                   |
| :wrench:                   | [inline-link-to](./rule/inline-link-to.md)                                       |
| :dress:                    | [linebreak-style](./rule/linebreak-style.md)                                     |
| :white_check_mark:         | [link-href-attributes](./rule/link-href-attributes.md)                           |
| :white_check_mark::wrench: | [link-rel-noopener](./rule/link-rel-noopener.md)                                 |
|                            | [modifier-name-case](./rule/modifier-name-case.md)                               |
| :white_check_mark:         | [no-abstract-roles](./rule/no-abstract-roles.md)                                 |
| :wrench:                   | [no-accesskey-attribute](./rule/no-accesskey-attribute.md)                       |
| :car:                      | [no-action](./rule/no-action.md)                                                 |
|                            | [no-action-modifiers](./rule/no-action-modifiers.md)                             |
| :white_check_mark:         | [no-args-paths](./rule/no-args-paths.md)                                         |
|                            | [no-arguments-for-html-elements](./rule/no-arguments-for-html-elements.md)       |
| :wrench:                   | [no-aria-hidden-body](./rule/no-aria-hidden-body.md)                             |
| :white_check_mark:         | [no-attrs-in-components](./rule/no-attrs-in-components.md)                       |
|                            | [no-bare-strings](./rule/no-bare-strings.md)                                     |
|                            | [no-block-params-for-html-elements](./rule/no-block-params-for-html-elements.md) |
| :car:                      | [no-curly-component-invocation](./rule/no-curly-component-invocation.md)         |
| :white_check_mark:         | [no-debugger](./rule/no-debugger.md)                                             |
| :white_check_mark:         | [no-duplicate-attributes](./rule/no-duplicate-attributes.md)                     |
|                            | [no-duplicate-id](./rule/no-duplicate-id.md)                                     |
|                            | [no-duplicate-landmark-elements](./rule/no-duplicate-landmark-elements.md)       |
|                            | [no-element-event-actions](./rule/no-element-event-actions.md)                   |
| :white_check_mark:         | [no-extra-mut-helper-argument](./rule/no-extra-mut-helper-argument.md)           |
|                            | [no-forbidden-elements](./rule/no-forbidden-elements.md)                         |
|                            | [no-heading-inside-button](./rule/no-heading-inside-button.md)                   |
| :white_check_mark:         | [no-html-comments](./rule/no-html-comments.md)                                   |
| :car:                      | [no-implicit-this](./rule/no-implicit-this.md)                                   |
| :white_check_mark:         | [no-index-component-invocation](./rule/no-index-component-invocation.md)         |
| :white_check_mark:         | [no-inline-styles](./rule/no-inline-styles.md)                                   |
| :white_check_mark:         | [no-input-block](./rule/no-input-block.md)                                       |
| :white_check_mark:         | [no-input-tagname](./rule/no-input-tagname.md)                                   |
|                            | [no-invalid-block-param-definition](./rule/no-invalid-block-param-definition.md) |
| :white_check_mark:         | [no-invalid-interactive](./rule/no-invalid-interactive.md)                       |
| :white_check_mark:         | [no-invalid-link-text](./rule/no-invalid-link-text.md)                           |
|                            | [no-invalid-link-title](./rule/no-invalid-link-title.md)                         |
| :white_check_mark:         | [no-invalid-meta](./rule/no-invalid-meta.md)                                     |
| :white_check_mark:         | [no-invalid-role](./rule/no-invalid-role.md)                                     |
|                            | [no-link-to-tagname](./rule/no-link-to-tagname.md)                               |
| :white_check_mark:         | [no-log](./rule/no-log.md)                                                       |
| :dress:                    | [no-multiple-empty-lines](./rule/no-multiple-empty-lines.md)                     |
| :white_check_mark:         | [no-negated-condition](./rule/no-negated-condition.md)                           |
| :white_check_mark:         | [no-nested-interactive](./rule/no-nested-interactive.md)                         |
|                            | [no-nested-landmark](./rule/no-nested-landmark.md)                               |
|                            | [no-nested-splattributes](./rule/no-nested-splattributes.md)                     |
| :white_check_mark:         | [no-obsolete-elements](./rule/no-obsolete-elements.md)                           |
| :white_check_mark:         | [no-outlet-outside-routes](./rule/no-outlet-outside-routes.md)                   |
| :white_check_mark:         | [no-partial](./rule/no-partial.md)                                               |
|                            | [no-passed-in-event-handlers](./rule/no-passed-in-event-handlers.md)             |
| :wrench:                   | [no-positional-data-test-selectors](./rule/no-positional-data-test-selectors.md) |
| :white_check_mark:         | [no-positive-tabindex](./rule/no-positive-tabindex.md)                           |
|                            | [no-potential-path-strings](./rule/no-potential-path-strings.md)                 |
| :white_check_mark:         | [no-quoteless-attributes](./rule/no-quoteless-attributes.md)                     |
| :wrench:                   | [no-redundant-fn](./rule/no-redundant-fn.md)                                     |
|                            | [no-redundant-landmark-role](./rule/no-redundant-landmark-role.md)               |
|                            | [no-restricted-invocations](./rule/no-restricted-invocations.md)                 |
| :white_check_mark:         | [no-shadowed-elements](./rule/no-shadowed-elements.md)                           |
| :dress:                    | [no-trailing-spaces](./rule/no-trailing-spaces.md)                               |
| :white_check_mark:         | [no-triple-curlies](./rule/no-triple-curlies.md)                                 |
|                            | [no-unbalanced-curlies](./rule/no-unbalanced-curlies.md)                         |
| :white_check_mark:         | [no-unbound](./rule/no-unbound.md)                                               |
| :white_check_mark:         | [no-unnecessary-component-helper](./rule/no-unnecessary-component-helper.md)     |
| :dress:                    | [no-unnecessary-concat](./rule/no-unnecessary-concat.md)                         |
| :white_check_mark:         | [no-unused-block-params](./rule/no-unused-block-params.md)                       |
|                            | [no-whitespace-for-layout](./rule/no-whitespace-for-layout.md)                   |
|                            | [no-whitespace-within-word](./rule/no-whitespace-within-word.md)                 |
|                            | [no-yield-only](./rule/no-yield-only.md)                                         |
| :dress:                    | [quotes](./rule/quotes.md)                                                       |
| :white_check_mark::wrench: | [require-button-type](./rule/require-button-type.md)                             |
|                            | [require-each-key](./rule/require-each-key.md)                                   |
|                            | [require-form-method](./rule/require-form-method.md)                             |
| :white_check_mark:         | [require-iframe-title](./rule/require-iframe-title.md)                           |
|                            | [require-input-label](./rule/require-input-label.md)                             |
|                            | [require-lang-attribute](./rule/require-lang-attribute.md)                       |
| :white_check_mark:         | [require-valid-alt-text](./rule/require-valid-alt-text.md)                       |
| :dress:                    | [self-closing-void-elements](./rule/self-closing-void-elements.md)               |
| :white_check_mark:         | [simple-unless](./rule/simple-unless.md)                                         |
| :white_check_mark:         | [style-concatenation](./rule/style-concatenation.md)                             |
| :white_check_mark:         | [table-groups](./rule/table-groups.md)                                           |
|                            | [template-length](./rule/template-length.md)                                     |
