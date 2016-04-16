Changelog
=========

## v0.3.5

- Update the `bare-strings` rule to allow the following configuration:
   * boolean -- `true` for enabled / `false` for disabled
   * array -- an array of whitelisted strings
   * object -- An object with the following keys:
     * `whitelist` -- An array of whitelisted strings
     * `globalAttributes` -- An array of attributes to check on every element.
     * `elementAttributes` -- An object whose keys are tag names and value is an array of attributes to check for that tag name.

- Change default `.template-lintrc.js` file value for `bare-strings` to be `true`, which defaults the configuration to:

```js
{
  whitelist: ['(', ')', ',', '.', '&', '+', '-', '=', '*', '/', '#', '%', '!', '?', ':', '[', ']', '{', '}'],
  globalAttributes: [ 'title' ],
  elementAttributes: { input: [ 'placeholder' ], img: [ 'alt' ]}
};
```

- Fix bug with `bare-strings` where an allowed whitelisted string would only be allowed once in a given string. i.e `&&` would have failed, even though `&` was a whitelisted string.

## v0.3.4

- Add support for TextNode/CommentNode location information. Now the `bare-strings` / `html-comments` rules include line and column info.
- Add `nested-interactive` rule. Usage of nested interactive content can lead to UX problems, accessibility problems, bugs and in some
  cases to DOM errors. You should not put interactive content elements nested inside other interactive content elements.

## v0.3.3

- Fix issue with per-template rule configuration.

## v0.3.2

- Fix issue with `block-indentation` rule when a given block starts on the same line as a previous item. i.e.:

```hbs
{{! good }}
{{#each foo as |bar|}}
  <span>{{bar.name}}:</span><span>{{bar.title}}</span>
{{/each}}
```

## v0.3.1

- Add `html-comments` rule which forbids the usage of HTML comments (other than `<!-- template-lint bare-strings=false -->` style control comments).

## v0.3.0

- Change default configuration so that no plugins are enabled (warns when `.template-lintrc.js` is not found).

## v0.2.13

- Add better default whitelist for `bare-strings` rule.

## v0.2.12

- Add blueprint that generate `.template-lintrc.js`.
- Deprecate using ember-cli-template-lint without a `.template-lintrc.js`.
