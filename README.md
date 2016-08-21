# ember-template-lint

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

When ran through the linter's `verify` method, we would have a single result indicating that
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
  extends: 'recommended',

  rules: {
    'bare-strings': true
  }
}
```

This extends from the builtin recommended configuration ([lib/config/recommended.js](https://github.com/rwjblue/ember-template-lint/blob/master/lib/config/recommended.js)),
and also enables the `bare-strings` rule (see [here](https://github.com/rwjblue/ember-template-lint#bare-strings)).

Using this mechanism allows you to extend from the builtin, and modify specific rules as needed.

Some rules also allow setting additional configuration, for example if you would like to configure
some "bare strings" that are allowed you might have:

```javascript
module.exports = {
  rules: {
    'bare-strings': ['ZOMG THIS IS ALLOWED!!!!']
  }
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

### Configuration Keys

The following properties are allowed in the root of the `.template-lintrc.js` configuration file:

* `rules` -- This is an object containing rule specific configuration (see details for each rule below).
* `extends` -- This is a string that allows you to specify an internally curated list of rules (we suggest `recommended` here).
* `pending` -- An array of module id's that are still pending. The goal of this array is to allow incorporating template linting
  into an existing project, without changing every single template file. You can add all existing templates to this `pending` listing
  and slowly work through them, while at the same time ensuring that new templates added to the project pass all defined rules.

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
  * object - Containing the following values:
    * `ignoredTags` - An array of element tag names that should be whitelisted. Default to `[]`.
    * `ignoreTabindex` - When `true` tabindex will be ignored. Defaults to `false`.
    * `ignoreUsemapAttribute` - When `true` ignores the `usemap` attribute on `img` and `object` elements. Defaults `false`.
    * `additionalInteractiveTags` - An array of element tag names that should also be considered as interactive. Defaults to `[]`.'

#### self-closing-void-elements

HTML has no self-closing tags. The HTML 5 parser will ignore self-closing tag in
the case of [`void elements`](https://www.w3.org/TR/html-markup/syntax.html#void-element)
(tags that shouldn't have a `closing tag`). Although the parser will ignore it's
unnecessary and can lead to confusing with SVG/XML code.

This rule forbids the following:

```hbs
<img src="http://emberjs.com/images/ember-logo.svg" alt="ember" />
<hr/>
```

Instead, you should write the template as:

```hbs
<img src="http://emberjs.com/images/ember-logo.svg" alt="ember">
<hr>
```

The following values are valid configuration:

  * boolean -- `true` for enabled / `false` for disabled

#### img-alt-attributes

An `<img>` without an `alt` attribute is essentially invisible to assistive technology (i.e. screen readers).
In order to ensure that screen readers can provide useful information, we need to ensure that all `<img>` elements
have an `alt` specified. See [WCAG Suggestion H37](https://www.w3.org/TR/WCAG20-TECHS/H37.html).

The rule forbids the following:

```hbs
<img src="rwjblue.png">
```

Instead, you should write the template as:

```hbs
<img src="rwjblue.png" alt="picture of Robert Jackson">
```

The following values are valid configuration:

  * boolean -- `true` for enabled / `false` for disabled

#### link-rel-noopener

When you want to link in your app to some external page it is very common to use `<a href="url" target="_blank"></a>`
to make the browser open this link in a new tab.
However, this practice has performance problems (see [https://jakearchibald.com/2016/performance-benefits-of-rel-noopener/](https://jakearchibald.com/2016/performance-benefits-of-rel-noopener/))
and also opens a door to some security attacks because the opened page can redirect the opener app to
somewhere to a malicious clone to perform phishing on your users.

To avoid those two problems, this rule forbids the following:

```hbs
<a href="https://i.seem.secure.com" target="_blank">I'm a bait</a>
```

Instead, you should write the template as:

```hbs
<a href="https://i.seem.secure.com" target="_blank" rel="noopener">I'm a bait</a>
```

The following values are valid configuration:

  * boolean -- `true` for enabled / `false` for disabled

#### invalid-interactive

Adding interactivity to an element that is not naturally interactive content leads to a very poor experience for
users of assistive technology (i.e. screen readers). In order to ensure that screen readers can provide useful information
to their users, we should add an appropriate `role` attribute when the underlying element would not have made that
role obvious.

This rule forbids the following:

```hbs
<div {{action 'foo'}}></div>
```

Instead, you should add a `role` to the element in question so that the A/T is aware that it is interactive:

```hbs
<div role="button" {{action "foo"}}></div>
```

The following values are valid configuration (same as the `nested-interactive` rule above):

  * boolean -- `true` indicates all whitelist test will run, `false` indicates that the rule is disabled.
  * object - Containing the following values:
    * `ignoredTags` - An array of element tag names that should be whitelisted. Default to `[]`.
    * `ignoreTabindex` - When `true` tabindex will be ignored. Defaults to `false`.
    * `ignoreUsemapAttribute` - When `true` ignores the `usemap` attribute on `img` and `object` elements. Defaults `false`.
    * `additionalInteractiveTags` - An array of element tag names that should also be considered as interactive. Defaults to `[]`.'

#### only-block-link-to

Ember's `link-to` component has both an inline form and a block form. This rule forbids the inline form.

Forbidden (inline form):

```hbs
{{link-to 'Link text' 'routeName' prop1 prop2}}
```

Allowed (block form):

```hbs
{{#link-to 'routeName' prop1 prop2}}Link text{{/link-to}}
```

The block form is a little longer but has advantages over the inline form:

* It maps closer to the use of HTML anchor tags which wrap their inner content.
* It provides an obvious way for developers to put nested markup and components inside of their link.
* The block form's argument order is more direct: "link to route". The inline form's argument order is somewhat ambiguous (link text then link target). This is opposite of the order in HTML (`href` then link text).

This rule is configured with one boolean value:

  * boolean -- `true` for enabled / `false` for disabled

### Deprecations

#### deprecated-each-syntax

In Ember 2.0, support for using the `in` form of the `{{#each}}` helper
has been removed.

For example, this rule forbids the following:

```hbs
{{#each post in posts}}
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
