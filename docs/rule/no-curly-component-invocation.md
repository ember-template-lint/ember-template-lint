# no-curly-component-invocation

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

There are two ways to invoke a component in a template: curly component syntax
(`{{my-component}}`), and angle bracket syntax (`<MyComponent />`). The
difference between them is syntactical. You should favour angle bracket syntax
as it improves readability of templates, i.e. disambiguates components from
helpers, and is also the future direction Ember is going with the Octane
Edition.

This rule checks all the curly braces in your app and warns about those that
look like they could be component invocations.

## Examples

- `{{foo}}` ❌
  (simple mustache without `-` in the path is likely to be a property; unless
  `noImplicitThis` is set or in `disallow` list and not a scoped variable)

- `{{foo.bar}}` ❌
  (simple mustache with nested path is likely to be a nested property; unless
  `noImplicitThis` is set)

- `{{foo-bar}}` ❌ (angle brackets: `<FooBar />`)
  (simple mustache with `-` in the path is more likely a component than a
  property or helper; unless in `allow` list)

- `{{nested/component}}` ❌ (angle brackets: `<Nested::Component />`)
  (simple mustache with `/` in the path is more likely a component than a
  property or helper; unless in `allow` list)

- `{{42}}` ✅
  (literal value mustaches)

- `{{foo bar}}` ✅
  (mustache with positional parameters can't be converted to angle brackets
  syntax)

- `{{foo bar=baz}}` ❌ (angle brackets: `<Foo @bar={{baz}} />`)
  (mustache with only named parameters is likely a component; unless in
  `allow` list)

  Setting `requireDash: true` lets `{{foo bar=baz}}` pass, but
  `{{foo-bar bar=baz}}` fails

- `<div {{foo}} />` ✅
  (mustache is a modifier)

- `<Foo @bar={{baz}} />` ✅
  (mustache is an argument or attribute)

- `{{#foo}}{{/foo}}` ❌ (angle brackets: `<Foo></Foo>`)
  (block mustache is considered a component unless it has positional
  parameters, an inverse block, or is in `allow` list)

- `{{#foo bar}}{{/foo}}` ✅
  (block mustache with positional parameters can't be converted to angle
  brackets syntax)

- `{{#foo}}bar{{else}}baz{{/foo}}` ✅
  (block mustache with inverse block can't be converted to angle
  brackets syntax)

- `{{link-to "bar" "foo"}}` ❌ (angle brackets: `<LinkTo @route="foo">bar</LinkTo>`)
  (inline form of the built-in `link-to` component)

- `{{#link-to "foo"}}bar{{/link-to}}` ❌ (angle brackets: `<LinkTo @route="foo">bar</LinkTo>`)
  (block form of the built-in `link-to` component)

## Migration

- use <https://github.com/ember-codemods/ember-angle-brackets-codemod>

## Configuration

- boolean -- if `true`, default configuration is applied
  (`noImplicitThis: true`, `requireDash: false`), see below for details

- object -- containing the following properties:
  - boolean -- `noImplicitThis` -- if `true`, the rule considers all simple
    curly invocations without positional or named arguments as components unless
    they are prefixed with `this.` or `@`
    (default: `true`)
  - boolean -- `requireDash` -- if `true`, the rule only considers curly
    invocations with a `-` character as potential component invocations
    (default: `false`)
  - array -- `allow` -- a list of curly invocation paths that are known to
    **not** be component invocations
  - array -- `disallow` -- a list of curly invocation paths that are known to
    be component invocations

## References

- [RFC #311](https://github.com/emberjs/rfcs/pull/311) (Angle Bracket Syntax)
- [RFC #457](https://github.com/emberjs/rfcs/pull/457) (Nested Components)
- [RFC #459](https://github.com/emberjs/rfcs/pull/459) (Angle Bracket Syntax for built-in components)
