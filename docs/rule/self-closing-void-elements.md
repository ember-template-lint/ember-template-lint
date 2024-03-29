# self-closing-void-elements

💅 The `extends: 'stylistic'` property in a configuration file enables this rule.

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

HTML has no self-closing tags. The HTML5 parser will ignore self-closing tag in the case of [void elements](https://www.w3.org/TR/html-markup/syntax.html#void-elements) (tags that shouldn't have a "closing tag"). Although the parser will ignore it, it's
unnecessary and can lead to confusion with SVG/XML code.

## Examples

This rule **forbids** the following:

```hbs
<img src="http://emberjs.com/images/ember-logo.svg" alt="ember" />
<hr/>
```

This rule **allows** the following:

```hbs
<img src="http://emberjs.com/images/ember-logo.svg" alt="ember">
<hr>
```

There may be cases where a self-closing tag may be necessary for void elements. In such cases, a `require` string may be passed to log the missing closing tags.

## Configuration

The following values are valid configuration:

* boolean -- `true` for enabled / `false` for disabled
* string -- `require` to mandate the use of self closing tags

## References

* [HTML spec/void elements](https://html.spec.whatwg.org/#void-elements)
