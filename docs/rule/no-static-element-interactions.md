## no-static-element-interactions

Static HTML elements do not have semantic meaning. This is clear in the case of `<div>` and `<span>`. It is less so clear in the case of elements that _seem_ semantic, but that do not have a semantic mapping in the accessibility layer. For example `<a>`, `<big>`, `<blockquote>`, `<footer>`, `<picture>`, `<strike>` and `<time>` -- to name a few -- have no semantic layer mapping. They are as void of meaning as `<div>`.

The [WAI-ARIA `role` attribute](https://www.w3.org/TR/wai-aria-1.1/#usage_intro) confers a semantic mapping to an element. The semantic value can then be expressed to a user via assistive technology.

In order to add interactivity such as a mouse or key event listener to a static element, that element must be given a role value as well.

## How do I resolve this error?

### Case: This element acts like a button, link, menuitem, etc.

Indicate the element's role with the `role` attribute:

```hbs
<div
  onclick={{action 'onClickHandler'}}
  onkeypress={{action 'onKeyPressHandler'}}
  role="button"
  tabindex="0">
  Save
</div>
```

Common interactive roles include:

  1. `button`
  1. `link`
  1. `checkbox`
  1. `menuitem`
  1. `menuitemcheckbox`
  1. `menuitemradio`
  1. `option`
  1. `radio`
  1. `searchbox`
  1. `switch`
  1. `textbox`

Note: Adding a role to your element does **not** add behavior. When a semantic HTML element like `<button>` is used, then it will also respond to Enter key presses when it has focus. The developer is responsible for providing the expected behavior of an element that the role suggests it would have: focusability and key press support.

### Case: This element is not a button, link, menuitem, etc. It is catching bubbled events from elements that it contains

If your element is catching bubbled click or key events from descendant elements, then the proper role for this element is `presentation`.

```hbs
<div
  onclick={{action 'onClickHandler'}}
  role="presentation">
  <button>Save</button>
</div>
```

Marking an element with the role `presentation` indicates to assistive technology that this element should be ignored; it exists to support the web application and is not meant for humans to interact with directly.


This rule **allows** the following:
```hbs
<button onclick={{action 'onButtonClick'}} class="foo" />
<div class="foo" onclick={{action 'onButtonClick'}} role="button" />
<input type="text" {{action 'onButtonClick'}} />
```

This rule **forbids** the following:
```hbs
<div onclick={{action 'foo-bar'}} ></div>
<div {{action 'foo-bar'}} ></div>
```

### References
  1. [WAI-ARIA `role` attribute](https://www.w3.org/TR/wai-aria-1.1/#usage_intro)
  2. [WAI-ARIA Authoring Practices Guide - Design Patterns and Widgets](https://www.w3.org/TR/wai-aria-practices-1.1/#aria_ex)
  3. [Fundamental Keyboard Navigation Conventions](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_generalnav)
  4. [Mozilla Developer Network - ARIA Techniques](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role#Keyboard_and_focus)
  5. [eslint-plugin-jsx-a11y/no-static-element-interaction](https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interaction.md)
