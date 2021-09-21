# quotes

💅 The `extends: 'stylistic'` property in a configuration file enables this rule.

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

* string -- "double" requires the use of double quotes wherever possible, "single" requires the use of single quotes wherever possible

## Related Rules

* [quotes](https://eslint.org/docs/rules/quotes) from eslint

## References

* [Google style guide/quotes](https://google.github.io/styleguide/htmlcssguide.html#HTML_Quotation_Marks)
