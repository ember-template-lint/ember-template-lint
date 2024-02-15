# no-unnecessary-curly-parens

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

Parentheses are used to wrap helpers within mustache expressions. The only situation where it is required to wrap the entire mustache expression is when invoking a helper without providing any arguments.

## Examples

This rule **forbids** the following:

```hbs
{{(concat "a" "b")}}
{{(helper a="b")}}
```

This rule **allows** the following:

```hbs
{{foo}}
{{(foo)}}
{{concat "a" "b"}}
{{concat (capitalize "foo") "-bar"}}
```

## References

* Ember's [Helper Functions](https://guides.emberjs.com/release/components/helper-functions/) guide
