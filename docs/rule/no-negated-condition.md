# no-negated-condition

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

Negated conditions can be hard to reason about and require additional nesting/parenthesis around the condition:

* `if (not condition)`
* `unless (not condition)`

Negated conditions can often be avoided or simplified by:

* Flipping `{{if (not condition)}} {{prop1}} {{else}} {{prop2}} {{/if}}` to `{{if condition}} {{prop2}} {{else}} {{prop1}} {{/if}}`
* Replacing `if (not condition)` with `unless condition`
* Replacing `unless (not condition)` with `if condition`

## Examples

This rule **forbids** the following:

```hbs
{{#if (not condition)}}
  ...
{{/if}}
```

```hbs
{{#if (not condition)}}
  ...
{{else}}
  ...
{{/if}}
```

```hbs
{{#unless (not condition)}}
  ...
{{/unless}}
```

And similar examples with non-block forms like:

```hbs
<img class={{if (not condition) "some-class" "other-class"}}>
```

```hbs
{{input class=(if (not condition) "some-class" "other-class")}}
```

This rule **allows** the following:

```hbs
{{#if condition}}
  ...
{{/if}}
```

```hbs
{{#if condition}}
  ...
{{else}}
  ...
{{/if}}
```

```hbs
{{#unless condition}}
  ...
{{/unless}}
```

And similar examples with non-block forms like:

```hbs
<img class={{if condition "some-class" "other-class"}}>
```

```hbs
{{input class=(if condition "some-class" "other-class")}}
```

## Configuration

The following values are valid configuration:

* boolean -- `true` for enabled / `false` for disabled
* object --
  * `simplifyHelpers` -- boolean - whether to flag and autofix negated helpers like `(not (eq ...))` or `(not (gt ...))` that can be simplified (default `true`)

## Related Rules

* [simple-unless](simple-unless.md)

## References

* [no-negated-condition](https://eslint.org/docs/rules/no-negated-condition) from eslint
