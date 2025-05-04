# no-builtin-form-components

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

Ember's built-in form components use two-way data binding, where the property passed as `@value` or `@checked` is mutated by user interaction. This goes against the Data Down Actions Up principle, goes against Glimmer Components’ intention to have immutable arguments, and is [discouraged by the Ember Core team](https://www.pzuraq.com/blog/on-mut-and-2-way-binding).

## Examples

This rule **forbids** the following:

```hbs
<Input />
```

```hbs
<Textarea></Textarea>
```

## Migration

Many forms may be simplified by switching to a light one-way data approach.

For example – vanilla JavaScript has everything we need to handle form data, de-sync it from our source data and collect all user input in a single object.

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MyComponent extends Component {
  @tracked userInput = {};

  @action
  handleInput(event) {
    const formData = new FormData(event.currentTarget);
    this.userInput = Object.fromEntries(formData.entries());
  }
}
```

```hbs
<form {{on "input" this.handleInput}}>
  <label> Name
    <input name="name">
  </label>
</form>
```

Another option would is to "control" the field's value by replacing the built-in form component with a native HTML element and binding an event listener to handle user input.

In the following example the initial value of a field is controlled by a local tracked property, which is updated by an event listener.

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

## Related Rules

* [no-mut-helper](no-mut-helper.md)

## References

* [Native HTML `input`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
* [Native HTML `textarea`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)
* [Native HTML `FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
* [The `on` modifier](https://guides.emberjs.com/release/components/component-state-and-actions/#toc_html-modifiers-and-actions)
* [ember-headless-form](https://ember-headless-form.pages.dev/)
* [Built-in components guides](https://guides.emberjs.com/release/components/built-in-components/)
* [Built-in `Input` component API](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Input?anchor=Input)
* [Built-in `Textarea` component API](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Textarea?anchor=Textarea)
