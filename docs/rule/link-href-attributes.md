# link-href-attributes

It's common to treat anchor tags as buttons. However, this is typically considered bad practice, as an anchor tag without an `href` is unfocusable which breaks accessibility. The most discernable difference between a link (`<a>`) and a `<button>` is that a link navigates the user to a new URL (thus taking the user away from the current context). A `button` toggles something in the interface or triggers new content in that same context (i.e., a popup menu using `aria-haspopup`).

One of the differences between `<a>` elements and `<button>` elements is how they work- the `<button>` can be triggered by either the `SPACEBAR` or the `ENTER` key, while the `<a>` is only triggered by the `ENTER` key. This is important to know, so you can provide appropriately for users who rely UI elements to work in a consistent way.

Wherever possible, a link should look like a link, and a button should look like a button. However, the underlying HTML markup and base functionality are more important here (if one has to choose).

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
