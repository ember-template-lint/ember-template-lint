# no-whitespace-for-layout

<<<<<<< HEAD
## Context

HTML's default procedures for handling, formatting, and displaying white space -- converting multiple spaces into a single space, removing line-breaks, etc. -- can be forcibly overridden in-line with the usage of HTML character entities that encode for some amount of white space.

Using HTML whitespace entities for layout formatting results in pages that are in violation of the Web Content Accessibility Guidelines (WCAG 2.0).
This approach reflects a choice to ignore [WCAG's officially-documented techniques](https://www.w3.org/TR/WCAG20-TECHS/intro.html) that ensure web accessibility criteria are met, and, unsurprisingly, produces results that are explicitly mentioned in [WCAG's list of common sources of web accessibility failures](https://www.w3.org/TR/WCAG20-TECHS/failures.html).

## Notable Failure Examples per WCAG 2.0 documentation:

The predominant issue raised by excess in-line HTML entity spacing is that the resulting 'formatting' of the text is entirely visual, and therefore is incompatible with screen-reading assistive technology tools.

### [F33: Using white space characters to create multiple columns in plain text content](https://www.w3.org/TR/WCAG20-TECHS/failures.html#F33)

``Web Content Accessibility Guidelines ``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`` including blindness and low vision,``<br>
``2.0 (WCAG 2.0) covers a wide range of ``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`` deafness and hearing loss, learning``<br>
``issues and recommendations for making ``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`` difficulties, cognitive limitations, limited``<br>
``Web content more accessible. This ``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`` movement, speech difficulties, and ``<br>
``document contains principles, ``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`` others. Following these guidelines will ``<br>
``guidelines, Success Criteria, benefits,``&nbsp;&nbsp;&nbsp;`` also make your Web content more ``<br>
``and examples that define and explain ``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`` accessible to the vast majority of users, ``<br>
``the requirements for making Web-based ``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`` including older users. It will also enable``<br>
``information and applications accessible.``&nbsp;&nbsp;&nbsp;`` people to access Web content using ``<br>
``"Accessible" means usable to a wide ``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`` many different devices - including a ``<br>
``range of people with disabilities, ``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`` wide variety of assistive technologies.``<br>

### [F34: Using white space characters to format tables in plain text content](https://www.w3.org/TR/WCAG20-TECHS/failures.html#F34)

``Menu``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Breakfast``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Lunch``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Dinner``
<br>

``Mon.  ``&nbsp;&nbsp;&nbsp;&nbsp;``Eggs ``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Tomato soup``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``House salad``<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Bacon``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Hamburger``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Fried chicken``<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Toast``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Onion rings``&nbsp;&nbsp;&nbsp;&nbsp;``Green beans``<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Cookie``&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``Mashed potatoes``<br>

## Detection of whitespaces used for layout in `ember-template-lint`

The proposed vehicle for addressing these accessibility failures during the development of Ember applications --  herein referred to as ```no-whitespace-for-layout``` -- is as a new linting rule inside of ```ember-template-lint```.

The rule applies to the content of Handlebars AST TextNodes, and performs a RegExp search for two consecutive white space characters that might indicate the use of whitespace used for layout.
=======
Formatting of text through the use of multiple whitespace is entirely visual, and therefore is incompatible with screen-reading assistive technology tools.

The rule applies to the content of Handlebars AST TextNodes, and performs a RegExp search for two consecutive white space characters that might indicate the use of whitespace used for layout.

### Examples

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

### Migration

To fix issues caused by using whitespace for layout, the following are recommended:

* use the appropriate HTML markup to contain the information
* use CSS to add padding or margins to the semantic HTML markup

### References

* [F33: Using white space characters to create multiple columns in plain text content](https://www.w3.org/TR/WCAG20-TECHS/failures.html#F33)
* [F34: Using white space characters to format tables in plain text content](https://www.w3.org/TR/WCAG20-TECHS/failures.html#F34)
>>>>>>> ae08b9027445690358a763cb0f0dcfa758920c63
