# no-only-default-slot

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

The default slot (`<:default>`) is used to explicitly target the main content block of a component. However, when *only* the default slot is used — with no named slots — the extra syntax is redundant and unnecessary.

This rule disallows using only the `default` slot block when rendering content into a component. The preferred form is to pass the content directly, without the default slot wrapper.

## Motivation

When a component has a single default block like this:

```hbs
<MyComponent>
  <:default>
    Hello!
  </:default>
</MyComponent>
```

The `<:default>` adds no semantic value. It’s simpler and clearer to write:

```hbs
<MyComponent>
  Hello!
</MyComponent>
```

Explicit slot naming should only be used when multiple slots are present, and disambiguation is needed.

## Examples

This rule **forbids** the following:

```hbs
<MyComponent>
  <:default>
    What?
  </:default>
</MyComponent>
```

```hbs
<MyComponent>
  <:default>
    <p>Hello world</p>
  </:default>
</MyComponent>
```

This rule **allows** the following:

```hbs
<MyComponent>
  What?
</MyComponent>
```

```hbs
<MyComponent>
  <:header>
    Header
  </:header>
  <:default>
    Body
  </:default>
</MyComponent>
```

```hbs
<MyComponent>
  <:default>
    Content
  </:default>
  <:footer>
    Footer
  </:footer>
</MyComponent>
```

## Migration

If you see this pattern:

```hbs
<SomeCard>
  <:default>
    Card Content
  </:default>
</SomeCard>
```

Just remove the `<:default>` wrapper:

```hbs
<SomeCard>
  Card Content
</SomeCard>
```

## References

- [Ember Guides – Component Block Content](https://guides.emberjs.com/v5.5.0/components/block-content/)
- [RFC: Named Blocks in Glimmer Components](https://github.com/emberjs/rfcs/blob/master/text/0460-named-blocks.md)
