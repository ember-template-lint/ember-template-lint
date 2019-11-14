## no-arguments-for-html-elements

For case like

```hbs
<option @value="1" />
```

we have untrackable error like

```
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

This is creepy and untracable (for end-users).
Using this linting rule we can guess (is it component or not) and emit error if argument assigned to lowercased element without same block name and without dots in notation.

This rule also emit error if we trying to specify "path-like" string as attribute argument.
Also, error will be thrown if we trying to use HTML element with block-params.

### Examples

This rule **forbids** the following:

```hbs
<picture @name="Cat" >
```

```hbs
<img @src="1" >`
```

```hbs
<img src="this.picture" >`
```

```hbs
<img src="@img" >`
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
<img src={{this.picture}} >`
```

```hbs
<img src={{@img}} >`
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
