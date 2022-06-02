# no-invalid-link-text

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

Screen readers call up a dialog box that has a list of links from the page, which users refer to decide where they will go. But if many of the links in that list simply say "click here" or "more" they will be unable to use this feature in their screen reader, which is a core navigation strategy.

Additionally, when a link contains no content at all, the link's href ends up as the accessible name. This results in a poor experience and requires the user to resort to trial and error to determine the purpose of the link.

This rule checks links containing a few default words("click here" and "more"), and is configurable so additional words can be added as appropriate for your project. Disallowed list: click here, more info, read more, more. With the `allowEmptyLinks` rule option set to `false`, this rule also disallows links without accessible content.

## Examples

This rule **forbids** the following:

```hbs
<LinkTo>click here</LinkTo>
```

```hbs
<a href={{link}}>more</a>
```

*With `allowEmptyLinks: false`*

```hbs
<LinkTo></LinkTo>
```

```hbs
<a href={{link}}></a>
```

This rule **allows** the following:

```hbs
<LinkTo>Click here to read more about common accessibility failures</LinkTo>
```

```hbs
<a href={{link}}>Read more about semantic html</a>
```

*With `allowEmptyLinks: false`*

```hbs
<a href={{link}} aria-label="Read more about semantic html">...</a>
```

## Configuration

* boolean -- `true` for enabled / `false` for disabled
* object -- Containing the following values:
  * `allowEmptyLinks` - When `false`, empty links are not allowed. Defaults to `false`.

## References

* [Failure of Success Criterion 2.4.9 due to using a non-specific link such as "click here" or "more" without a mechanism to change the link text to specific text.](https://www.w3.org/WAI/WCAG21/Techniques/failures/F84)

* [WCAG 2.4.4: Link Purpose (In Context)](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context)
