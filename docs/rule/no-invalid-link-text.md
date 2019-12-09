## no-invalid-link-text

Screen readers call up a dialog box that has a list of links from the page, which users refer to decide where they will go. But if many of the links in that list simply say "click here" or "more" they will be unable to use this feature in their screen reader, which is a core navigation strategy.

This rule checks links containing a few default words("click here" and "more"), and is configurable so additional words can be added as appropriate for your project.

### Examples

This rule **forbids** the following:

```hbs
<LinkTo>click here</LinkTo>
```

```hbs
{{link-to}}more{{/link-to}}
```

This rule **allows** the following:

```hbs
<LinkTo>Click here to read more about plastics in the ocean</LinkTo>
```

```hbs
{{link-to}}Read more about semantic html{{/link-to}}
```

### Configuration

* object -- containing the following properties:
  * string -- `parameterName1` -- description of parameter including the possible values and default value
  * boolean -- `parameterName2` -- description of parameter including the possible values and default value

### References

* [Failure of Success Criterion 2.4.9 due to using a non-specific link such as "click here" or "more" without a mechanism to change the link text to specific text.](https://www.w3.org/WAI/WCAG21/Techniques/failures/F84)
