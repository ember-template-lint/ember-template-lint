# no-action-on-submit-button

This rule requires all `<button>` elements with a `type="submit"` attribute to not have any click action.

When the `type` attribute of `<button>` elements is `submit`, the action should be on the `<form>` element instead of directly on the button.

By default, the `type` attribute of `<button>` elements is `submit`.

## Examples

This rule **forbids** the following:

```hbs
<button type="submit" {{on "click" this.handleClick}} />
<button type="submit" {{action "handleClick"}} />
<button {{on "click" this.handleClick}} />
<button {{action "handleClick"}} />
```

This rule **allows** the following:

```hbs
<button type="button" {{on "click" this.handleClick}} />
<button type="button" {{action "handleClick"}} />
<button type="submit" />
<button />
```

## Related Rules

- [require-button-type](require-button-type.md)

## References

- [HTML spec - the button element](https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type)
