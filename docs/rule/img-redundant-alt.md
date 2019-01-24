## img-redundant-alt

Enforce img alt attribute does not contain the word image, picture, or photo. Screenreaders already announce `img` elements as an image. There is no need to use words such as *image*, *photo*, and/or *picture*.

## `<img>`

The rule will first check if `aria-hidden` is true to determine whether to enforce the rule. If the image is hidden, then rule will always succeed.

This rule **allows** the following:
```hbs
<img src="foo" alt="Foo eating a sandwich." />
<img src="bar" aria-hidden alt="Picture of me taking a photo of an image" /> // Will pass because it is hidden.
<img src="baz" alt="Baz taking a {{photo}}" /> // This is valid since photo is a variable name.
```

This rule **forbids** the following:

```hbs
<img src="foo" alt="Photo of foo being weird." />
<img src="bar" alt="Image of me at a bar!" />
<img src="baz" alt="Picture of baz fixing a bug." />
```

### References

 - [eslint-plugin-jsx-a11y/img-redundant-alt](https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/img-redundant-alt.md)