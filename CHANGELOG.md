Changelog
=========

## v1.1.0 (2019-01-16)

#### :rocket: Enhancement
* [#609](https://github.com/ember-template-lint/ember-template-lint/pull/609) Add 'no-negated-condition' rule ([@bmish](https://github.com/bmish))
* [#573](https://github.com/ember-template-lint/ember-template-lint/pull/573) Allow RegExp's with no-implicit-this  ([@iki6](https://github.com/iki6))

#### :bug: Bug Fix
* [#559](https://github.com/ember-template-lint/ember-template-lint/pull/559) Added video and audio with control attribute as interactive elements ([@HenryVonfire](https://github.com/HenryVonfire))
* [#607](https://github.com/ember-template-lint/ember-template-lint/pull/607) Always ignore dist, tmp, node_modules by default. ([@jasonmit](https://github.com/jasonmit))
* [#600](https://github.com/ember-template-lint/ember-template-lint/pull/600) Add {{welcome-page}} to default allowed list for no-implicit-this. ([@rwjblue](https://github.com/rwjblue))

#### :memo: Documentation
* [#608](https://github.com/ember-template-lint/ember-template-lint/pull/608) Improve clarity of descriptions and examples in rule docs. ([@bmish](https://github.com/bmish))
* [#606](https://github.com/ember-template-lint/ember-template-lint/pull/606) Fix typo in 'no-unnecessary-concat' doc migration regexp. ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#458](https://github.com/ember-template-lint/ember-template-lint/pull/458) Add prettier. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 5
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Jason Mitchell ([@jasonmit](https://github.com/jasonmit))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- [@HenryVonfire](https://github.com/HenryVonfire)
- [@iki6](https://github.com/iki6)

## v1.0.0 (2019-01-08)

#### :boom: Breaking Change
* [#599](https://github.com/ember-template-lint/ember-template-lint/pull/599) Remove attribute-indentation from recommended config. ([@rwjblue](https://github.com/rwjblue))

#### :rocket: Enhancement
* [#598](https://github.com/ember-template-lint/ember-template-lint/pull/598) Add lerna-changelog for changelog generation. ([@rwjblue](https://github.com/rwjblue))
* [#582](https://github.com/ember-template-lint/ember-template-lint/pull/582) Ensure absolute paths are normalized when checking modules for "pending" status ([@xcambar](https://github.com/xcambar))
* [#584](https://github.com/ember-template-lint/ember-template-lint/pull/584) feat: add rule 'no-extra-mut-helper-argument'. ([@bmish](https://github.com/bmish))
* [#528](https://github.com/ember-template-lint/ember-template-lint/pull/528) Add option to executable for specifying a custom config path ([@krivaten](https://github.com/krivaten))
* [#535](https://github.com/ember-template-lint/ember-template-lint/pull/535) Add no-action-modifiers rule ([@bendemboski](https://github.com/bendemboski))

#### :bug: Bug Fix
* [#597](https://github.com/ember-template-lint/ember-template-lint/pull/597) Fix config resolution with Yarn PnP. ([@rwjblue](https://github.com/rwjblue))
* [#592](https://github.com/ember-template-lint/ember-template-lint/pull/592) fix: errors from 'simple-unless' rule with empty unless usage ([@bmish](https://github.com/bmish))
* [#591](https://github.com/ember-template-lint/ember-template-lint/pull/591) feat: update 'style-concatenation' rule to catch an unsafe usage of the 'concat' helper. ([@bmish](https://github.com/bmish))
* [#580](https://github.com/ember-template-lint/ember-template-lint/pull/580) Ensure failure when invalid config path is provided. ([@xcambar](https://github.com/xcambar))
* [#568](https://github.com/ember-template-lint/ember-template-lint/pull/568) Fix contextual component error message in attribute-indentation and block-indentation rules ([@HodofHod](https://github.com/HodofHod))

#### :memo: Documentation
* [#590](https://github.com/ember-template-lint/ember-template-lint/pull/590) docs: improve organization, formatting, and consistency for rule docs. ([@bmish](https://github.com/bmish))
* [#589](https://github.com/ember-template-lint/ember-template-lint/pull/589) docs: reorganize, reformat, add links, and add examples to improve doc for 'style-concatenation' rule. ([@bmish](https://github.com/bmish))
* [#574](https://github.com/ember-template-lint/ember-template-lint/pull/574) Fix typo in no-implicit-this documentation ([@efx](https://github.com/efx))
* [#564](https://github.com/ember-template-lint/ember-template-lint/pull/564) Removed ember-i18n recommendation in no-bare-string documentation ([@Alonski](https://github.com/Alonski))
* [#563](https://github.com/ember-template-lint/ember-template-lint/pull/563) Add an example of how to ignore files to the README ([@h2blake](https://github.com/h2blake))
* [#547](https://github.com/ember-template-lint/ember-template-lint/pull/547) Fix typo in table-groups rule documentation ([@evoactivity](https://github.com/evoactivity))
* [#544](https://github.com/ember-template-lint/ember-template-lint/pull/544) Fix attribute-indentation rule documentation to comply with default config ([@benmurden](https://github.com/benmurden))
* [#541](https://github.com/ember-template-lint/ember-template-lint/pull/541) Fix attribute-indentation rule documentation to comply with default config ([@benmurden](https://github.com/benmurden))
* [#540](https://github.com/ember-template-lint/ember-template-lint/pull/540) Small tweaks to `no-shadowed-elements` docs ([@sduquej](https://github.com/sduquej))
* [#515](https://github.com/ember-template-lint/ember-template-lint/pull/515) Add documentation for no-shadowed-elements rule ([@Willibaur](https://github.com/Willibaur))
* [#538](https://github.com/ember-template-lint/ember-template-lint/pull/538) Fix links and markdown styling ([@scottwernervt](https://github.com/scottwernervt))

#### :house: Internal
* [#570](https://github.com/ember-template-lint/ember-template-lint/pull/570) TravisCI: Remove deprecated `sudo: false` option ([@Turbo87](https://github.com/Turbo87))

#### Committers: 16
- Alon Bukai ([@Alonski](https://github.com/Alonski))
- Ben Demboski ([@bendemboski](https://github.com/bendemboski))
- Ben Murden ([@benmurden](https://github.com/benmurden))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Eli Flanagan ([@efx](https://github.com/efx))
- Heather Blake ([@h2blake](https://github.com/h2blake))
- Kris Van Houten ([@krivaten](https://github.com/krivaten))
- Liam Potter ([@evoactivity](https://github.com/evoactivity))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Sander Steenhuis ([@Redsandro](https://github.com/Redsandro))
- Scott Werner ([@scottwernervt](https://github.com/scottwernervt))
- Sebastián Duque ([@sduquej](https://github.com/sduquej))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))
- William Bautista ([@Willibaur](https://github.com/Willibaur))
- Xavier Cambar ([@xcambar](https://github.com/xcambar))
- [@HodofHod](https://github.com/HodofHod)

## v1.0.0-beta.6

- Fix a number of issues with attribute-indentation:
  - Ensure contextual component indentation / closing indentation is properly enforced.
  - Ensure block opening indentation is properly detected when the block itself is indented.
  - Ensure element modifiers are handled and do cause elements to fail
    attribute-indentation (note: this requires that all element modifiers are
    **after** all attributes).

## v1.0.0-beta.5

- Refactor `linebreak-style` rule to add:
  - `system` setting which enforces current system native line endings
  - `true` value now prevents _mixing_ line endings (as opposed to enforcing a specific one)
- Fix a number of issues with `attribute-indentation`:
  - Ensure that using a value-less attribute does **not** cause following attributes to be considered the wrong indentation
  - Ensure that mustache invocation from within an ElementNode uses the correct indentation
  - Add configuration to control where the `>` / `/>` or `}}` of the open element/mustache go
    - 'new-line' - requires the closing symbol on a new line (outdented)
    - 'last-attribute' - requires the closing symbol to be directly after the last attribute
- Ensure invalid config errors are properly bubbled to the console
- Update `simple-unless` to allow either `maxHelpers` or `whitelist` or both together

## v1.0.0-beta.4

- Ensure the `no-implicit-this` rule allows `hasBlock` / `has-block` without arguments.
- Ensure `no-ambiguous-elements` rule does not mark angle bracket invocation of yielded block param paths as invalid.

## v1.0.0-beta.3

- Fix issue causing `node_modules` to be scanned when running `ember-template-lint .`.

## v1.0.0-beta.2

- Fix issue with `attribute-indentation` rule parsing of element nodes.
- Add `no-quoteless-attributes` rule. See the [rule documentation](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-quoteless-attributes.md) for details.
- Add `no-quoteless-attributes` to the default `recommended` configuration.
-
## v1.0.0-beta.1

- Tweak bin script so that it automatically ignores any files ignored by `.gitignore`.
- Drop support for Node 4, 5, 7, and 9.
- Update `attribute-indentation`'s default `true` config to include processing of elements.
- Make `0-8-recommended` configuration (to make upgrading a bit easier for folks.
- Change "recommended" configuration
  - To be added to the recommended config for 0.9.0:
    - `no-inline-styles`
    - `linebreak-style`
    - `no-duplicate-attributes`
    - `table-groups`
    - `attribute-indentation`
    - `no-unnecessary-concat`
    - `no-input-block`
    - `no-input-tagname`
    - `no-unbound`
    - `no-outlet-outside-routes`
    - `no-partial`
    - `quotes`
    - `no-attrs-in-components`
    - `no-shadowed-elements`
  - To be removed from the recommended config for 0.9.0:
    - `deprecated-inline-view-helper`


## v0.8.23

- Fix regression in `no-unused-block-params` rule.
- Add support for element validation to `attribute-indentation` rule (enableable via the `process-elements` configuration option).

## v0.8.22

- Add `link-href-attributes` rule to forbid `a` elements without an `href` attribute.

## v0.8.21

- Add `--quiet` option to command line interface. Similar to the same option in `eslint` the `--quiet` prevents warnings from being printed.
- Fix issue with block param scope tracking (from `BlockStatement`s) included in prior versions.

## v0.8.20

- Fix issue with using literals in mustaches (e.g. `{{false}}`).

## v0.8.19

### Bugfixes

- Update to latest `@glimmer/compiler` (0.35.5).
- Correct naming of `no-attrs-in-components` rule (deprecating `no-attr-in-components`).
- Add line/column information to fatal / parsing errors.
- Deprecate `no-trailing-dot-in-path-expression` rule (it is now directly enforced by Glimmer itself).
- Update `invocation-blacklist` rule to accomodate angle bracket invocation.
- Update `no-unused-block-param` rule to accomodate angle bracket invocation.
- Add `Plugin.prototype.isLocal` to test if a given node is derived from a block param.
- Add ability to configure the indentation level for `attribute-indentation` rule.

### New Rules

- Add `no-implicit-this` rule. See [the documentation](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-implicit-this.md) for more details.
- Add `no-shadowed-elements` rule.

## 0.8.18

- Ensure `no-nested-interactive` rule does not flag angle bracket invoked components.

## 0.8.17

- Fix issue with rule deprecation (introduced in 0.8.16). This was causing
  deprecated rules that were configured properly to "loose" their config.
- Ensure reported errors include line and column numbers.

## 0.8.16

- Add `invocable-blacklist` rule allowing specific invokables to be disabled
  (e.g. you want to forbid a `stinky-garbage` component or helper from usage in
  your app).
- Fix various ordering issues with `link-rel-noopener` rule (combinations of
  `noreferrer` and `noopener` would incorrectly be marked as invalid).
- Fix issues with templates with a string literal inside mustaches (e.g. `{{"foo"}}`).
- Remove `tabpanel` from being considered an interactive element.
- Add `aria-label`, `aria-placeholder`, `aria-roledescription`,
  `aria-valuetext` to be considered as part of the `no-bare-strings` rule.
- Rename a number of rules for consistency. A deprecation message will be
  emitted when the deprecated name is used in your applications configuration:
  - `inline-styles` -> `no-inline-styles`
  - `bare-strings` -> `no-bare-strings`
  - `html-comments` -> `no-html-comments`
  - `invalid-interactive` -> `no-invalid-interactive`
  - `nested-interactive` -> `no-nested-interactive`
  - `triple-curlies` -> `no-triple-curlies`
  - `unused-block-params` -> `no-unused-block-params`

## 0.8.15

- add whitelist to simple-unless [#356](https://github.com/rwjblue/ember-template-lint/pull/356)
- add no-partial rule [#369](https://github.com/rwjblue/ember-template-lint/pull/369)
- unused-block-params: Disable rule when partial is used in scope [#368](https://github.com/rwjblue/ember-template-lint/pull/368)
- Remove unused `lodash` dependency [#367](https://github.com/rwjblue/ember-template-lint/pull/367)
- add no-unnecessary-concat rule [#365](https://github.com/rwjblue/ember-template-lint/pull/365)
- update @glimmer/compiler to version 0.32.3 [#362](https://github.com/rwjblue/ember-template-lint/pull/362)
- Remove explicit `@glimmer/syntax` dependency [#363](https://github.com/rwjblue/ember-template-lint/pull/363)
- add no-outlet-outside-routes rule [#359](https://github.com/rwjblue/ember-template-lint/pull/359)
- add no-input-block and no-input-tagname rules [#361](https://github.com/rwjblue/ember-template-lint/pull/361)
- add no-unbound rule [#360](https://github.com/rwjblue/ember-template-lint/pull/360)
- fix attribute-indentation) [#358](https://github.com/rwjblue/ember-template-lint/pull/358)
- fix eol-last [#344](https://github.com/rwjblue/ember-template-lint/pull/344)
- fix attribute-indentation [#334](https://github.com/rwjblue/ember-template-lint/pull/334)
- Allow form elements to have reset actions [#355](https://github.com/rwjblue/ember-template-lint/pull/355)
- No trailing dot(s) in a path expression [#342](https://github.com/rwjblue/ember-template-lint/pull/342)
- Allow sharing and extending configs [#322](https://github.com/rwjblue/ember-template-lint/pull/322)
- table-groups improvements [#335](https://github.com/rwjblue/ember-template-lint/pull/335)

## 0.8.14

- Ensure that the configuration objects are not mutated.

## 0.8.13

- Add new `quotes` rule. Examples:

Enforce either:

```hbs
<div class="my-class">test</div>
{{my-helper "hello there"}}
```

or:

```hbs
<div class='my-class'>test</div>
{{my-helper 'hello there'}}
```

You can read more about the rule [in the documentation](https://github.com/rwjblue/ember-template-lint/blob/master/docs/rule/quotes.md).

## 0.8.12

- Ensure packages required by the executable script are dependencies. This fixes issues when using `ember-template-lint` as a globally installed package.

## 0.8.11

- Fix issue with `attribute-indentation` rule (reporting incorrect indentation for multiple valid invocations).

## 0.8.10

- Add new `no-trailing-spaces` rule. Examples:

Bad:

```hbs
<div>test</div>//••
//•••••
```

Good:

```hbs
<div>test</div>//
//
```

You can read more about the rule [in the documentation](https://github.com/rwjblue/ember-template-lint/blob/master/docs/rule/no-trailing-spaces.md).

- Add new `eol-last` rule. Examples:

Enforce either:

```hbs
<div>test</div>
```

or:

```hbs
<div>test</div>

```

You can read more about the rule [in the documentation](https://github.com/rwjblue/ember-template-lint/blob/master/docs/rule/eol-last.md).

## 0.8.9

- Add support for `colgroup` and `caption` to `table-groups` rule.
- Colorize the error severity in the console output.

## 0.8.8

- Add new `table-groups` rule. Examples:

The rule forbids the following:

```hbs
<table>
  <tr>
    <td></td>
  </tr>
</table>
```

```hbs
<table>
  {{some-thing content=content}}
</table>
```

Instead, you should write your table as:

```hbs
<table>
  <tbody>
    <tr>
      <td></td>
    </tr>
  </tbody>
</table>
```

```hbs
<table>
  <tbody>
    {{some-thing content=content}}
  </tbody>
</table>
```

You can read more about the rule [in the documentation](https://github.com/rwjblue/ember-template-lint/blob/master/docs/rule/table-groups.md).

## 0.8.7

- Ensure that the contents of else blocks (a.k.a. `inverse` blocks) are checked for indentation.

## 0.8.6

- Fix error in `simple-unless` rule when an `{{if` or `{{unless` block was empty.

## 0.8.5

- Add new `template-length` rule. When enabled, this rule restricts the total number of lines in a template file to the configured number. You can read more about the rule (and configuration) [in the documentation](https://github.com/rwjblue/ember-template-lint/blob/master/docs/rule/template-length.md).

## 0.8.4

- Add new `attribute-indentation` rule.  Examples:

``` hbs
{{! good }}

{{foo-bar baz="bat" derp="qux"}}

{{foo-bar
  baz="bat"
  derp="qux"
}}

{{#foo-bar
  baz="bat"
  derp="qux"
as |foo|}}
  stuff here
{{/foo-bar}}

{{#foo-bar baz="bat" derp="qux" as |foo|}}
  stuff here
{{/foo-bar}}
```

``` hbs
{{! bad }}

{{foo-bar baz="bat"
  derp="qux"
}}

{{foo-bar
baz="bat"
derp="qux"
}}

{{foo-bar
  baz="bat"
  derp="qux"}}
```

You can read more about the rule (and configuration) [in the documentation](https://github.com/rwjblue/ember-template-lint/blob/master/docs/rule/attribute-indentation.md).


## 0.8.3

- Update @glimmer packages to 0.27.0.
- Update `block-indentation` rule to allow `{{#if foo}}stuff{{else}}stuff{{/if}}`.
- Fix error being thrown by `linebreak-style` rule when dynamic attributes were being used (e.g. `<img alt="example" src={{some/thing here}}>`).

## 0.8.2

- Add new rule `no-duplicate-attributes` to prevent duplicating the same attributes in a single mustache/block/element. Read the [documentation](https://github.com/rwjblue/ember-template-lint/blob/master/docs/rule/no-duplicate-attributes.md) for more details.
- Add new rule `linkbreak-style` to ensure all templates use the same style of linebreaks throughout the template. Read the [documentation](https://github.com/rwjblue/ember-template-lint/blob/master/docs/rule/linebreak-style.md) for more details.

## 0.8.1

- Fix issue with console output formatting to avoid noisy console output when no errors are present.

## 0.8.0

- Refactor the console output formatter to be a much closer match to ESLint output (changes the signature of `Linter.errorsToMessages`).

## 0.7.4

- Cleanup dependencies (remove unused, update versions to latest, etc).
- Move rule documentation out of the `README.md` and into `docs/rules/<rule-name>.md` to make it simpler to reason about and link to documentation by rule.
- Add `require` as an option to `self-closing-void-elements`. Use this value if you would like to _require_ that all void elements are self closing (e.g. you require `<img />`).

## 0.7.3

- Move `strip-bom` to `dependencies` (was mistakenly a `devDependency`).

## 0.7.2

- Prevent errors when using contextual components.

## 0.7.1

- Prevent errors within the `bare-strings` rule for `<input placeholder="{{foo}}.">`

## 0.7.0

- Add support for user supplied rules and configuration. Please review [the documentation](https://github.com/rwjblue/ember-template-lint/blob/master/docs/plugins.md) for more details.
- Add `ember-template-lint` command line script. This enable much easier running of the linter from the command line, editor plugins, etc. Supports `--json` flag to enable easier consumption by tools. See [documentation](https://github.com/rwjblue/ember-template-lint#cli-executable) for more details.
- Allow `rel=noreferrer` to satisfy the `link-rel-noopener` rule.
- Add `inline-styles` rule, which forbids using the `style` attribute in HTML elements.
- Drop support for Node < 4.
- Fix a number of issues with `block-indentation` rule when using "whitespace control" characters (e.g. `{{~if foo~}}`).
- Add support for globs in `.template-lintrc.js`'s `ignore` option.
- Add `simple-unless` rule which forbids using `{{unless` with an inverse (or from an inverse), and with complex helper invocations as the predicate.

  ```hbs
  {{! good }}

  <div class="{{unless foo "bar"}}"></div>
  {{#unless something}}
  {{/unless}}

  {{! bad }}

  {{#unless something}}
  {{else}}
  {{/unless}}


  {{#unless (complex (helper (invocation)))}}
  {{/unless}}
  ```
- Add `simple-unless` to the recommended configuration.
- Allow `<form onsubmit={{action 'foo'}}></form>` from the `invalid-interactive` rule.
- Remove `deprecated-each-syntax` from `recommended` config.
- Add configurable option to `link-rel-noopener` to require **both** `noopener` and `noreferrer`. See the [documentation](https://github.com/rwjblue/ember-template-lint#link-rel-noopener) for more details.
- Update to leverage ES2015 features that are supported in Node 4.
- Added `no-log` and `no-debugger` rules. These rules forbid usage of `{{log}}` and `{{debugger}` helpers, which should be used only for local debugging and never checked in.
- Fix issues around templates including a [Byte Order Mark](https://en.wikipedia.org/wiki/Byte_order_mark).
- Upgrade underlying engine to leverage `@glimmer/compiler@0.25.1`. Includes much smaller footprint, better location support, easier to use plugin API.
- Change API around `Rule` definition. A simple `class extends Rule { }` is all that is required.


## v0.6.3

- Add support for Handlebars comments.

  A few new types of control statements are now available:
    * `{{! template-lint-enable some-rule-name }}` - This will enable the rule `some-rule-name` with the default configuration (from `.template-lintrc.js`) or `true` (if not present in the config file). This can be ran for multiple rules at once (i.e. `{{! template-lint-enable bare-strings some-other-thing }}`).
    * `{{! template-lint-disable some-rule-name }}` - This will disable the rule `some-rule-name`. Multiple rules can be provided at once (i.e. `{{! template-lint-disable bare-strings some-other-thing }}`).
    * `{{! template-lint-configure some-rule-name { "whitelist": ["some", "valid", "json"] } }}` - This configures the rule `some-rule-name` with the `JSON.parse()`'ed result of the second argument.  The configure instruction only applies toa  single rule at a time.

  These configuration instructions do not modify the rule for the rest of the template, but instead only modify it within whatever DOM scope the comment instruction appears.

  An instruction will apply to all later siblings and their descendants:

  ```hbs
  {{! disable for <p> and <span> and their contents, but not for <div> or <hr> }}
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
  {{! enable for <p>, but not for <div>, <hr> or <span> }}
  <div>
    <hr>
    <p {{! template-lint-enable }}>
      <span>Hello!</span>
    </p>
  </div>
  ```

  An in-element instruction with the -tree suffix will apply to that element and all its descendants:

  ```hbs
  {{! configure for <p>, <span> and their contents, but not for <div> or <hr> }}
  <div>
    <hr>
    <p {{! template-lint-configure-tree block-indentation "tab" }}>
      <span>Hello!</span>
    </p>
  </div>
  ```

- Deprecate using HTML comments for enabling/disabling rules. Support for HTML comments will be removed in v0.7.0.

## v0.6.2

- Add `ignore` to allowed configuration values. `ignore` is an array of moduleId's that are to be completely ignored. This is similar (but different) from `pending`.
- Add `unused-block-params` rule. The following example would fail this rule (since it has an unused block param `index`):

```hbs
{{#each foo as |bar index|}}
  {{bar}}
{{/each}}
```
- Update `img-alt-attributes` rule to allow `<img alt>` and `<img alt="">`.
- Update `invalid-interactive` rule to allow `<form {{action 'foo' on="submit"}}>`.


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
