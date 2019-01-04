## style-concatenation

Ember has a runtime warning that says:

> Binding style attributes may introduce cross-site scripting vulnerabilities; please ensure that values being bound are properly escaped.

This warning can only be avoided by always marking the bound value with `Ember.String.htmlSafe`. While we can't detect statically if you're always providing a safe string, we can detect common cases where it's impossible that you're doing so.

For example, implied string concatenation does not propagate `htmlSafe`, so any use of quotes is therefore forbidden.

This rule **forbids** the following:

```hbs
<div style="background-style: url({{url}})">
```

```hbs
<div style="{{make-background url}}">
```

This rule **allows** the following:

```hbs
<div style={{make-background url}}>
```

```hbs
<div style={{html-safe (concat knownSafeStyle1 knownSafeStyle2)}}>
```

### References

* See the [Binding Style Attributes](https://emberjs.com/deprecations/v1.x/#toc_binding-style-attributes) Ember deprecation documentation
* See the [documentation](https://www.emberjs.com/api/ember/release/functions/@ember%2Ftemplate/htmlSafe) for Ember's `htmlSafe` function
* See the [documentation](https://github.com/romulomachado/ember-cli-string-helpers#html-safe) for the `html-safe` handlebars helper from the `ember-cli-string-helpers` addon

### Related Rules

* [no-inline-styles](no-inline-styles.md)
