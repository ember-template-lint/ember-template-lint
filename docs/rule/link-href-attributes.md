# link-href-attributes

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

It's common to treat anchor tags as buttons. However, this is a bad practice! The resulting anchor tag without an `href` is completely unfocusable (cannot use keyboard navigation to to land on it, cannot be seen from a screen reader). The most discernible difference between a link (`<a>`) and a `<button>` is that a link navigates the user to a new URL (thus taking the user away from the current context). A `button` toggles something in the interface or triggers new content in that same context (i.e., a popup menu using `aria-haspopup`).

One of the differences between `<a>` elements and `<button>` elements is how they work- the `<button>` can be triggered by either the `SPACEBAR` or the `ENTER` key, while the `<a>` is only triggered by the `ENTER` key. This is important to know, so you can provide appropriately for users who rely UI elements to work in a consistent way.

Instead of using a link, attach the action to the `<button>` element:

```hbs
<button type="button" {{on 'click' this.submit}}>Submit</button>
```

Wherever possible, a link should look like a link, and a button should look like a button. However, if one must choose, the underlying HTML markup and base functionality are more important. In these cases, adding a CSS class with the styling desired may be acceptable.

## Examples

This rule **forbids** the following:

```hbs
<a>I'm a fake link</a>
<a {{action 'handleClick'}}>I'm a fake link</a>
```

This rule **allows** the following:

```hbs
<a href="https://alink.com">I'm a real link</a>
```

## References

* <https://marcysutton.com/links-vs-buttons-in-modern-web-applications>
* <https://a11y-101.com/design/button-vs-link>
* <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role>
