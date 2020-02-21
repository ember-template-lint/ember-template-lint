## no-invalid-block-param-definition

Glimmer parser eats warn about incorrect Angle Component block definition. This behaviour may confuse developers and produce tricky bugs.

### Examples

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
