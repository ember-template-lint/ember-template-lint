# no-multiple-empty-lines

:nail_care: The `extends: 'stylistic'` property in a configuration file enables this rule.

Some developers prefer to have multiple blank lines removed, while others feel
that it helps improve readability. Whitespace is useful for separating logical
sections of code, but excess whitespace takes up more of the screen.

This rule aims to reduce the scrolling required when reading through your code.
It will warn when the maximum amount of empty lines has been exceeded.

## Examples

This rule **forbids** the following:

```hbs
<div>foo</div>


<div>bar</div>
```

This rule **allows** the following:

```hbs
<div>foo</div>

<div>bar</div>
```

```hbs
<div>foo</div>
<div>bar</div>
```

## Configuration

* object -- containing the following properties:
  * number -- `max` --  (default: `1`) enforces a maximum number of consecutive empty lines.

## References

* <https://eslint.org/docs/rules/no-multiple-empty-lines>
