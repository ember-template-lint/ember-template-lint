# no-input-tagname

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

`{{input tagName=x}}` will result in obtuse errors. Typically, the input will simply fail to render, whether used in block form or inline. The only valid `tagName` for the input helper is `input`. For `textarea`, `button`, and other input-like elements, you should instead create a new component or better use the DOM!

## Examples

This rule **forbids** the following:

```hbs
{{input tagName="foo"}}
{{input tagName=X}}
{{component "input" tagName="foo"}}
{{component "input" tagName=X}}
{{yield (component "input" tagName="foo")}}
{{yield (component "input" tagName=X)}}
```

## Related rules

* [no-link-to-tagname](no-link-to-tagname.md)
- [no-unknown-arguments-for-builtin-components](no-unknown-arguments-for-builtin-components.md)


## References

* [Ember api/input component](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Input?anchor=Input)
* [rfcs/built in components](https://emberjs.github.io/rfcs/0459-angle-bracket-built-in-components.html)
