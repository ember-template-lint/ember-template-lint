## no-whitespace-within-word

In practice, the predominant issue raised by inline whitespace styling is that the resultant text 'formatting' is entirely visual in nature; the ability to discern the correct manner in which to read the text, and therefore, to correctly comprehend its meaning, is restricted to sighted users.

Using in-line whitespace word formatting produces results that are explicitly mentioned in [WCAG's list of common sources of web accessibility failures](https://www.w3.org/TR/WCAG20-TECHS/failures.html). Specifically, this common whitespace-within-word-induced web accessibility issue fails to successfully achieve [WCAG Success Criterion 1.3.2: Meaningful Sequence](https://www.w3.org/TR/UNDERSTANDING-WCAG20/content-structure-separation-sequence.html).

The `no-whitespace-within-word` rule operates on the assumption that artifically-spaced English words in rendered text content contain, at a minimum, two word characters fencepost-delimited by three whitespace characters  (`space-char-space-char-space`) so it should be avoided.

### Examples

This rule **forbids** the following:

```hbs
W e l c o m e
```

`W`**`&nbsp;`**`e`**`&nbsp;`**`l`**`&nbsp;`**`c`**`&nbsp;`**`o`**`&nbsp;`**`m`**`&nbsp;`**`e`

`Wel c o me`

`Wel`**`&nbsp;`**`c`**`&emsp;`**`o`**`&nbsp;`**`me`

```hbs
<div>W e l c o m e</div>

<div>Wel c o me</div>
```

This rule **allows** the following:

`Welcome`

`Yes`**`&nbsp;`**`I`**`&nbsp;`**`am`

`It is possible to get some examples of in-word emph a sis past this rule.`

`However, I do not want a rule that flags annoying false positives for correctly-used single-character words.`

```hbs
<div>Welcome</div>

<div>Yes&nbsp;I am.</div>
```

This rule uses the heuristic of letter, whitespace character, letter, whitespace character, letter which makes it a good candidate for most use cases, but not ideal for some languages (such as Japanese).

### Migration

The rule's RegExp-based detection mechanism can be used within a codebase to identify potential instances where in-line whitespace-within-word formatting will result in an F32-related loss of meaningful sequence. Flags / violations largely need to be diagnosed / addressed on a case-by-case basis, but the WCAG-approved vehicle for controlling letter-spacing within a word is CSS styling -- specifically, the implementation of [WCAG Technique C8: Using CSS letter-spacing to control spacing within a word](https://www.w3.org/WAI/WCAG21/Techniques/css/C8).

### References

* [F32: Using white space characters to create multiple columns in plain text content](https://www.w3.org/TR/WCAG20-TECHS/failures.html#F32)
* [WCAG Success Criterion 1.3.2: Meaningful Sequence](https://www.w3.org/TR/UNDERSTANDING-WCAG20/content-structure-separation-sequence.html)
* [C8: Using CSS letter-spacing to control spacing within a word](https://www.w3.org/WAI/WCAG21/Techniques/css/C8)
