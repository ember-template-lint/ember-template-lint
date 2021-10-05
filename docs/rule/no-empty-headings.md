# no-empty-headings

Headings relay the structure of a webpage and provide a meaningful, hierarchical order of its content. If headings are empty or its text contents are inaccessible, this could confuse users or prevent them accessing sections of interest.

Disallow headings (h1, h2, etc.) with no accessible text content.

## Examples

This rule **forbids** the following:

```hbs
<h*></h*>
```

```hbs
<div role="heading"></div>
```

```hbs
<h*><span aria-hidden="true">Inaccessible text<span></h*>
```

This rule **allows** the following:

```hbs
<h*>Heading Content</h*>
```

```hbs
<h*><span>Text</span><h*>
```

```hbs
<div role="heading">Heading Content</div>
```

```hbs
<h* aria-hidden="true">Heading Content</h*>
```

```hbs
<h* hidden>Heading Content</h*>
```

## Migration

If violations are found, remediation should be planned to ensure text content is present and visible and/or screen-reader accessible. Setting `aria-hidden="false"` or removing `hidden` attributes from the element(s) containing heading text may serve as a quickfix.

## References

- [WCAG SC 2.4.6 Headings and Labels](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html)
