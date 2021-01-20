# no-this-in-template-only-components

There is no `this` context in template-only components.

:wrench: The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

## Examples

This rule **forbids** `this` if the template has no corresponding `component.js`:

```hbs
<h1>Hello {{this.name}}!</h1>
```

This rule **allows** `this` if the template has a corresponding `component.js`:

```js
import Component from '@ember/component';

export default Component.extend({
  name: 'Derek'
});
```

```hbs
<h1>Hello {{this.name}}!</h1>
```

The `--fix` option will convert to named arguments:

```hbs
<h1>Hello {{@name}}!</h1>
```

## Configuration

* boolean -- `true` for enabled / `false` for disabled
* object -- An object with the following keys:
  * `validComponentExtensions` -- An array of component class extensions. Defaults to `[ '.js', '.ts' ]`

## Migration

* use [ember-no-implicit-this-codemod](https://github.com/ember-codemods/ember-no-implicit-this-codemod)
* [upgrade to Glimmer components](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/), which don't allow ambiguous access
  * classic components have [auto-reflection](https://github.com/emberjs/rfcs/blob/master/text/0276-named-args.md#motivation), and can use `this.myArgName` or `this.args.myArgNme` or `@myArgName` interchangeably

## References

* [Glimmer components](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/)
* [rfcs/named args](https://github.com/emberjs/rfcs/blob/master/text/0276-named-args.md#motivation)
