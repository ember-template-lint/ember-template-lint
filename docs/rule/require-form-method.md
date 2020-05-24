# require-form-method

This rule requires all `<form>` elements to have `method` attribute with `POST`, `GET` or `DIALOG` value.

By default `form` elements without `method` attribute are submitted as `GET` requests.
In usual applications `submit` event listeners are attached to `form` elements and `event.preventDefault()` is called to avoid form submission.

However in case of failure to prevent default action, form submission as `GET` request can leak sensitive end-user information.

Example uses of `GET` requests:

* non-secure data
* bookmarking the submission result
* data search query strings

**Caution** - this rules does not check for `formmethod` attribute on `form` elements themselves.

## Examples

This rule **forbids** the following:

```hbs
<form>Hello world!</form>
<form method="">Hello world!</form>
<form method="random">Hello world!</form>
```

This rule **allows** the following:

```hbs
<form method="post">Hello world!</form>
<form method="get">Hello world!</form>
<form method="dialog">Hello world!</form>
```

## Configuration

The following values are valid configuration:

* boolean - `true` to enable / `false` to disable
* object -- An object with the following keys:
  * `allowedMethods` -- An array of allowed form `method` attribute values, default: `['POST', 'GET', 'DIALOG']`

## References

* [MDN - form method attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-method)
* [HTML spec - form method attribute](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-method)
