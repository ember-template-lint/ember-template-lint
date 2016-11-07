Changelog
=========

## v0.6.1

- Fix issue with new `deprecated-inline-view-helper` (throwing error when parsing mustache statements).

## v0.6.0

- Add `invalid-interactive` to recommended rules.
- Add `img-alt-attributes` to recommended rules.
- Add `style-concatenation` to recommended rules.
- Add `deprecated-inline-view-helper` to recommended rules.
- Add `link-rel-noopener` to recommended rules.
- Remove support for Node 0.10.

## v0.5.18

- Add `deprecated-inline-view-helper` rule. Usage of `{{view` / `{{#view` helper and `{{view.path.here}}` were deprecated in Ember 1.13, and subsequently removed in Ember 2.0.
  This rule flags these usages.

## v0.5.17

- Fix issue with the `invalid-interactive` rule not honoring the documented `additonalInteractiveTags` option.

## v0.5.16

- Fix issue with `link-rel-noopener` rule when using properly with a listing (i.e. `rel="noopener noreferrer"`).
- Add `inline-link-to` rule to prevent usage of inline `{{link-to`.
- Add `style-concatenation` rule. This prevents the usage of `<div style="{{make-background url}}">` (quoted value with any dynamic segments) but allows
  `<div style={{make-background url}}>`.

## v0.5.15

- Fix issue causing `<iframe>` to be detected as `{{#if`.
- Add `link-rel-noopener` rule. This rule requires that any `<a target="_blank">` have a `rel="noopener"`. This prevents the newly opened window from having access
  to the opener (and helps prevent a number of phishing attacks).

## v0.5.14

- Fix `invalid-indentation` rule to allow scenarios where the opening and closing elements can have no space between. For example:

```hbs
<textarea
    class="form-control"
    id="job-instructions"
    rows="3"
    placeholder="Do it well"
    value={{job.instructions}}
    oninput={{action 'updateInstructions' value='target.value'}}></textarea>
```

  If the above `</textarea>` had been after a newline and indented properly, the default contents of the textarea would then include that whitespace. The rule now enforces
  that there be no child elements within a given block.

- Remove a few ARIA roles that were incorrectly flagging things as interactive elements (i.e. `dialog` and `alertdialog`).

## v0.5.13

- Fix bug with `invalid-interactive` rule incorrectly flagging valid elements.

## v0.5.12

- Change `nested-interactive` rule to ignore elements using `tabindex` when determining if a parent element is interactive. `tabindex` is still used
  for detecting all child elements once already inside of another interactive element.
- Fix various issues with `nested-interactive` and `<label>`.
  - Consider `<label>` an interactive element.
  - Specifically handle the various edge cases of having `<label><input></label>`.
  - Prevent multiple interactive elements inside of a `<label>`.
- Fix bugs with the `invalid-indentation` around escaped mustaches and raw blocks.
- Add `invalid-interactive` rule ([full documentation](https://github.com/rwjblue/ember-template-lint#invalid-interactive)).
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

- Add `img-alt-attributes` rule ([full documentation](https://github.com/rwjblue/ember-template-lint#img-alt-attributes)).
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

## v0.5.11

- Add internal helper for determining if a given element is an interactive element.
- Update `nested-interactive` rule to use the new `isInteractiveElement` helper function.
- Change `nested-interactive` configuration.  Now uses an object (instead of an array). Example:

```js
rules: {
  'nested-interactive': {
    ignoredTags: ['a', 'button'], // list of tag names to ignore
    ignoreTabindex: true, // ignore the tabindex check
    ignoreUsemapAttribute: ['img', 'object'], // ignore `usemap` check for specific tag names
    additionalInteractiveTags: ['some-custom-tag'], // not sure this is needed, but it seams neat :P
  }
}
```

## v0.5.10

- Add ability to mark specific rules as pending for a module. Given the following `.template-lintrc.js` file, the `foo/bar/baz` module would have only its indentation related issues labeled as warnings:

```js
module.exports = {
  extends: 'recommended',
  pending: [
    { moduleId: 'foo/bar/baz', only: ['block-indentation']}
  ]
}
```

All other rules with errors in the `foo/bar/baz` template would still be reported as errors.

## v0.5.9

- Update internals to use better API for traversing nodes in template AST.
- Lock down parser version (should make package more stable as loose deps won't break consumers).

## v0.5.8

- Fix various issues with `block-indentation` rule:
  - Ensure that usage of whitespace control in end block does not trigger an error. Before this: `{{#if foo}}{{~/if}}` would error.
  - Validate indentation for block inverse (aka `{{else}}`).

## v0.5.7

- Fix a bug with `block-indentation` rule that would throw an error if a block contained a comment.
- Fixed bugs upstream in HTMLBars that caused location information to be incorrect for attributes and comments.

## v0.5.6

- Remove `bare-strings` from `recommended` configuration. See [#27](https://github.com/rwjblue/ember-template-lint/pull/27) for more details.

## v0.5.5

- Fix invalid rule name in `recommended` configuration.
- Add ability to mark files as `pending` in the `.template-lintrc.js` configuration file.  When a module is listed in the `pending` list, it will be checked but any errors detected will be marked as warnings (and will not trigger a failing test when using ember-cli-template-lint). If there are no errors detected when checking a pending file, a new error will be triggered. The goal of this process is to allow large existing projects begin utilizing `ember-template-lint` / `ember-cli-template-lint` and slowly fix their template files to comply with the rules here.  Feedback welcome on this idea/process...

## v0.5.4

- Move rule configuration into `rules` property inside `.tempalte-lintrc.js`. Configuration in the root is still supported,
  but triggers a deprecation warning. Migration should be very straigtforward.

  Before:

  ```js
  // .template-lintrc.js
  module.exports = {
    'bare-strings': true
  }
  ```

  After:

  ```js
  // .template-lintrc.js
  module.exports = {
    rules: {
      'bare-strings': true
    }
  }
  ```

## v0.5.3

- Add ability to extend from internally managed configurations.
- Add `recommended` configuration, which can be used via the following in your `.template-lintrc.js`:

```js
module.exports = {
  extends: 'recommended'
}
```

## v0.5.2

- Add `fix` information to the results object for:
  - `html-comments`
  - `self-closing-void-elements`
  - `deprecated-each-syntax`
- Add support for context shifting `{{#each` (i.e. `{{#each posts}}`) to the `deprecated-each-syntax`.

## v0.5.1

- Bring back rules lost during migration from ember-cli-template-lint (deprecated-each, self-closing-void-elements).

## v0.5.0

- Initial migration of plugins from ember-cli-template-lint.
- Implement new node API for the Linter.
- Implement new result objects.
