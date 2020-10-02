# no-invalid-interactive

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

Adding interactivity to an element that is not naturally interactive content leads to a very poor experience for
users of assistive technology (i.e. screen readers). In order to ensure that screen readers can provide useful information to their users, we should add an appropriate `role` attribute when the underlying element would not have made that role obvious.

Some complexities of note:

Both a `tabindex` attribute and an interactive role is required to make a custom element interactive; otherwise it is a non-interactive element and not eligible to have an interaction added.

The `<canvas>` element is not an interactive element, but may contain certain interactive elements as descendants. From the HTML spec: `a` elements, `img` elements with `usemap` attributes, `button` elements, `input` elements whose `type` attribute are in the Checkbox or Radio Button states, `input` elements that are buttons, and `select` elements with a multiple attribute or a display size greater than 1.

## Examples

This rule **forbids** the following:

```hbs
<div {{action 'foo'}}></div>
```

```hbs
<div role="button" {{action "foo"}}></div> //missing tabindex
```

This rule **allows** the following:

```hbs
<div role="button" tabindex="0" {{action "foo"}}></div>
```

## Configuration

The following values are valid configuration (same as the `no-nested-interactive` rule above):

* boolean -- `true` indicates all allowed tests will run, `false` indicates that the rule is disabled.
* object - Containing the following values:
  * `ignoredTags` - An array of element tag names that should be allowed. Default to `[]`.
  * `ignoreTabindex` - When `true` tabindex will be ignored. Defaults to `false`.
  * `ignoreUsemapAttribute` - When `true` ignores the `usemap` attribute on `img` and `object` elements. Defaults `false`.
  * `additionalInteractiveTags` - An array of element tag names that should also be considered as interactive. Defaults to `[]`.

## References

* [MDN docs/ARIA roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
* [the canvas element](https://html.spec.whatwg.org/#the-canvas-element)
