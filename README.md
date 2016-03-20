# ember-cli-template-lint

[![Build Status](https://travis-ci.org/rwjblue/ember-cli-template-lint.svg?branch=master)](https://travis-ci.org/rwjblue/ember-cli-template-lint)

ember-cli-template-lint will lint your templates and add a test for each  asserting
that all style rules have been satisfied.

For example, given the rule `bare-strings` is enabled, this template would be
in violation:

```hbs
{{! app/components/my-thing/template.hbs }}
<div>A bare string</div>
```

Thus a the test `TemplateLint: app/components/my-thing/template.hbs` would
fail with the assertion "A bare string was found (0:5)".

## Install

To install ember-cli-template-lint

```
ember install ember-cli-template-lint
```

__Ember CLI >= 2.4.2 is required for linting templates__

## Configuration

### Project Wide

You can turn on specific rules by toggling them in a
`.template-lintrc.js` file at the base of your project:

```javascript
module.exports = {
  'bare-strings': false
}
```

Some rules also allow setting additional configuration, for example if you would like to configure
some "bare strings" that are allowed you might have:

```javascript
module.exports = {
  'bare-strings': ['ZOMG THIS IS ALLOWED!!!!']
};
```

### Per Template

It is also possible to disable specific rules (or all rules) in a template itself:

```hbs
{{! disable all rules for this template }}
<!-- template-lint disable=true -->

{{! disable specific rules for this template }}
<!-- template-lint bare-strings=false -->
```

It is not currently possible to change rule configuration in the template.

## Rules

#### bare-strings

In order to be able to internationalize your application, you will need to avoid using plain strings in your templates. Instead, you would need to use a template helper specializing in translation ([ember-i18n](https://github.com/jamesarosen/ember-i18n) and [ember-intl](https://github.com/yahoo/ember-intl) are great projects to use for this).

This rule forbids the following:

``` html
<h2>Some string here!</h2>
```

The following values are valid configuration:

  * boolean -- `true` for enabled / `false` for disabled
  * array -- an array of whitelisted strings

By default, the following characters are whitelisted:
`(),.&+-=*/#%!?:[]{}`


#### block-indentation

Good indentation is crucial for long term maintenance of templates. For example, having blocks misaligned is a common cause of logic errors...

This rule forbids the following examples:

``` hbs
  {{#each foo as |bar}}

    {{/each}}

  <div>
  <p>{{t "greeting"}}</p>
  </div>
```

``` html
<div>
  <p>{{t 'Stuff here!'}}</p></div>
```

The following values are valid configuration:

  * boolean -- `true` indicates a 2 space indent, `false` indicates that the rule is disabled.
  * numeric -- the number of spaces to require for indentation
  * "tab" -- To indicate tab style indentation (1 char)


#### triple-curlies

Usage of triple curly braces to allow raw HTML to be injected into the DOM is large vector for exploits of your application (especially when the raw HTML is user controllable ). Instead of using `{{{foo}}}`, you should use appropriate helpers or computed properties that return a `SafeString` (via `Ember.String.htmlSafe` generally) and ensure that user supplied data is properly escaped.

This rule forbids the following:

``` hbs
{{{foo}}}
```

## Contributing

A few ideas for where to take this in the future:

* The list of rules should be configurable
* This addon should use a test printer shared with jshint, eslint and jscs addons
* A command-line version of the linter should be provided so IDEs and editors
  can provide feedback to devs during development

### Installation

* `git clone` this repository
* `npm install`
* `bower install`

### Running

* `ember server`
* Visit your app at http://localhost:4200.

### Running Tests

* `npm run test-node`
* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
