# no-block-params-for-html-elements

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

Block parameters (`<Checkbox as |checkbox|>`) are only useful when invoking
components. When they are used on regular HTML elements they are useless and an
indicator of a potential bug.

This rule warns about all block parameter usages on regular HTML elements
(angle bracket invocations with lower-case tagnames).

## Examples

This rule **forbids** the following:

```hbs
<div as |blockName|></div>
```

This rule **allows** the following:

```hbs
<div></div>
```

```hbs
<Checkbox as |blockName|></Checkbox>
```

## Migration

- Remove the unused block parameters or fix the tag name to refer to a component

## Related Rules

- [no-arguments-for-html-elements](no-arguments-for-html-elements.md)

## References

- [Component Arguments and HTML Attributes](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/)
