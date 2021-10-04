# no-invalid-block-param-definition

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

There are a few common failure scenarios when using angle bracket components that use block parameters. This rule attempts to identify these pitfalls.

## Examples

This rule **forbids** the following:

```hbs
<MyComponent  |blockParam|>
    {{blockParam}}
</MyComponent>
```

```hbs
<MyComponent  |blockParam>
    {{blockParam}}
</MyComponent>
```

```hbs
<MyComponent  blockParam|>
    {{blockParam}}
</MyComponent>
```

This rule **allows** the following:

```hbs
<MyComponent as |blockParam|>
    {{blockParam}}
</MyComponent>
```

## Related rules

* [no-shadowed-elements](no-shadowed-elements.md)

## References

* [Ember guides/block content](https://guides.emberjs.com/release/components/block-content/)
* [rfcs/angle bracket invocation](https://emberjs.github.io/rfcs/0311-angle-bracket-invocation.html)
* [rfcs/named blocks](https://emberjs.github.io/rfcs/0226-named-blocks.html)
