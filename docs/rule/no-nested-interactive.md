## no-nested-interactive

Usage of nested `interactive content` can lead to UX problems, accessibility
problems, bugs and in some cases to DOM errors. You should not put interactive
content elements nested inside other interactive content elements. Instead using
nested interactive content elements you should separate them and put them one
after the other.

This rule forbids the following:

```hbs
<button type="button">
  Click here and <a href="/">go to home here</a>
</button>
```

The following values are valid configuration:

  * boolean -- `true` indicates all whitelist test will run, `false` indicates that the rule is disabled.
  * object - Containing the following values:
    * `ignoredTags` - An array of element tag names that should be whitelisted. Default to `[]`.
    * `ignoreTabindex` - When `true` tabindex will be ignored. Defaults to `false`.
    * `ignoreUsemapAttribute` - When `true` ignores the `usemap` attribute on `img` and `object` elements. Defaults `false`.
    * `additionalInteractiveTags` - An array of element tag names that should also be considered as interactive. Defaults to `[]`.'
