# require-valid-named-block-naming-format

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

Require named blocks to use a valid naming format (`camelCase` or `kebab-case`).

The default naming format used is `camelCase`.

## Examples

This rule **forbids** the following when the `camelCase` naming format is enabled:

```hbs
{{yield to="foo-bar"}}
{{has-block "foo-bar"}}
{{if (has-block "foo-bar")}}
{{has-block-params "foo-bar"}}
{{if (has-block-params "foo-bar")}}
```

This rule **allows** the following when the `camelCase` naming format is enabled:

```hbs
{{yield to="fooBar"}}
{{has-block "fooBar"}}
{{if (has-block "fooBar")}}
{{has-block-params "fooBar"}}
{{if (has-block-params "fooBar")}}
```

This rule **forbids** the following when the `kebab-case` naming format is enabled:

```hbs
{{yield to="fooBar"}}
{{has-block "fooBar"}}
{{if (has-block "fooBar")}}
{{has-block-params "fooBar"}}
{{if (has-block-params "fooBar")}}
```

This rule **allows** the following when the `kebab-case` naming format is enabled:

```hbs
{{yield to="foo-bar"}}
{{has-block "foo-bar"}}
{{if (has-block "foo-bar")}}
{{has-block-params "foo-bar"}}
{{if (has-block-params "foo-bar")}}
```

## Configuration

- string -- `'camelCase'` Requires the use of the `camelCase` naming format. `'kebab-case'` Requires the use of the `kebab-case` naming format.

## References

- [Naming convention (programming)](https://en.wikipedia.org/wiki/Naming_convention_(programming))
