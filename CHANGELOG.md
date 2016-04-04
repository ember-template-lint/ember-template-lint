Changelog
=========

## v0.3.1

- Add `html-comments` rule which forbids the usage of HTML comments (other than `<!-- template-lint bare-strings=false -->` style control comments).

## v0.3.0

- Change default configuration so that no plugins are enabled (warns when `.template-lintrc.js` is not found).

## v0.2.13

- Add better default whitelist for `bare-strings` rule.

## v0.2.12

- Add blueprint that generate `.template-lintrc.js`.
- Deprecate using ember-cli-template-lint without a `.template-lintrc.js`.
