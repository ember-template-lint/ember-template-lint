# require-input-label

Users with assistive technology need `<input>` elements to have associated labels. It's so essential for users that failure to provide an associated label for an `<input>` element will cause failure of **three** different WCAG success criteria: [1.3.1, Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html), [3.3.2, Labels or Instructions](https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html), and [4.1.2, Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html). It is also associated with common failure [#68: Failure of Success Criterion 4.1.2 due to a user interface control not having a programmatically determined name](https://www.w3.org/WAI/WCAG21/Techniques/failures/F68).

This rule checks to see if the input element (either `<input>` or `<textarea>`) element is contained by a label element. If it is not, it checks to see if the input has any of these three attributes: `id`, `aria-label`, or `aria-labelledby`. While the `id` element on the input is not a concrete indicator of the presence of an associated `<label>` element with a `for` attribute, it is a good indicator that one likely exists.

This rule does not allow an input to use a `title` attribute for a valid label. This is because implementation by browsers is unreliable and incomplete.

This rule is unable to determine if a valid label is present if ...attributes is used, and must allow it to pass. However, developers are encouraged to write tests to ensure that a valid label is present for each input element present.

## Examples

This rule **forbids** the following:

```hbs
<div><input /></div>
```

```hbs
<input title="some label text" />
```

```hbs
<textarea />
```

This rule **allows** the following:

```hbs
<label>Some Label Text<input /></label>
```

```hbs
<input id="someId" />
```

```hbs
<input aria-label="Label Text Here" />
```

```hbs
<input aria-labelledby="someButtonId" />
```

```hbs
<input ...attributes />
```

## Migration

* the recommended fix is to add an associated label element.
* another option is to add an aria-label to the input element.
* wrapping the input element in a label element is also allowed; however this is less flexible for styling purposes, so use with awareness.

## References

* [Understanding Success Criterion 1.3.1: Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships)
* [Understanding Success Criterion 3.3.2: Labels or Instructions](https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html)
* [Understanding Success Criterion 4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)
* [Using label elements to associate text labels and form controls](https://www.w3.org/WAI/WCAG21/Techniques/html/H44.html)
* [Using aria-labelledby to provide a name for user interface controls](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA16)
* [Using aria-label to provide an invisible label where a visible label cannot be used](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA14.html)
* [Failure due to a user interface control not having a programmatically determined name](https://www.w3.org/WAI/WCAG21/Techniques/failures/F68)
* [Failure due to visually formatting a set of phone number fields but not including a text label](https://www.w3.org/WAI/WCAG21/Techniques/failures/F82)
