# no-autofocus-attribute

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

The autofocus attribute is a global attribute that indicates an element should be focused on page load. Autofocus reduces accessibility by moving users to an element without warning and context. Its use should be limited to form fields that serve as the main purpose of the page, such as the search input on the Google home page.

## Examples

This rule **allows** the following:

```hbs
<input type="text" />
```

This rule **forbids** the following:

```hbs
<input type="text" autofocus />
```

```hbs
<input type="password" autofocus="autofocus" />
```

## References

- [MDN Web](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus)
- [Focus Order: Understanding SC 2.4.3](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-focus-order.html)
- [The Accessibility of HTML 5 Autofocus](https://brucelawson.co.uk/2009/the-accessibility-of-html-5-autofocus/)
