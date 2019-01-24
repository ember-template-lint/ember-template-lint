## iframe-has-title

### `<iframe>`

`<iframe>` elements must have a unique title property to indicate its content to the user.

This rule takes no arguments.

This rule **allows** the following:

```hbs
<iframe title="This is a unique title" />
<iframe title={{someValue}} />
```

This rule **forbids** the following:

```hbs
<iframe />
<iframe title="" />
```

### References
 - [Deque University](https://dequeuniversity.com/rules/axe/1.1/frame-title)
 - [eslint-plugin-jsx-a11y/iframe-has-title](https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/iframe-has-title.md)