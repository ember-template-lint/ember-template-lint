# no-unused-disable

Reports `template-lint-disable` comments that are not suppressing any lint violations.

## Examples

This rule aims to help you detect and remove template-lint directives that are no longer needed.

### Examples of **incorrect** usage

```hbs
{{! template-lint-disable no-bare-strings }}
{{t 'greeting'}}
```

```hbs
{{! template-lint-disable-tree no-bare-strings }}
<div>{{t 'greeting'}}</div>
```

### Examples of **correct** usage

```hbs
{{! template-lint-disable no-bare-strings }}
Hello world
```

```hbs
{{! template-lint-disable-tree no-bare-strings }}
<div>Hello world</div>
```

## Configuration

- boolean -- `true` to enable / `false` to disable

## References

- [ESLint no-unused-disable rule](https://eslint.org/docs/rules/no-unused-disable)
