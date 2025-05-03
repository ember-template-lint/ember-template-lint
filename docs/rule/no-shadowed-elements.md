# no-shadowed-elements

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

This rule prevents ambiguity in situations where a yielded block param which starts with a lower case letter is also
used within the block itself as an element name.

## Examples

This rule **forbids** the following:

```hbs
<FooBar as |div|>
  <div></div>
</FooBar>
```

This rule **allows** the following:

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

## References

* [Ember guides/block content](https://guides.emberjs.com/release/components/block-content/)
* [rfcs/angle bracket invocation](https://emberjs.github.io/rfcs/0311-angle-bracket-invocation.html)
* [rfcs/named blocks](https://emberjs.github.io/rfcs/0226-named-blocks.html)
