## no-shadowed-elements

This rule prevents situations where a `variable` declared within an iterator has the same `name` than any other primitive element like `<div>, <body>` etc.

The following code will throw an error:

```hbs
<FooBar as |div|>
  <div></div>
</FooBar>
```
The following code will be accepted:

```hbs
{{#foo-bar as |Baz|}}
  <Baz />
{{/foo-bar}}

<FooBar as |Baz|>
  <Baz />
</FooBar>

{{#with foo=(component "blah-zorz") as |Div|}}
  <Div></Div>
{{/with}}

<Foo as |bar|>
  <bar.baz />
</Foo>
```