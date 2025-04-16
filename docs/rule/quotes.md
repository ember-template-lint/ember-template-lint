# quotes

💅 The `extends: 'stylistic'` property in a configuration file enables this rule.

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

Enforce the consistent use of either double or single quotes.

## Examples

Enforce either:

```hbs
<div class="my-class">test</div>
{{my-helper "hello there"}}
```

or:

```hbs
<div class='my-class'>test</div>
{{my-helper 'hello there'}}
```

## Configuration

The following values are valid configuration:

- string -- "double" requires the use of double quotes wherever possible, "single" requires the use of single quotes wherever possible
- object -- { curlies: "single"|"double"|false, html: "single"|"double"|false } - requires different quotes for Handlebars and HTML syntax

For the object config, the properties `curlies` and `html` can be passed one of the following values: "single", "double", or `false`. If `false` is passed to a property, it will be as if this rule is turned off for that specific syntax.

With the config `{ curlies: false, html: "double" }`, this would be **forbidden**:

```hbs
<div foo='bar'></div>
```

However, this would be **allowed**:

```hbs
{{component "foo"}}
{{test x='y'}}
<div foo="bar"></div>
```

## Related Rules

- [quotes](https://eslint.org/docs/rules/quotes) from eslint

## References

- [Google style guide/quotes](https://google.github.io/styleguide/htmlcssguide.html#HTML_Quotation_Marks)
