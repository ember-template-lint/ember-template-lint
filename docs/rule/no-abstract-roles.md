## no-abstract-roles

The HTML attribute role should never have the following values:

* command
* composite
* input
* landmark
* range
* roletype
* section
* sectionhead
* select
* structure
* widget
* window

### `<* role>`

This rule **forbids** the following:

```hbs
<button role="window">
```

This rule **allows** the following:

```hbs
<img role="button">
```

### References
* See [https://www.w3.org/TR/wai-aria-1.0/roles#abstract_roles](https://www.w3.org/TR/wai-aria-1.0/roles#abstract_roles)