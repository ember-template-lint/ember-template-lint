# modifier-name-case

💅 The `extends: 'stylistic'` property in a configuration file enables this rule.

It is currently possible to invoke a modifier with multiple words in its name
using camelCase: `{{didInsert}}` or using dasherized-case: `{{did-insert}}`.
This means that you can potentially have a lot of inconsistency throughout your
codebase.

This rule enforces that you will always use the dasherized-case form of the
modifier invocation.

## Examples

This rule **forbids** the following:

```hbs
<div {{didInsert}}></div>
```

This rule **allows** the following:

```hbs
<div {{did-insert}}></div>
```

## References

* [Documentation](https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/#toc_event-handlers) for modifiers
* [Polyfill](https://github.com/buschtoens/ember-on-modifier) for the `on` modifier (needed below Ember 3.11)
* [Spec](http://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/fn?anchor=on) for the `on` modifier
* [Spec](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/action?anchor=action) for the `action` modifier
