## self-closing-void-elements

HTML has no self-closing tags. The HTML 5 parser will ignore self-closing tag in
the case of [`void elements`](https://www.w3.org/TR/html-markup/syntax.html#void-element)
(tags that shouldn't have a `closing tag`). Although the parser will ignore it's
unnecessary and can lead to confusing with SVG/XML code.

This rule forbids the following:

```hbs
<img src="http://emberjs.com/images/ember-logo.svg" alt="ember" />
<hr/>
```

Instead, you should write the template as:

```hbs
<img src="http://emberjs.com/images/ember-logo.svg" alt="ember">
<hr>
```

There may be cases where a self-closing tag may be necessary for void elements. In such cases, a `require` string may be passed to log the missing closing tags.

The following values are valid configuration:

  * boolean -- `true` for enabled / `false` for disabled
  * string -- `require` to mandate the use of self closing tags
