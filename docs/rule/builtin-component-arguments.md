# builtin-component-arguments

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

The builtin `Input` component has several arguments that match attributes
of the lower-case `input` HTML element. These arguments should be set via e.g.
`@type`, instead of `type`, but it is easy to forget and can cause subtle
issues.

This rule warns about `Input` component invocations that use the following attributes instead of arguments:

* `checked`
* `type`
* `value`

The builtin `Textarea` component has several arguments that match properties
of the lower-case `textarea` HTML element. These arguments should be set via e.g.
`@value`, instead of `value`, but it is easy to forget and can cause subtle
issues.

This rule warns about `Textarea` component invocations that use the following attributes instead of arguments:

* `value`

Please note that this rule currently only warns about these three attributes on
the `Input`, `Textarea` components, but might be extended in the future to also warn about
other attributes or builtin components.

## Examples

This rule **forbids** the following:

```hbs
<Input type="text" size="10" />
```

```hbs
<Input @type="checkbox" checked />
```

```hbs
<Textarea value="Hello, Tom!" /></Textarea>
```

This rule **allows** the following:

```hbs
<input type="text" size="10" />
```

```hbs
<Input @type="text" size="10" />
```

```hbs
<Input @type="checkbox" @checked={{true}} />
```


```hbs
<Textarea @value="Hello, Tom!" /></Textarea>
```

## Migration

* Add the `@` character in front of the relevant attributes to convert them
  into component argument

## Related Rules

- [no-unknown-arguments-for-builtin-components](no-unknown-arguments-for-builtin-components.md)

## References

* [`Input` component API documentation](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Input?anchor=Input)
* [`Textarea` component API documentation](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Textarea?anchor=Textarea)
