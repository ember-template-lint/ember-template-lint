## no-curly-component-invocation

There are two ways to invoke a component in a template: curly compoment syntax
(`{{my-component}}`), and angle bracket syntax (`<MyComponent />`). The
difference between them is syntactical. You should favour angle bracket syntax
as it improves readability of templates, i.e. disambiguates components from
helpers, and is also the future direction Ember is going with the Octane
Edition.

This rule checks all the curly braces in your app and warns about those that
look like they could be component invocations.

### Examples

This rule **forbids** the following:

```hbs
{{bad-code}}
{{#bad-code}}{{/bad-code}}
{{nested/bad-code}}
{{#nested/bad-code}}{{/nested/bad-code}}
```

This rule **allows** the following:

```hbs
<GoodCode />
<GoodCode></GoodCode>
<Nested::GoodCode />
<Nested::GoodCode></Nested::GoodCode>
```

```hbs
{{! whitelisted helpers}}
{{some-valid-helper param}}
{{some/some-valid-helper param}}
```

```hbs
{{! in-built helpers}}
{{if someProperty "yay"}}
{{#each items as |item|}}
  {{item}}
{{/each}}
```

### Migration

- use https://github.com/ember-codemods/ember-angle-brackets-codemod

### Configuration

- object -- containing the following properties:
  - boolean -- `requireDash` -- if `true`, the rule only considers curly
    invocations with a `-` character as potential component invocations
    (default: `true`)
  - array -- `allow` -- a list of curly invocation paths that are known to
    **not** be component invocations
  - array -- `disallow` -- a list of curly invocation paths that are known to
    be component invocations

### References

- [RFC #311](https://github.com/emberjs/rfcs/pull/311) (Angle Bracket Syntax)
- [RFC #457](https://github.com/emberjs/rfcs/pull/457) (Nested Components)
- [RFC #459](https://github.com/emberjs/rfcs/pull/459) (Angle Bracket Syntax for built-in components)
