# no-arguments-for-html-elements

Angle bracket components use the `@argument` style and that's why users are more likely to start making this mistake.

For case like:

```hbs
<option @value="1" />
```

we have untrackable error like

```txt
Uncaught (in promise) TypeError: func is not a function
    at Compilers.compile
    at compile
    at LazyCompiler.add
    at CompilableBlock.compile
    at Object.evaluate
    at AppendOpcodes.evaluate
    at LowLevelVM.evaluateSyscall
    at LowLevelVM.evaluateInner
    at LowLevelVM.evaluateOuter
    at VM.next
```

This is untraceable for end-users.
This linting rule determines if it is a component or not and emits an error if argument is assigned to a lower-case element without the same block name and without dots in notation.

This rule will also emit an error for these other conditions:

- trying to specify "path-like" string as attribute argument
- trying to use an HTML element with block params

## Examples

This rule **forbids** the following:

```hbs
<picture @name="Cat" >
```

```hbs
<img @src="1" >
```

```hbs
<img src="this.picture" >
```

```hbs
<img src="@img" >
```

```hbs
<div as |blockName|>
    {{blockName}}
</div>
```

This rule **allows** the following:

```hbs
<Picture @name="Cat" />
```

```hbs
<Img @src="1" />
```

```hbs
<img src={{this.picture}} >
```

```hbs
<img src={{@img}} >
```

```hbs
<MyComponent as |blockName|>
  {{blockName}}
</MyComponent>
```

```hbs
{{#let (component "bar" as |foo|}}
  <foo @name="1" />
{{/let}}
```

```hbs
<foo.some.name @name="1"/>
<@foo @name="2" />
<@foo.bar @name="2" />
```

```hbs
<MyComponent>
  <:slot @name="Header"></:slot>
</MyComponent>
```

## References

- [Component Arguments and HTML Attributes](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/)
