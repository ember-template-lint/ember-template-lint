## quotes

Enforce the consistent use of either double or single quotes. Similar to https://eslint.org/docs/rules/quotes.

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

The following values are valid configuration:

  * string -- "double" requires the use of double quotes wherever possible, "single" requires the use of single quotes wherever possible
