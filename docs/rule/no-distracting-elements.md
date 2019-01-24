## no-distracting-elements

### `<marquee | blink>`

Enforces that no distracting elements are used. Elements that can be visually distracting can cause accessibility issues with visually impaired users. Such elements are most likely deprecated, and should be avoided. By default, the following elements are visually distracting: `<marquee>` and `<blink>`.

This rule **allows** the following:

```hbs
<div></div>
```

This rule **forbids** the following:

```hbs
<marquee></marquee>
<blink></blink>
```


### References

1. [w3.org/TR/WCAG20-TECHS/F47](https://www.w3.org/TR/WCAG20-TECHS/F47.html)
1. [Deque University - marquee](https://dequeuniversity.com/rules/axe/1.1/marquee)
1. [Deque University - blink](https://dequeuniversity.com/rules/axe/1.1/blink)
1. [eslint-plugin-jsx-a11y/no-distracting-elements](https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-distracting-elements.md)
