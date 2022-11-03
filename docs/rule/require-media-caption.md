# require-media-caption

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

Captions provide a text version of the spoken and non-spoken audio information for media. They are essential for making audio and video content accessible for users who are deaf as well as those for whom the media is unavailable (similar to `alt` text on an image when it is unable to load).

Captions should contain all relevant information needed to help users understand the media content, which may include a transcription of the dialogue and descriptions of meaningful sound effects. They are synchronized with the media to allow users access to the portion of the content conveyed via the audio track. Note that when audio or video components include the `muted` attribute, however, captions are *not* necessary.

## Examples

This rule **forbids** the following:

```hbs
<audio></audio>
```

```hbs
<video><track /></video>
```

```hbs
<video><track kind="descriptions" /></video>
```

This rule **allows** the following:

```hbs
<audio><track kind="captions"></audio>
```

```hbs
<video muted="true"></video>
```

```hbs
<video><track kind="captions" /><track kind="descriptions" /></video>
```

## References

- [Captions_Subtitles _ Web Accessibility Initiative (WAI) _ W3C](https://www.w3.org/WAI/media/av/captions/)
- [Understanding Success Criterion 1.2.2: Captions (Prerecorded)](https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html)
- [media-has-caption - eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/media-has-caption.md)
