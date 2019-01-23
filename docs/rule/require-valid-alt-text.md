## require-valid-alt-text

Enforce that all elements that require alternative text have meaningful information to relay back to the end user. This is a critical component of accessibility for screenreader users in order for them to understand the content's purpose on the page. By default, this rule checks for alternative text on the following elements: `<img>`, `<area>`, `<input type="image">`, and `<object>`.


This rule **forbids** the following:


### `<img>`

An `<img>` must have the `alt` prop set with meaningful text or as an empty string to indicate that it is an image for decoration.

The content of an `alt` attribute is used to calculate the accessible label of an element, whereas the text content is used to produce a label for the element. For this reason, adding a label to an icon can produce a confusing or duplicated label on a control that already has appropriate text content.

If it's not a meaningful image, it should have an empty alt attribute value and have the role of presentation or none.

This rule **forbids** the following:

```hbs
<img src="rwjblue.png">
```

This rule **allows** the following:

```hbs
<img src="rwjblue.png" alt="picture of Robert Jackson">
```

### `<object>`
Add alternative text to all embedded `<object>` elements using either inner text, setting the `title` prop, or using the `aria-label` or `aria-labelledby` props.


This rule **forbids** the following:

```hbs
<object width="128" height="256"></object>
```

This rule **allows** the following:

```hbs
<object width="128" height="256" title="Middle-sized"></object>
<object width="128" height="256" aria-label="Middle-sized"></object>
<object width="128" height="256" aria-labelledby="Middle-sized"></object>
```


### `<input type="image">`
All `<input type="image">` elements must have a non-empty `alt` prop set with a meaningful description of the image or have the `aria-label` or `aria-labelledby` props set.

This rule **forbids** the following:

```hbs
<input type="image">
```

This rule **allows** the following:

```hbs
<input type="image" alt="Select image to upload">
```

### `<area>`
All clickable `<area>` elements within an image map have an `alt`, `aria-label` or `aria-labelledby` prop that describes the purpose of the link.

This rule **forbids** the following:

```hbs
<area shape="poly" coords="113,24,211,0" href="inform.html">
```

This rule **allows** the following:

```hbs
<area shape="poly" coords="113,24,211,0" href="inform.html" alt="Inform">
```

### References

* See [WCAG Suggestion H37](https://www.w3.org/TR/WCAG20-TECHS/H37.html)
* Ref [eslint-plugin-jsx-a11y/alt-text](https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/alt-text.md)
