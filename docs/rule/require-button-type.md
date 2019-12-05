## require-button-type

This rule requires all `<button>` elements to have a valid `type` attribute.

By default, the `type` attribute of `<button>` elements is `submit`. This can
be very confusing, when a button component is developed in isolation without
`type="button"`, and when inside a `<form>` element it suddenly starts to
submit the form.

This rule **forbids** the following:

```hbs
<button>Hello World!</button>
<button type="">Hello World!</button>
<button type="invalid">Hello World!</button>
```

This rule **allows** the following:

```hbs
<button type="button">Hello World!</button>
<button type="submit">Hello World!</button>
<button type="reset">Hello World!</button>
```

### References

* Red [HTML spec - the button element](https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type)
