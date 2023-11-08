# no-builtin-form-components

Ember's built-in form components use two-way data binding, where the property as `@value` or `@checked` is mutated by user interaction. This goes against the Data Down Actions Up principle, goes against Glimmer Components’ intention to have immutable arguments, and is [discouraged by the Ember Core team](https://www.pzuraq.com/on-mut-and-2-way-binding/).

## Examples

This rule **forbids** the following:

```hbs
<Input />
```

```hbs
<Textarea></Textarea>
```

## Migration

The migration path typically involves replacing the built-in form component with a native HTML element and binding an event listener to handle user input.

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MyComponent extends Component {
  @tracked name;

  @action
  updateName(event) {
    this.name = event.target.value;
  }
}
```

```hbs
<input
  type="text"
  value={{this.name}}
  {{on "input" this.updateName}}
/>
```

You may consider composing the [set helper](https://github.com/pzuraq/ember-set-helper) with the [pick helper](https://github.com/DockYard/ember-composable-helpers#pick) to avoid creating an action within a component class.

```hbs
<input
  type="text"
  value={{this.name}}
  {{on "input" (pick "target.value" (set this "name"))}}
/>
```

## Related Rules

* [no-mut-helper](no-mut-helper.md)

## References

* [Built-in components guides](https://guides.emberjs.com/release/components/built-in-components/)
* [Built-in `Input` component API](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Input?anchor=Input)
* [Built-in `Textarea` component API](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Textarea?anchor=Textarea)
* [Native HTML `input`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
* [Native HTML `textarea`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)
* [The `on` modifier](https://guides.emberjs.com/release/components/component-state-and-actions/#toc_html-modifiers-and-actions)
