# no-mut-helper

## Reasons to not use [the `mut` helper](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each?anchor=mut)

1. General problems in the programming model:
   * The mut helper is non-intuitive to use, see, teach, and learn since it can either be a getter or a setter based on the context in which it’s used.

   Example:

   ```hbs
   {{#let (mut this.foo) as |foo|}}
     <!-- When used like this, it's a getter -->
     {{foo}}

     <!-- When used like this, it's a setter -->
     <button {{action foo 123}}>Update Foo</button>
   {{/let}}
   ```

   * The need for the [no-extra-mut-helper-argument](no-extra-mut-helper-argument.md) rule is further evidence that `mut` has a non-intuitive signature and frequently gets misused.
   * The mut helper is usually only used as a pure setter, in which case there are other template helpers that are pure setters that could be used instead of mut (e.g. [ember-set-helper](https://github.com/pzuraq/ember-set-helper)).
2. Incompatibility with Glimmer Component intentions:

   * The mut helper can re-introduce 2 way data binding into Glimmer Components on named arguments where a child can change a parent’s data, which goes against the Data Down Actions Up principle, goes against Glimmer Components’ intention to have immutable arguments, and is [discouraged by the Ember Core team](https://www.pzuraq.com/on-mut-and-2-way-binding/).

Example:

```hbs
<input
  type="checkbox"
  checked={{@checked}}
  {{on "change" (fn (mut @checked) (not @checked))}}
/>
```

## What this rule does

This rule forbids any use of the `mut` helper, both as a getter and a setter, in any context. It also
surfaces possible alternatives in the lint violation message to help guide engineers to resolving
the lint violations.

## Examples

This rule **forbids** the following:

```hbs
<MyComponent @isDropdownOpen={{mut this.isDropdownOpen}}/>
```

```hbs
<button {{action (mut this.isDropdownOpen) false}}>Close Dropdown</button>
```

```hbs
<MyComponent @closeDropdown={{action (mut this.isDropdownOpen) false}}/>
```

```hbs
<MyComponent onclick={{fn (mut this.isDropdownOpen) false}}/>
```

```hbs
<Input onchange={{action (mut this.profile.description) value="target.value"}}/>
```

```hbs
{{my-component click=(action (mut this.isDropdownOpen) false)}}
```

```hbs
{{my-component value=(mut this.profile.description)}}
```

This rule **allows** the following:

```hbs
<MyComponent @isDropdownOpen={{this.isDropdownOpen}}/>
```

```hbs
<button {{action (set this "isDropdownOpen" false)}}>Close Dropdown</button>
```

```hbs
<button {{on "click" (set this "isDropdownOpen" false)}}>Close Dropdown</button>
```

```hbs
<button {{on "click" (fn this.setIsDropdownOpen false)}}>Close Dropdown</button>
```

```hbs
<button {{action "setIsDropdownOpen" false}}>Close Dropdown</button>
```

```hbs
<MyComponent @closeDropdown={{action this.setIsDropdownOpen false}}/>
```

```hbs
<MyComponent onclick={{fn this.setIsDropdownOpen false}}/>
```

```hbs
<Input onchange={{action this.setProfileDescription}}/>
```

Coupled with a corresponding JS action to set:

```js
@action
setProfileDescription({ target: { value } }) {
  set(this, 'profile.description', value);
}
```

```hbs
{{my-component click=(action (set this "setIsDropdownOpen" false)}}
```

```hbs
{{my-component value=this.profile.description}}
```

## Migration

1. When used as a pure setter only, `mut` could be replaced by a JS action ("Option 1" below) or [ember-set-helper](https://github.com/pzuraq/ember-set-helper) ("Option 2" below):

Before:

```hbs
<MyComponent
  @closeDropdown={{action (mut this.setIsDropdownOpen) false}}
/>
```

After (Option 1 HBS):

```hbs
<MyComponent
  @closeDropdown={{action this.setIsDropdownOpen false}}
/>
```

After (Option 1 JS):

```js
@action
setIsDropdownOpen(isDropdownOpen) {
  set(this, 'isDropdownOpen', isDropdownOpen);
}
```

After (Option 2):

```hbs
<MyComponent
  @closeDropdown={{set this "isDropdownOpen" false}}
/>
```

\
2. When used as a pure getter only, `mut` could be removed:

Before:

```hbs
<MyComponent
  @isDropdownOpen={{mut this.isDropdownOpen}}
/>
```

After:

```hbs
<MyComponent
  @isDropdownOpen={{this.isDropdownOpen}}
/>
```

\
3. When `mut` is used as a getter and setter, `mut` could be replaced with a different namespace for the property and a dedicated action function to set the property: (Note: another other option could be to pull in the pick helper from [ember-composable-helpers](https://github.com/DockYard/ember-composable-helpers) and use it like [this](https://github.com/pzuraq/ember-set-helper#picking-values-with-ember-composable-helpers).) (Note: Another option could be to use [ember-box](https://github.com/pzuraq/ember-box)).

Before:

```hbs
{{#let (mut this.foo) as |foo|}}
  {{foo}}
  <input onchange={{action foo value=”target.value”}} />
{{/let}}
```

After HBS:

```hbs
{{this.foo}}
<input {{on “change” this.updateFoo}} />
```

After JS:

```js
@tracked
foo;

@action
updateFoo(evt) {
  this.foo = evt.target.value;
  // or set(this, ‘foo’, evt.target.value); for legacy Ember code
}
```

\
4. When `mut` is being passed into a built-in classic component that uses 2 way data binding, `mut` could be removed:

Before:

```hbs
<Input
  @value={{mut this.profile.description}}
/>
```

After:

```hbs
<Input
  @value={{this.profile.description}}
/>
```

## Configuration

* object -- containing the following properties:
  * string -- `setterAlternative` -- Optional: String name of a helper that could replace mut as a setter. If configured, the lint violation error message will include this as a possible alternative for resolving the lint violation.

Example:

```js
// .template-lintrc.js

module.exports = {
  rules: {
    'no-mut-helper': ['error', {
      setterAlternative: '{{set}}',
    }]
  }
};
```

## Related Rules

* [no-action](no-action.md)
* [no-extra-mut-helper-argument](no-extra-mut-helper-argument.md)

## References

* [Intent to RFC: Deprecate `{{mut}}`](https://github.com/emberjs/rfcs/issues/538)
* [Blogpost by @pzuraq explaining concerns with `mut` helper](https://www.pzuraq.com/on-mut-and-2-way-binding/)
* [ember-set-helper as an alternative to `mut` helper](https://github.com/pzuraq/ember-set-helper)
* [Ember api/mut helper](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each?anchor=mut)
