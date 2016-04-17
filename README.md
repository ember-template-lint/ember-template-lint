# ember-cli-template-lint

[![Build Status](https://travis-ci.org/rwjblue/ember-template-lint.svg?branch=master)](https://travis-ci.org/rwjblue/ember-template-lint)

ember-template-lint will lint your template and return error results. This is commonly
used through ember-cli-template-lint which adds failing lint tests for consuming ember-cli
applications.

For example, given the rule `bare-strings` is enabled, this template would be
in violation:

```hbs
{{! app/components/my-thing/template.hbs }}
<div>A bare string</div>
```

When ran throught the linters `verify` method we would have a single result indicating that
the `bare-strings` rule found an error.

## Install

To install ember-template-lint

```
npm install --save-dev ember-template-lint
```

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
   * object -- An object with the following keys:
     * `whitelist` -- An array of whitelisted strings
     * `globalAttributes` -- An array of attributes to check on every element.
     * `elementAttributes` -- An object whose keys are tag names and value is an array of attributes to check for that tag name.

When the config value of `true` is used the following configuration is used:
 * `whitelist` - `(),.&+-=*/#%!?:[]{}`
 * `globalAttributes` - `title`
 * `elementAttributes` - `{ img: ['alt'], input: ['placeholder'] }`


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


#### html-comments

Html comments in your templates will get compiled and rendered into the DOM at runtime. Instead you can annotate your templates using Handlebars comments, which will be stripped out when the template is compiled and have no effect at runtime.

This rule forbids the following:

``` hbs
<!-- comment goes here -->
```

but allows the following:

```hbs
{{!-- comment goes here --}}
```

Html comments containing linting instructions such as:

```hbs
<!-- template-lint bare-strings=false -->
```

are of course allowed (and since the linter strips them during processing, they will not get compiled and rendered into the DOM regardless of this rule).


#### triple-curlies

Usage of triple curly braces to allow raw HTML to be injected into the DOM is large vector for exploits of your application (especially when the raw HTML is user controllable ). Instead of using `{{{foo}}}`, you should use appropriate helpers or computed properties that return a `SafeString` (via `Ember.String.htmlSafe` generally) and ensure that user supplied data is properly escaped.

This rule forbids the following:

``` hbs
{{{foo}}}
```


#### nested-interactive

Usage of nested `interactive content` can lead to UX problems, accessibility
problems, bugs and in some cases to DOM errors. You should not put interactive
content elements nested inside other interactive content elements. Instead using
nested interactive content elements you should separate them and put them one
after the other.

This rule forbids the following:

```hbs
<button type="button">
  Click here and <a href="/">go to home here</a>
</button>
```

The following values are valid configuration:

  * boolean -- `true` indicates all whitelist test will run, `false` indicates that the rule is disabled.
  * array -- an array of whitelisted tests as the following

Whitelist of option in the configuration (are tags name or element attributes):

  * `button`
  * `details`
  * `embed`
  * `iframe`
  * `img`
  * `input`
  * `object`
  * `select`
  * `textarea`
  * `tabindex`

### Deprecations

#### deprecated-each-syntax

In Ember 2.0, support for using the `in` form of the `{{#each}}` helper
has been removed.

For example, this rule forbids the following:

```hbs
{{{#each post in posts}}}
  <li>{{post.name}}</li>
{{/each}}
```

Instead, you should write the template as:

```hbs
{{#each posts as |post|}}
  <li>{{post.name}}</li>
{{/each}}
```

More information is available at the [Deprecation Guide](http://emberjs.com/deprecations/v1.x/#toc_code-in-code-syntax-for-code-each-code).

## Contributing

A few ideas for where to take this in the future:

* The list of rules should be configurable
* This addon should use a test printer shared with jshint, eslint and jscs addons
* A command-line version of the linter should be provided so IDEs and editors
  can provide feedback to devs during development

### Installation

* `git clone` this repository
* `npm install`

### Running Tests

* `npm test`