# no-named-arguments-with-global-attribute-names

Angle bracket components use `@argumentName` to denote named arguments.

Named arguments that use the same names as global attribute can cause confusion, especially when the `...attributes` spread syntax is applied.

This rule will emit an error if a named argument is passed with a name that matches any HTML-specified global attribute, including `data-*` attributes, `aria-*` attributes, and event handler attributes like `onclick`.

This rule only applies to angle bracket components, as curly component invocation and standard HTML elements do not use named argument syntax. This rule does not apply to named arguments to helpers, as `...attributes` cannot be spread into helpers.

## Examples

This rule **forbids** the following:

```hbs
  <MyComponent
    @class="shaded"
    @id="ichi"
    @data-id="ichiban"
    @aria-valuemin={{0}}
  />
```

```hbs
  <MyComponent
    @onclick={{action "increment"}}
  />
```

This rule **allows** the following:

```hbs
  <MyComponent
    class="shaded"
    id="ichi"
    data-id="ichiban"
    aria-valuemin={{0}}
  />
```

```hbs
  <MyComponent
    {{on "click" this.increment}}
  />
```

## Configuration

- boolean -- if `true`, default configuration is applied (`allow: []`, `disallow: []`),

- object -- containing the following properties:
  - array -- `disallow` -- a list of names that **cannot** be invoked as named arguments, in addition to the defaults. Do not include the `@` prefix in names passed to this configuration.
  - array -- `allow` -- a list of names that **can** be invoked as named arguments. the `allow` list takes precedence, overriding both the default list of disallowed names, and any names passed in the `disallow` configuration. Do not include the `@` prefix in names passed to this configuration.

## Related Rules

- [no-arguments-for-html-elements](no-argument-for-html-elements.md)

## References

- [MDN: global attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes)
- This rule could be useful when running [ember-angle-brackets-codemod](https://github.com/ember-codemods/ember-angle-brackets-codemod)
