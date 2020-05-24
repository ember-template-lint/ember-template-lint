# no-html-comments

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

HTML comments in your templates will get compiled and rendered into the DOM at runtime. This is undesirable in a production environment. Instead, you can annotate your templates using Handlebars comments, which will be stripped out when the template is compiled and have no effect at runtime.

## Examples

This rule **forbids** the following:

```hbs
<!-- comment goes here -->
```

This rule **allows** the following:

```hbs
{{!-- comment goes here --}}
```
