# no-triple-curlies

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

Usage of triple curly braces to allow raw HTML to be injected into the DOM is a large vector for exploits of your application (especially when the raw HTML is user-controllable). Instead of using `{{{foo}}}`, you should use appropriate helpers or computed properties that return a `SafeString` (via `Ember.String.htmlSafe` generally) and ensure that user-supplied data is properly escaped.

## Examples

This rule **forbids** the following:

```hbs
{{{foo}}}
```

This rule **allows** the following:

```hbs
{{foo}}
```

## References

* See the [documentation](https://api.emberjs.com/ember/release/functions/@ember%2Ftemplate/htmlSafe) for Ember's `htmlSafe` function
