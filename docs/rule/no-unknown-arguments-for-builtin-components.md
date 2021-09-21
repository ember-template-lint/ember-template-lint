# no-unknown-arguments-for-builtin-components

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

The builtin components `LinkTo`, `Input`, `Textarea` has list of allowed arguments, and some argument names may be mistyped, this rule trying to highlight possible typos, checking for unknown arguments, also, some components has conflicted and required arguments, rule addressing this behavior.

This rule warns about `unknown`, `required` and `conflicted` arguments for `LinkTo`, `Input`, `Textarea` components.

## Examples

This rule **forbids** the following:

```hbs
<LinkTo @unsupportedArgument="foo"> some link with unknown argument</LinkTo>
<LinkTo @route="info" @model="a" @models="b"> info </LinkTo>
<LinkTo @models="b"> info </LinkTo>
```

```hbs
<Input @foo="bar" />
```

```hbs
<Textarea @foo="bar" />
```

This rule **allows** the following:

```hbs
<LinkTo @route="readme"> readme </LinkTo>
```

```hbs
<Input @value="someValue" />
```

```hbs
<Textarea @value="someValue" />
```

## Migration

* Check references section to get allowed arguments list.
* If argument represents html attribute, remove `@` from name.

## Related Rules

* [no-link-to-tagname](no-link-to-tagname.md)
* [no-input-tagname](no-input-tagname.md)
* [builtin-component-arguments](builtin-component-arguments.md)

## References

* [Reduce API Surface of Built-In Components](https://github.com/emberjs/rfcs/blob/master/text/0707-modernize-built-in-components-2.md#summary)
