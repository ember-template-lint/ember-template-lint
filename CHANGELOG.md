Changelog
=========

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
