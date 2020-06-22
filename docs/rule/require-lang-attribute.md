# require-lang-attribute

A missing `lang` attribute can cause an application to fail legal conformance for digital accessibility requirements.

This rule's objective is to ensure that Ember applications achieve [WCAG Success Criterion 3.1.1: Language of Page](https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html). The state of the `lang` attribute has a usability impact on the experience of users that require screen-reading assistive technology. When the attribute is properly assigned:

> "Both assistive technologies and conventional user agents can render text more accurately when the language of the Web page is identified. Screen readers can load the correct pronunciation rules. Visual browsers can display characters and scripts correctly. Media players can show captions correctly. **As a result, users with disabilities will be better able to understand the content.**"
>
> **Source: [WCAG Success Criterion 3.1.1: Intent](https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html#intent)**

When the language of the page cannot be identified, the integrity of the above information cannot be guaranteed.

Consider the following use case:

* the application developer is unaware that Ember now includes the lang attribute
* the application does not require internationalization
* the application's content is in a language that is not English
* an end-user with a screen reader turned on, whose operating system (OS) is set to a different language, navigates to that page with their screen reader turned on
* the screen reader would attempt to read the page in the language that is defined by the lang attribute on the page, but the supporting element information ("button", "link", etc) is read out in the language that is set by the operating system.

## Examples

This rule **forbids** the following:

```hbs
<html></html>
```

```hbs
<html lang=""></html>

This rule **allows** the following:

```hbs
<html lang="en"></html>
```

```hbs
<html lang="en-US"></html>
```

```hbs
<html lang={{this.foo}}></html>
```

## Migration

Add the `lang` attribute to the `app/index.html` file in your Ember app. If you use an internationalization addon like `ember-intl`, note that this will not conflict with that addon.

## References

* [WCAG Success Criterion 3.1.1: Language of Page](https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html)
