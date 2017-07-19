## style-concatenation

Ember has a runtime warning that says "Binding style attributes may introduce cross-site scripting vulnerabilities." It can only be avoided by always marking the bound value with `Ember.String.htmlSafe`. While we can't detect statically if you're always providing a safe string, we can detect cases common where it's impossible that you're doing so. For example,

```hbs
<div style="background-style: url({{url}})">
```

is never safe because the implied string concatentation does not propagate `htmlSafe`. Any use of quotes is therefore forbidden. This is forbidden:

```hbs
<div style="{{make-background url}}">
```

whereas this is allowed:

```hbs
<div style={{make-background url}}>
```
