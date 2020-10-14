# no-inline-styles

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

Inline styles are not the best practice because they are hard to maintain and usually make the overall size of the project bigger. This rule forbids inline styles. Use CSS classes instead.

## Examples

This rule **forbids** the following:

```hbs
<div style="width:900px"></div>
```

This rule **allows** the following:

```hbs
<div class="wide-element"></div>
```

```hbs
{{!-- allowed when `allowDynamicStyles` is enabled  --}}
<div style={{html-safe (concat "background-image: url(" url ")")}}></div>
```

## Configuration

 The following values are valid configuration:

* boolean - `true` to enable / `false` to disable
* object -- An object with the following keys:
  * `allowDynamicStyles` -- Whether dynamically-generated inline styles should be allowed (defaults to `true`)

## Related Rules

* [style-concatenation](style-concatenation.md)

## References

* [Deprecations/binding style attributes](https://emberjs.com/deprecations/v1.x/#toc_binding-style-attributes)
