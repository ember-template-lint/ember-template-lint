# no-link-to-tag-name

The builtin `LinkTo` component generates an `<a>` element. Since it is still
built on top of `Ember.Component` it is possible to assign a `tagName` from the
outside to change that `<a>` element into something else. This goes against
several a11y rules though, because elements that link somewhere should be links,
which have to be represented by `<a>` elements.

This rule looks for `LinkTo` component invocations where a custom `tagName` is
assigned and warns about them.

## Examples

This rule **forbids** the following:

```hbs
<LinkTo @route="routeName" @tagName="button">Link text</LinkTo>
```

```hbs
{{#link-to "routeName" tagName="button"}}Link text{{/link-to}}
```

```hbs
{{link-to "Link text" "routeName" tagName="button"}}
```

This rule **allows** the following:

```hbs
<LinkTo @route="routeName">Link text</LinkTo>
```

```hbs
{{#link-to "routeName"}}Link text{{/link-to}}
```

```hbs
{{link-to "Link text" "routeName"}}
```

## Migration

- Remove the `tagName` overrides and, if you need it, adjust the styling of the
  `<a>` elements to make them look like buttons
