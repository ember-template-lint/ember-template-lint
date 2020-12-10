# no-invalid-link-title

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

The `title` attribute is a useful way to give users extra context for a link. However, this content should be complementary content and should not be the exact same value as the link text.

This rule checks links for the presence of a `title` attribute and ensures that it is not the same as the link text.

## Examples

This rule **forbids** the following:

```hbs
<a href="https://mytutorial.com" title="read the tutorial">Read the Tutorial</a>
```

This rule **allows** the following:

```hbs
<a href="https://mytutorial.com" title="New to Ember? Read the full tutorial for the best experience">Read the Tutorial</a>,
```

## Migration

* If the `title` attribute value is the same as the link text, it's better to leave it out.

## References

* [Supplementing link text with the title attribute](https://www.w3.org/TR/WCAG20-TECHS/H33.html)
* [Understanding Link Purpose](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-refs.html)
