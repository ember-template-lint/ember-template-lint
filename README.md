# ember-template-lint

[![Greenkeeper badge](https://badges.greenkeeper.io/rwjblue/ember-template-lint.svg)](https://greenkeeper.io/)

[![npm version](https://badge.fury.io/js/ember-template-lint.svg)](https://badge.fury.io/js/ember-template-lint)
[![Build Status](https://travis-ci.org/rwjblue/ember-template-lint.svg?branch=master)](https://travis-ci.org/rwjblue/ember-template-lint)

ember-template-lint will lint your template and return error results. This is commonly
used through ember-cli-template-lint which adds failing lint tests for consuming ember-cli
applications.

For example, given the rule [`bare-strings`](https://github.com/rwjblue/ember-template-lint#bare-strings) is enabled, this template would be
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

## Usage

### Direct usage

Run templates through the linter's `verify` method like so:

```js
var TemplateLinter = require('ember-template-lint');

var linter = new TemplateLinter();
var template = fs.readFileSync('some/path/to/template.hbs', { encoding: 'utf8' });
var results = linter.verify({ source: template, moduleId: 'template.hbs' });
```

`results` will be an array of objects which have the following properties:
* `rule` - The name of the rule that triggered this warning/error.
* `message` - The message that should be output.
* `line` - The line on which the error occurred.
* `column` - The column on which the error occurred.
* `moduleId` - The module path for the file containing the error.
* `source` - The source that caused the error.
* `fix` - An object describing how to fix the error.

### CLI executable

Basic `ember-template-lint` executable is provided, allowing for easy use within i.e. Git pre-commit/push hooks and development of appropriate plugins for text editors.

Example usage:

```bash
# basic usage
./node_modules/.bin/ember-template-lint app/templates/application.hbs

# multiple file/directory/wildcard paths are accepted
./node_modules/.bin/ember-template-lint app/templates/components/**/* app/templates/application.hbs

# output errors as pretty-printed JSON string
./node_modules/.bin/ember-template-lint app/templates/application.hbs --json
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
<!-- disable all rules -->
{{! template-lint-disable }}

<!-- disable bare-strings -->
{{! template-lint-disable bare-strings }}

<!-- disable bare-strings and triple-curlies -->
{{! template-lint-disable bare-strings triple-curlies }}

<!-- enable all rules -->
{{! template-lint-enable }}

<!-- enable bare-strings -->
{{! template-lint-enable bare-strings }}

<!-- enable bare-strings and triple-curlies -->
{{! template-lint-enable bare-strings triple-curlies }}
```

and to configure rules in the template:

```hbs
{{! template-lint-configure bare-strings ["ZOMG THIS IS ALLOWED!!!!"] }}

{{! template-lint-configure bare-strings {"whitelist": "(),.", "globalAttributes": ["title"]} }}
```

The configure instruction can only configure a single rule, and the configuration value must be valid JSON that parses into a configuration for that rule.

These configuration instructions do not modify the rule for the rest of the template, but instead modify it within whatever DOM scope the comment instruction appears.

An instruction will apply to all later siblings and their descendants:

```hbs
<!-- disable for <p> and <span> and their contents, but not for <div> or <hr> -->
<div>
  <hr>
  {{! template-lint-disable }}
  <p>
    <span>Hello!</span>
  </p>
</div>
```

An in-element instruction will apply to only that element:

```hbs
<!-- enable for <p>, but not for <div>, <hr> or <span> -->
<div>
  <hr>
  <p {{! template-lint-enable }}>
    <span>Hello!</span>
  </p>
</div>
```

An in-element instruction with the `-tree` suffix will apply to that element and all its descendants:

```hbs
<!-- configure for <p>, <span> and their contents, but not for <div> or <hr> -->
<div>
  <hr>
  <p {{! template-lint-configure-tree block-indentation "tab" }}>
    <span>Hello!</span>
  </p>
</div>
```

Note that enabling a rule (`{{! template-lint-enable }}`) that has been configured in-template (`{{! template-lint-configure }}`), will restore it to its default configuration rather than the modified in-template configuration for the scope of the `{{! template-lint-enable }}` instruction.

### Configuration Keys

The following properties are allowed in the root of the `.template-lintrc.js` configuration file:

* `rules` -- `Object`
  This is an object containing rule specific configuration (see details for each rule below).
* `extends` -- `string|string[]`
  Either a string or an array of strings. Each string allows you to specify an internally curated list of rules (we suggest `recommended` here).
* `pending` -- `string[]`
  An array of module id's that are still pending. The goal of this array is to allow incorporating template linting
  into an existing project, without changing every single template file. You can add all existing templates to this `pending` listing
  and slowly work through them, while at the same time ensuring that new templates added to the project pass all defined rules.
* `ignore` -- `string[]|glob[]`
  An array of module id's that are to be completely ignored.
* `plugins` -- `(string|Object)[]`
  An array of plugin objects, or strings that resolve to files that export plugin objects. See [plugin documentation](docs/plugins.md) for more details.

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

#### no-debugger

`{{debugger}}` will inject `debugger` statement into compiled template code and will pause its rendering if developer tools are open. That is undesirable in a production environment.

This rule forbids usage of the following:

```hbs
{{debugger}}
```


#### no-log

`{{log}}` will produce messages in the browser console. That is undesirable in a production environment.

This rule forbids usage of the following:

```hbs
{{log}}
{{log "foo" var}}
```

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
and also opens a door to some security attacks because the opened page can redirect the opener app
to a malicious clone to perform phishing on your users.
Adding `rel="noopener noreferrer"` closes that door and avoids javascript in the opened tab to block the main
thread in the opener. Also note that Firefox versions prior 52 do not implement `noopener` and `rel="noreferrer"` should be used instead [ see Firefox issue ](https://bugzilla.mozilla.org/show_bug.cgi?id=1222516) and https://html.spec.whatwg.org/multipage/semantics.html#link-type-noreferrer.

This rule forbids the following:

```hbs
<a href="https://i.seem.secure.com" target="_blank">I'm a bait</a>
```

Instead, you should write the template as:

```hbs
<a href="https://i.seem.secure.com" target="_blank" rel="noopener noreferrer">I'm a bait</a>
```

The following values are valid configuration:

  * string -- `strict` for enabled and validating both noopener `and` noreferrer
  * boolean `true` to maintain backwards compatibility with previous versions of `ember-template-lint` that validate noopener `or` noreferrer
  If you are supporting Firefox, you should use `strict`.

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

#### inline-link-to

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

#### inline-styles

Inline styles are not the best practice because they are hard to maintain and usually make the overall size of the project bigger. This rule forbids the inline styles.

Forbidden:

```hbs
<div style="width:900px"></div>
```

Allowed:

```hbs
<div class="wide-element"></div>
```

This rule is configured with one boolean value:

  * boolean -- `true` for enabled rule that forbids the inline styles / `false` for disabled rule that allows them

#### style-concatenation

Ember has a runtime warning that says "Binding style attributes may introduce cross-site scripting vulnerabilities." It can only be avoided by always marking the bound value with `Ember.String.htmlSafe`. While we can't detect statically if you're always providing a safe string, we can detect cases common where it's impossible that you're doing so. For example,

```hbs
<div style="background-style: url({{url}})">
```

is never safe because the implied string concatentation does not propagate `htmlSafe`. Any use of quotes is therefore forbidden. This is forbidden:

```hbs
<div style="{{make-background url}}">
```

whereas this is allowed:

```hbs
<div style={{make-background url}}>
```

#### unless-helper (default === false)

This rule strongly advises against `{{unless}}` blocks used in conjunction with other
block helpers (e.g. `{{else}}`, `{{else if}}`), and template helpers.

For example, the rule forbids against the following:

``` hbs
{{! `if` template helper}}

{{unless (if true) "This is not recommended"}}
```

``` hbs
{{! `else` block}}

{{#unless bandwagoner}}
  Go Niners!
{{else}}
  Go Seahawks!
{{/unless
```

Common solutions are to use an `{{if}}` block, or refactor potentially confusing
logic within the template.

``` hbs
{{#if bandwagoner}}
  Go Blue Jays!
{{else}}
  Go Mariners!
{{/unless
```

The following values are valid configuration:

  * boolean -- `true` for enabled / `false` for disabled

#### unused-block-params

This rule forbids unused block parameters except when they are needed to access a later parameter.

Forbidden (unused parameters):

``` hbs
{{#each users as |user index|}}
  {{user.name}}
{{/each}}
```

Allowed (used parameters):

``` hbs
{{#each users as |user|}}
  {{user.name}}
{{/each}}
```

``` hbs
{{#each users as |user index|}}
  {{index}} {{user.name}}
{{/each}}
```

Allowed (later parameter used):

``` hbs
{{#each users as |user index|}}
  {{index}}
{{/each}}
```

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

#### deprecated-inline-view-helper

In Ember 1.12, support for invoking the inline View helper was deprecated.

For example, this rule forbids the following:

```hbs
{{view 'this-is-bad'}}

{{view.also-bad}}

{{qux-qaz please=view.stop}}

{{#not-this please=view.stop}}{{/not-this}}

<div foo={{view.bar}}></div>
```

Instead, you should use:

```hbs
{{this-is-better}}

{{qux-qaz this=good}}

{{#ok-this yay=nice}}{{/ok-this}}

<div foo={{bar}}></div>
```

More information is available at the [Deprecation Guide](http://emberjs.com/deprecations/v1.x/#toc_ember-view).

### Defining your own rules

You can define and use your own custom rules using the plugin system. See [plugin documentation](docs/plugins.md) for more details.

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
