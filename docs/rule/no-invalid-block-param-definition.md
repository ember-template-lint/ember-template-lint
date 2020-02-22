# no-invalid-block-param-definition

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
