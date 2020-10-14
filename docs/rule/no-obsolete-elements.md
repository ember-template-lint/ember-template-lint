# no-obsolete-elements

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

Some elements are entirely obsolete and must not be used by authors.

This rule forbids the use of obsolete elements.

## Examples

This rule **forbids** the following:

```hbs
<acronym></acronym>
<applet></applet>
<basefont></basefont>
<bgsound></bgsound>
<big></big>
<blink></blink>
<center></center>
<dir></dir>
<font></font>
<frame></frame>
<frameset></frameset>
<isindex></isindex>
<keygen>
<listing></listing>
<marquee></marquee>
<menuitem></menuitem>
<multicol></multicol>
<nextid></nextid>
<nobr></nobr>
<noembed></noembed>
<noframes></noframes>
<plaintext></plaintext>
<rb></rb>
<rtc></rtc>
<spacer></spacer>
<strike></strike>
<tt></tt>
<xmp></xmp>
```

This rule **allows** anything that is not an obsolete element.

## Migration

* replace any use of these elements with the appropriate updated element or a `div` element.

## References

* [no-obsolete-elements](https://html.spec.whatwg.org/multipage/obsolete.html#non-conforming-features)
* [Failure of Success Criterion 2.2.2 due to using the blink element](https://www.w3.org/TR/WCAG20-TECHS/failures.html#F47)
