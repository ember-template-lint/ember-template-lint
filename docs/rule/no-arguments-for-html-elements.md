# no-arguments-for-html-elements

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

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

## Examples

This rule **forbids** the following:

```hbs
<picture @name="Cat" >
```

```hbs
<img @src="1" >
```

This rule **allows** the following:

```hbs
<Picture @name="Cat" />
```

```hbs
<Img @src="1" />
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

## Related Rules

* [no-potential-path-strings](no-potential-path-strings.md)

## References

* [Component Arguments and HTML Attributes](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/)
