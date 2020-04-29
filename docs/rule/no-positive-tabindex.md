# no-positive-tabindex

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

## `<* tabindex>`

[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) explains the motivation of this rule nicely:

> Avoid using tabindex values greater than 0. Doing so makes it difficult for people who rely on assistive technology to navigate and operate page content. Instead, write the document with the elements in a logical sequence.

This rule prevents usage of any `tabindex` values other than `0` and `-1`. It does allow for dynamic values (choosing which value to show based on some condition / helper / etc), but only if that inline `if` condition has static `0`/`-1` as the value.

This rule takes no arguments.

## Examples

This rule **allows** the following:

```hbs
<span tabindex="0">foo</span>
<span tabindex="-1">bar</span>
<span tabindex={{0}}>baz</span>
<button tabindex={{if this.isHidden "-1"}}>baz</button>
<div role="tab" tabindex={{if this.isHidden "-1" "0"}}>baz</div>
```

This rule **forbids** the following:

```hbs
<span tabindex="5">foo</span>
<span tabindex="3">bar</span>
<span tabindex={{dynamicValue}}>zoo</span>
<span tabindex="1">baz</span>
<span tabindex="2">never really sure what goes after baz</span>
```

## References

1. [AX_FOCUS_03](https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_focus_03)
1. [w3.org/TR/wai-aria-practices/#kbd_general_between](https://www.w3.org/TR/wai-aria-practices/#kbd_general_between)
1. [w3.org/TR/2009/WD-wai-aria-practices-20090224/#focus_tabindex](https://www.w3.org/TR/2009/WD-wai-aria-practices-20090224/#focus_tabindex)
1.[MDN: tabindex documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)
