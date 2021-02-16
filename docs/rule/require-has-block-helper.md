# require-has-block-helper

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

In Ember 3.26 the properties `hasBlock` and `hasBlockParams` were deprecated. Their replacement is to use `has-block` and `has-block-params` helpers instead.

This rule prevents the usage of `hasBlock` and `hasBlockParams` and suggests using `has-block` or `has-block-params` instead.

For more information about this deprecation you can view the [RFC](https://github.com/emberjs/rfcs/blob/master/text/0689-deprecate-has-block.md) or its entry on the [Deprecations page](https://deprecations.emberjs.com/v3.x/#toc_has-block-and-has-block-params).

## Examples

This rule **forbids** the following:

```hbs
{{hasBlock}}
{{#if hasBlock}}

{{/if}}
```

```hbs
{{hasBlockParams}}
{{#if hasBlockParams}}

{{/if}}
```

This rule **allows** the following:

```hbs
{{has-block}}
{{#if (has-block)}}

{{/if}}
```

```hbs
{{has-block-params}}
{{#if (has-block-params)}}

{{/if}}
```

## Migration

:wrench: The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

- `{{hasBlock}}`-> `{{has-block}}
- `{{hasBlockParams}}`-> `{{has-block-params}}
- `{{#if hasBlock}} {{/if}}`-> `{{#if (has-block)}} {{/if}}`
- `{{#if (hasBlock "inverse")}} {{/if}}`-> `{{#if (has-block "inverse")}} {{/if}}`
- `{{#if hasBlockParams}} {{/if}}`-> `{{#if (has-block-params)}} {{/if}}`
- `{{#if (hasBlockParams "inverse")}} {{/if}}`-> `{{#if (has-block-params "inverse")}} {{/if}}`

## References

- [RFC](https://github.com/emberjs/rfcs/blob/master/text/0689-deprecate-has-block.md)
- [Deprecation information](https://deprecations.emberjs.com/v3.x/#toc_has-block-and-has-block-params)
