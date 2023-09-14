# no-jsx-attributes

Folks coming from React may have developed habits around how they type attributes on elements.
JSX isn't HTML (it's JS), so in JS, you can't have kebab-case identifiers, so JSX uses camelCase.

However, since Ember uses HTML, camelCase attributes are not valid when writing components.

## Examples

This rule **forbids** the following attributes:

```
acceptCharset
accessKey
allowFullScreen
allowTransparency
autoComplete
autoFocus
autoPlay
cellPadding
cellSpacing
charSet
className
contentEditable
contextMenu
crossOrigin
dataTime
encType
formAction
formEncType
formMethod
formNoValidate
formTarget
frameBorder
httpEquiv
inputMode
keyParams
keyType
noValidate
marginHeight
marginWidth
maxLength
mediaGroup
minLength
radioGroup
readOnly
rowSpan
spellCheck
srcDoc
srcSet
tabIndex
useMap
```

## Migration

Convert attributes to kebab-case[^camelCaseNote]

- `<div className="...">` -> `<div class="...">`
- `<video autoPlay>` -> `<video auto-play>`
- `<div contentEditable>` -> `<div content-editable>`
- etc


[^camelCaseNote]: keep in mind that `@args`, and `<:blocks>` should be js-compatible identifiers and be camelCase


## References

- [HTML attribute reference on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes) 
