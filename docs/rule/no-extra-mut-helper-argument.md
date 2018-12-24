## no-extra-mut-helper-argument

A common mistake when using the Ember handlebars template `mut(attr)` helper is to pass an extra `value` parameter to it when only `attr` should be passed. Instead, the `value` should be passed outside of `mut`.

Examples of **incorrect** code for this rule:

```hbs
{{my-component click=(action (mut isClicked true))}}
```

Examples of **correct** code for this rule:

```hbs
{{my-component click=(action (mut isClicked) true)}}
```

### References

* See the [documentation](https://emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/mut?anchor=mut) for the Ember handlebars template `mut` helper
