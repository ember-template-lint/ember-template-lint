## link-rel-noopener

When you want to link in your app to some external page it is very common to use `<a href="url" target="_blank"></a>`
to make the browser open this link in a new tab.
However, this practice has performance problems (see [https://jakearchibald.com/2016/performance-benefits-of-rel-noopener/](https://jakearchibald.com/2016/performance-benefits-of-rel-noopener/))
and also opens a door to some security attacks because the opened page can redirect the opener app
to a malicious clone to perform phishing on your users.
Adding `rel="noopener noreferrer"` closes that door and avoids javascript in the opened tab to block the main
thread in the opener. Also note that Firefox versions prior 52 do not implement `noopener` and `rel="noreferrer"` should be used instead [ see Firefox issue ](https://bugzilla.mozilla.org/show_bug.cgi?id=1222516) and https://html.spec.whatwg.org/multipage/semantics.html#link-type-noreferrer.

This rule forbids the following:

```hbs
<a href="https://i.seem.secure.com" target="_blank">I'm a bait</a>
```

Instead, you should write the template as:

```hbs
<a href="https://i.seem.secure.com" target="_blank" rel="noopener noreferrer">I'm a bait</a>
```

The following values are valid configuration:

  * string -- `strict` for enabled and validating both noopener `and` noreferrer
  * boolean `true` to maintain backwards compatibility with previous versions of `ember-template-lint` that validate noopener `or` noreferrer
  If you are supporting Firefox, you should use `strict`.
