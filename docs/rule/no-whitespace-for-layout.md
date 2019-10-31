# no-whitespace-for-layout

Formatting of text through the use of multiple whitespace is entirely visual, and therefore is incompatible with screen-reading assistive technology tools.

The rule applies to the content of Handlebars AST TextNodes, and performs a RegExp search for two consecutive white space characters that might indicate the use of whitespace used for layout.

## Examples

This rule **forbids** the following:

```hbs
``Mon.  ``&nbsp;&nbsp;&nbsp;&nbsp;``Eggs ``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Tomato soup``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``House salad``<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Bacon``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Hamburger``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Fried chicken``<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Toast``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Onion rings``&nbsp;&nbsp;&nbsp;&nbsp;``Green beans``<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Cookie``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Mashed potatoes``
```

This rule **allows** the following:

```hbs
<p>Start to finish</p>
```

```hbs
<p>Start&nbsp;to&nbsp;Finish</p>
```

## Migration

To fix issues caused by using whitespace for layout, the following are recommended:

* use the appropriate HTML markup to contain the information
* use CSS to add padding or margins to the semantic HTML markup

## References

* [F33: Using white space characters to create multiple columns in plain text content](https://www.w3.org/TR/WCAG20-TECHS/failures.html#F33)
* [F34: Using white space characters to format tables in plain text content](https://www.w3.org/TR/WCAG20-TECHS/failures.html#F34)
