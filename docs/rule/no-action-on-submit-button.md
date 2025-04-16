# no-action-on-submit-button

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

In a `<form>`, this rule requires all `<button>` elements with a `type="submit"` attribute to not have any click action.

When the `type` attribute of `<button>` elements is `submit`, the action should be on the `<form>` element instead of directly on the button.

By default, the `type` attribute of `<button>` elements is `submit`.

## Examples

This rule **forbids** the following:

```hbs
<form>
  <button type='submit' {{on 'click' this.handleClick}} />
  <button type='submit' {{action 'handleClick'}} />
  <button {{on 'click' this.handleClick}} />
  <button {{action 'handleClick'}} />
</form>
```

This rule **allows** the following:

```hbs
// In a <form>
<form>
  <button type='button' {{on 'click' this.handleClick}} />
  <button type='button' {{action 'handleClick'}} />
  <button type='submit' />
  <button />
</form>

// Outside a <form>
<button type='submit' {{on 'click' this.handleClick}} />
<button type='submit' {{action 'handleClick'}} />
<button {{on 'click' this.handleClick}} />
<button {{action 'handleClick'}} />
```

## Related Rules

- [require-button-type](require-button-type.md)

## References

- [HTML spec - the button element](https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type)
