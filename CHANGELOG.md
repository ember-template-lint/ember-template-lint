












## v5.13.0 (2023-11-21)

#### :rocket: Enhancement
* [#2990](https://github.com/ember-template-lint/ember-template-lint/pull/2990) Add new rule `no-builtin-form-components` ([@gilest](https://github.com/gilest))

#### Committers: 1
- Giles Thompson ([@gilest](https://github.com/gilest))


## v5.12.0 (2023-11-04)

#### :rocket: Enhancement
* [#1931](https://github.com/ember-template-lint/ember-template-lint/pull/1931) Add new rule `no-action-on-submit-button` ([@JoaoDsv](https://github.com/JoaoDsv))
* [#2970](https://github.com/ember-template-lint/ember-template-lint/pull/2970) Support auto-lookup of `.mjs` and `.cjs` config files ([@bertdeblock](https://github.com/bertdeblock))

#### :bug: Bug Fix
* [#2982](https://github.com/ember-template-lint/ember-template-lint/pull/2982) Disable `modifier-name-case` rule for gjs/gts ([@chancancode](https://github.com/chancancode))

#### :memo: Documentation
* [#2967](https://github.com/ember-template-lint/ember-template-lint/pull/2967) Update example markup for consistency and errors ([@chrisrng](https://github.com/chrisrng))

#### Committers: 4
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Chris Ng ([@chrisrng](https://github.com/chrisrng))
- Godfrey Chan ([@chancancode](https://github.com/chancancode))
- Joao Da Silva Marly ([@JoaoDsv](https://github.com/JoaoDsv))


## v5.11.2 (2023-08-12)

#### :bug: Bug Fix
* [#2954](https://github.com/ember-template-lint/ember-template-lint/pull/2954) Don't require redundant role for `<img alt="" />` in `require-valid-alt-text` rule ([@HeroicEric](https://github.com/HeroicEric))
* [#2955](https://github.com/ember-template-lint/ember-template-lint/pull/2955) Update @lint-todo/utils to 3.1.1 ([@Techn1x](https://github.com/Techn1x))

#### Committers: 2
- Brad Overton ([@Techn1x](https://github.com/Techn1x))
- Eric Kelly ([@HeroicEric](https://github.com/HeroicEric))


## v5.11.1 (2023-07-19)

#### :bug: Bug Fix
* [#2940](https://github.com/ember-template-lint/ember-template-lint/pull/2940) Fixes location reporting in `simple-unless` rule ([@judithhinlung](https://github.com/judithhinlung))

#### Committers: 1
- Judith Lung ([@judithhinlung](https://github.com/judithhinlung))


## v5.11.0 (2023-06-27)

#### :rocket: Enhancement
* [#2554](https://github.com/ember-template-lint/ember-template-lint/pull/2554) Add new rule `no-at-ember-render-modifiers` ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)


## v5.10.3 (2023-06-17)

#### :bug: Bug Fix
* [#2917](https://github.com/ember-template-lint/ember-template-lint/pull/2917) Fix crash in `no-unsupported-role-attributes` rule ([@jaswilli](https://github.com/jaswilli))

#### Committers: 1
- Jason Williams ([@jaswilli](https://github.com/jaswilli))


## v5.10.2 (2023-06-16)

#### :bug: Bug Fix
* [#2914](https://github.com/ember-template-lint/ember-template-lint/pull/2914) Fix `aria-query` related crash in `no-unsupported-role-attributes` rule ([@bmish](https://github.com/bmish))
* [#2907](https://github.com/ember-template-lint/ember-template-lint/pull/2907) Fix location reporting in `block-indentation` rule ([@judithhinlung](https://github.com/judithhinlung))

#### :house: Internal
* [#2915](https://github.com/ember-template-lint/ember-template-lint/pull/2915) Update incorrect tests ([@ef4](https://github.com/ef4))

#### Committers: 3
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Edward Faulkner ([@ef4](https://github.com/ef4))
- Judith Lung ([@judithhinlung](https://github.com/judithhinlung))


## v5.10.1 (2023-06-07)

#### :bug: Bug Fix
* [#2907](https://github.com/ember-template-lint/ember-template-lint/pull/2907) Fix location reporting in `block-indentation` rule ([@judithhinlung](https://github.com/judithhinlung))

#### Committers: 3
- Judith Lung ([@judithhinlung](https://github.com/judithhinlung))


## v5.10.0 (2023-05-25)

#### :rocket: Enhancement
* [#2895](https://github.com/ember-template-lint/ember-template-lint/pull/2895) Add autofixer to `no-unnecessary-curly-strings` rule ([@lin-ll](https://github.com/lin-ll))
* [#2894](https://github.com/ember-template-lint/ember-template-lint/pull/2894) Add autofixer to `no-trailing-spaces`  rule ([@lin-ll](https://github.com/lin-ll))

#### Committers: 1
- Lucy Lin ([@lin-ll](https://github.com/lin-ll))


## v5.9.0 (2023-05-24)

#### :rocket: Enhancement
* [#2754](https://github.com/ember-template-lint/ember-template-lint/pull/2754) Add options for different `html` / `hbs` quote styles in `quotes` rule ([@robclancy](https://github.com/robclancy))

#### Committers: 1
- Robert Clancy (Robbo) ([@robclancy](https://github.com/robclancy))


## v5.8.0 (2023-05-23)

#### :rocket: Enhancement
* [#2887](https://github.com/ember-template-lint/ember-template-lint/pull/2887) Add new rule `simple-modifiers` ([@rmonzon](https://github.com/rmonzon))

#### :bug: Bug Fix
* [#2891](https://github.com/ember-template-lint/ember-template-lint/pull/2891) Fix override for gjs files in `recommended` config ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 2
- Raul Rivero ([@rmonzon](https://github.com/rmonzon))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)


## v5.7.3 (2023-04-28)

#### :bug: Bug Fix
* [#2339](https://github.com/ember-template-lint/ember-template-lint/pull/2339) Convert path to URL before import of config/plugin for Windows support ([@lifeart](https://github.com/lifeart))

#### Committers: 1
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))


## v5.7.2 (2023-03-28)

#### :bug: Bug Fix
* [#2853](https://github.com/ember-template-lint/ember-template-lint/pull/2853) Bump `ember-template-recast` to v6.1.4 ([@bertdeblock](https://github.com/bertdeblock))

#### Committers: 1
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))


## v5.7.1 (2023-03-16)

#### :bug: Bug Fix

* [#2846](https://github.com/ember-template-lint/ember-template-lint/pull/2846) Disable embedded templates handling for `eol-last` rule ([@robinborst95](https://github.com/robinborst95))
* [#2844](https://github.com/ember-template-lint/ember-template-lint/pull/2844) Disable `no-curly-component-invocation` and `no-implicit-this` rules for `gjs` / `gts` files ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 2

- NullVoxPopuli ([@NullVoxPopuli](https://github.com/NullVoxPopuli)
- Robin Borst ([@robinborst95](https://github.com/robinborst95))

## v5.7.0 (2023-03-15)

#### :bug: Bug Fix
* [#2843](https://github.com/ember-template-lint/ember-template-lint/pull/2843) Avoid crash with dynamic `aria-label` in `no-invalid-link-text` rule ([@StephanH90](https://github.com/StephanH90))
* [#2838](https://github.com/ember-template-lint/ember-template-lint/pull/2838) Fix embedded templates handling in `block-indentation` rule  ([@robinborst95](https://github.com/robinborst95))
* [#2833](https://github.com/ember-template-lint/ember-template-lint/pull/2833) Fix incorrect violation with embedded templates in `no-trailing-spaces` rule ([@robinborst95](https://github.com/robinborst95))
* [#2845](https://github.com/ember-template-lint/ember-template-lint/pull/2845) Recognize imports from `@glimmerx/component` ([@tstewart15](https://github.com/tstewart15))

#### Committers: 3
- Robin Borst  ([@robinborst95](https://github.com/robinborst95))
- Tom Stewart ([@tstewart15](https://github.com/tstewart15))
- [@StephanH90](https://github.com/StephanH90)

## v5.6.0 (2023-02-24)

#### :rocket: Enhancement
* [#2818](https://github.com/ember-template-lint/ember-template-lint/pull/2818) Add `additionalNonSemanticTags` option to `require-presentational-children` rule ([@Techn1x](https://github.com/Techn1x))

#### :bug: Bug Fix
* [#2819](https://github.com/ember-template-lint/ember-template-lint/pull/2819) Allow intermediate presentation role before context in `require-context-role` rule ([@Techn1x](https://github.com/Techn1x))
* [#2820](https://github.com/ember-template-lint/ember-template-lint/pull/2820) Allow presentation role for `li` in `no-invalid-role` rule ([@Techn1x](https://github.com/Techn1x))

#### Committers: 1
- Brad Overton ([@Techn1x](https://github.com/Techn1x))


## v5.5.1 (2023-02-10)

#### :bug: Bug Fix
* [#2802](https://github.com/ember-template-lint/ember-template-lint/pull/2802) Rename `no-unnecessary-curly-literals` rule to `no-unnecessary-curly-strings` ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))


## v5.5.0 (2023-02-08)

#### :rocket: Enhancement
* [#2794](https://github.com/ember-template-lint/ember-template-lint/pull/2794) Add new rule `no-unnecessary-curly-literals` ([@Shivareddy-Aluri](https://github.com/Shivareddy-Aluri))

#### Committers: 1
- Shivareddy-Aluri ([@Shivareddy-Aluri](https://github.com/Shivareddy-Aluri))


## v5.4.0 (2023-02-08)

#### :rocket: Enhancement
* [#2792](https://github.com/ember-template-lint/ember-template-lint/pull/2792) Add new rule `no-unnecessary-curly-parens` ([@raycohen](https://github.com/raycohen))

#### Committers: 1
- Ray Cohen ([@raycohen](https://github.com/raycohen))


## v5.3.3 (2023-01-27)

#### :bug: Bug Fix
* [#2780](https://github.com/ember-template-lint/ember-template-lint/pull/2780) Ignore `{{(unique-id)}}` helper variation in `no-duplicate-id` rule ([@lifeart](https://github.com/lifeart))

#### Committers: 1
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))


## v5.3.2 (2023-01-22)

#### :bug: Bug Fix
* [#2778](https://github.com/ember-template-lint/ember-template-lint/pull/2778) Ignore `unique-id` helper in `no-duplicate-id` rule ([@lifeart](https://github.com/lifeart))

#### Committers: 1
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))


## v5.3.1 (2023-01-06)

#### :bug: Bug Fix
* [#2765](https://github.com/ember-template-lint/ember-template-lint/pull/2765) Throw the more-helpful, original exception when encountering an ESM plugin/config loading error ([@jsturgis](https://github.com/jsturgis))

#### :memo: Documentation
* [#2760](https://github.com/ember-template-lint/ember-template-lint/pull/2760) Document how to write rule test cases for fatal errors ([@bmish](https://github.com/bmish))
* [#2759](https://github.com/ember-template-lint/ember-template-lint/pull/2759) Improve snapshot test documentation ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#2761](https://github.com/ember-template-lint/ember-template-lint/pull/2761) Add Node v19 to CI ([@ddzz](https://github.com/ddzz))

#### Committers: 3
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Darius Dzien ([@ddzz](https://github.com/ddzz))
- Jeff Sturgis ([@jsturgis](https://github.com/jsturgis))


## v5.3.0 (2022-12-14)

#### :rocket: Enhancement
* [#2746](https://github.com/ember-template-lint/ember-template-lint/pull/2746) Add autofixer to `no-multiple-empty-lines` rule ([@Shivareddy-Aluri](https://github.com/Shivareddy-Aluri))

#### Committers: 1
- Shivareddy-Aluri ([@Shivareddy-Aluri](https://github.com/Shivareddy-Aluri))


## v5.2.0 (2022-12-07)

#### :rocket: Enhancement
* [#2591](https://github.com/ember-template-lint/ember-template-lint/pull/2591) Add formatter for Kakoune editor ([@velrest](https://github.com/velrest))

#### :bug: Bug Fix
* [#2725](https://github.com/ember-template-lint/ember-template-lint/pull/2725) Fix `--no-ignore-pattern` ([@velrest](https://github.com/velrest))

#### Committers: 1
- Jonas Cosandey ([@velrest](https://github.com/velrest))


## v5.1.1 (2022-12-05)

#### :bug: Bug Fix
* [#2731](https://github.com/ember-template-lint/ember-template-lint/pull/2731) Allow nested `menuitem`s in `no-nested-interactive` rule ([@geneukum](https://github.com/geneukum))

#### :memo: Documentation
* [#2732](https://github.com/ember-template-lint/ember-template-lint/pull/2732)  Link to "skipping helpers" part of the codemod doc in `no-curly-component-invocation` rule doc ([@geneukum](https://github.com/geneukum))

#### Committers: 1
- Geordan Neukum ([@geneukum](https://github.com/geneukum))


## v5.1.0 (2022-12-04)

#### :rocket: Enhancement
* [#2730](https://github.com/ember-template-lint/ember-template-lint/pull/2730) Add autofixer to `no-duplicate-attributes` rule ([@Shivareddy-Aluri](https://github.com/Shivareddy-Aluri))

#### :bug: Bug Fix
* [#2726](https://github.com/ember-template-lint/ember-template-lint/pull/2726) Allow passing only `@model` or `@models` for `<LinkTo>` in `no-unknown-arguments-for-builtin-components` rule ([@geneukum](https://github.com/geneukum))

#### :memo: Documentation
* [#2727](https://github.com/ember-template-lint/ember-template-lint/pull/2727) Add note about `title` property limitations to `require-valid-alt-text` rule doc ([@geneukum](https://github.com/geneukum))

#### Committers: 2
- Geordan Neukum ([@geneukum](https://github.com/geneukum))
- Shivareddy-Aluri ([@Shivareddy-Aluri](https://github.com/Shivareddy-Aluri))


## v5.0.2 (2022-11-28)

#### :bug: Bug Fix
* [#2722](https://github.com/ember-template-lint/ember-template-lint/pull/2722) Fix autofixer bug with `firstObject` inside a `MustacheStatement` in `no-array-prototype-extensions` rule ([@tgvrssanthosh](https://github.com/tgvrssanthosh))

#### Committers: 1
- Santhosh Venkata Rama Siva Thanakala Gani ([@tgvrssanthosh](https://github.com/tgvrssanthosh))


## v5.0.1 (2022-11-21)

#### :bug: Bug Fix
* [#2714](https://github.com/ember-template-lint/ember-template-lint/pull/2714) Allow `role=list` on `<ul>` and `<ol>` in `no-redundant-role` rule ([@Turbo87](https://github.com/Turbo87))

#### Committers: 1
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))


## v5.0.0 (2022-11-19)

#### :boom: Breaking Change
* [#2669](https://github.com/ember-template-lint/ember-template-lint/pull/2669) Drop Node 12 and 17 support ([@bmish](https://github.com/bmish))
* [#2606](https://github.com/ember-template-lint/ember-template-lint/pull/2606) Lint embedded templates by default ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#2671](https://github.com/ember-template-lint/ember-template-lint/pull/2671) Enabled additional `recommended` rules `no-aria-unsupported-elements`, `no-array-prototype-extensions`, `no-invalid-aria-attributes`, `no-obscure-array-access`, `no-scope-outside-table-headings`, `no-unsupported-role-attributes`, `require-aria-activedescendant-tabindex`, `require-mandatory-role-attributes`, `require-media-caption` ([@bmish](https://github.com/bmish))
* [#2675](https://github.com/ember-template-lint/ember-template-lint/pull/2675) Rename `no-redundant-landmark-role` rule to `no-redundant-role` and change `checkAllHTMLElements` option default to `true` ([@bmish](https://github.com/bmish))
* [#2054](https://github.com/ember-template-lint/ember-template-lint/pull/2054) Rename and narrow rule `no-down-event-binding` to `no-pointer-down-event-binding` ([@jfdnc](https://github.com/jfdnc))
* [#2674](https://github.com/ember-template-lint/ember-template-lint/pull/2674) Change `validateValues` option default to `true` in `require-lang-attribute` rule ([@bmish](https://github.com/bmish))
* [#2673](https://github.com/ember-template-lint/ember-template-lint/pull/2673) Change `simplifyHelpers` option default to `true` in `no-negated-condition` rule ([@bmish](https://github.com/bmish))
* [#2672](https://github.com/ember-template-lint/ember-template-lint/pull/2672) Change `maxHelpers` option default to `1` in `simple-unless` rule ([@bmish](https://github.com/bmish))
* [#2657](https://github.com/ember-template-lint/ember-template-lint/pull/2657) Include modifiers in `no-restricted-invocations` rule ([@achambers](https://github.com/achambers))

#### Committers: 4
- Aaron Chambers ([@achambers](https://github.com/achambers))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Jacob ([@jfdnc](https://github.com/jfdnc))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)



## v5.0.0-alpha.0 (2022-11-03)

#### :boom: Breaking Change
* [#2669](https://github.com/ember-template-lint/ember-template-lint/pull/2669) Drop Node 12 and 17 support ([@bmish](https://github.com/bmish))
* [#2606](https://github.com/ember-template-lint/ember-template-lint/pull/2606) Lint embedded templates by default ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#2671](https://github.com/ember-template-lint/ember-template-lint/pull/2671) Enabled additional `recommended` rules `no-aria-unsupported-elements`, `no-array-prototype-extensions`, `no-invalid-aria-attributes`, `no-obscure-array-access`, `no-scope-outside-table-headings`, `no-unsupported-role-attributes`, `require-aria-activedescendant-tabindex`, `require-mandatory-role-attributes`, `require-media-caption` ([@bmish](https://github.com/bmish))
* [#2675](https://github.com/ember-template-lint/ember-template-lint/pull/2675) Rename `no-redundant-landmark-role` rule to `no-redundant-role` and change `checkAllHTMLElements` option default to `true` ([@bmish](https://github.com/bmish))
* [#2054](https://github.com/ember-template-lint/ember-template-lint/pull/2054) Rename and narrow rule `no-down-event-binding` to `no-pointer-down-event-binding` ([@jfdnc](https://github.com/jfdnc))
* [#2674](https://github.com/ember-template-lint/ember-template-lint/pull/2674) Change `validateValues` option default to `true` in `require-lang-attribute` rule ([@bmish](https://github.com/bmish))
* [#2673](https://github.com/ember-template-lint/ember-template-lint/pull/2673) Change `simplifyHelpers` option default to `true` in `no-negated-condition` rule ([@bmish](https://github.com/bmish))
* [#2672](https://github.com/ember-template-lint/ember-template-lint/pull/2672) Change `maxHelpers` option default to `1` in `simple-unless` rule ([@bmish](https://github.com/bmish))
* [#2657](https://github.com/ember-template-lint/ember-template-lint/pull/2657) Include modifiers in `no-restricted-invocations` rule ([@achambers](https://github.com/achambers))

#### :house: Internal
* [#2676](https://github.com/ember-template-lint/ember-template-lint/pull/2676) Refresh lockfile from scratch ([@bmish](https://github.com/bmish))

#### Committers: 4
- Aaron Chambers ([@achambers](https://github.com/achambers))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Jacob ([@jfdnc](https://github.com/jfdnc))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)



## v4.18.2 (2022-11-17)

#### :bug: Bug Fix
* [#2696](https://github.com/ember-template-lint/ember-template-lint/pull/2696) Ensure `--fix` works properly for `.gjs`/`.gts` files ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v4.18.1 (2022-11-15)

#### :bug: Bug Fix
* [#2701](https://github.com/ember-template-lint/ember-template-lint/pull/2701) Fix autofixer for value-less attributes and comment order in `attribute-order` rule ([@rob-long](https://github.com/rob-long))

#### :memo: Documentation
* [#2694](https://github.com/ember-template-lint/ember-template-lint/pull/2694) Use `npx` in stale todo command suggestion ([@bertdeblock](https://github.com/bertdeblock))

#### :house: Internal
* [#2698](https://github.com/ember-template-lint/ember-template-lint/pull/2698) Add CodeQL ([@bmish](https://github.com/bmish))
* [#2658](https://github.com/ember-template-lint/ember-template-lint/pull/2658) Utilize new contents data from ember-template-imports ([@gabrielcsapo](https://github.com/gabrielcsapo))

#### Committers: 4
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Gabriel Csapo ([@gabrielcsapo](https://github.com/gabrielcsapo))
- Rob Long ([@rob-long](https://github.com/rob-long))


## v4.18.0 (2022-11-08)

Related note: The first v5 preview release is available for testing: [v5.0.0-alpha.0](https://github.com/ember-template-lint/ember-template-lint/releases/tag/v5.0.0-alpha.0).

#### :rocket: Enhancement
* [#2575](https://github.com/ember-template-lint/ember-template-lint/pull/2575) Add new rule `attribute-order` ([@rob-long](https://github.com/rob-long))

#### Committers: 1
- Rob Long ([@rob-long](https://github.com/rob-long))


## v4.17.0 (2022-10-29)

#### :rocket: Enhancement
* [#2653](https://github.com/ember-template-lint/ember-template-lint/pull/2653) Add `simplifyHelpers` option in `no-negated-condition` rule ([@godric3](https://github.com/godric3))

#### :house: Internal
* [#2661](https://github.com/ember-template-lint/ember-template-lint/pull/2661) Remove usage of `cross-env` ([@rwjblue](https://github.com/rwjblue))
* [#2659](https://github.com/ember-template-lint/ember-template-lint/pull/2659) Remove eslint-plugin-import-helpers ([@rwjblue](https://github.com/rwjblue))

#### Committers: 3
- Andrzej Żak ([@godric3](https://github.com/godric3))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v4.16.1 (2022-10-18)

#### :bug: Bug Fix
* [#2648](https://github.com/ember-template-lint/ember-template-lint/pull/2648) Allow negation with multiple parameters in `no-negated-condition` rule ([@godric3](https://github.com/godric3))

#### Committers: 1
- Andrzej Żak ([@godric3](https://github.com/godric3))


## v4.16.0 (2022-10-18)

#### :rocket: Enhancement
* [#2639](https://github.com/ember-template-lint/ember-template-lint/pull/2639) Add autofix for case with helpers to `simple-unless` rule ([@godric3](https://github.com/godric3))

#### :memo: Documentation
* [#2643](https://github.com/ember-template-lint/ember-template-lint/pull/2643) Clarify default `maxHelpers` option value for `simple-unless` rule ([@bmish](https://github.com/bmish))
* [#2636](https://github.com/ember-template-lint/ember-template-lint/pull/2636) Add link to RFC for `no-array-prototype-extensions` rule ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#2638](https://github.com/ember-template-lint/ember-template-lint/pull/2638) Bump volta-cli/action@v4 ([@ctjhoa](https://github.com/ctjhoa))

#### Committers: 3
- Andrzej Żak ([@godric3](https://github.com/godric3))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Camille TJHOA ([@ctjhoa](https://github.com/ctjhoa))


## v4.15.0 (2022-10-10)

#### :rocket: Enhancement
* [#2629](https://github.com/ember-template-lint/ember-template-lint/pull/2629) Add autofixer to `simple-unless` rule for simplest case ([@godric3](https://github.com/godric3))

#### :house: Internal
* [#2607](https://github.com/ember-template-lint/ember-template-lint/pull/2607) Add eslint-plugin-jest ([@bmish](https://github.com/bmish))

#### Committers: 2
- Andrzej Żak ([@godric3](https://github.com/godric3))
- Bryan Mishkin ([@bmish](https://github.com/bmish))


## v4.14.0 (2022-09-01)

#### :rocket: Enhancement
* [#2483](https://github.com/ember-template-lint/ember-template-lint/pull/2483) Implement support for embedded templates ([@ventuno](https://github.com/ventuno))

#### :bug: Bug Fix
* [#2604](https://github.com/ember-template-lint/ember-template-lint/pull/2604) Fix `--version` to actually give the right value ([@rwjblue](https://github.com/rwjblue))

#### :house: Internal
* [#2605](https://github.com/ember-template-lint/ember-template-lint/pull/2605) Add `concurrency` setup to GitHub Actions workflow ([@rwjblue](https://github.com/rwjblue))
* [#2602](https://github.com/ember-template-lint/ember-template-lint/pull/2602) Update GitHub Actions setup to volta-cli/action@v3 ([@rwjblue](https://github.com/rwjblue))

#### Committers: 2
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- [@ventuno](https://github.com/ventuno)


## v4.13.0 (2022-08-30)

#### :rocket: Enhancement
* [#2583](https://github.com/ember-template-lint/ember-template-lint/pull/2583) Add autofixer to `self-closing-void-elements` rule ([@locks](https://github.com/locks))
* [#2581](https://github.com/ember-template-lint/ember-template-lint/pull/2581) Add autofixer to `no-html-comments` rule ([@locks](https://github.com/locks))
* [#2582](https://github.com/ember-template-lint/ember-template-lint/pull/2582) Add autofixer to `no-quoteless-attributes` rule ([@locks](https://github.com/locks))

#### :bug: Bug Fix
* [#2589](https://github.com/ember-template-lint/ember-template-lint/pull/2589) Remove `<s>` and `<u>` from `no-obsolete-elements` ([@sukima](https://github.com/sukima))
* [#2593](https://github.com/ember-template-lint/ember-template-lint/pull/2593) Add `unique-id` to allowed built-in helpers in `no-curly-component-invocation` and `no-implicit-this` rules ([@geneukum](https://github.com/geneukum))

#### :house: Internal
* [#2598](https://github.com/ember-template-lint/ember-template-lint/pull/2598) Limit permissions for CI workflow ([@sashashura](https://github.com/sashashura))
* [#2434](https://github.com/ember-template-lint/ember-template-lint/pull/2434) Extract `hasParentTag` utility function ([@JoaoDsv](https://github.com/JoaoDsv))

#### Committers: 5
- Alex ([@sashashura](https://github.com/sashashura))
- Devin Weaver ([@sukima](https://github.com/sukima))
- Geordan Neukum ([@geneukum](https://github.com/geneukum))
- Joao Da Silva Marly ([@JoaoDsv](https://github.com/JoaoDsv))
- Ricardo Mendes ([@locks](https://github.com/locks))


## v4.12.0 (2022-08-05)

#### :rocket: Enhancement
* [#2574](https://github.com/ember-template-lint/ember-template-lint/pull/2574) Add autofixer to `no-unnecessary-component-helper` rule ([@bmish](https://github.com/bmish))
* [#2573](https://github.com/ember-template-lint/ember-template-lint/pull/2573) Add autofixer to `modifier-name-case` rule ([@bmish](https://github.com/bmish))
* [#2569](https://github.com/ember-template-lint/ember-template-lint/pull/2569) Add autofixer to `require-valid-named-block-naming-format` rule ([@locks](https://github.com/locks))

#### :memo: Documentation
* [#2513](https://github.com/ember-template-lint/ember-template-lint/pull/2513) Update overrides example ([@jamescdavis](https://github.com/jamescdavis))

#### Committers: 3
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- James C. Davis ([@jamescdavis](https://github.com/jamescdavis))
- Ricardo Mendes ([@locks](https://github.com/locks))


## v4.11.0 (2022-08-03)

#### :rocket: Enhancement
* [#2568](https://github.com/ember-template-lint/ember-template-lint/pull/2568) Add autofixer to `no-unnecessary-concat` rule ([@locks](https://github.com/locks))

#### Committers: 1
- Ricardo Mendes ([@locks](https://github.com/locks))


## v4.10.1 (2022-06-26)

#### :bug: Bug Fix
* [#2541](https://github.com/ember-template-lint/ember-template-lint/pull/2541) Fix helper used by several rules for dasherizing multi-level nested component names ([@nulle](https://github.com/nulle))
* [#2535](https://github.com/ember-template-lint/ember-template-lint/pull/2535) Clarify violation message for `no-dynamic-subexpression-invocations` rule ([@chrisrng](https://github.com/chrisrng))
* [#2527](https://github.com/ember-template-lint/ember-template-lint/pull/2527) Add route action name to error message in `no-route-action` rule ([@tylerbecks](https://github.com/tylerbecks))

#### :memo: Documentation
* [#2540](https://github.com/ember-template-lint/ember-template-lint/pull/2540) Fix config documentation for `table-groups` rule ([@nulle](https://github.com/nulle))
* [#2533](https://github.com/ember-template-lint/ember-template-lint/pull/2533) Add `no-action` rule migration example ([@angelayanpan](https://github.com/angelayanpan))

#### Committers: 4
- Angela Pan ([@angelayanpan](https://github.com/angelayanpan))
- Chris Ng ([@chrisrng](https://github.com/chrisrng))
- Inga Brūnava ([@nulle](https://github.com/nulle))
- Tyler Becks ([@tylerbecks](https://github.com/tylerbecks))


## v4.10.0 (2022-05-26)

#### :rocket: Enhancement
* [#2523](https://github.com/ember-template-lint/ember-template-lint/pull/2523) Add new rule `require-mandatory-role-attributes` ([@judithhinlung](https://github.com/judithhinlung))

#### Committers: 1
- Judith Lung ([@judithhinlung](https://github.com/judithhinlung))


## v4.9.1 (2022-05-19)

#### :bug: Bug Fix
* [#2516](https://github.com/ember-template-lint/ember-template-lint/pull/2516) Fix crash in `no-unsupported-role-attributes` rule when an element has no implicit role ([@bertdeblock](https://github.com/bertdeblock))

#### Committers: 1
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))


## v4.9.0 (2022-05-18)

#### :rocket: Enhancement
* [#2511](https://github.com/ember-template-lint/ember-template-lint/pull/2511) Add new rule `no-unsupported-role-attributes` ([@judithhinlung](https://github.com/judithhinlung))

#### :bug: Bug Fix
* [#2509](https://github.com/ember-template-lint/ember-template-lint/pull/2509) Update yargs to 17.5.1 to fix `--version` ([@jamescdavis](https://github.com/jamescdavis))

#### Committers: 2
- James C. Davis ([@jamescdavis](https://github.com/jamescdavis))
- Judith Lung ([@judithhinlung](https://github.com/judithhinlung))


## v4.8.0 (2022-05-13)

#### :rocket: Enhancement
* [#2507](https://github.com/ember-template-lint/ember-template-lint/pull/2507) Add new rule `no-aria-unsupported-elements` ([@thegilby](https://github.com/thegilby))

#### :bug: Bug Fix
* [#2503](https://github.com/ember-template-lint/ember-template-lint/pull/2503) Fixes issue where lint-todos add blank lines in .lint-todo storage file ([@scalvert](https://github.com/scalvert))

#### :house: Internal
* [#2506](https://github.com/ember-template-lint/ember-template-lint/pull/2506) Converts to using npm over yarn 1 ([@scalvert](https://github.com/scalvert))
* [#2505](https://github.com/ember-template-lint/ember-template-lint/pull/2505) Fixes CI OOM issues in Windows for Node 18 ([@scalvert](https://github.com/scalvert))

#### Committers: 2
- Gilbert "Gilby" Hernandez ([@thegilby](https://github.com/thegilby))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v4.7.0 (2022-05-10)

#### :rocket: Enhancement
* [#2497](https://github.com/ember-template-lint/ember-template-lint/pull/2497) Add new rule `require-media-caption` ([@judithhinlung](https://github.com/judithhinlung))

#### Committers: 1
- Judith Lung ([@judithhinlung](https://github.com/judithhinlung))


## v4.6.0 (2022-04-28)

#### :rocket: Enhancement
* [#2487](https://github.com/ember-template-lint/ember-template-lint/pull/2487) Add `checkAllHTMLElements` option to `no-redundant-landmark-role` rule to lint against all HTML elements with default ARIA roles ([@judithhinlung](https://github.com/judithhinlung))

#### Committers: 1
- Judith Lung ([@judithhinlung](https://github.com/judithhinlung))


## v4.5.0 (2022-04-22)

#### :rocket: Enhancement
* [#2478](https://github.com/ember-template-lint/ember-template-lint/pull/2478) Add `validateValues` option to `require-lang-attribute` rule ([@judithhinlung](https://github.com/judithhinlung))

#### :house: Internal
* [#2480](https://github.com/ember-template-lint/ember-template-lint/pull/2480) Test under Node 18 ([@bmish](https://github.com/bmish))
* [#2437](https://github.com/ember-template-lint/ember-template-lint/pull/2437) Standardize CLI tests with bin tester package  ([@scalvert](https://github.com/scalvert))

#### Committers: 3
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Judith Lung ([@judithhinlung](https://github.com/judithhinlung))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v4.4.2 (2022-04-19)

#### :bug: Bug Fix
* [#2465](https://github.com/ember-template-lint/ember-template-lint/pull/2465) Better handling of dashes in `no-whitespace-within-word` rule ([@mydea](https://github.com/mydea))

#### Committers: 1
- Francesco Novy ([@mydea](https://github.com/mydea))


## v4.4.1 (2022-04-15)

#### :bug: Bug Fix
* [#2474](https://github.com/ember-template-lint/ember-template-lint/pull/2474) Ensure `--compact-todo` functions properly  ([@scalvert](https://github.com/scalvert))
* [#2468](https://github.com/ember-template-lint/ember-template-lint/pull/2468) Ensure configuration can be resolved from a parent directory when no `--config-path` override is present (e.g. within a monorepo with `.template-lintrc.js` in the monorepo root). ([@scalvert](https://github.com/scalvert))
* [#2466](https://github.com/ember-template-lint/ember-template-lint/pull/2466) Remove validation of mustache statements in `no-invalid-aria-attributes` rule ([@judithhinlung](https://github.com/judithhinlung))

#### :memo: Documentation
* [#2469](https://github.com/ember-template-lint/ember-template-lint/pull/2469) Add missing "forbids" sentence in `no-array-prototype-extensions` rule doc ([@bertdeblock](https://github.com/bertdeblock))

#### :house: Internal
* [#2473](https://github.com/ember-template-lint/ember-template-lint/pull/2473) Add tests for monorepos with shared configuration in monorepo root ([@rwjblue](https://github.com/rwjblue))
* [#2471](https://github.com/ember-template-lint/ember-template-lint/pull/2471) Add tests for plugin resolution within a monorepo setup ([@rwjblue](https://github.com/rwjblue))
* [#2472](https://github.com/ember-template-lint/ember-template-lint/pull/2472) Fixes incorrectly invoked tests (non-awaited async) ([@scalvert](https://github.com/scalvert))

#### Committers: 4
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Judith Lung ([@judithhinlung](https://github.com/judithhinlung))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v4.4.0 (2022-04-12)

#### :rocket: Enhancement
* [#2435](https://github.com/ember-template-lint/ember-template-lint/pull/2435) Add CLI option `--no-error-on-unmatched-pattern` ([@CvX](https://github.com/CvX))
* [#2454](https://github.com/ember-template-lint/ember-template-lint/pull/2454) Add new rule `no-array-prototype-extensions` ([@smilland](https://github.com/smilland))
* [#2413](https://github.com/ember-template-lint/ember-template-lint/pull/2413) Add new rule `no-scope-outside-table-headings` ([@judithhinlung](https://github.com/judithhinlung))

#### :bug: Bug Fix
* [#2449](https://github.com/ember-template-lint/ember-template-lint/pull/2449) Updates `require-context-role` rule to accept `table` as a valid parent `role` and `rowgroup` ([@judithhinlung](https://github.com/judithhinlung))
* [#2421](https://github.com/ember-template-lint/ember-template-lint/pull/2421) Handle dashes in `no-whitespace-within-word` rule ([@mydea](https://github.com/mydea))
* [#2433](https://github.com/ember-template-lint/ember-template-lint/pull/2433) Fix `require-presentational-children` rule to report violation on correct node ([@scalvert](https://github.com/scalvert))

#### :house: Internal
* [#2419](https://github.com/ember-template-lint/ember-template-lint/pull/2419) Use async `write()` instead of deprecated `writeSync()` in tests ([@mydea](https://github.com/mydea))

#### Committers: 5
- Francesco Novy ([@mydea](https://github.com/mydea))
- Hang Li ([@smilland](https://github.com/smilland))
- Jarek Radosz ([@CvX](https://github.com/CvX))
- Judith Lung ([@judithhinlung](https://github.com/judithhinlung))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v4.3.0 (2022-03-08)

#### :rocket: Enhancement
* [#2408](https://github.com/ember-template-lint/ember-template-lint/pull/2408) New formatter: multi ([@scalvert](https://github.com/scalvert))

#### :house: Internal
* [#2407](https://github.com/ember-template-lint/ember-template-lint/pull/2407) Update `fixturify-project` to v4 ([@dcyriller](https://github.com/dcyriller))
* [#2401](https://github.com/ember-template-lint/ember-template-lint/pull/2401) Change formatters to return string output rather than outputting to stdout/output files ([@scalvert](https://github.com/scalvert))
* [#2406](https://github.com/ember-template-lint/ember-template-lint/pull/2406) Relax coverage thresholds to allow for some small drift ([@rwjblue](https://github.com/rwjblue))

#### Committers: 3
- Cyrille ([@dcyriller](https://github.com/dcyriller))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v4.2.0 (2022-02-22)

#### :rocket: Enhancement
* [#2376](https://github.com/ember-template-lint/ember-template-lint/pull/2376) Add new rule `no-obscure-array-access` ([@jsturgis](https://github.com/jsturgis))

#### :bug: Bug Fix
* [#2389](https://github.com/ember-template-lint/ember-template-lint/pull/2389) Fix string handling errors with `no-invalid-aria-attributes` rule ([@judithhinlung](https://github.com/judithhinlung))

#### Committers: 2
- Jeff Sturgis ([@jsturgis](https://github.com/jsturgis))
- Judith Lung ([@judithhinlung](https://github.com/judithhinlung))


## v4.1.0 (2022-02-14)

#### :rocket: Enhancement
* [#2365](https://github.com/ember-template-lint/ember-template-lint/pull/2365) Add new rule `require-aria-activedescendant-tabindex` ([@judithhinlung](https://github.com/judithhinlung))
* [#2276](https://github.com/ember-template-lint/ember-template-lint/pull/2276) Add new rule `no-invalid-aria-attributes` ([@judithhinlung](https://github.com/judithhinlung))

#### :bug: Bug Fix
* [#2348](https://github.com/ember-template-lint/ember-template-lint/pull/2348) Support the `modifier` helper in the `modifier-name-case` rule ([@bertdeblock](https://github.com/bertdeblock))
* [#2332](https://github.com/ember-template-lint/ember-template-lint/pull/2332) Fix bug with newlines and cleanup `no-unbalanced-curlies` rule ([@pablobm](https://github.com/pablobm))

#### :house: Internal
* [#2361](https://github.com/ember-template-lint/ember-template-lint/pull/2361) Don't include prototype information in jest snapshots ([@scalvert](https://github.com/scalvert))

#### Committers: 5
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Judith Lung ([@judithhinlung](https://github.com/judithhinlung))
- Pablo Brasero ([@pablobm](https://github.com/pablobm))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v4.0.0 (2022-01-05)

Also see the [v4 migration guide](docs/migration/v4.md).

#### :boom: Breaking Change
* [#2208](https://github.com/ember-template-lint/ember-template-lint/pull/2208) Add `exports` to package.json to restrict access to private internals ([@bmish](https://github.com/bmish))
* [#2238](https://github.com/ember-template-lint/ember-template-lint/pull/2238) Config Files: Disallow extending an invalid configuration ([@bmish](https://github.com/bmish))
* [#2239](https://github.com/ember-template-lint/ember-template-lint/pull/2239) Config Files: Disallow invalid plugin in configuration file ([@bmish](https://github.com/bmish))
* [#2236](https://github.com/ember-template-lint/ember-template-lint/pull/2236) Config Files: Disallow unexpected properties at top-level of configuration file ([@bmish](https://github.com/bmish))
* [#2262](https://github.com/ember-template-lint/ember-template-lint/pull/2262) Convert to ESM ([@bmish](https://github.com/bmish))
* [#2245](https://github.com/ember-template-lint/ember-template-lint/pull/2245) Disallow specifying non-existent files on CLI ([@bmish](https://github.com/bmish))
* [#2261](https://github.com/ember-template-lint/ember-template-lint/pull/2261) Disallow unknown CLI options ([@bmish](https://github.com/bmish))
* [#2193](https://github.com/ember-template-lint/ember-template-lint/pull/2193) Remove CLI option `--json` ([@bmish](https://github.com/bmish))
* [#2207](https://github.com/ember-template-lint/ember-template-lint/pull/2207) Remove CLI option `--print-pending` ([@bmish](https://github.com/bmish))
* [#2252](https://github.com/ember-template-lint/ember-template-lint/pull/2252) Remove deprecated pending functionality ([@scalvert](https://github.com/scalvert))
* [#2191](https://github.com/ember-template-lint/ember-template-lint/pull/2191) Remove rule `deprecated-each-syntax` ([@bmish](https://github.com/bmish))
* [#2188](https://github.com/ember-template-lint/ember-template-lint/pull/2188) Remove rule `no-invalid-block-param-definition` ([@dcyriller](https://github.com/dcyriller))
* [#2176](https://github.com/ember-template-lint/ember-template-lint/pull/2176) Require Node `^12.22.0 || ^14.17.0 || >=16.0.0` ([@dcyriller](https://github.com/dcyriller))
* [#2211](https://github.com/ember-template-lint/ember-template-lint/pull/2211) Rule Configs: Add additional `recommended` rules for v4 ([@bmish](https://github.com/bmish))
* [#2237](https://github.com/ember-template-lint/ember-template-lint/pull/2237) Rule Configs: Remove config `2-x-recommended` and add `3-x-recommended` config ([@bmish](https://github.com/bmish))
* [#2192](https://github.com/ember-template-lint/ember-template-lint/pull/2192) Rule Configs: Remove config `octane` ([@bmish](https://github.com/bmish))
* [#2242](https://github.com/ember-template-lint/ember-template-lint/pull/2242) Rule Reporting: When logging a rule violation, require passing `message` ([@bmish](https://github.com/bmish))
* [#2228](https://github.com/ember-template-lint/ember-template-lint/pull/2228) Rule Reporting: When logging a rule violation, require passing the node or all loc properties ([@bmish](https://github.com/bmish))
* [#2279](https://github.com/ember-template-lint/ember-template-lint/pull/2279) Testing: Disallow duplicate test cases ([@bmish](https://github.com/bmish))
* [#2240](https://github.com/ember-template-lint/ember-template-lint/pull/2240) Testing: Disallow identical `template` and `fixedTemplate` in a test case ([@bmish](https://github.com/bmish))
* [#2216](https://github.com/ember-template-lint/ember-template-lint/pull/2216) Testing: Disallow unexpected properties in rule test cases ([@bmish](https://github.com/bmish))
* [#2230](https://github.com/ember-template-lint/ember-template-lint/pull/2230) Testing: Only fixable test cases are allowed to assert `fixedTemplate` ([@bmish](https://github.com/bmish))
* [#2217](https://github.com/ember-template-lint/ember-template-lint/pull/2217) Testing: Require auto-fixable test cases to assert the fixed template ([@bmish](https://github.com/bmish))
* [#2255](https://github.com/ember-template-lint/ember-template-lint/pull/2255) Todos: Convert to single file storage ([@scalvert](https://github.com/scalvert))
* [#2241](https://github.com/ember-template-lint/ember-template-lint/pull/2241) Update `no-bare-strings` rule options to augment instead of replace the default config  ([@bmish](https://github.com/bmish))
* [#2089](https://github.com/ember-template-lint/ember-template-lint/pull/2089) Update `no-bare-strings` rule to check the arguments to `{{page-title ...}}` helper ([@bertdeblock](https://github.com/bertdeblock))
* [#2278](https://github.com/ember-template-lint/ember-template-lint/pull/2278) Update `no-element-event-actions` rule to set `requireActionHelper` option default to `false` ([@bmish](https://github.com/bmish))
* [#2195](https://github.com/ember-template-lint/ember-template-lint/pull/2195) Update `no-invalid-link-text` rule to set `allowEmptyLinks` option default to `false` ([@bmish](https://github.com/bmish))
* [#1881](https://github.com/ember-template-lint/ember-template-lint/pull/1881) Update `no-invalid-link-title` rule to check for link title being substring of link text ([@bertdeblock](https://github.com/bertdeblock))
* [#2172](https://github.com/ember-template-lint/ember-template-lint/pull/2172) Upgrade `ember-template-recast` to v6 ([@dcyriller](https://github.com/dcyriller))
* [#2293](https://github.com/ember-template-lint/ember-template-lint/pull/2293) Upgrade `find-up` to v6 ([@bmish](https://github.com/bmish))
* [#2294](https://github.com/ember-template-lint/ember-template-lint/pull/2294) Upgrade `get-stdin` to v9 ([@bmish](https://github.com/bmish))
* [#2296](https://github.com/ember-template-lint/ember-template-lint/pull/2296) Upgrade `globby` to v6 ([@bmish](https://github.com/bmish))
* [#2197](https://github.com/ember-template-lint/ember-template-lint/pull/2197) Upgrade `yargs` dependency to v17 ([@bertdeblock](https://github.com/bertdeblock))

#### :rocket: Enhancement
* [#2143](https://github.com/ember-template-lint/ember-template-lint/pull/2143) Add autofixer to `quotes` rule ([@courajs](https://github.com/courajs))

#### :memo: Documentation
* [#2297](https://github.com/ember-template-lint/ember-template-lint/pull/2297) Add v4 migration guide ([@bmish](https://github.com/bmish))

#### Committers: 7
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)
- Aaron Sikes ([@courajs](https://github.com/courajs))
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Cyrille ([@dcyriller](https://github.com/dcyriller))
- Sam Van Campenhout ([@Windvis](https://github.com/Windvis))
- Steve Calvert ([@scalvert](https://github.com/scalvert))



## v4.0.0-beta.3 (2021-12-29)

Also see the [v4 migration guide](docs/migration/v4.md).

#### :bug: Bug Fix
* [#2303](https://github.com/ember-template-lint/ember-template-lint/pull/2303) Update @lint-todos/utils to fix bug with non-normalized paths ([@scalvert](https://github.com/scalvert))
* [#2301](https://github.com/ember-template-lint/ember-template-lint/pull/2301) Fix false positives with non-serializable rule configs in duplicate test case check ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#2302](https://github.com/ember-template-lint/ember-template-lint/pull/2302) Improve v4 migration guide ([@bmish](https://github.com/bmish))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v4.0.0-beta.2 (2021-12-23)

Also see the [v4 migration guide](docs/migration/v4.md).

#### :boom: Breaking Change
* [#2262](https://github.com/ember-template-lint/ember-template-lint/pull/2262) Convert to ESM ([@bmish](https://github.com/bmish))

#### :rocket: Enhancement
* [#2293](https://github.com/ember-template-lint/ember-template-lint/pull/2293) Update find-up to v6 ([@bmish](https://github.com/bmish))
* [#2296](https://github.com/ember-template-lint/ember-template-lint/pull/2296) Update globby to v6 ([@bmish](https://github.com/bmish))
* [#2294](https://github.com/ember-template-lint/ember-template-lint/pull/2294) Update get-stdin to v9 ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#2297](https://github.com/ember-template-lint/ember-template-lint/pull/2297) Add v4 migration guide ([@bmish](https://github.com/bmish))
* [#2291](https://github.com/ember-template-lint/ember-template-lint/pull/2291) Fix broken markdown links ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#2295](https://github.com/ember-template-lint/ember-template-lint/pull/2295) Update execa to v6 ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))


## v4.0.0-beta.1 (2021-12-15)

Also see the [v4 migration guide](docs/migration/v4.md).

#### :boom: Breaking Change
* [#2278](https://github.com/ember-template-lint/ember-template-lint/pull/2278) Disable `requireActionHelper` option on `no-element-event-actions` rule ([@bmish](https://github.com/bmish))
* [#2279](https://github.com/ember-template-lint/ember-template-lint/pull/2279) Disallow duplicate test cases ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#2277](https://github.com/ember-template-lint/ember-template-lint/pull/2277) Updates @lint-todo/utils to latest version for read isolation ([@scalvert](https://github.com/scalvert))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v4.0.0-beta.0 (2021-12-03)

Also see the [v4 migration guide](docs/migration/v4.md).

#### :boom: Breaking Change
* [#2261](https://github.com/ember-template-lint/ember-template-lint/pull/2261) Disallow unknown CLI options ([@bmish](https://github.com/bmish))
* [#2245](https://github.com/ember-template-lint/ember-template-lint/pull/2245) Disallow specifying non-existent files on CLI ([@bmish](https://github.com/bmish))
* [#2256](https://github.com/ember-template-lint/ember-template-lint/pull/2256) Rule Configs: Add `no-autofocus-attribute` to `recommended` config ([@bmish](https://github.com/bmish))
* [#2242](https://github.com/ember-template-lint/ember-template-lint/pull/2242) Rule Reporting: When logging a rule violation, require passing `message` ([@bmish](https://github.com/bmish))
* [#2255](https://github.com/ember-template-lint/ember-template-lint/pull/2255) Todos: Convert to single file storage ([@scalvert](https://github.com/scalvert))
* [#2252](https://github.com/ember-template-lint/ember-template-lint/pull/2252) Remove deprecated pending functionality ([@scalvert](https://github.com/scalvert))

#### :rocket: Enhancement
* [#2143](https://github.com/ember-template-lint/ember-template-lint/pull/2143) Add autofixer to `quotes` rule ([@courajs](https://github.com/courajs))

#### :memo: Documentation
* [#2253](https://github.com/ember-template-lint/ember-template-lint/pull/2253) Update reference links for `no-autofocus-attribute` rule ([@MelSumner](https://github.com/MelSumner))
* [#2246](https://github.com/ember-template-lint/ember-template-lint/pull/2246) Fix link about configuration properties ([@courajs](https://github.com/courajs))

#### :house: Internal
* [#2258](https://github.com/ember-template-lint/ember-template-lint/pull/2258) Update `eslint-plugin-unicorn` to v39 ([@bmish](https://github.com/bmish))
* [#2257](https://github.com/ember-template-lint/ember-template-lint/pull/2257) Update `yargs` to 17.3.0 ([@bmish](https://github.com/bmish))
* [#2254](https://github.com/ember-template-lint/ember-template-lint/pull/2254) Remove misleading `await` from `project.dispose()` in tests ([@courajs](https://github.com/courajs))

#### Committers: 4
- Aaron Sikes ([@courajs](https://github.com/courajs))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v4.0.0-alpha.0 (2021-11-24)

Also see the [v4 migration guide](docs/migration/v4.md).

#### :boom: Breaking Change
* [#2208](https://github.com/ember-template-lint/ember-template-lint/pull/2208) Add `exports` to package.json to restrict access to private internals ([@bmish](https://github.com/bmish))
* [#2238](https://github.com/ember-template-lint/ember-template-lint/pull/2238) Config Files: Disallow extending an invalid configuration ([@bmish](https://github.com/bmish))
* [#2239](https://github.com/ember-template-lint/ember-template-lint/pull/2239) Config Files: Disallow invalid plugin in configuration file ([@bmish](https://github.com/bmish))
* [#2236](https://github.com/ember-template-lint/ember-template-lint/pull/2236) Config Files: Disallow unexpected properties at top-level of configuration file ([@bmish](https://github.com/bmish))
* [#2193](https://github.com/ember-template-lint/ember-template-lint/pull/2193) Remove CLI option `--json` ([@bmish](https://github.com/bmish))
* [#2207](https://github.com/ember-template-lint/ember-template-lint/pull/2207) Remove CLI option `--print-pending` ([@bmish](https://github.com/bmish))
* [#2191](https://github.com/ember-template-lint/ember-template-lint/pull/2191) Remove rule `deprecated-each-syntax` ([@bmish](https://github.com/bmish))
* [#2188](https://github.com/ember-template-lint/ember-template-lint/pull/2188) Remove rule `no-invalid-block-param-definition` ([@dcyriller](https://github.com/dcyriller))
* [#2176](https://github.com/ember-template-lint/ember-template-lint/pull/2176) Require Node `^12.22.0 || ^14.17.0 || >=16.0.0` ([@dcyriller](https://github.com/dcyriller))
* [#2211](https://github.com/ember-template-lint/ember-template-lint/pull/2211) Rule Configs: Add additional `recommended` rules for v4 ([@bmish](https://github.com/bmish))
* [#2237](https://github.com/ember-template-lint/ember-template-lint/pull/2237) Rule Configs: Remove config `2-x-recommended` and add `3-x-recommended` config ([@bmish](https://github.com/bmish))
* [#2192](https://github.com/ember-template-lint/ember-template-lint/pull/2192) Rule Configs: Remove config `octane` ([@bmish](https://github.com/bmish))
* [#2240](https://github.com/ember-template-lint/ember-template-lint/pull/2240) Testing: Disallow identical `template` and `fixedTemplate` in a test case ([@bmish](https://github.com/bmish))
* [#2216](https://github.com/ember-template-lint/ember-template-lint/pull/2216) Testing: Disallow unexpected properties in rule test cases ([@bmish](https://github.com/bmish))
* [#2230](https://github.com/ember-template-lint/ember-template-lint/pull/2230) Testing: Only fixable test cases are allowed to assert `fixedTemplate` ([@bmish](https://github.com/bmish))
* [#2217](https://github.com/ember-template-lint/ember-template-lint/pull/2217) Testing: Require auto-fixable test cases to assert the fixed template ([@bmish](https://github.com/bmish))
* [#2241](https://github.com/ember-template-lint/ember-template-lint/pull/2241) Update `no-bare-strings` rule options to augment instead of replace the default config  ([@bmish](https://github.com/bmish))
* [#2089](https://github.com/ember-template-lint/ember-template-lint/pull/2089) Update `no-bare-strings` rule to check the arguments to `{{page-title ...}}` helper ([@bertdeblock](https://github.com/bertdeblock))
* [#2195](https://github.com/ember-template-lint/ember-template-lint/pull/2195) Update `no-invalid-link-text` rule to set `allowEmptyLinks` option default to `false` ([@bmish](https://github.com/bmish))
* [#1881](https://github.com/ember-template-lint/ember-template-lint/pull/1881) Update `no-invalid-link-title` rule to check for link title being substring of link text ([@bertdeblock](https://github.com/bertdeblock))
* [#2172](https://github.com/ember-template-lint/ember-template-lint/pull/2172) Upgrade `ember-template-recast` to v6 ([@dcyriller](https://github.com/dcyriller))
* [#2197](https://github.com/ember-template-lint/ember-template-lint/pull/2197) Upgrade `yargs` dependency to v17 ([@bertdeblock](https://github.com/bertdeblock))
* [#2228](https://github.com/ember-template-lint/ember-template-lint/pull/2228) When logging a rule violation, require passing the node or all loc properties ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#2231](https://github.com/ember-template-lint/ember-template-lint/pull/2231) Remove unused rule exports ([@bmish](https://github.com/bmish))

#### Committers: 3
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Cyrille ([@dcyriller](https://github.com/dcyriller))


## v3.16.0 (2022-01-05)

#### :rocket: Enhancement
* [#2281](https://github.com/ember-template-lint/ember-template-lint/pull/2281) Add autofixer to `block-indentation` rule ([@VincentMolinie](https://github.com/VincentMolinie))

#### :bug: Bug Fix
* [#2318](https://github.com/ember-template-lint/ember-template-lint/pull/2318) Fix false negatives with `block-indentation` rule ([@VincentMolinie](https://github.com/VincentMolinie))

#### :memo: Documentation
* [#2291](https://github.com/ember-template-lint/ember-template-lint/pull/2291) Fix broken markdown links ([@bmish](https://github.com/bmish))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Vincent Molinié ([@VincentMolinie](https://github.com/VincentMolinie))


## v3.15.0 (2021-12-16)

#### :rocket: Enhancement
* [#2269](https://github.com/ember-template-lint/ember-template-lint/pull/2269) Add `requireActionHelper` config option to `no-element-event-actions` ([@jamescdavis](https://github.com/jamescdavis))

#### :memo: Documentation
* [#2280](https://github.com/ember-template-lint/ember-template-lint/pull/2280) Remove outdated boolean config in `docs/configuration.md` ([@rwjblue](https://github.com/rwjblue))
* [#2253](https://github.com/ember-template-lint/ember-template-lint/pull/2253) Update reference links for `no-autofocus-attribute` rule ([@MelSumner](https://github.com/MelSumner))
* [#2246](https://github.com/ember-template-lint/ember-template-lint/pull/2246) Fix link about configuration properties ([@courajs](https://github.com/courajs))

#### :house: Internal
* [#2254](https://github.com/ember-template-lint/ember-template-lint/pull/2254) Remove misleading `await` from `project.dispose()` in tests ([@courajs](https://github.com/courajs))

#### Committers: 5
- Aaron Sikes ([@courajs](https://github.com/courajs))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- James C. Davis ([@jamescdavis](https://github.com/jamescdavis))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))

## v3.14.0 (2021-11-24)

#### :rocket: Enhancement
* [#2209](https://github.com/ember-template-lint/ember-template-lint/pull/2209) Expose `generateRuleTests` as named export in public NodeJS API ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#2210](https://github.com/ember-template-lint/ember-template-lint/pull/2210) Ensure `--print-pending` works with `--format=json` ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#2235](https://github.com/ember-template-lint/ember-template-lint/pull/2235) Remove unused helper `remove-configuration-html-comments` ([@bmish](https://github.com/bmish))
* [#2234](https://github.com/ember-template-lint/ember-template-lint/pull/2234) Remove unused helper `calculate-location-display` ([@bmish](https://github.com/bmish))
* [#2215](https://github.com/ember-template-lint/ember-template-lint/pull/2215) Fix Node version on CI ([@ddzz](https://github.com/ddzz))

#### Committers: 3
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Cyrille ([@dcyriller](https://github.com/dcyriller))
- Darius D. ([@ddzz](https://github.com/ddzz))


## v3.13.0 (2021-11-13)

#### :rocket: Enhancement
* [#2168](https://github.com/ember-template-lint/ember-template-lint/pull/2168) Add new rule `no-autofocus-attribute` ([@judithhinlung](https://github.com/judithhinlung))

#### :bug: Bug Fix
* [#2174](https://github.com/ember-template-lint/ember-template-lint/pull/2174) Fix false negative with `always` setting and template ending with non-text in `eol-last` rule ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#2175](https://github.com/ember-template-lint/ember-template-lint/pull/2175) Enforce minimum test code coverage ([@bmish](https://github.com/bmish))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Judith Lung ([@judithhinlung](https://github.com/judithhinlung))


## v3.12.0 (2021-11-04)

#### :rocket: Enhancement
* [#2162](https://github.com/ember-template-lint/ember-template-lint/pull/2162) Ensure test harness setup in custom plugins is correct ([@rwjblue](https://github.com/rwjblue))

#### :bug: Bug Fix
* [#2167](https://github.com/ember-template-lint/ember-template-lint/pull/2167) Slightly loosening requires for log method parameter requirements ([@scalvert](https://github.com/scalvert))
* [#2165](https://github.com/ember-template-lint/ember-template-lint/pull/2165) Adding ruleId to deprecation message to track its origin ([@scalvert](https://github.com/scalvert))
* [#2164](https://github.com/ember-template-lint/ember-template-lint/pull/2164) Noops the console when using the SARIF formatter ([@scalvert](https://github.com/scalvert))

#### :memo: Documentation
* [#2156](https://github.com/ember-template-lint/ember-template-lint/pull/2156) Move workflow examples out of README into separate doc ([@bmish](https://github.com/bmish))
* [#2157](https://github.com/ember-template-lint/ember-template-lint/pull/2157) Ensure rules with options include a `Configuration` section in their rule doc ([@bmish](https://github.com/bmish))

#### Committers: 3
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v3.11.0 (2021-10-27)

#### :rocket: Enhancement
* [#2151](https://github.com/ember-template-lint/ember-template-lint/pull/2151) Add `endLine` / `endColumn` to generated rule test results ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix
* [#2140](https://github.com/ember-template-lint/ember-template-lint/pull/2140) Update `no-empty-headings` rule to only check for valid element & text nodes ([@glnster](https://github.com/glnster))

#### :house: Internal
* [#2155](https://github.com/ember-template-lint/ember-template-lint/pull/2155) Fixes incorrect rule test passing fake values ([@scalvert](https://github.com/scalvert))
* [#2150](https://github.com/ember-template-lint/ember-template-lint/pull/2150) Migrate to using inline snapshots for rule unit tests ([@rwjblue](https://github.com/rwjblue))
* [#2154](https://github.com/ember-template-lint/ember-template-lint/pull/2154) Test under Node 17 ([@bmish](https://github.com/bmish))

#### Committers: 4
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Glenn Cueto ([@glnster](https://github.com/glnster))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v3.10.0 (2021-10-13)

#### :rocket: Enhancement
* [#2126](https://github.com/ember-template-lint/ember-template-lint/pull/2126) Add new rule `no-empty-headings` ([@glnster](https://github.com/glnster))
* [#2127](https://github.com/ember-template-lint/ember-template-lint/pull/2127) Add `allowEmptyLinks` option (default `true`) to `no-invalid-link-text` rule ([@glnster](https://github.com/glnster))

#### :bug: Bug Fix
* [#2137](https://github.com/ember-template-lint/ember-template-lint/pull/2137) Skip SVG elements in `require-presentational-children` rule ([@mydea](https://github.com/mydea))

#### Committers: 2
- Francesco Novy ([@mydea](https://github.com/mydea))
- Glenn Cueto ([@glnster](https://github.com/glnster))


## v3.9.0 (2021-10-05)

#### :rocket: Enhancement
* [#1982](https://github.com/ember-template-lint/ember-template-lint/pull/1982) Add new rule `require-presentational-children` ([@faith-or](https://github.com/faith-or))
* [#636](https://github.com/ember-template-lint/ember-template-lint/pull/636) Add new rule `require-context-role` ([@lifeart](https://github.com/lifeart))
* [#1955](https://github.com/ember-template-lint/ember-template-lint/pull/1955) Add new rule `no-valueless-arguments` ([@Windvis](https://github.com/Windvis))
* [#1841](https://github.com/ember-template-lint/ember-template-lint/pull/1841) Add new rule `no-with` ([@bertdeblock](https://github.com/bertdeblock))
* [#2053](https://github.com/ember-template-lint/ember-template-lint/pull/2053) Add `labelTags` option for custom label components to `require-input-label` rule ([@lifeart](https://github.com/lifeart))
* [#2118](https://github.com/ember-template-lint/ember-template-lint/pull/2118) Add autofixer to `no-negated-condition` rule ([@bmish](https://github.com/bmish))
* [#1935](https://github.com/ember-template-lint/ember-template-lint/pull/1935) Add autofixer to `no-unknown-arguments-for-builtin-components` rule ([@dwickern](https://github.com/dwickern))
* [#2013](https://github.com/ember-template-lint/ember-template-lint/pull/2013) Add `Textarea` support to `builtin-component-arguments` rule ([@lifeart](https://github.com/lifeart))

#### :bug: Bug Fix
* [#1934](https://github.com/ember-template-lint/ember-template-lint/pull/1934) Fix false positives in `deprecated-inline-view-helper` rule ([@dwickern](https://github.com/dwickern))
* [#1851](https://github.com/ember-template-lint/ember-template-lint/pull/1851) Fix false positive with slash symbol in `no-unbound` rule ([@lifeart](https://github.com/lifeart))
* [#1861](https://github.com/ember-template-lint/ember-template-lint/pull/1861) Fix false positive with local `log` in `no-log` rule ([@bertdeblock](https://github.com/bertdeblock))
* [#1864](https://github.com/ember-template-lint/ember-template-lint/pull/1864) Add `has-block-params` as built-in helper to `no-implicit-this` rule ([@bertdeblock](https://github.com/bertdeblock))

#### :memo: Documentation
* [#2119](https://github.com/ember-template-lint/ember-template-lint/pull/2119) Stricter validation of rule doc notices ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#2107](https://github.com/ember-template-lint/ember-template-lint/pull/2107) Move helpers located in `_internal` folder to main `helpers` folder ([@bertdeblock](https://github.com/bertdeblock))

#### Committers: 6
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Derek Wickern ([@dwickern](https://github.com/dwickern))
- Faith Or ([@faith-or](https://github.com/faith-or))
- Sam Van Campenhout ([@Windvis](https://github.com/Windvis))


## v3.8.0 (2021-10-01)

#### :rocket: Enhancement
* [#2115](https://github.com/ember-template-lint/ember-template-lint/pull/2115) Converting --clean-todo to a default, providing --no-clean-todo option ([@scalvert](https://github.com/scalvert))
* [#2020](https://github.com/ember-template-lint/ember-template-lint/pull/2020) Add `--fix` support for `eol-last` rule ([@rwjblue](https://github.com/rwjblue))

#### :bug: Bug Fix
* [#2051](https://github.com/ember-template-lint/ember-template-lint/pull/2051) Bugfix: resolved issue with incorrect button type in form during template fix ([@lifeart](https://github.com/lifeart))
* [#2088](https://github.com/ember-template-lint/ember-template-lint/pull/2088) Bugfix: fixes fuzzy messages arguments suggestion ([@lifeart](https://github.com/lifeart))
* [#1863](https://github.com/ember-template-lint/ember-template-lint/pull/1863) Fix `undefined` error message for `no-link-to-positional-params` rule ([@bertdeblock](https://github.com/bertdeblock))

#### :memo: Documentation
* [#2116](https://github.com/ember-template-lint/ember-template-lint/pull/2116) Slight tweak to explanation in `no-negated-condition` doc ([@bmish](https://github.com/bmish))
* [#2104](https://github.com/ember-template-lint/ember-template-lint/pull/2104) Mention package.json keywords for plugin discoverability ([@bmish](https://github.com/bmish))
* [#2099](https://github.com/ember-template-lint/ember-template-lint/pull/2099) Add ember/lint keywords to package.json ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#2073](https://github.com/ember-template-lint/ember-template-lint/pull/2073) Ensures all log calls include `node` ([@scalvert](https://github.com/scalvert))

#### Committers: 5
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v3.7.0 (2021-09-07)

#### :rocket: Enhancement
* [#2080](https://github.com/ember-template-lint/ember-template-lint/pull/2080) Add `require-valid-named-block-naming-format` rule ([@bertdeblock](https://github.com/bertdeblock))
* [#2079](https://github.com/ember-template-lint/ember-template-lint/pull/2079) Adding `--print-config` option to CLI ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix
* [#2052](https://github.com/ember-template-lint/ember-template-lint/pull/2052) Ensure `deprecated-inline-view-helper` allows named blocks named `"view"` ([@lifeart](https://github.com/lifeart))

#### Committers: 3
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v3.6.0 (2021-08-15)

#### :rocket: Enhancement
* [#2033](https://github.com/ember-template-lint/ember-template-lint/pull/2033) Upgrades to latest todo-utils to include new fuzzy matching functionality ([@scalvert](https://github.com/scalvert))
* [#2030](https://github.com/ember-template-lint/ember-template-lint/pull/2030) Implement `no-route-action` rule ([@thiagofesta](https://github.com/thiagofesta))

#### :bug: Bug Fix
* [#2064](https://github.com/ember-template-lint/ember-template-lint/pull/2064) Removed modifier support for `no-route-action` rule ([@thiagofesta](https://github.com/thiagofesta))
* [#2024](https://github.com/ember-template-lint/ember-template-lint/pull/2024) Fix no-duplicate-id rule false positive with block param ([@faith-or](https://github.com/faith-or))

#### :memo: Documentation
* [#2063](https://github.com/ember-template-lint/ember-template-lint/pull/2063) Update docs with .lint-todorc.js ([@tylerbecks](https://github.com/tylerbecks))

#### :house: Internal
* [#2065](https://github.com/ember-template-lint/ember-template-lint/pull/2065) Export rules and configs using `requireindex` ([@bmish](https://github.com/bmish))

#### Committers: 5
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Faith Or ([@faith-or](https://github.com/faith-or))
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- Thiago Festa ([@thiagofesta](https://github.com/thiagofesta))
- Tyler Becks ([@tylerbecks](https://github.com/tylerbecks))


## v3.5.1 (2021-07-23)

#### :bug: Bug Fix
* [#2032](https://github.com/ember-template-lint/ember-template-lint/pull/2032) Fixes the SARIF formatter to correctly filter output by severity ([@scalvert](https://github.com/scalvert))

#### :memo: Documentation
* [#2031](https://github.com/ember-template-lint/ember-template-lint/pull/2031) Switch from github emojis to standard emojis ([@bmish](https://github.com/bmish))

#### Committers: 3
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v3.5.0 (2021-06-16)

#### :rocket: Enhancement
* [#1972](https://github.com/ember-template-lint/ember-template-lint/pull/1972) Adding extra tests to no-invalid-role rule ([@faith-or](https://github.com/faith-or))
* [#1993](https://github.com/ember-template-lint/ember-template-lint/pull/1993) feat(todos): Adds support for configuring todo decay days by rule ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix
* [#1994](https://github.com/ember-template-lint/ember-template-lint/pull/1994) Fix `require-input-label` to allow inputs within a `<label>` to have an `id` attribute ([@MelSumner](https://github.com/MelSumner))
* [#1992](https://github.com/ember-template-lint/ember-template-lint/pull/1992) Resolved issue where test was looking for directories incorrectly ([@MelSumner](https://github.com/MelSumner))

#### :memo: Documentation
* [#1972](https://github.com/ember-template-lint/ember-template-lint/pull/1972) Adding extra tests to no-invalid-role rule ([@faith-or](https://github.com/faith-or))
* [#1997](https://github.com/ember-template-lint/ember-template-lint/pull/1997) Add `Requirements` section to README ([@bmish](https://github.com/bmish))
* [#1874](https://github.com/ember-template-lint/ember-template-lint/pull/1874) Document the A11Y preset ([@bertdeblock](https://github.com/bertdeblock))
* [#1985](https://github.com/ember-template-lint/ember-template-lint/pull/1985) Fix some broken links on `CONFIGURATION.md` ([@nwhittaker](https://github.com/nwhittaker))
* [#1954](https://github.com/ember-template-lint/ember-template-lint/pull/1954) Improve columns for README rules table ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#1962](https://github.com/ember-template-lint/ember-template-lint/pull/1962) Upgrading yeoman-environment to 3.4.1 ([@scalvert](https://github.com/scalvert))

#### Committers: 6
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Faith ([@faith-or](https://github.com/faith-or))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Nathan Whittaker ([@nwhittaker](https://github.com/nwhittaker))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v3.4.2 (2021-05-11)

#### :bug: Bug Fix
* [#1947](https://github.com/ember-template-lint/ember-template-lint/pull/1947) Moves expired todo removal under the `--clean-todo` flag ([@scalvert](https://github.com/scalvert))

#### Committers: 1
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v3.4.1 (2021-05-10)

#### :bug: Bug Fix
* [#1945](https://github.com/ember-template-lint/ember-template-lint/pull/1945) Fixes `--clean-todo` flag to actually do the cleaning ([@scalvert](https://github.com/scalvert))

#### :memo: Documentation
* [#1900](https://github.com/ember-template-lint/ember-template-lint/pull/1900) Fixed typo in README ([@MelSumner](https://github.com/MelSumner))

#### Committers: 2
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v3.4.0 (2021-05-07)

#### :rocket: Enhancement
* [#1933](https://github.com/ember-template-lint/ember-template-lint/pull/1933) Adds `--clean-todo` option to provide separate functionality to cleanup stale and expired todos ([@MelSumner](https://github.com/MelSumner))

#### :bug: Bug Fix
* [#1933](https://github.com/ember-template-lint/ember-template-lint/pull/1933) Adds `--clean-todo` option to provide separate functionality to cleanup stale and expired todos ([@MelSumner](https://github.com/MelSumner))

#### :memo: Documentation
* [#1918](https://github.com/ember-template-lint/ember-template-lint/pull/1918) Update some wording in README.md ([@MelSumner](https://github.com/MelSumner))

#### Committers: 1
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))


## v3.3.1 (2021-04-29)

#### :bug: Bug Fix
* [#1922](https://github.com/ember-template-lint/ember-template-lint/pull/1922) Allows SARIF output to always write to a file if outputFile is present ([@scalvert](https://github.com/scalvert))

#### :house: Internal
* [#1919](https://github.com/ember-template-lint/ember-template-lint/pull/1919) Adds @microsoft/jest-sarif to validate SARIF file format ([@scalvert](https://github.com/scalvert))

#### Committers: 2
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)


## v3.3.0 (2021-04-26)

#### :rocket: Enhancement
* [#1907](https://github.com/ember-template-lint/ember-template-lint/pull/1907) Deprecate `--json` option in favor of `--format=json`. ([@rwjblue](https://github.com/rwjblue))
* [#1895](https://github.com/ember-template-lint/ember-template-lint/pull/1895) Updating stale todo message with more targeted --fix instructions ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix
* [#1904](https://github.com/ember-template-lint/ember-template-lint/pull/1904) Ensures we always emit output file even with empty results ([@scalvert](https://github.com/scalvert))
* [#1897](https://github.com/ember-template-lint/ember-template-lint/pull/1897) Allow words containing redundant words for `require-valid-alt-text` rule ([@bertdeblock](https://github.com/bertdeblock))

#### :memo: Documentation
* [#1901](https://github.com/ember-template-lint/ember-template-lint/pull/1901) Fix invalid link in `docs/configuration.md` ([@bartocc](https://github.com/bartocc))
* [#1906](https://github.com/ember-template-lint/ember-template-lint/pull/1906) Fix typo in TODO documentation ([@Willibaur](https://github.com/Willibaur))

#### Committers: 6
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Julien Palmas ([@bartocc](https://github.com/bartocc))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- William Bautista ([@Willibaur](https://github.com/Willibaur))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)


## v3.2.0 (2021-03-23)

#### :rocket: Enhancement
* [#1857](https://github.com/ember-template-lint/ember-template-lint/pull/1857) Adding ignore option to `no-passed-in-event-handlers` ([@scalvert](https://github.com/scalvert))
* [#1812](https://github.com/ember-template-lint/ember-template-lint/pull/1812) Adding SARIF formatter ([@scalvert](https://github.com/scalvert))
* [#1810](https://github.com/ember-template-lint/ember-template-lint/pull/1810) Add rules index generator ([@scalvert](https://github.com/scalvert))
* [#1340](https://github.com/ember-template-lint/ember-template-lint/pull/1340) Add `--format` option to allow loading custom formatters ([@gabrielcsapo](https://github.com/gabrielcsapo))

#### :bug: Bug Fix
* [#1862](https://github.com/ember-template-lint/ember-template-lint/pull/1862) Fix `require-has-block-helper` rule autofix when multiple parameters present ([@bertdeblock](https://github.com/bertdeblock))
* [#1850](https://github.com/ember-template-lint/ember-template-lint/pull/1850) Only catch exact matches of title and link text in `no-invalid-link-title` rule ([@bmish](https://github.com/bmish))
* [#1823](https://github.com/ember-template-lint/ember-template-lint/pull/1823) Fix suggestions for deprecated events and argument names in `no-unknown-built-in-component-arguments` ([@lifeart](https://github.com/lifeart))
* [#1824](https://github.com/ember-template-lint/ember-template-lint/pull/1824) Add missing ARIA roles to `no-invalid-role` ([@Windvis](https://github.com/Windvis))
* [#1822](https://github.com/ember-template-lint/ember-template-lint/pull/1822) Prevent `no-duplicate-landmark-elements` false positive for non-landmark roles ([@rwjblue](https://github.com/rwjblue))

#### :memo: Documentation
* [#1832](https://github.com/ember-template-lint/ember-template-lint/pull/1832) Add `--config` example to README.md. ([@MelSumner](https://github.com/MelSumner))
* [#1816](https://github.com/ember-template-lint/ember-template-lint/pull/1816) docs: for disabling todos decay days ([@timiyay](https://github.com/timiyay))

#### :house: Internal
* [#1837](https://github.com/ember-template-lint/ember-template-lint/pull/1837) Resolve `no-missing-require` lint error ([@bertdeblock](https://github.com/bertdeblock))
* [#1836](https://github.com/ember-template-lint/ember-template-lint/pull/1836) Make sure newly generated rules don't trigger lint errors ([@bertdeblock](https://github.com/bertdeblock))
* [#1834](https://github.com/ember-template-lint/ember-template-lint/pull/1834) Upgrading @ember-template-lint-todo-utils to 8.0.0 ([@scalvert](https://github.com/scalvert))

#### Committers: 10
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Gabriel Csapo ([@gabrielcsapo](https://github.com/gabrielcsapo))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Sam Van Campenhout ([@Windvis](https://github.com/Windvis))
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)
- [@timiyay](https://github.com/timiyay)


## v3.1.1 (2021-03-07)

#### :bug: Bug Fix
* [#1823](https://github.com/ember-template-lint/ember-template-lint/pull/1823) Fix suggestions for deprecated events and argument names in `no-unknown-built-in-component-arguments` ([@lifeart](https://github.com/lifeart))
* [#1824](https://github.com/ember-template-lint/ember-template-lint/pull/1824) Add missing ARIA roles to `no-invalid-role` ([@Windvis](https://github.com/Windvis))

#### Committers: 2
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Sam Van Campenhout ([@Windvis](https://github.com/Windvis))


## v3.1.0 (2021-03-07)

#### :rocket: Enhancement
* [#1340](https://github.com/ember-template-lint/ember-template-lint/pull/1340) Add `--format` option to allow loading custom formatters ([@gabrielcsapo](https://github.com/gabrielcsapo))

#### :bug: Bug Fix
* [#1822](https://github.com/ember-template-lint/ember-template-lint/pull/1822) Prevent `no-duplicate-landmark-elements` false positive for non-landmark roles ([@rwjblue](https://github.com/rwjblue))

#### :memo: Documentation
* [#1816](https://github.com/ember-template-lint/ember-template-lint/pull/1816) docs: for disabling todos decay days ([@timiyay](https://github.com/timiyay))

#### Committers: 3
- Gabriel Csapo ([@gabrielcsapo](https://github.com/gabrielcsapo))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- [@timiyay](https://github.com/timiyay)


## v3.0.1 (2021-03-03)

#### :bug: Bug Fix
* [#1807](https://github.com/ember-template-lint/ember-template-lint/pull/1807) Remove `deprecated-each-syntax` from `recommended` config ([@rwjblue](https://github.com/rwjblue))
* [#1806](https://github.com/ember-template-lint/ember-template-lint/pull/1806) Ensure `no-bare-strings` check's `placeholder` attribute for `<Input />` and `<Textarea />` ([@lifeart](https://github.com/lifeart))
* [#1805](https://github.com/ember-template-lint/ember-template-lint/pull/1805) Ensure `no-unknown-arguments-for-builtin-components` allows `@query` only `<LinkTo>`'s ([@lifeart](https://github.com/lifeart))

#### Committers: 3
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v3.0.0 (2021-03-02)

### Highlights

* :rocket: Added new todo feature. Allows for 'stashing' lint violations away to be fixed at a later date. [Read more in our docs!](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/todos.md)
* :boom: JavaScript API Changes
  * Allow rules to have async `visitor` functions
  * Change the internal linter class's `.verify`/`.verifyAndFix` methods to be asynchronous
* :boom: Changes to configuration (adding more rules)
  * Promoted "octane" config to be "recommended"
  * Added the following to `recommended`
    * `builtin-component-arguments`
    * `deprecated-each-syntax`
    * `deprecated-inline-view-helper`
    * `no-accesskey-attribute`
    * `no-action`
    * `no-arguments-for-html-elements`
    * `no-aria-hidden-body`
    * `no-block-params-for-html-elements`
    * `no-down-event-binding`
    * `no-duplicate-id`
    * `no-duplicate-landmark-elements`
    * `no-forbidden-elements`
    * `no-heading-inside-button`
    * `no-invalid-block-param-definition`
    * `no-invalid-link-title`
    * `no-link-to-positional-params`
    * `no-nested-landmark`
    * `no-nested-splattributes`
    * `no-passed-in-event-handlers`
    * `no-positional-data-test-selectors`
    * `no-potential-path-strings`
    * `no-redundant-fn`
    * `no-redundant-landmark-role`
    * `no-unbalanced-curlies`
    * `no-unknown-arguments-for-builtin-components`
    * `no-yield-only`
    * `require-has-block-helper`
    * `require-input-label`
    * `require-lang-attribute`
    * `splat-attributes-only`

#### :boom: Breaking Change
* [#1714](https://github.com/ember-template-lint/ember-template-lint/pull/1714) Update recommended config to include 'no-down-event-binding' ([@MelSumner](https://github.com/MelSumner))
* [#1697](https://github.com/ember-template-lint/ember-template-lint/pull/1697) Allow rule visitor to be an async function (remove `env` argument) ([@lifeart](https://github.com/lifeart))
* [#1388](https://github.com/ember-template-lint/ember-template-lint/pull/1388) Remove automatic `TextNode` unwrapping by `attributeValue` functions in `ast-node-info` helper ([@josephdsumner](https://github.com/josephdsumner))
* [#1643](https://github.com/ember-template-lint/ember-template-lint/pull/1643) Enable more `recommended` rules ([@bmish](https://github.com/bmish))
* [#1642](https://github.com/ember-template-lint/ember-template-lint/pull/1642) Update `noImplicitThis` option default to true and `requireDash` option default to false in `no-curly-component-invocation` rule ([@bmish](https://github.com/bmish))
* [#1639](https://github.com/ember-template-lint/ember-template-lint/pull/1639) Promote `octane` rules to `recommended` config and delete `octane` config ([@bmish](https://github.com/bmish))
* [#1638](https://github.com/ember-template-lint/ember-template-lint/pull/1638) Add more rules to `stylistic` config ([@bmish](https://github.com/bmish))
* [#1586](https://github.com/ember-template-lint/ember-template-lint/pull/1586) Add `no-aria-hidden-body` and `table-groups` rules to `a11y` config ([@MelSumner](https://github.com/MelSumner))
* [#1549](https://github.com/ember-template-lint/ember-template-lint/pull/1549) Add `<textarea>` and `<select>` support to `require-input-label` rule ([@zelaznik](https://github.com/zelaznik))
* [#1553](https://github.com/ember-template-lint/ember-template-lint/pull/1553) Convert `Linter.prototype.verify` and `Linter.prototype.verifyAndFix` to be async. ([@scalvert](https://github.com/scalvert))
* [#1532](https://github.com/ember-template-lint/ember-template-lint/pull/1532) Add `s` and `u` elements to `no-obsolete-elements` rule elements list ([@bmish](https://github.com/bmish))
* [#1535](https://github.com/ember-template-lint/ember-template-lint/pull/1535) Remove support for deprecated rule names ([@bmish](https://github.com/bmish))
* [#1534](https://github.com/ember-template-lint/ember-template-lint/pull/1534) Enable `catchNonexistentRoles` by default on `no-invalid-role` rule ([@bmish](https://github.com/bmish))
* [#1513](https://github.com/ember-template-lint/ember-template-lint/pull/1513) Fix `extends` overriding order ([@Turbo87](https://github.com/Turbo87))
* [#1490](https://github.com/ember-template-lint/ember-template-lint/pull/1490) remove deprecated `whitelist` & `blacklist` configurations ([@jaydgruber](https://github.com/jaydgruber))
* [#1463](https://github.com/ember-template-lint/ember-template-lint/pull/1463) ast-node-info: Remove trivial `isNode()` helpers ([@Turbo87](https://github.com/Turbo87))
* [#1460](https://github.com/ember-template-lint/ember-template-lint/pull/1460) ast-node-info: Remove trivial `isElement()` helpers ([@Turbo87](https://github.com/Turbo87))
* [#1452](https://github.com/ember-template-lint/ember-template-lint/pull/1452) Drop support for Node 13 ([@MelSumner](https://github.com/MelSumner))
* [#1549](https://github.com/ember-template-lint/ember-template-lint/pull/1549) Add `<textarea>` and `<select>` support to `require-input-label` rule ([@zelaznik](https://github.com/zelaznik))
* [#1513](https://github.com/ember-template-lint/ember-template-lint/pull/1513) / [#1687](https://github.com/ember-template-lint/ember-template-lint/pull/1687) Fix `extends` overriding order ([@Turbo87](https://github.com/Turbo87)) / ([@renatoi](https://github.com/renatoi))

#### :rocket: Enhancement
* [#1710](https://github.com/ember-template-lint/ember-template-lint/pull/1710) Adds `octane` config as an alias of `recommended` ([@scalvert](https://github.com/scalvert))
* Implement Todo feature, please review our [documentation here](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/todos.md) ([@scalvert](https://github.com/scalvert)) / ([@renatoi](https://github.com/renatoi))
* [#1629](https://github.com/ember-template-lint/ember-template-lint/pull/1629) chore(deps): bump ember-template-recast from 4.2.1 to 5.0.1 ([@dependabot-preview[bot]](https://github.com/apps/dependabot-preview))
* [#1595](https://github.com/ember-template-lint/ember-template-lint/pull/1595) Allow passing a top-level `meta` property in test harness ([@rwjblue](https://github.com/rwjblue))
* [#1556](https://github.com/ember-template-lint/ember-template-lint/pull/1556) Allow linting individual files with arbitrary extensions. ([@rwjblue](https://github.com/rwjblue))
* [#1631](https://github.com/ember-template-lint/ember-template-lint/pull/1631) Add `rootURL` to ignore list for index.html ([@scalvert](https://github.com/scalvert))

#### Committers: 14
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Alex LaFroscia ([@alexlafroscia](https://github.com/alexlafroscia))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Collin Adams ([@collinadams](https://github.com/collinadams))
- Joseph D. Sumner ([@josephdsumner](https://github.com/josephdsumner))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Rajasegar Chandran ([@rajasegar](https://github.com/rajasegar))
- Renato Iwashima ([@renatoi](https://github.com/renatoi))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- Steve Zelaznik ([@zelaznik](https://github.com/zelaznik))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))
- [@jaydgruber](https://github.com/jaydgruber)


## v2.21.0 (2021-02-26)

#### :rocket: Enhancement
* [#1787](https://github.com/ember-template-lint/ember-template-lint/pull/1787) New rule: no-link-to-positional-params ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix
* [#1791](https://github.com/ember-template-lint/ember-template-lint/pull/1791) Revert no-class-bindings fixer. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 2
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v2.20.0 (2021-02-23)

#### :rocket: Enhancement
* [#1729](https://github.com/ember-template-lint/ember-template-lint/pull/1729) Make `this.filePath` and `this.workingDir` available to plugins ([@lifeart](https://github.com/lifeart))
* [#1594](https://github.com/ember-template-lint/ember-template-lint/pull/1594) Implement autofixer for `no-curly-component-invocation` ([@lifeart](https://github.com/lifeart))
* [#1774](https://github.com/ember-template-lint/ember-template-lint/pull/1774) Add fixer for `no-class-bindings` rule. ([@rwjblue](https://github.com/rwjblue))
* [#1773](https://github.com/ember-template-lint/ember-template-lint/pull/1773) Add `--max-warnings` option ([@mukilane](https://github.com/mukilane))
* [#1770](https://github.com/ember-template-lint/ember-template-lint/pull/1770) Add simplified mechanism for rules to log warnings and errors ([@scalvert](https://github.com/scalvert))
* [#1769](https://github.com/ember-template-lint/ember-template-lint/pull/1769) Add new rule: `no-class-bindings` ([@scalvert](https://github.com/scalvert))

#### Committers: 5
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Mukil Elango ([@mukilane](https://github.com/mukilane))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v2.19.0 (2021-02-18)

#### :rocket: Enhancement
* [#1759](https://github.com/ember-template-lint/ember-template-lint/pull/1759) Add new rule: `no-capital-arguments` ([@lifeart](https://github.com/lifeart))
* [#1760](https://github.com/ember-template-lint/ember-template-lint/pull/1760) chore: Deprecating moduleId and moduleName in Rule base class ([@scalvert](https://github.com/scalvert))
* [#1734](https://github.com/ember-template-lint/ember-template-lint/pull/1734) Add new rule: `no-unknown-arguments-for-builtin-components` ([@lifeart](https://github.com/lifeart))
* [#1717](https://github.com/ember-template-lint/ember-template-lint/pull/1717) Allow `meta` in `<head>` contexts ([@MelSumner](https://github.com/MelSumner))
* [#1672](https://github.com/ember-template-lint/ember-template-lint/pull/1672) Add new rule: `require-splattributes` ([@Turbo87](https://github.com/Turbo87))
* [#1736](https://github.com/ember-template-lint/ember-template-lint/pull/1736) Add fixer for require-has-block-helper rule ([@patocallaghan](https://github.com/patocallaghan))
* [#1731](https://github.com/ember-template-lint/ember-template-lint/pull/1731) Add `require-has-block-helper` lint rule ([@patocallaghan](https://github.com/patocallaghan))

#### :memo: Documentation
* [#1738](https://github.com/ember-template-lint/ember-template-lint/pull/1738) Removes duplicate main from `no-duplicate-landmarks` documentation ([@skaterdav85](https://github.com/skaterdav85))

#### :house: Internal
* [#1758](https://github.com/ember-template-lint/ember-template-lint/pull/1758) chore: fix require-has-block-helper readme linting error ([@lifeart](https://github.com/lifeart))
* [#1735](https://github.com/ember-template-lint/ember-template-lint/pull/1735) Add test to `no-invalid-meta` for ember-cli default value ([@rwjblue](https://github.com/rwjblue))

#### Committers: 8
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- David Tang ([@skaterdav85](https://github.com/skaterdav85))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Pat O'Callaghan ([@patocallaghan](https://github.com/patocallaghan))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v2.18.1 (2021-02-02)

#### :bug: Bug Fix
* [#1727](https://github.com/ember-template-lint/ember-template-lint/pull/1727) Fix `no-dynamic-subexpression-invocations` handling of `{{1}}` ([@rwjblue](https://github.com/rwjblue))

#### Committers: 2
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v2.18.0 (2021-01-28)

#### :rocket: Enhancement
* [#1716](https://github.com/ember-template-lint/ember-template-lint/pull/1716) Add `no-dynamic-subexpression-invocations`. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 2
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)


## v2.17.0 (2021-01-21)

#### :rocket: Enhancement
* [#1671](https://github.com/ember-template-lint/ember-template-lint/pull/1671) Add rule: `no-this-in-template-only-components` ([@dwickern](https://github.com/dwickern))
* [#1356](https://github.com/ember-template-lint/ember-template-lint/pull/1356) Add rule: `no-yield-to-default` ([@rajasegar](https://github.com/rajasegar))

#### :bug: Bug Fix
* [#1678](https://github.com/ember-template-lint/ember-template-lint/pull/1678) Fix broken link to shell script ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#1693](https://github.com/ember-template-lint/ember-template-lint/pull/1693) Add link to Ember.js issue for no-model-argument-in-route-templates rule ([@SergeAstapov](https://github.com/SergeAstapov))

#### :house: Internal
* [#1702](https://github.com/ember-template-lint/ember-template-lint/pull/1702) Update `stylistic` config emoji ([@MelSumner](https://github.com/MelSumner))
* [#1700](https://github.com/ember-template-lint/ember-template-lint/pull/1700) Fix `lint:docs` syntax on Windows ([@dwickern](https://github.com/dwickern))

#### Committers: 6
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Derek Wickern ([@dwickern](https://github.com/dwickern))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Rajasegar Chandran ([@rajasegar](https://github.com/rajasegar))
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v2.16.0 (2021-01-06)

#### :rocket: Enhancement
* [#1652](https://github.com/ember-template-lint/ember-template-lint/pull/1652) Add new rule `no-mut-helper` ([@collinadams](https://github.com/collinadams))
* [#1653](https://github.com/ember-template-lint/ember-template-lint/pull/1653) Add autofixer for `no-redundant-landmark-role` rule ([@MelSumner](https://github.com/MelSumner))

#### :bug: Bug Fix
* [#1668](https://github.com/ember-template-lint/ember-template-lint/pull/1668) Remove explicit GitHub Actions reporter ([@Turbo87](https://github.com/Turbo87))

#### :memo: Documentation
* [#1657](https://github.com/ember-template-lint/ember-template-lint/pull/1657) Add example script for counting lint violation disable directive comments ([@bmish](https://github.com/bmish))
* [#1676](https://github.com/ember-template-lint/ember-template-lint/pull/1676) Fix broken documentation links ([@Turbo87](https://github.com/Turbo87))
* [#1664](https://github.com/ember-template-lint/ember-template-lint/pull/1664) Reorganize and improve the README ([@scalvert](https://github.com/scalvert))

#### :house: Internal
* [#1670](https://github.com/ember-template-lint/ember-template-lint/pull/1670) Remove lerna-changelog dependency since it is provided and handled by release-it-lerna-changelog ([@bmish](https://github.com/bmish))

#### Committers: 6
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Collin Adams ([@collinadams](https://github.com/collinadams))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)


## v2.15.0 (2020-12-10)

#### :boom: Breaking Change
* [#1586](https://github.com/ember-template-lint/ember-template-lint/pull/1586) Add `no-aria-hidden-body` and `table-groups` rules to `a11y` config ([@MelSumner](https://github.com/MelSumner))

#### :rocket: Enhancement
* [#1596](https://github.com/ember-template-lint/ember-template-lint/pull/1596) Add new rule `no-model-argument-in-route-templates` ([@rwjblue](https://github.com/rwjblue))
* [#1623](https://github.com/ember-template-lint/ember-template-lint/pull/1623) Add new rule `splat-attributes-only` ([@Turbo87](https://github.com/Turbo87))
* [#1620](https://github.com/ember-template-lint/ember-template-lint/pull/1620) Add new rule `no-down-event-binding` ([@alexlafroscia](https://github.com/alexlafroscia))
* [#632](https://github.com/ember-template-lint/ember-template-lint/pull/632) Add new rule `no-accesskey-attribute` ([@lifeart](https://github.com/lifeart))
* [#1595](https://github.com/ember-template-lint/ember-template-lint/pull/1595) Allow passing a top-level `meta` property ([@rwjblue](https://github.com/rwjblue))
* [#1629](https://github.com/ember-template-lint/ember-template-lint/pull/1629) chore(deps): bump ember-template-recast from 4.2.1 to 5.0.1 ([@dependabot-preview[bot]](https://github.com/apps/dependabot-preview))

#### :bug: Bug Fix
* [#1606](https://github.com/ember-template-lint/ember-template-lint/pull/1606) Fix false positive with content within `{{#if}}`/`{{else}}` blocks in `no-duplicate-id` rule ([@MelSumner](https://github.com/MelSumner))
* [#1605](https://github.com/ember-template-lint/ember-template-lint/pull/1605) Fix false positive in `no-invalid-link-title` when using a dynamic value surrounded by whitespace. ([@josephdsumner](https://github.com/josephdsumner))
* [#1137](https://github.com/ember-template-lint/ember-template-lint/pull/1137) Prevent `no-unused-block-params` from flagging locals that are used within `{{template-lint-disable}}`ed content ([@lifeart](https://github.com/lifeart))

#### :memo: Documentation
* [#1630](https://github.com/ember-template-lint/ember-template-lint/pull/1630) Add element examples to `no-duplicate-attributes` ([@rwjblue](https://github.com/rwjblue))

#### Committers: 7
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Alex LaFroscia ([@alexlafroscia](https://github.com/alexlafroscia))
- Joseph D. Sumner ([@josephdsumner](https://github.com/josephdsumner))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v2.14.0 (2020-10-11)

#### :rocket: Enhancement
* [#1564](https://github.com/ember-template-lint/ember-template-lint/pull/1564) Add `--working-directory` option ([@rwjblue](https://github.com/rwjblue))
* [#1550](https://github.com/ember-template-lint/ember-template-lint/pull/1550) Add new rule `no-duplicate-landmark-elements` ([@MelSumner](https://github.com/MelSumner))
* [#1519](https://github.com/ember-template-lint/ember-template-lint/pull/1519) Add `as-indentation` option to `attribute-indentation` rule ([@VincentMolinie](https://github.com/VincentMolinie))

#### :bug: Bug Fix
* [#1566](https://github.com/ember-template-lint/ember-template-lint/pull/1566) Allow `itemprop` use in meta tags in `no-invalid-meta` rule ([@sukima](https://github.com/sukima))
* [#1554](https://github.com/ember-template-lint/ember-template-lint/pull/1554) Ensure globbing is only used when using a globlike pattern ([@rwjblue](https://github.com/rwjblue))
* [#1541](https://github.com/ember-template-lint/ember-template-lint/pull/1541) Allow nested landmarks of different types in `no-nested-landmark` rule ([@zelaznik](https://github.com/zelaznik))
* [#1548](https://github.com/ember-template-lint/ember-template-lint/pull/1548) Upgrade ember-template-recast to reduce memory pressure while linting ([@dcyriller](https://github.com/dcyriller))

#### :house: Internal
* [#1518](https://github.com/ember-template-lint/ember-template-lint/pull/1518) chore(deps): bump yargs from 15.4.1 to 16.0.3 ([@dependabot-preview[bot]](https://github.com/apps/dependabot-preview))

#### Committers: 7
- Cyrille David ([@dcyriller](https://github.com/dcyriller))
- Devin Weaver ([@sukima](https://github.com/sukima))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Steve Zelaznik ([@zelaznik](https://github.com/zelaznik))
- Vincent Molinié ([@VincentMolinie](https://github.com/VincentMolinie))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)


## v2.13.0 (2020-09-27)

#### :rocket: Enhancement
* [#1521](https://github.com/ember-template-lint/ember-template-lint/pull/1521) Add new rule `no-aria-hidden-body` ([@rajasegar](https://github.com/rajasegar))
* [#1465](https://github.com/ember-template-lint/ember-template-lint/pull/1465) Add new rule `builtin-component-arguments` ([@Turbo87](https://github.com/Turbo87))
* [#1525](https://github.com/ember-template-lint/ember-template-lint/pull/1525) Add new rule `require-each-key` ([@rajasegar](https://github.com/rajasegar))

#### :bug: Bug Fix
* [#1516](https://github.com/ember-template-lint/ember-template-lint/pull/1516) `no-whitespace-within-word` rule should ignore <style> elements ([@mydea](https://github.com/mydea))
* [#1540](https://github.com/ember-template-lint/ember-template-lint/pull/1540) `require-input-label` rule should ignore hidden inputs ([@bmish](https://github.com/bmish))
* [#1543](https://github.com/ember-template-lint/ember-template-lint/pull/1543) `no-invalid-block-param-definition` rule should ignore comments ([@bmish](https://github.com/bmish))
* [#1533](https://github.com/ember-template-lint/ember-template-lint/pull/1533) Add missing `keygen` element to `no-obsolete-elements` rule elements list ([@bmish](https://github.com/bmish))
* [#1495](https://github.com/ember-template-lint/ember-template-lint/pull/1495) Ensure `overrides` config parsing is idempotent ([@bobisjan](https://github.com/bobisjan))

#### :house: Internal
* [#1537](https://github.com/ember-template-lint/ember-template-lint/pull/1537) Remove unnecessary deprecations folder for rules ([@bmish](https://github.com/bmish))

#### Committers: 6
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Francesco Novy ([@mydea](https://github.com/mydea))
- Jan Bobisud ([@bobisjan](https://github.com/bobisjan))
- Rajasegar Chandran ([@rajasegar](https://github.com/rajasegar))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)


## v2.12.1 (2020-09-11)

#### :bug: Bug Fix
* [#1514](https://github.com/ember-template-lint/ember-template-lint/pull/1514) Ensure `bad` test cases **always** have results. ([@rwjblue](https://github.com/rwjblue))

#### :house: Internal
* [#1510](https://github.com/ember-template-lint/ember-template-lint/pull/1510) Update automated release setup. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 2
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)


## v2.12.0 (2020-09-09)

#### :boom: Breaking Change
* [#1509](https://github.com/ember-template-lint/ember-template-lint/pull/1509) Add `no-duplicate-id` to `a11y` preset ([@rwjblue](https://github.com/rwjblue))
* [#1505](https://github.com/ember-template-lint/ember-template-lint/pull/1505) Add `no-duplicate-attributes` to `a11y` preset ([@MelSumner](https://github.com/MelSumner))

#### :rocket: Enhancement
* [#1187](https://github.com/ember-template-lint/ember-template-lint/pull/1187) Adds new rule: no-duplicate-id ([@MelSumner](https://github.com/MelSumner))
* [#1504](https://github.com/ember-template-lint/ember-template-lint/pull/1504) Update documentation for `no-duplicate-attributes` ([@MelSumner](https://github.com/MelSumner))
* [#1466](https://github.com/ember-template-lint/ember-template-lint/pull/1466) Cache `pending`/`ignore` config lookups to speed up linting of larger codebases ([@fivetanley](https://github.com/fivetanley))

#### :bug: Bug Fix
* [#1497](https://github.com/ember-template-lint/ember-template-lint/pull/1497) Avoid validating text within attributes in `no-whitespace-within-word` ([@zelaznik](https://github.com/zelaznik))

#### :memo: Documentation
* [#1504](https://github.com/ember-template-lint/ember-template-lint/pull/1504) Update documentation for `no-duplicate-attributes` ([@MelSumner](https://github.com/MelSumner))

#### Committers: 5
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Stanley Stuart ([@fivetanley](https://github.com/fivetanley))
- Steve Zelaznik ([@zelaznik](https://github.com/zelaznik))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)


## v2.11.0 (2020-08-27)

#### :rocket: Enhancement
* [#1489](https://github.com/ember-template-lint/ember-template-lint/pull/1489) Add `allowlist` & `denylist` alternatives to `whitelist` & `blacklist` configuration ([@jaydgruber](https://github.com/jaydgruber))
* [#1443](https://github.com/ember-template-lint/ember-template-lint/pull/1443) Add new `a11y` configuration ([@MelSumner](https://github.com/MelSumner))
* [#1481](https://github.com/ember-template-lint/ember-template-lint/pull/1481) `no-bare-strings`: export `DEFAULT_CONFIG` ([@jaydgruber](https://github.com/jaydgruber))
* [#1439](https://github.com/ember-template-lint/ember-template-lint/pull/1439) `require-input-label`: update rule to detect duplicate labels ([@KamiKillertO](https://github.com/KamiKillertO))
* [#1430](https://github.com/ember-template-lint/ember-template-lint/pull/1430) Add `.match` API via new `NodeMatcher` helper ([@josephdsumner](https://github.com/josephdsumner))
* [#1464](https://github.com/ember-template-lint/ember-template-lint/pull/1464) `no-quoteless-attributes`: Adjust error message for component arguments ([@Turbo87](https://github.com/Turbo87))
* [#1474](https://github.com/ember-template-lint/ember-template-lint/pull/1474) `link-rel-noopener`: add `--fix` support ([@fivetanley](https://github.com/fivetanley))
* [#1462](https://github.com/ember-template-lint/ember-template-lint/pull/1462) `no-invalid-interactive`: Only warn about known disallowed DOM events in the `on` modifier ([@Turbo87](https://github.com/Turbo87))
* [#1461](https://github.com/ember-template-lint/ember-template-lint/pull/1461) `no-invalid-interactive`: Add `canvas` to the list of interactive tag names ([@Turbo87](https://github.com/Turbo87))
* [#1459](https://github.com/ember-template-lint/ember-template-lint/pull/1459) Implement `no-link-to-tagname` rule ([@Turbo87](https://github.com/Turbo87))
* [#1458](https://github.com/ember-template-lint/ember-template-lint/pull/1458) `no-arguments-for-html-elements`: Extract `no-block-params-for-html-elements` rule ([@Turbo87](https://github.com/Turbo87))
* [#1457](https://github.com/ember-template-lint/ember-template-lint/pull/1457) Implement `no-potential-path-strings` rule ([@Turbo87](https://github.com/Turbo87))
* [#1449](https://github.com/ember-template-lint/ember-template-lint/pull/1449) Implement `no-nested-splattributes` rule ([@Turbo87](https://github.com/Turbo87))
* [#1450](https://github.com/ember-template-lint/ember-template-lint/pull/1450) Implement `no-redundant-fn` rule ([@Turbo87](https://github.com/Turbo87))
* [#1316](https://github.com/ember-template-lint/ember-template-lint/pull/1316) Implement `no-positional-data-test-selectors` rule ([@gabrielcsapo](https://github.com/gabrielcsapo))
* [#1431](https://github.com/ember-template-lint/ember-template-lint/pull/1431) Add `--no-inline-config` option. ([@rwjblue](https://github.com/rwjblue))

#### :bug: Bug Fix
* [#1136](https://github.com/ember-template-lint/ember-template-lint/pull/1136) `no-curly-component-invocation`: update rule to ignore ember-cli-app-version usage ([@lifeart](https://github.com/lifeart))

#### :memo: Documentation
* [#1480](https://github.com/ember-template-lint/ember-template-lint/pull/1480) Ensure all rule docs have a references section ([@jaydgruber](https://github.com/jaydgruber))
* [#1456](https://github.com/ember-template-lint/ember-template-lint/pull/1456) `no-arguments-for-html-elements`: Remove wrong examples from the documentation ([@Turbo87](https://github.com/Turbo87))
* [#1454](https://github.com/ember-template-lint/ember-template-lint/pull/1454) Fix misspelling of `--print-pending`s help output ([@MelSumner](https://github.com/MelSumner))
* [#1436](https://github.com/ember-template-lint/ember-template-lint/pull/1436) Add note about github actions printer ([@nadavshatz](https://github.com/nadavshatz))

#### :house: Internal
* [#1468](https://github.com/ember-template-lint/ember-template-lint/pull/1468) Use `eslint-plugin-import-helpers` to sort imports alphabetically ([@Turbo87](https://github.com/Turbo87))
* [#1467](https://github.com/ember-template-lint/ember-template-lint/pull/1467) Adjust `new-rule` template ([@Turbo87](https://github.com/Turbo87))
* [#1455](https://github.com/ember-template-lint/ember-template-lint/pull/1455) Add test to ensure rules list is sorted ([@bmish](https://github.com/bmish))
* [#1447](https://github.com/ember-template-lint/ember-template-lint/pull/1447) Replace `npm-package-json-lint` with `sort-package-json` ([@Turbo87](https://github.com/Turbo87))

#### Committers: 12
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Benjamin JEGARD ([@KamiKillertO](https://github.com/KamiKillertO))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Gabriel Csapo ([@gabrielcsapo](https://github.com/gabrielcsapo))
- Joseph D. Sumner ([@josephdsumner](https://github.com/josephdsumner))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Nadav Shatz ([@nadavshatz](https://github.com/nadavshatz))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Stanley Stuart ([@fivetanley](https://github.com/fivetanley))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)
- [@jaydgruber](https://github.com/jaydgruber)


## v2.10.0 (2020-08-07)

#### :rocket: Enhancement
* [#1386](https://github.com/ember-template-lint/ember-template-lint/pull/1386) Add new rule: `require-lang-attribute` ([@MelSumner](https://github.com/MelSumner))
* [#1426](https://github.com/ember-template-lint/ember-template-lint/pull/1426) Add v8-compile-cache to improve startup performance ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#1419](https://github.com/ember-template-lint/ember-template-lint/pull/1419) Check `name` and `property` in `no-invalid-meta` rule ([@rwwagner90](https://github.com/rwwagner90))

#### :house: Internal
* [#1418](https://github.com/ember-template-lint/ember-template-lint/pull/1418) Add npm-package-json-lint ([@bmish](https://github.com/bmish))

#### Committers: 3
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Robert Wagner ([@rwwagner90](https://github.com/rwwagner90))

## v2.9.1 (2020-07-15)

#### :bug: Bug Fix
* [#1407](https://github.com/ember-template-lint/ember-template-lint/pull/1407) Ensure `plugins` config parsing is idempotent  ([@dcyriller](https://github.com/dcyriller))

#### :memo: Documentation
* [#1413](https://github.com/ember-template-lint/ember-template-lint/pull/1413) Add fixable notice to the rule doc of fixable rules ([@bmish](https://github.com/bmish))
* [#1411](https://github.com/ember-template-lint/ember-template-lint/pull/1411) Add 🔧 emoji to fixable rules in rules table in README ([@dcyriller](https://github.com/dcyriller))
* [#1409](https://github.com/ember-template-lint/ember-template-lint/pull/1409) Add documentation about how to create a fixer for a rule ([@dcyriller](https://github.com/dcyriller))
* [#1410](https://github.com/ember-template-lint/ember-template-lint/pull/1410) Minor cleanup to README ([@dcyriller](https://github.com/dcyriller))

#### Committers: 2
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Cyrille ([@dcyriller](https://github.com/dcyriller))


## v2.9.0 (2020-06-29)

#### :rocket: Enhancement
* [#1400](https://github.com/ember-template-lint/ember-template-lint/pull/1400) Refactor `no-restricted-invocations` rule to significantly improve performance ([@bmish](https://github.com/bmish))
* [#1389](https://github.com/ember-template-lint/ember-template-lint/pull/1389) Rename `invocable-blacklist` rule to `no-restricted-invocations` (backwards-compatible) ([@bmish](https://github.com/bmish))
* [#1372](https://github.com/ember-template-lint/ember-template-lint/pull/1372) Allow specifying a custom error message in `no-restricted-invocations` rule ([@bmish](https://github.com/bmish))
* [#1392](https://github.com/ember-template-lint/ember-template-lint/pull/1392) Add configuration options for allowing components as table children in `table-groups` rule ([@mongoose700](https://github.com/mongoose700))

#### :bug: Bug Fix
* [#1393](https://github.com/ember-template-lint/ember-template-lint/pull/1393) Fix table groups ordering enforcement when whitespace is present in `table-groups` rule ([@mongoose700](https://github.com/mongoose700))
* [#1370](https://github.com/ember-template-lint/ember-template-lint/pull/1370) Update `no-restricted-invocations` rule to handle nested angle bracket component invocation ([@bmish](https://github.com/bmish))
* [#1369](https://github.com/ember-template-lint/ember-template-lint/pull/1369) Update `no-restricted-invocations` rule to disallow empty config array ([@bmish](https://github.com/bmish))
* [#1362](https://github.com/ember-template-lint/ember-template-lint/pull/1362) Handle `unless` in `no-positive-tabindex` rule ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#1394](https://github.com/ember-template-lint/ember-template-lint/pull/1394) Add autogenerated rule table for README ([@bmish](https://github.com/bmish))
* [#1399](https://github.com/ember-template-lint/ember-template-lint/pull/1399) Improve package.json `description` field ([@bmish](https://github.com/bmish))
* [#1387](https://github.com/ember-template-lint/ember-template-lint/pull/1387) Improve message for `no-implicit-this` to mention using angle bracket invocation ([@chriskrycho](https://github.com/chriskrycho))

#### :house: Internal
* [#1350](https://github.com/ember-template-lint/ember-template-lint/pull/1350) Add eslint-plugin-unicorn with recommended rules ([@bmish](https://github.com/bmish))
* [#1355](https://github.com/ember-template-lint/ember-template-lint/pull/1355) Add a test for fixing from stdin (provided a --filename is given) ([@dcyriller](https://github.com/dcyriller))

#### Committers: 4
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Chris Krycho ([@chriskrycho](https://github.com/chriskrycho))
- Cyrille ([@dcyriller](https://github.com/dcyriller))
- Michael Peirce ([@mongoose700](https://github.com/mongoose700))


## v2.8.0 (2020-05-22)

#### :rocket: Enhancement
* [#1335](https://github.com/ember-template-lint/ember-template-lint/pull/1335) Add new rule: no-forbidden-elements ([@rajasegar](https://github.com/rajasegar))
* [#1321](https://github.com/ember-template-lint/ember-template-lint/pull/1321) Add new rule: `no-redundant-landmark-role` ([@rajasegar](https://github.com/rajasegar))
* [#1322](https://github.com/ember-template-lint/ember-template-lint/pull/1322) Add new rule: `no-nested-landmark` ([@rajasegar](https://github.com/rajasegar))

#### :bug: Bug Fix
* [#1347](https://github.com/ember-template-lint/ember-template-lint/pull/1347) Add additional built-in helpers to `no-implicit-this` (e.g. `array`, `concat`, `query-params`, etc) ([@jaydgruber](https://github.com/jaydgruber))

#### :memo: Documentation
* [#1338](https://github.com/ember-template-lint/ember-template-lint/pull/1338) Clarify recommended fix for `no-negated-condition` rule ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#1349](https://github.com/ember-template-lint/ember-template-lint/pull/1349) chore(dev-deps): update to eslint 7 ([@bmish](https://github.com/bmish))
* [#1333](https://github.com/ember-template-lint/ember-template-lint/pull/1333) Ensure `<MyComponent @prop={{can.do}} />` triggers `no-implicit-this` error. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 4
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Rajasegar Chandran ([@rajasegar](https://github.com/rajasegar))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- [@jaydgruber](https://github.com/jaydgruber)


## v2.7.0 (2020-05-11)

#### :rocket: Enhancement
* [#927](https://github.com/ember-template-lint/ember-template-lint/pull/927) Add `no-arguments-for-html-elements` rule ([@lifeart](https://github.com/lifeart))
* [#1320](https://github.com/ember-template-lint/ember-template-lint/pull/1320) Add `catchNonexistentRoles` option (default false) to `no-invalid-role` rule ([@rajasegar](https://github.com/rajasegar))
* [#1222](https://github.com/ember-template-lint/ember-template-lint/pull/1222) Add new rule: `no-unbalanced-curlies` ([@pablobm](https://github.com/pablobm))

#### :bug: Bug Fix
* [#1324](https://github.com/ember-template-lint/ember-template-lint/pull/1324) Ensure `require-valid-alt-text` can handle a dynamic `role` attribute  ([@gabrielcsapo](https://github.com/gabrielcsapo))
* [#1317](https://github.com/ember-template-lint/ember-template-lint/pull/1317) Avoid glob matching when no-glob is present (e.g. globs have already been replaced by shell expansion) ([@gabrielcsapo](https://github.com/gabrielcsapo))

#### :memo: Documentation
* [#1313](https://github.com/ember-template-lint/ember-template-lint/pull/1313) Update documentation and examples for `no-positive-tabindex` ([@MelSumner](https://github.com/MelSumner))

#### :house: Internal
* [#1323](https://github.com/ember-template-lint/ember-template-lint/pull/1323) Refactor `no-invalid-role` rule to better support future additions ([@bmish](https://github.com/bmish))
* [#1298](https://github.com/ember-template-lint/ember-template-lint/pull/1298) Add shell-specific tests for reading from stdin ([@dcyriller](https://github.com/dcyriller))

#### Committers: 7
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Cyrille David ([@dcyriller](https://github.com/dcyriller))
- Gabriel Csapo ([@gabrielcsapo](https://github.com/gabrielcsapo))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Pablo Brasero ([@pablobm](https://github.com/pablobm))
- Rajasegar Chandran ([@rajasegar](https://github.com/rajasegar))


## v2.6.0 (2020-04-28)

#### :rocket: Enhancement
* [#1263](https://github.com/ember-template-lint/ember-template-lint/pull/1263) Add `--rule` and `--no-config-path` command line options ([@gabrielcsapo](https://github.com/gabrielcsapo))

#### :bug: Bug Fix
* [#1303](https://github.com/ember-template-lint/ember-template-lint/pull/1303) Update ember-template-recast to remove extraneous whitespace in `--fix` for `inline-link-to` rule ([@dcyriller](https://github.com/dcyriller))
* [#1297](https://github.com/ember-template-lint/ember-template-lint/pull/1297) Fix reading from stdin on Windows ([@dcyriller](https://github.com/dcyriller))

#### :memo: Documentation
* [#1305](https://github.com/ember-template-lint/ember-template-lint/pull/1305) Fix example in no-invalid-role documentation ([@MelSumner](https://github.com/MelSumner))
* [#1304](https://github.com/ember-template-lint/ember-template-lint/pull/1304) Tweak Installation section of `README.md` to clarify that `ember-template-lint` is installed by default ([@MelSumner](https://github.com/MelSumner))
* [#1308](https://github.com/ember-template-lint/ember-template-lint/pull/1308) Add Node 14 as supported platform ([@dcyriller](https://github.com/dcyriller))
* [#1306](https://github.com/ember-template-lint/ember-template-lint/pull/1306) Fix invalid URL in documentation reference for `no-invalid-link-title` rule ([@MelSumner](https://github.com/MelSumner))

#### :house: Internal
* [#1310](https://github.com/ember-template-lint/ember-template-lint/pull/1310) Refactor CI setup. ([@rwjblue](https://github.com/rwjblue))
* [#1309](https://github.com/ember-template-lint/ember-template-lint/pull/1309) Add Node 14 to CI. ([@rwjblue](https://github.com/rwjblue))
* [#1302](https://github.com/ember-template-lint/ember-template-lint/pull/1302) Remove "over DRY" test setup (make tests easier to understand) ([@dcyriller](https://github.com/dcyriller))
* [#1282](https://github.com/ember-template-lint/ember-template-lint/pull/1282) Adapt tests for reading from stdin to run on Windows ([@stukalin](https://github.com/stukalin))
* [#1284](https://github.com/ember-template-lint/ember-template-lint/pull/1284) Test Windows in CI ([@stukalin](https://github.com/stukalin))
* [#1285](https://github.com/ember-template-lint/ember-template-lint/pull/1285) Set a shorter timeout for Github Actions ([@dcyriller](https://github.com/dcyriller))
* [#1278](https://github.com/ember-template-lint/ember-template-lint/pull/1278) Use the correct title in generated rule doc when running `yarn new` ([@josephdsumner](https://github.com/josephdsumner))
* [#1277](https://github.com/ember-template-lint/ember-template-lint/pull/1277) Use get-stdin dependency to read from stdin ([@dcyriller](https://github.com/dcyriller))
* [#1271](https://github.com/ember-template-lint/ember-template-lint/pull/1271) Adds additional test cases for `no-invalid-role` ([@MelSumner](https://github.com/MelSumner))
* [#1270](https://github.com/ember-template-lint/ember-template-lint/pull/1270) Start testing editor integrations ([@dcyriller](https://github.com/dcyriller))
* [#1268](https://github.com/ember-template-lint/ember-template-lint/pull/1268) Add unit tests for `bin/ember-template-lint.js` ([@dcyriller](https://github.com/dcyriller))

#### Committers: 7
- Andrey Stukalin ([@stukalin](https://github.com/stukalin))
- Cyrille David ([@dcyriller](https://github.com/dcyriller))
- Gabriel Csapo ([@gabrielcsapo](https://github.com/gabrielcsapo))
- Joseph D. Sumner ([@josephdsumner](https://github.com/josephdsumner))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)


## v2.5.2 (2020-04-11)

#### :bug: Bug Fix
* [#1264](https://github.com/ember-template-lint/ember-template-lint/pull/1264) Ensure `--json` argument can be used anywhere on the command line. ([@dcyriller](https://github.com/dcyriller))

#### :house: Internal
* [#1265](https://github.com/ember-template-lint/ember-template-lint/pull/1265) test(cli): Set LC_ALL env var to en_US ([@dcyriller](https://github.com/dcyriller))

#### Committers: 1
- Cyrille David ([@dcyriller](https://github.com/dcyriller))


## v2.5.1 (2020-04-09)

#### :rocket: Enhancement
* [#1260](https://github.com/ember-template-lint/ember-template-lint/pull/1260) Expose `ember-template-recast` API on main entry point (e.g. `require('ember-template-lint').recast`) ([@dcyriller](https://github.com/dcyriller))

#### Committers: 1
- Cyrille David ([@dcyriller](https://github.com/dcyriller))


## v2.5.0 (2020-04-08)

#### :rocket: Enhancement
* [#1251](https://github.com/ember-template-lint/ember-template-lint/pull/1251) Pass `env` from `ember-template-recast` to rules so they can use `env.syntax.builders.*` during `ember-template-lint **/*.hbs --fix`. ([@dcyriller](https://github.com/dcyriller))
* [#1238](https://github.com/ember-template-lint/ember-template-lint/pull/1238) Add new rule: `require-form-method` ([@raido](https://github.com/raido))

#### :bug: Bug Fix
* [#1257](https://github.com/ember-template-lint/ember-template-lint/pull/1257) Ensure GitHub Action annotations are not emitted for warnings. ([@eramod](https://github.com/eramod))

#### :memo: Documentation
* [#1250](https://github.com/ember-template-lint/ember-template-lint/pull/1250) Update each rule doc to mention what config enables the rule ([@bmish](https://github.com/bmish))

#### Committers: 5
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Cyrille David ([@dcyriller](https://github.com/dcyriller))
- Dianne Eramo ([@eramod](https://github.com/eramod))
- Raido Kuli ([@raido](https://github.com/raido))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)


## v2.4.1 (2020-03-25)

#### :bug: Bug Fix
* [#1229](https://github.com/ember-template-lint/ember-template-lint/pull/1229) Ensure template parsing errors are only reported once (not once per-rule) ([@lifeart](https://github.com/lifeart))
* [#1210](https://github.com/ember-template-lint/ember-template-lint/pull/1210) Fix invalid failure for invalid block param definition ([@lifeart](https://github.com/lifeart))

#### :memo: Documentation
* [#1220](https://github.com/ember-template-lint/ember-template-lint/pull/1220) Ensure each rule documentation file has the right title and an examples section ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#1212](https://github.com/ember-template-lint/ember-template-lint/pull/1212) Re-run `npm init rwjblue-release-it-setup --update`. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 3
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v2.4.0 (2020-03-08)

#### :rocket: Enhancement
* [#1200](https://github.com/ember-template-lint/ember-template-lint/pull/1200) Add `--ignore-pattern` and `--no-ignore-pattern` command line flags ([@kangax](https://github.com/kangax))

#### :memo: Documentation
* [#1202](https://github.com/ember-template-lint/ember-template-lint/pull/1202) Update contributing info in README ([@pablobm](https://github.com/pablobm))

#### Committers: 2
- Juriy Zaytsev ([@kangax](https://github.com/kangax))
- Pablo Brasero ([@pablobm](https://github.com/pablobm))

## v2.3.0 (2020-03-04)

#### :rocket: Enhancement
* [#1179](https://github.com/ember-template-lint/ember-template-lint/pull/1179) inline-link-to: Implement `fix` mode ([@Turbo87](https://github.com/Turbo87))
* [#1160](https://github.com/ember-template-lint/ember-template-lint/pull/1160) Add severity support (off, warn, error) to rule configuration (via both `.template-lintrc.js` and inline configuration). ([@suchitadoshi1987](https://github.com/suchitadoshi1987))

#### :memo: Documentation
* [#1195](https://github.com/ember-template-lint/ember-template-lint/pull/1195) Add v2 migration guide ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#1196](https://github.com/ember-template-lint/ember-template-lint/pull/1196) Migrate to `yargs` for argument parsing. ([@rwjblue](https://github.com/rwjblue))
* [#1191](https://github.com/ember-template-lint/ember-template-lint/pull/1191) Refactor printers. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 5
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Cyrille David ([@dcyriller](https://github.com/dcyriller))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Suchita Doshi ([@suchitadoshi1987](https://github.com/suchitadoshi1987))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))

## v2.2.0 (2020-03-02)

#### :rocket: Enhancement
* [#1190](https://github.com/ember-template-lint/ember-template-lint/pull/1190) Ensure BOM is preserved when using `--fix`. ([@rwjblue](https://github.com/rwjblue))
* [#1185](https://github.com/ember-template-lint/ember-template-lint/pull/1185) Add message about running `--fix` to console output when fixable errors have ocurred. ([@rwjblue](https://github.com/rwjblue))
* [#1183](https://github.com/ember-template-lint/ember-template-lint/pull/1183) --fix: Write output to fs ([@dcyriller](https://github.com/dcyriller))
* [#1178](https://github.com/ember-template-lint/ember-template-lint/pull/1178) require-button-type: Implement `fix` mode ([@Turbo87](https://github.com/Turbo87))

#### :bug: Bug Fix
* [#1189](https://github.com/ember-template-lint/ember-template-lint/pull/1189) Ensure resolvable plugins work when the config is not resolved. ([@rwjblue](https://github.com/rwjblue))

#### :house: Internal
* [#1188](https://github.com/ember-template-lint/ember-template-lint/pull/1188) Ensure `yarn new` emits the expected TODO format ([@MelSumner](https://github.com/MelSumner))
* [#1181](https://github.com/ember-template-lint/ember-template-lint/pull/1181) Ensure the exported class name matches the rule name ([@bmish](https://github.com/bmish))

#### Committers: 5
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Cyrille David ([@dcyriller](https://github.com/dcyriller))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))

## v2.1.0 (2020-02-28)

#### :rocket: Enhancement
* [#1158](https://github.com/ember-template-lint/ember-template-lint/pull/1158) Introduce rule visitor based fixing support. ([@rwjblue](https://github.com/rwjblue))
* [#1174](https://github.com/ember-template-lint/ember-template-lint/pull/1174) Add test harness features (naming test cases, snapshot support, etc). ([@rwjblue](https://github.com/rwjblue))
* [#1169](https://github.com/ember-template-lint/ember-template-lint/pull/1169) Add support to `test.only` in the test harness. ([@rwjblue](https://github.com/rwjblue))
* [#1117](https://github.com/ember-template-lint/ember-template-lint/pull/1117) Add configuration file support for overrides  ([@suchitadoshi1987](https://github.com/suchitadoshi1987))
* [#1074](https://github.com/ember-template-lint/ember-template-lint/pull/1074) Add --help option and configurable option parsing ([@velrest](https://github.com/velrest))
* [#1102](https://github.com/ember-template-lint/ember-template-lint/pull/1102) Add new rule: `no-heading-inside-button` ([@MelSumner](https://github.com/MelSumner))
* [#1105](https://github.com/ember-template-lint/ember-template-lint/pull/1105) Add new rule: `require-input-label` ([@MelSumner](https://github.com/MelSumner))
* [#1120](https://github.com/ember-template-lint/ember-template-lint/pull/1120) Add new rule: `no-invalid-link-title` ([@MelSumner](https://github.com/MelSumner))

#### :bug: Bug Fix
* [#1167](https://github.com/ember-template-lint/ember-template-lint/pull/1167) Ensure accessing `this.editorConfig` in a rule instance does not error. ([@rwjblue](https://github.com/rwjblue))

#### :memo: Documentation
* [#1159](https://github.com/ember-template-lint/ember-template-lint/pull/1159) Rewrite documentation for `link-href-attributes` rule to explain motivation and migration ([@MelSumner](https://github.com/MelSumner))
* [#1154](https://github.com/ember-template-lint/ember-template-lint/pull/1154) Fix CI badge in README ([@rwjblue](https://github.com/rwjblue))

#### :house: Internal
* [#1177](https://github.com/ember-template-lint/ember-template-lint/pull/1177) Add `new` command for generating a new rule from CLI ([@MelSumner](https://github.com/MelSumner))
* [#1173](https://github.com/ember-template-lint/ember-template-lint/pull/1173) Update minimum version of ember-template-recast to 4.1.1. ([@rwjblue](https://github.com/rwjblue))
* [#1166](https://github.com/ember-template-lint/ember-template-lint/pull/1166) Refactor `cli-test.js` to remove usage of fixtures in favor of using `fixturify-project` ([@suchitadoshi1987](https://github.com/suchitadoshi1987))
* [#1157](https://github.com/ember-template-lint/ember-template-lint/pull/1157) Refactor rule logging to track results locally. ([@rwjblue](https://github.com/rwjblue))
* [#1156](https://github.com/ember-template-lint/ember-template-lint/pull/1156) Extract `Linter.prototype.buildRule` internal helper method to build rule instances. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 5
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Jonas Cosandey ([@velrest](https://github.com/velrest))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Suchita Doshi ([@suchitadoshi1987](https://github.com/suchitadoshi1987))

## v2.0.1 (2020-02-24)

#### :rocket: Enhancement
* [#935](https://github.com/ember-template-lint/ember-template-lint/pull/935) Implement more plumbing for `--fix` support (add `Linter.prototype.verifyAndFix`) ([@dcyriller](https://github.com/dcyriller))

#### :bug: Bug Fix
* [#1153](https://github.com/ember-template-lint/ember-template-lint/pull/1153) Ensure plugins are resolved relative to config file location. ([@rwjblue](https://github.com/rwjblue))
* [#1072](https://github.com/ember-template-lint/ember-template-lint/pull/1072) Ensure `editorconfig` integration always uses the real file path not module name (add's new `filePath` property for rules to access). ([@bobisjan](https://github.com/bobisjan))

#### :house: Internal
* [#1151](https://github.com/ember-template-lint/ember-template-lint/pull/1151) Add internal `fixturify-project` based test helper. ([@rwjblue](https://github.com/rwjblue))
* [#1148](https://github.com/ember-template-lint/ember-template-lint/pull/1148) Use npm-run-all to run multiple scripts. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 3
- Cyrille David ([@dcyriller](https://github.com/dcyriller))
- Jan Bobisud ([@bobisjan](https://github.com/bobisjan))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))

## v2.0.0 (2020-02-22)

See the [migration guide](docs/migration/v2.md) for this release.

#### :boom: Breaking Change
* [#1067](https://github.com/ember-template-lint/ember-template-lint/pull/1067) Remove deprecated `templateEnvironmentData` rule property ([@bmish](https://github.com/bmish))
* [#1060](https://github.com/ember-template-lint/ember-template-lint/pull/1060) Add more rules to `stylistic` config ([@bmish](https://github.com/bmish))
* [#1061](https://github.com/ember-template-lint/ember-template-lint/pull/1061) Remove deprecated rule `no-trailing-dot-in-path-expression` ([@bmish](https://github.com/bmish))
* [#1059](https://github.com/ember-template-lint/ember-template-lint/pull/1059) Add `no-index-component-invocation` to `recommended` configuration. ([@rwjblue](https://github.com/rwjblue))
* [#1053](https://github.com/ember-template-lint/ember-template-lint/pull/1053) Add `no-invalid-role` and `no-negated-condition` rules to `recommended` preset ([@bmish](https://github.com/bmish))
* [#1052](https://github.com/ember-template-lint/ember-template-lint/pull/1052) Change `allowDynamicStyles` option to default to true in `no-inline-styles` rule ([@bmish](https://github.com/bmish))
* [#1055](https://github.com/ember-template-lint/ember-template-lint/pull/1055) Remove deprecated array config for `no-nested-interactive` rule ([@bmish](https://github.com/bmish))
* [#1054](https://github.com/ember-template-lint/ember-template-lint/pull/1054) Remove deprecated rule `no-meta-redirect-with-time-limit` which was replaced by `no-invalid-meta` ([@bmish](https://github.com/bmish))
* [#1047](https://github.com/ember-template-lint/ember-template-lint/pull/1047) Add `no-args-path`, `no-invalid-link-text`, `no-invalid-meta`, `require-button-type` into `recommended` configuration. ([@rwjblue](https://github.com/rwjblue))
* [#1023](https://github.com/ember-template-lint/ember-template-lint/pull/1023) Drop NodeJs v8 support ([@dcyriller](https://github.com/dcyriller))
* [#918](https://github.com/ember-template-lint/ember-template-lint/pull/918) Use `.editorconfig` to choose default value for `block-indentation` ([@lifeart](https://github.com/lifeart))
* [#919](https://github.com/ember-template-lint/ember-template-lint/pull/919) Use `.editorconfig` to choose default value for `linebreak-style` ([@lifeart](https://github.com/lifeart))
* [#899](https://github.com/ember-template-lint/ember-template-lint/pull/899) Update recommended config ([@rwjblue](https://github.com/rwjblue))
* [#844](https://github.com/ember-template-lint/ember-template-lint/pull/844) Remove HTML comment config ([@initram](https://github.com/initram))
* [#885](https://github.com/ember-template-lint/ember-template-lint/pull/885) Drop support for NodeJs v6 and v11 ([@dcyriller](https://github.com/dcyriller))

#### :rocket: Enhancement
* [#1126](https://github.com/ember-template-lint/ember-template-lint/pull/1126) Add new rule `no-invalid-block-param-definition` ([@lifeart](https://github.com/lifeart))
* [#1138](https://github.com/ember-template-lint/ember-template-lint/pull/1138) Automatically discover `.template-lintrc.js` when running linter from a project subdirectory (e.g. a monorepo's package, with linting configuration in the project root). ([@lifeart](https://github.com/lifeart))
* [#1134](https://github.com/ember-template-lint/ember-template-lint/pull/1134) Add `ignoredTags` option to `no-invalid-interactive` rule ([@bmish](https://github.com/bmish))
* [#1086](https://github.com/ember-template-lint/ember-template-lint/pull/1086) Update `block-indentation` rule to add new `ignoreComments` option ([@akashdsouza](https://github.com/akashdsouza))
* [#1060](https://github.com/ember-template-lint/ember-template-lint/pull/1060) Add more rules to `stylistic` config ([@bmish](https://github.com/bmish))
* [#1062](https://github.com/ember-template-lint/ember-template-lint/pull/1062) Add support for detecting `eol-last` from `.editorconfig` ([@rwjblue](https://github.com/rwjblue))
* [#1059](https://github.com/ember-template-lint/ember-template-lint/pull/1059) Add `no-index-component-invocation` to `recommended` configuration. ([@rwjblue](https://github.com/rwjblue))
* [#1053](https://github.com/ember-template-lint/ember-template-lint/pull/1053) Add `no-invalid-role` and `no-negated-condition` rules to `recommended` preset ([@bmish](https://github.com/bmish))
* [#1052](https://github.com/ember-template-lint/ember-template-lint/pull/1052) Change `allowDynamicStyles` option to default to true in `no-inline-styles` rule ([@bmish](https://github.com/bmish))
* [#1048](https://github.com/ember-template-lint/ember-template-lint/pull/1048) Add `stylistic` configuration ([@bmish](https://github.com/bmish))
* [#1047](https://github.com/ember-template-lint/ember-template-lint/pull/1047) Add `no-args-path`, `no-invalid-link-text`, `no-invalid-meta`, `require-button-type` into `recommended` configuration. ([@rwjblue](https://github.com/rwjblue))
* [#1045](https://github.com/ember-template-lint/ember-template-lint/pull/1045) Remove no-implicit-this from `recommended` config. ([@rwjblue](https://github.com/rwjblue))
* [#918](https://github.com/ember-template-lint/ember-template-lint/pull/918) Use `.editorconfig` to choose default value for `block-indentation` ([@lifeart](https://github.com/lifeart))
* [#919](https://github.com/ember-template-lint/ember-template-lint/pull/919) Use `.editorconfig` to choose default value for `linebreak-style` ([@lifeart](https://github.com/lifeart))
* [#906](https://github.com/ember-template-lint/ember-template-lint/pull/906) Add utility function to allow reading from `.editorconfig` ([@lifeart](https://github.com/lifeart))
* [#873](https://github.com/ember-template-lint/ember-template-lint/pull/873) Leverage ember-template-recast ([@dcyriller](https://github.com/dcyriller))

#### :bug: Bug Fix
* [#1123](https://github.com/ember-template-lint/ember-template-lint/pull/1123) Fix issues introduced by ember-template-recast@4.0.1. ([@rwjblue](https://github.com/rwjblue))
* [#1051](https://github.com/ember-template-lint/ember-template-lint/pull/1051) Fix configuration of `quotes` rule in `stylistic` preset ([@bmish](https://github.com/bmish))
* [#1049](https://github.com/ember-template-lint/ember-template-lint/pull/1049) Bring `no-implicit-this` back into the `octane` config ([@rwjblue](https://github.com/rwjblue))
* [#920](https://github.com/ember-template-lint/ember-template-lint/pull/920) Ensure `no-bare-strings` consider literals in mustaches (e.g. `{{"foo"}}`) ([@lifeart](https://github.com/lifeart))
* [#923](https://github.com/ember-template-lint/ember-template-lint/pull/923) Allow `getLocalName` to work with number literals ([@alexlafroscia](https://github.com/alexlafroscia))
* [#913](https://github.com/ember-template-lint/ember-template-lint/pull/913) Update `no-unnecessary-component-helper` rule to allow the `component` helper as an angle bracket component argument ([@buschtoens](https://github.com/buschtoens))
* [#908](https://github.com/ember-template-lint/ember-template-lint/pull/908) Update `no-bare-strings` to ignore contents within elements that are not translated (e.g. `<script>`,`<style>`, and `<pre>`). ([@lifeart](https://github.com/lifeart))
* [#905](https://github.com/ember-template-lint/ember-template-lint/pull/905) Ensure configuration ordering does not matter with `no-bare-strings` ([@lifeart](https://github.com/lifeart))
* [#904](https://github.com/ember-template-lint/ember-template-lint/pull/904) Update `block-indentation` to ignore children of `<template>` and `<textarea>` ([@lifeart](https://github.com/lifeart))

#### :memo: Documentation
* [#1140](https://github.com/ember-template-lint/ember-template-lint/pull/1140) Add markdownlint and fix violations ([@bmish](https://github.com/bmish))
* [#1133](https://github.com/ember-template-lint/ember-template-lint/pull/1133) Don't mention `ember-cli-template-lint` in README ([@dcyriller](https://github.com/dcyriller))
* [#1050](https://github.com/ember-template-lint/ember-template-lint/pull/1050) Add presets list to README ([@bmish](https://github.com/bmish))
* [#911](https://github.com/ember-template-lint/ember-template-lint/pull/911) Update documentation for `require-valid-alt-text` to clarify that `logo` and `spacer` are forbidden words ([@gojefferson](https://github.com/gojefferson))

#### :house: Internal
* [#1147](https://github.com/ember-template-lint/ember-template-lint/pull/1147) Use updated mechanism to disable chalk. ([@rwjblue](https://github.com/rwjblue))
* [#1146](https://github.com/ember-template-lint/ember-template-lint/pull/1146) Update execa from 1.x to 4.0.0. ([@rwjblue](https://github.com/rwjblue))
* [#1145](https://github.com/ember-template-lint/ember-template-lint/pull/1145) Update dependencies & devDependencies to latest. ([@rwjblue](https://github.com/rwjblue))
* [#1141](https://github.com/ember-template-lint/ember-template-lint/pull/1141) Replace `minimatch` with `micromatch` #1139 ([@lifeart](https://github.com/lifeart))
* [#1067](https://github.com/ember-template-lint/ember-template-lint/pull/1067) Remove deprecated `templateEnvironmentData` rule property ([@bmish](https://github.com/bmish))
* [#1061](https://github.com/ember-template-lint/ember-template-lint/pull/1061) Remove deprecated rule `no-trailing-dot-in-path-expression` ([@bmish](https://github.com/bmish))
* [#1055](https://github.com/ember-template-lint/ember-template-lint/pull/1055) Remove deprecated array config for `no-nested-interactive` rule ([@bmish](https://github.com/bmish))
* [#1054](https://github.com/ember-template-lint/ember-template-lint/pull/1054) Remove deprecated rule `no-meta-redirect-with-time-limit` which was replaced by `no-invalid-meta` ([@bmish](https://github.com/bmish))
* [#1046](https://github.com/ember-template-lint/ember-template-lint/pull/1046) Update `octane` config to extend from `recommended`. ([@rwjblue](https://github.com/rwjblue))
* [#1023](https://github.com/ember-template-lint/ember-template-lint/pull/1023) Drop NodeJs v8 support ([@dcyriller](https://github.com/dcyriller))
* [#941](https://github.com/ember-template-lint/ember-template-lint/pull/941) Leverage static class fields for  SEVERITY constants ([@dcyriller](https://github.com/dcyriller))
* [#933](https://github.com/ember-template-lint/ember-template-lint/pull/933) Linter class: Use named severity ([@dcyriller](https://github.com/dcyriller))
* [#932](https://github.com/ember-template-lint/ember-template-lint/pull/932) Move main linter engine to stand alone file. ([@dcyriller](https://github.com/dcyriller))
* [#876](https://github.com/ember-template-lint/ember-template-lint/pull/876) Begin migrating tests to inline fixtures (via `broccoli-test-helper`) ([@lifeart](https://github.com/lifeart))
* [#898](https://github.com/ember-template-lint/ember-template-lint/pull/898) Update dependencies to latest (requiring Node 8+). ([@rwjblue](https://github.com/rwjblue))

#### Committers: 9
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Cyrille David ([@dcyriller](https://github.com/dcyriller))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- [@akashdsouza](https://github.com/akashdsouza)
- Alex LaFroscia ([@alexlafroscia](https://github.com/alexlafroscia))
- Jan Buschtöns ([@buschtoens](https://github.com/buschtoens))
- Jeff Kerr ([@gojefferson](https://github.com/gojefferson))
- Martin Midtgaard ([@initram](https://github.com/initram))

## v2.0.0-beta.5 (2020-01-15)

This release includes all the changes that went into v1.12.1 - v1.13.1.

#### :boom: Breaking Change
* [#1067](https://github.com/ember-template-lint/ember-template-lint/pull/1067) Remove deprecated `templateEnvironmentData` rule property ([@bmish](https://github.com/bmish))
* [#1060](https://github.com/ember-template-lint/ember-template-lint/pull/1060) Add more rules to `stylistic` config ([@bmish](https://github.com/bmish))
* [#1061](https://github.com/ember-template-lint/ember-template-lint/pull/1061) Remove deprecated rule `no-trailing-dot-in-path-expression` ([@bmish](https://github.com/bmish))
* [#1059](https://github.com/ember-template-lint/ember-template-lint/pull/1059) Add `no-index-component-invocation` to `recommended` configuration. ([@rwjblue](https://github.com/rwjblue))
* [#1053](https://github.com/ember-template-lint/ember-template-lint/pull/1053) Add `no-invalid-role` and `no-negated-condition` rules to `recommended` preset ([@bmish](https://github.com/bmish))
* [#1052](https://github.com/ember-template-lint/ember-template-lint/pull/1052) Change `allowDynamicStyles` option to default to true in `no-inline-styles` rule ([@bmish](https://github.com/bmish))
* [#1055](https://github.com/ember-template-lint/ember-template-lint/pull/1055) Remove deprecated array config for `no-nested-interactive` rule ([@bmish](https://github.com/bmish))
* [#1054](https://github.com/ember-template-lint/ember-template-lint/pull/1054) Remove deprecated rule `no-meta-redirect-with-time-limit` which was replaced by `no-invalid-meta` ([@bmish](https://github.com/bmish))
* [#1047](https://github.com/ember-template-lint/ember-template-lint/pull/1047) Add `no-args-path`, `no-invalid-link-text`, `no-invalid-meta`, `require-button-type` into `recommended` configuration. ([@rwjblue](https://github.com/rwjblue))
* [#1023](https://github.com/ember-template-lint/ember-template-lint/pull/1023) Drop NodeJs v8 support ([@dcyriller](https://github.com/dcyriller))

#### :rocket: Enhancement
* [#1060](https://github.com/ember-template-lint/ember-template-lint/pull/1060) Add more rules to `stylistic` config ([@bmish](https://github.com/bmish))
* [#1062](https://github.com/ember-template-lint/ember-template-lint/pull/1062) Add support for detecting `eol-last` from `.editorconfig` ([@rwjblue](https://github.com/rwjblue))
* [#1059](https://github.com/ember-template-lint/ember-template-lint/pull/1059) Add `no-index-component-invocation` to `recommended` configuration. ([@rwjblue](https://github.com/rwjblue))
* [#1053](https://github.com/ember-template-lint/ember-template-lint/pull/1053) Add `no-invalid-role` and `no-negated-condition` rules to `recommended` preset ([@bmish](https://github.com/bmish))
* [#1052](https://github.com/ember-template-lint/ember-template-lint/pull/1052) Change `allowDynamicStyles` option to default to true in `no-inline-styles` rule ([@bmish](https://github.com/bmish))
* [#1048](https://github.com/ember-template-lint/ember-template-lint/pull/1048) Add `stylistic` configuration ([@bmish](https://github.com/bmish))
* [#1047](https://github.com/ember-template-lint/ember-template-lint/pull/1047) Add `no-args-path`, `no-invalid-link-text`, `no-invalid-meta`, `require-button-type` into `recommended` configuration. ([@rwjblue](https://github.com/rwjblue))
* [#1045](https://github.com/ember-template-lint/ember-template-lint/pull/1045) Remove no-implicit-this from `recommended` config. ([@rwjblue](https://github.com/rwjblue))

#### :bug: Bug Fix
* [#1051](https://github.com/ember-template-lint/ember-template-lint/pull/1051) Fix configuration of `quotes` rule in `stylistic` preset ([@bmish](https://github.com/bmish))
* [#1049](https://github.com/ember-template-lint/ember-template-lint/pull/1049) Bring `no-implicit-this` back into the `octane` config ([@rwjblue](https://github.com/rwjblue))

#### :memo: Documentation
* [#1050](https://github.com/ember-template-lint/ember-template-lint/pull/1050) Add presets list to README ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#1067](https://github.com/ember-template-lint/ember-template-lint/pull/1067) Remove deprecated `templateEnvironmentData` rule property ([@bmish](https://github.com/bmish))
* [#1061](https://github.com/ember-template-lint/ember-template-lint/pull/1061) Remove deprecated rule `no-trailing-dot-in-path-expression` ([@bmish](https://github.com/bmish))
* [#1055](https://github.com/ember-template-lint/ember-template-lint/pull/1055) Remove deprecated array config for `no-nested-interactive` rule ([@bmish](https://github.com/bmish))
* [#1054](https://github.com/ember-template-lint/ember-template-lint/pull/1054) Remove deprecated rule `no-meta-redirect-with-time-limit` which was replaced by `no-invalid-meta` ([@bmish](https://github.com/bmish))
* [#1046](https://github.com/ember-template-lint/ember-template-lint/pull/1046) Update `octane` config to extend from `recommended`. ([@rwjblue](https://github.com/rwjblue))
* [#1023](https://github.com/ember-template-lint/ember-template-lint/pull/1023) Drop NodeJs v8 support ([@dcyriller](https://github.com/dcyriller))

#### Committers: 3
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Cyrille David ([@dcyriller](https://github.com/dcyriller))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))

## v1.14.0 (2020-02-20)

#### :rocket: Enhancement
* [#1078](https://github.com/ember-template-lint/ember-template-lint/pull/1078) Add `modifier-name-case` rule ([@mansona](https://github.com/mansona))

#### :bug: Bug Fix
* [#1108](https://github.com/ember-template-lint/ember-template-lint/pull/1108) Update `no-bare-strings` rule to allow `&ndash;` ([@jrjohnson](https://github.com/jrjohnson))
* [#1090](https://github.com/ember-template-lint/ember-template-lint/pull/1090) Update `no-curly-component-invocation` rule to ignore all usages of the `yield` helper ([@wagenet](https://github.com/wagenet))

#### :memo: Documentation
* [#1094](https://github.com/ember-template-lint/ember-template-lint/pull/1094) docs/plugins: Fix typo ([@Turbo87](https://github.com/Turbo87))

#### :house: Internal
* [#1121](https://github.com/ember-template-lint/ember-template-lint/pull/1121) Update dependencies to latest allowed versions. ([@rwjblue](https://github.com/rwjblue))
* [#1107](https://github.com/ember-template-lint/ember-template-lint/pull/1107) Simplify a few rules by using the `path` visitor argument ([@Turbo87](https://github.com/Turbo87))

#### Committers: 6
- Chris Manson ([@mansona](https://github.com/mansona))
- Jonathan Johnson ([@jrjohnson](https://github.com/jrjohnson))
- Peter Wagenet ([@wagenet](https://github.com/wagenet))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v1.13.2 (2020-01-18)

#### :bug: Bug Fix
* [#1087](https://github.com/ember-template-lint/ember-template-lint/pull/1087) Fix crash from missing `content` attribute in `no-invalid-meta` rule ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#1083](https://github.com/ember-template-lint/ember-template-lint/pull/1083) Add presets list to README ([@bmish](https://github.com/bmish))
* [#1081](https://github.com/ember-template-lint/ember-template-lint/pull/1081) Fix some spelling mistakes ([@bmish](https://github.com/bmish))

#### Committers: 1
- Bryan Mishkin ([@bmish](https://github.com/bmish))

## v1.13.1 (2020-01-15)

#### :bug: Bug Fix
* [#1071](https://github.com/ember-template-lint/ember-template-lint/pull/1071) Update `no-invalid-interactive` to allow `change` event with `<form>` elements ([@lifeart](https://github.com/lifeart))

#### :memo: Documentation
* [#1076](https://github.com/ember-template-lint/ember-template-lint/pull/1076) Normalize handlebars comments to {{!-- syntax ([@locks](https://github.com/locks))
* [#1068](https://github.com/ember-template-lint/ember-template-lint/pull/1068) no-curly-component-invocation: Document default config ([@dcyriller](https://github.com/dcyriller))

#### Committers: 3
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Cyrille David ([@dcyriller](https://github.com/dcyriller))
- Ricardo Mendes ([@locks](https://github.com/locks))

## v1.13.0 (2020-01-07)

#### :rocket: Enhancement
* [#895](https://github.com/ember-template-lint/ember-template-lint/pull/895) Add `no-index-component-invocation` rule ([@lifeart](https://github.com/lifeart))

#### :memo: Documentation
* [#1040](https://github.com/ember-template-lint/ember-template-lint/pull/1040) Fix link to recommended config ([@kategengler](https://github.com/kategengler))

#### :house: Internal
* [#1042](https://github.com/ember-template-lint/ember-template-lint/pull/1042) Refactor test-harness ([@dcyriller](https://github.com/dcyriller))
* [#1036](https://github.com/ember-template-lint/ember-template-lint/pull/1036) Group acceptance tests in test/acceptance folder ([@dcyriller](https://github.com/dcyriller))

#### Committers: 4
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Cyrille David ([@dcyriller](https://github.com/dcyriller))
- Katie Gengler ([@kategengler](https://github.com/kategengler))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v2.0.0-beta.4 (2019-12-13)

This release includes all the changes that went into v1.10.0 - v1.12.0.

## v2.0.0-beta.3 (2019-12-04)

This release includes all the changes that went into v1.9.0.

#### :house: Internal
* [#941](https://github.com/ember-template-lint/ember-template-lint/pull/941) Leverage static class fields for  SEVERITY constants ([@dcyriller](https://github.com/dcyriller))
* [#933](https://github.com/ember-template-lint/ember-template-lint/pull/933) Linter class: Use named severity ([@dcyriller](https://github.com/dcyriller))
* [#932](https://github.com/ember-template-lint/ember-template-lint/pull/932) Move main linter engine to stand alone file. ([@dcyriller](https://github.com/dcyriller))

#### Committers: 1
- Cyrille David ([@dcyriller](https://github.com/dcyriller))

## v2.0.0-beta.2 (2019-11-17)

#### :boom: Breaking Change
* [#918](https://github.com/ember-template-lint/ember-template-lint/pull/918) Use `.editorconfig` to choose default value for `block-indentation` ([@lifeart](https://github.com/lifeart))
* [#919](https://github.com/ember-template-lint/ember-template-lint/pull/919) Use `.editorconfig` to choose default value for `linebreak-style` ([@lifeart](https://github.com/lifeart))

#### :rocket: Enhancement
* [#918](https://github.com/ember-template-lint/ember-template-lint/pull/918) Use `.editorconfig` to choose default value for `block-indentation` ([@lifeart](https://github.com/lifeart))
* [#919](https://github.com/ember-template-lint/ember-template-lint/pull/919) Use `.editorconfig` to choose default value for `linebreak-style` ([@lifeart](https://github.com/lifeart))
* [#906](https://github.com/ember-template-lint/ember-template-lint/pull/906) Add utility function to allow reading from `.editorconfig` ([@lifeart](https://github.com/lifeart))

#### :bug: Bug Fix
* [#920](https://github.com/ember-template-lint/ember-template-lint/pull/920) Ensure `no-bare-strings` consider literals in mustaches (e.g. `{{"foo"}}`) ([@lifeart](https://github.com/lifeart))
* [#923](https://github.com/ember-template-lint/ember-template-lint/pull/923) Allow `getLocalName` to work with number literals ([@alexlafroscia](https://github.com/alexlafroscia))
* [#913](https://github.com/ember-template-lint/ember-template-lint/pull/913) Update `no-unnecessary-component-helper` rule to allow the `component` helper as an angle bracket component argument ([@buschtoens](https://github.com/buschtoens))
* [#908](https://github.com/ember-template-lint/ember-template-lint/pull/908) Update `no-bare-strings` to ignore contents within elements that are not translated (e.g. `<script>`,`<style>`, and `<pre>`). ([@lifeart](https://github.com/lifeart))
* [#905](https://github.com/ember-template-lint/ember-template-lint/pull/905) Ensure configuration ordering does not matter with `no-bare-strings` ([@lifeart](https://github.com/lifeart))
* [#904](https://github.com/ember-template-lint/ember-template-lint/pull/904) Update `block-indentation` to ignore children of `<template>` and `<textarea>` ([@lifeart](https://github.com/lifeart))

#### :memo: Documentation
* [#911](https://github.com/ember-template-lint/ember-template-lint/pull/911) Update documentation for `require-valid-alt-text` to clarify that `logo` and `spacer` are forbidden words ([@gojefferson](https://github.com/gojefferson))

#### :house: Internal
* [#876](https://github.com/ember-template-lint/ember-template-lint/pull/876) Begin migrating tests to inline fixtures (via `broccoli-test-helper`) ([@lifeart](https://github.com/lifeart))

#### Committers: 5
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Alex LaFroscia ([@alexlafroscia](https://github.com/alexlafroscia))
- Jan Buschtöns ([@buschtoens](https://github.com/buschtoens))
- Jeff Kerr ([@gojefferson](https://github.com/gojefferson))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v2.0.0-beta.1 (2019-11-04)

#### :boom: Breaking Change
* [#899](https://github.com/ember-template-lint/ember-template-lint/pull/899) Update recommended config ([@rwjblue](https://github.com/rwjblue))
* [#844](https://github.com/ember-template-lint/ember-template-lint/pull/844) Remove HTML comment config ([@initram](https://github.com/initram))
* [#885](https://github.com/ember-template-lint/ember-template-lint/pull/885) Drop support for NodeJs v6 and v11 ([@dcyriller](https://github.com/dcyriller))

#### :rocket: Enhancement
* [#873](https://github.com/ember-template-lint/ember-template-lint/pull/873) Leverage ember-template-recast ([@dcyriller](https://github.com/dcyriller))

#### :house: Internal
* [#898](https://github.com/ember-template-lint/ember-template-lint/pull/898) Update dependencies to latest (requiring Node 8+). ([@rwjblue](https://github.com/rwjblue))

#### Committers: 3
- Cyrille David ([@dcyriller](https://github.com/dcyriller))
- Martin Midtgaard ([@initram](https://github.com/initram))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))

## v1.12.3 (2019-12-23)

#### :bug: Bug Fix
* [#1032](https://github.com/ember-template-lint/ember-template-lint/pull/1032) no-curly-component-invocation: Ignore built-ins and fix nested key scoped variable scenario ([@Turbo87](https://github.com/Turbo87))
* [#1031](https://github.com/ember-template-lint/ember-template-lint/pull/1031) no-passed-in-event-handlers: Ignore built-in `input` and `textarea` components ([@Turbo87](https://github.com/Turbo87))

#### Committers: 1
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))

## v1.12.2 (2019-12-23)

#### :bug: Bug Fix
* [#1027](https://github.com/ember-template-lint/ember-template-lint/pull/1027) Refactor `no-curly-component-invocation` to reduce the occurrences of false positives ([@Turbo87](https://github.com/Turbo87))
* [#1019](https://github.com/ember-template-lint/ember-template-lint/pull/1019) Adding error when individual pending rules are passing ([@gmurphey](https://github.com/gmurphey))
* [#954](https://github.com/ember-template-lint/ember-template-lint/pull/954) Update `--print-pending` logic to ignore existing pending modules that have no linting errors ([@gmurphey](https://github.com/gmurphey))

#### :memo: Documentation
* [#1016](https://github.com/ember-template-lint/ember-template-lint/pull/1016) Correct name of class ([@kategengler](https://github.com/kategengler))

#### :house: Internal
* [#1011](https://github.com/ember-template-lint/ember-template-lint/pull/1011) Add test cases for `{{!-- template-lint-disable --}}` comments ([@Turbo87](https://github.com/Turbo87))

#### Committers: 4
- Garrett Murphey ([@gmurphey](https://github.com/gmurphey))
- Katie Gengler ([@kategengler](https://github.com/kategengler))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v1.12.1 (2019-12-13)

#### :bug: Bug Fix
* [#1013](https://github.com/ember-template-lint/ember-template-lint/pull/1013) Fix missing `Linter.errorsToMessages()` API for ember-cli-template-lint ([@Turbo87](https://github.com/Turbo87))

#### Committers: 1
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))

## v1.12.0 (2019-12-13)

#### :rocket: Enhancement
* [#1010](https://github.com/ember-template-lint/ember-template-lint/pull/1010) Add `no-yield-only` rule ([@Turbo87](https://github.com/Turbo87))
* [#1001](https://github.com/ember-template-lint/ember-template-lint/pull/1001) Show "Definition for rule XXX was not found" error message ([@Turbo87](https://github.com/Turbo87))

#### :bug: Bug Fix
* [#1009](https://github.com/ember-template-lint/ember-template-lint/pull/1009) Ensure `require-valid-alt-text` does not flag `<img ...attributes>`. ([@rwjblue](https://github.com/rwjblue))
* [#1006](https://github.com/ember-template-lint/ember-template-lint/pull/1006) no-curly-component-invocation: Ignore *all* curly invocations with positional arguments ([@Turbo87](https://github.com/Turbo87))
* [#1005](https://github.com/ember-template-lint/ember-template-lint/pull/1005) no-curly-component-invocation: Ignore block invocations with inverse blocks ([@Turbo87](https://github.com/Turbo87))
* [#1002](https://github.com/ember-template-lint/ember-template-lint/pull/1002) no-whitespace-for-layout: Ignore whitespace at the start and end of the line ([@Turbo87](https://github.com/Turbo87))

#### :memo: Documentation
* [#977](https://github.com/ember-template-lint/ember-template-lint/pull/977) Update `README.md` to include a reference to our Semantic Versioning policy ([@MelSumner](https://github.com/MelSumner))
* [#1000](https://github.com/ember-template-lint/ember-template-lint/pull/1000) package.json: Fix repository URLs ([@Turbo87](https://github.com/Turbo87))
* [#999](https://github.com/ember-template-lint/ember-template-lint/pull/999) Fix Changelog ([@Turbo87](https://github.com/Turbo87))

#### :house: Internal
* [#1008](https://github.com/ember-template-lint/ember-template-lint/pull/1008) Extract `Printer` classes ([@Turbo87](https://github.com/Turbo87))
* [#1007](https://github.com/ember-template-lint/ember-template-lint/pull/1007) Extract `FakeConsole` class to simplify testing code ([@Turbo87](https://github.com/Turbo87))

#### Committers: 3
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))

## v1.11.1 (2019-12-12)

#### :bug: Bug Fix
* [#998](https://github.com/ember-template-lint/ember-template-lint/pull/998) Ensure `no-invalid-meta` does not error on non-meta elements. ([@rwjblue](https://github.com/rwjblue))

#### :house: Internal
* [#994](https://github.com/ember-template-lint/ember-template-lint/pull/994) Use `Template` and `Block` nodes instead of `Program` fallback ([@Turbo87](https://github.com/Turbo87))

#### Committers: 2
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))

## v1.11.0 (2019-12-12)

#### :rocket: Enhancement
* [#997](https://github.com/ember-template-lint/ember-template-lint/pull/997) Add `require-button-type` to octane configuration ([@rwjblue](https://github.com/rwjblue))
* [#996](https://github.com/ember-template-lint/ember-template-lint/pull/996) Add `no-invalid-link-text` and `no-invalid-meta` to octane configuration. ([@MelSumner](https://github.com/MelSumner))
* [#988](https://github.com/ember-template-lint/ember-template-lint/pull/988) Add rule `no-invalid-link-text` ([@MelSumner](https://github.com/MelSumner))
* [#910](https://github.com/ember-template-lint/ember-template-lint/pull/910) Add `no-invalid-meta` rule ([@MelSumner](https://github.com/MelSumner))

#### Committers: 2
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))

## v1.10.0 (2019-12-07)

#### :rocket: Enhancement
* [#966](https://github.com/ember-template-lint/ember-template-lint/pull/966) Report errors as GitHub Actions Annotations ([@Turbo87](https://github.com/Turbo87))
* [#930](https://github.com/ember-template-lint/ember-template-lint/pull/930) Updated `require-valid-alt-text` to ensure `<img ... role="presentation">` or `<img ... role="none">` **must** have an empty `alt` attribute ([@MelSumner](https://github.com/MelSumner))
* [#980](https://github.com/ember-template-lint/ember-template-lint/pull/980) Add `no-invalid-role` rule ([@MelSumner](https://github.com/MelSumner))

#### :bug: Bug Fix
* [#986](https://github.com/ember-template-lint/ember-template-lint/pull/986) no-multiple-empty-lines: Fix `parseConfig()` implementation ([@Turbo87](https://github.com/Turbo87))

#### :house: Internal
* [#979](https://github.com/ember-template-lint/ember-template-lint/pull/979) Update `.npmignore` file ([@Turbo87](https://github.com/Turbo87))

#### Committers: 2
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))


## v1.9.0 (2019-12-04)

#### :rocket: Enhancement
* [#971](https://github.com/ember-template-lint/ember-template-lint/pull/971) no-curly-component-invocation: Do not warn for MustacheStatements with positional arguments ([@Turbo87](https://github.com/Turbo87))
* [#964](https://github.com/ember-template-lint/ember-template-lint/pull/964) Implement `no-passed-in-event-handlers` rule ([@Turbo87](https://github.com/Turbo87))
* [#950](https://github.com/ember-template-lint/ember-template-lint/pull/950) Implement `require-button-type` rule ([@Turbo87](https://github.com/Turbo87))
* [#951](https://github.com/ember-template-lint/ember-template-lint/pull/951) Implement `no-multiple-empty-lines` rule ([@Turbo87](https://github.com/Turbo87))

#### :bug: Bug Fix
* [#944](https://github.com/ember-template-lint/ember-template-lint/pull/944) Fix `no-invalid-interactive` to allow `{{on "load"...}}` and `{{on "error"...}}` for `<img>` ([@lifeart](https://github.com/lifeart))

#### :house: Internal
* [#972](https://github.com/ember-template-lint/ember-template-lint/pull/972) Replace `chai` with Jest assertions ([@Turbo87](https://github.com/Turbo87))
* [#973](https://github.com/ember-template-lint/ember-template-lint/pull/973) Remove TravisCI configuration file ([@Turbo87](https://github.com/Turbo87))
* [#952](https://github.com/ember-template-lint/ember-template-lint/pull/952) Add GitHub Actions CI workflow ([@Turbo87](https://github.com/Turbo87))
* [#968](https://github.com/ember-template-lint/ember-template-lint/pull/968) Replace Mocha with Jest ([@Turbo87](https://github.com/Turbo87))
* [#970](https://github.com/ember-template-lint/ember-template-lint/pull/970) Remove unused `mocha-only-detector` dev dependency ([@Turbo87](https://github.com/Turbo87))
* [#959](https://github.com/ember-template-lint/ember-template-lint/pull/959) Add validation that all files in `lib/config/` have been reexported in `lib/config/index.js` ([@lifeart](https://github.com/lifeart))
* [#967](https://github.com/ember-template-lint/ember-template-lint/pull/967) test/bin: Use `execa` to run CLI for tests ([@Turbo87](https://github.com/Turbo87))
* [#965](https://github.com/ember-template-lint/ember-template-lint/pull/965) Improve ESLint setup ([@Turbo87](https://github.com/Turbo87))
* [#963](https://github.com/ember-template-lint/ember-template-lint/pull/963) Update lockfile ([@Turbo87](https://github.com/Turbo87))
* [#957](https://github.com/ember-template-lint/ember-template-lint/pull/957) removed the `lint-` prefix and updated related files so tests pass ([@MelSumner](https://github.com/MelSumner))
* [#947](https://github.com/ember-template-lint/ember-template-lint/pull/947) Add tests confirming extending multiple configs works properly. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 4
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))

## v1.8.2 (2019-11-17)

#### :bug: Bug Fix
* [#920](https://github.com/ember-template-lint/ember-template-lint/pull/920) Ensure `no-bare-strings` consider literals in mustaches (e.g. `{{"foo"}}`) ([@lifeart](https://github.com/lifeart))
* [#923](https://github.com/ember-template-lint/ember-template-lint/pull/923) Allow `getLocalName` to work with number literals ([@alexlafroscia](https://github.com/alexlafroscia))
* [#913](https://github.com/ember-template-lint/ember-template-lint/pull/913) Update `no-unnecessary-component-helper` rule to allow the `component` helper as an angle bracket component argument ([@buschtoens](https://github.com/buschtoens))
* [#908](https://github.com/ember-template-lint/ember-template-lint/pull/908) Update `no-bare-strings` to ignore contents within elements that are not translated (e.g. `<script>`,`<style>`, and `<pre>`). ([@lifeart](https://github.com/lifeart))
* [#905](https://github.com/ember-template-lint/ember-template-lint/pull/905) Ensure configuration ordering does not matter with `no-bare-strings` ([@lifeart](https://github.com/lifeart))
* [#904](https://github.com/ember-template-lint/ember-template-lint/pull/904) Update `block-indentation` to ignore children of `<template>` and `<textarea>` ([@lifeart](https://github.com/lifeart))

#### :memo: Documentation
* [#911](https://github.com/ember-template-lint/ember-template-lint/pull/911) Update documentation for `require-valid-alt-text` to clarify that `logo` and `spacer` are forbidden words ([@gojefferson](https://github.com/gojefferson))

#### Committers: 5
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Alex LaFroscia ([@alexlafroscia](https://github.com/alexlafroscia))
- Jan Buschtöns ([@buschtoens](https://github.com/buschtoens))
- Jeff Kerr ([@gojefferson](https://github.com/gojefferson))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v1.8.1 (2019-11-04)

#### :bug: Bug Fix
* [#902](https://github.com/ember-template-lint/ember-template-lint/pull/902) Do not validate indentation within `<pre>`,`<script>`, or `<style>`. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))

## v1.8.0 (2019-11-04)

#### :rocket: Enhancement
* [#850](https://github.com/ember-template-lint/ember-template-lint/pull/850) Changed parser mode to 'codemod' ([@initram](https://github.com/initram))
* [#893](https://github.com/ember-template-lint/ember-template-lint/pull/893) Add `no-args-paths` to the `octane` preset ([@lifeart](https://github.com/lifeart))
* [#865](https://github.com/ember-template-lint/ember-template-lint/pull/865) Add new `no-args-paths` rule. ([@lifeart](https://github.com/lifeart))

#### :bug: Bug Fix
* [#884](https://github.com/ember-template-lint/ember-template-lint/pull/884) Fix `no-curly-component-invocation` to not warn about invocations within an existing angle bracket invocation ([@lifeart](https://github.com/lifeart))
* [#870](https://github.com/ember-template-lint/ember-template-lint/pull/870) Fix issue preventing running a subset of rules ([@lifeart](https://github.com/lifeart))

#### :house: Internal
* [#896](https://github.com/ember-template-lint/ember-template-lint/pull/896) Pass `moduleName` and `rawSource` to `Rule` upon creation. ([@rwjblue](https://github.com/rwjblue))
* [#892](https://github.com/ember-template-lint/ember-template-lint/pull/892) Remove reliance on `preprocess` (from `@glimmer/syntax`) ability to accept an array of AST plugins ([@rwjblue](https://github.com/rwjblue))
* [#890](https://github.com/ember-template-lint/ember-template-lint/pull/890) Remove TransformDotComponentInvocation. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 4
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Martin Midtgaard ([@initram](https://github.com/initram))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))

## v1.7.0 (2019-10-31)

#### :rocket: Enhancement
* [#848](https://github.com/ember-template-lint/ember-template-lint/pull/848) Add `no-whitespace-within-word` rule ([@MelSumner](https://github.com/MelSumner))
* [#868](https://github.com/ember-template-lint/ember-template-lint/pull/868) Add `no-meta-redirect-with-time-limit` rule ([@MelSumner](https://github.com/MelSumner))
* [#819](https://github.com/ember-template-lint/ember-template-lint/pull/819) Added `no-whitespace-for-layout` rule ([@MelSumner](https://github.com/MelSumner))

#### Committers: 2
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v1.6.2 (2019-10-30)

#### :bug: Bug Fix
* [#887](https://github.com/ember-template-lint/ember-template-lint/pull/887) Ensure `no-action` does not error when encountering literals (StringLiteral, BooleanLiteral, etc). ([@lifeart](https://github.com/lifeart))
* [#882](https://github.com/ember-template-lint/ember-template-lint/pull/882) Fix issues when converting dasherized curly component invocation into angle bracket invocation ([@suchitadoshi1987](https://github.com/suchitadoshi1987))

#### :memo: Documentation
* [#877](https://github.com/ember-template-lint/ember-template-lint/pull/877) Document requirement on Node.js >= 6 ([@bmish](https://github.com/bmish))

#### Committers: 3
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Suchita Doshi ([@suchitadoshi1987](https://github.com/suchitadoshi1987))

## v1.6.1 (2019-10-28)

#### :bug: Bug Fix
* [#864](https://github.com/ember-template-lint/ember-template-lint/pull/864) Update `no-invalid-interactive` to check for `on` modifier (in addition to `action`). ([@lifeart](https://github.com/lifeart))

#### :house: Internal
* [#874](https://github.com/ember-template-lint/ember-template-lint/pull/874) test-harness: Make it available for (external) plugins ([@dcyriller](https://github.com/dcyriller))

#### Committers: 2
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Cyrille David ([@dcyriller](https://github.com/dcyriller))

## v1.6.0 (2019-10-22)

#### :rocket: Enhancement
* [#862](https://github.com/ember-template-lint/ember-template-lint/pull/862) ✨Add option --print-pending from ember-cli-template-lint ([@TristanToye](https://github.com/TristanToye))
* [#858](https://github.com/ember-template-lint/ember-template-lint/pull/858) Add `no-action` to `octane` preset configuration. ([@rwjblue](https://github.com/rwjblue))
* [#853](https://github.com/ember-template-lint/ember-template-lint/pull/853) Add `no-action` rule ([@lifeart](https://github.com/lifeart))
* [#783](https://github.com/ember-template-lint/ember-template-lint/pull/783) Add support for reading a file to lint from `process.stdin` (e.g `cat some-file.hbs | ember-template-lint`) ([@sukima](https://github.com/sukima))

#### :bug: Bug Fix
* [#861](https://github.com/ember-template-lint/ember-template-lint/pull/861) Update `no-curly-component-invocation` to allow non-component yielded values to be used with mustaches ([@patocallaghan](https://github.com/patocallaghan))
* [#849](https://github.com/ember-template-lint/ember-template-lint/pull/849) Improve `require-valid-alt-text` rule to catch additional common failure scenarios ([@MelSumner](https://github.com/MelSumner))
* [#846](https://github.com/ember-template-lint/ember-template-lint/pull/846) Update `table-groups` to enforce required ordering of table children ([@initram](https://github.com/initram))
* [#845](https://github.com/ember-template-lint/ember-template-lint/pull/845) Fixed `attribute-indentation` when using triple curlies (non-escaped `MustacheStatement`) ([@initram](https://github.com/initram))
* [#836](https://github.com/ember-template-lint/ember-template-lint/pull/836) Expose internal errors from erroneous config when consuming it ([@ygongdev](https://github.com/ygongdev))

#### :house: Internal
* [#859](https://github.com/ember-template-lint/ember-template-lint/pull/859) Remove `testem` setup. ([@rwjblue](https://github.com/rwjblue))
* [#856](https://github.com/ember-template-lint/ember-template-lint/pull/856) Use @glimmer/syntax directly. ([@rwjblue](https://github.com/rwjblue))
* [#843](https://github.com/ember-template-lint/ember-template-lint/pull/843) Test interactivity of onload for img tags ([@joankaradimov](https://github.com/joankaradimov))
* [#832](https://github.com/ember-template-lint/ember-template-lint/pull/832) Add eslint-plugin-import and enable most rules internally ([@bmish](https://github.com/bmish))
* [#830](https://github.com/ember-template-lint/ember-template-lint/pull/830) Enable optional eslint rules internally ([@bmish](https://github.com/bmish))
* [#829](https://github.com/ember-template-lint/ember-template-lint/pull/829) Add eslint-plugin-eslint-comments internally ([@bmish](https://github.com/bmish))
* [#828](https://github.com/ember-template-lint/ember-template-lint/pull/828) Add eslint-plugin-filenames to enforce kebab-case filenames internally ([@bmish](https://github.com/bmish))
* [#827](https://github.com/ember-template-lint/ember-template-lint/pull/827) Add CI check to ensure yarn.lock is up-to-date ([@bmish](https://github.com/bmish))
* [#826](https://github.com/ember-template-lint/ember-template-lint/pull/826) Start testing with Node 12 ([@bmish](https://github.com/bmish))

#### Committers: 11
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Devin Weaver ([@sukima](https://github.com/sukima))
- Joan Karadimov ([@joankaradimov](https://github.com/joankaradimov))
- Martin Midtgaard ([@initram](https://github.com/initram))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Pat O'Callaghan ([@patocallaghan](https://github.com/patocallaghan))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Tristan Toye ([@TristanToye](https://github.com/TristanToye))
- Yicheng (Jerry) Gong ([@ygongdev](https://github.com/ygongdev))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v1.5.3 (2019-08-20)

#### :bug: Bug Fix
* [#805](https://github.com/ember-template-lint/ember-template-lint/pull/805) Update `no-action-modifiers` and `no-element-event-actions` rules to suggest using the `on` modifier ([@bmish](https://github.com/bmish))
* [#803](https://github.com/ember-template-lint/ember-template-lint/pull/803) Add 'octane' config to export list so it can be used in `.template-lintrc.js` ([@pgengler](https://github.com/pgengler))

#### Committers: 3
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Phil Gengler ([@pgengler](https://github.com/pgengler))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v1.5.2 (2019-08-12)

#### :bug: Bug Fix
* [#801](https://github.com/ember-template-lint/ember-template-lint/pull/801) Don't require `alt` on `<img ...attributes>` ([@chancancode](https://github.com/chancancode))

#### :house: Internal
* [#798](https://github.com/ember-template-lint/ember-template-lint/pull/798) Ensure that fundamental setup (docs, tests, exports, etc) is correct when adding new rules ([@lifeart](https://github.com/lifeart))

#### Committers: 2
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Godfrey Chan ([@chancancode](https://github.com/chancancode))

## v1.5.1 (2019-08-06)

#### :rocket: Enhancement
* [#790](https://github.com/ember-template-lint/ember-template-lint/pull/790) Add "octane" configuration preset. ([@rwjblue](https://github.com/rwjblue))

#### :bug: Bug Fix
* [#796](https://github.com/ember-template-lint/ember-template-lint/pull/796) Allow `{{#-in-element}}` and `{{#in-element}}` for `no-curly-component-invocation` rule ([@mydea](https://github.com/mydea))
* [#791](https://github.com/ember-template-lint/ember-template-lint/pull/791) Ensure table-group rule allows `each`, `each-in`, `let`, and comments ([@mongoose700](https://github.com/mongoose700))

#### Committers: 4
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Francesco Novy ([@mydea](https://github.com/mydea))
- Michael Peirce ([@mongoose700](https://github.com/mongoose700))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))

## v1.5.0 (2019-07-31)

#### :rocket: Enhancement
* [#768](https://github.com/ember-template-lint/ember-template-lint/pull/768) Add no-curly-component-invocation rule ([@patocallaghan](https://github.com/patocallaghan))

#### :bug: Bug Fix
* [#788](https://github.com/ember-template-lint/ember-template-lint/pull/788) Add support for handling `<button tabindex={{if this.foo 0 -1}}><button>` to no-positive-tabindex rule ([@lifeart](https://github.com/lifeart))
* [#779](https://github.com/ember-template-lint/ember-template-lint/pull/779) Allow <img onload={{action 'foo'}}> in no-invalid-interactive rule ([@joankaradimov](https://github.com/joankaradimov))
* [#762](https://github.com/ember-template-lint/ember-template-lint/pull/762) Ensure no-outlet-outside-routes allows apps or routes named "components" ([@marcoow](https://github.com/marcoow))

#### :memo: Documentation
* [#775](https://github.com/ember-template-lint/ember-template-lint/pull/775) Add rule documentation to missing rule to docs/rules.md. ([@bmish](https://github.com/bmish))

#### Committers: 5
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Joan Karadimov ([@joankaradimov](https://github.com/joankaradimov))
- Marco Otte-Witte ([@marcoow](https://github.com/marcoow))
- Pat O'Callaghan ([@patocallaghan](https://github.com/patocallaghan))

## v1.4.0 (2019-07-12)

#### :rocket: Enhancement
* [#759](https://github.com/ember-template-lint/ember-template-lint/pull/759) Deprecate `img-alt-attributes` rule in favor of `require-valid-alt-text` ([@bmish](https://github.com/bmish))
* [#753](https://github.com/ember-template-lint/ember-template-lint/pull/753) Add `no-unnecessary-component-helper` rule ([@bmish](https://github.com/bmish))
* [#518](https://github.com/ember-template-lint/ember-template-lint/pull/518) Add blacklist support to simple-unless rule ([@mattbalmer](https://github.com/mattbalmer))

#### :bug: Bug Fix
* [#772](https://github.com/ember-template-lint/ember-template-lint/pull/772) Fix `no-element-event-actions` rule to ignore case when checking the DOM event attribute name (should handle either `onclick` or `ONCLICK`) ([@bmish](https://github.com/bmish))
* [#773](https://github.com/ember-template-lint/ember-template-lint/pull/773) Fix `no-invalid-interactive` rule to consider any DOM event attribute usage as adding interactivity to an element ([@bmish](https://github.com/bmish))

#### Committers: 3
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Matt Balmer ([@mattbalmer](https://github.com/mattbalmer))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v1.3.0 (2019-06-19)

#### :rocket: Enhancement
* [#742](https://github.com/ember-template-lint/ember-template-lint/pull/742) Update `table-groups` rule to allow `{{#some-component tagName="tbody"}}{{/some-component}}` to be a child of `table` ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#750](https://github.com/ember-template-lint/ember-template-lint/pull/750) Ensure custom rules can be disabled with inline comments. ([@rwjblue](https://github.com/rwjblue))

#### :memo: Documentation
* [#744](https://github.com/ember-template-lint/ember-template-lint/pull/744) Tweak error message for `no-element-event-actions` rule. ([@bmish](https://github.com/bmish))
* [#740](https://github.com/ember-template-lint/ember-template-lint/pull/740) Fix rule ordering and incorrect rule name in plugin documentation ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#738](https://github.com/ember-template-lint/ember-template-lint/pull/738) Add support for new node types to the AST ([@CvX](https://github.com/CvX))

#### Committers: 4
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Jarek Radosz ([@CvX](https://github.com/CvX))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v1.2.0 (2019-06-12)

#### :rocket: Enhancement
* [#733](https://github.com/ember-template-lint/ember-template-lint/pull/733) Add new rule: `no-obsolete-elements` ([@MelSumner](https://github.com/MelSumner))
* [#714](https://github.com/ember-template-lint/ember-template-lint/pull/714) Expose rule test harness for use by custom rule authors. ([@gabrielcsapo](https://github.com/gabrielcsapo))
* [#631](https://github.com/ember-template-lint/ember-template-lint/pull/631) Add rule: [A11y] `require-iframe-title` ([@lifeart](https://github.com/lifeart))
* [#681](https://github.com/ember-template-lint/ember-template-lint/pull/681) Update `table-groups` rule to allow `{{yield}}` inside `<table>` ([@sohara](https://github.com/sohara))
* [#633](https://github.com/ember-template-lint/ember-template-lint/pull/633) Add rule: [A11y] `no-positive-tabindex` ([@lifeart](https://github.com/lifeart))
* [#624](https://github.com/ember-template-lint/ember-template-lint/pull/624) Add rule: [A11y]`require-valid-alt-text` ([@lifeart](https://github.com/lifeart))
* [#628](https://github.com/ember-template-lint/ember-template-lint/pull/628) Add rule: [A11y] `no-abstract-roles` ([@lifeart](https://github.com/lifeart))
* [#721](https://github.com/ember-template-lint/ember-template-lint/pull/721) Allow `{{some-component tagName="tbody"}}` to be a child of a `table` ([@raycohen](https://github.com/raycohen))
* [#672](https://github.com/ember-template-lint/ember-template-lint/pull/672) Add `allowDynamicStyles` option to `no-inline-styles` lint rule ([@bmish](https://github.com/bmish))
* [#638](https://github.com/ember-template-lint/ember-template-lint/pull/638) Update `table-groups` rule to allow comments inside `<table>` ([@lifeart](https://github.com/lifeart))
* [#614](https://github.com/ember-template-lint/ember-template-lint/pull/614) Add rule: `no-element-event-actions` ([@bmish](https://github.com/bmish))

#### :bug: Bug Fix
* [#737](https://github.com/ember-template-lint/ember-template-lint/pull/737) Allow `onerror` for `img` elements in `no-invalid-interactive` rule ([@elidupuis](https://github.com/elidupuis))
* [#730](https://github.com/ember-template-lint/ember-template-lint/pull/730) Ensure console output is completed before exiting `ember-template-lint` executable ([@john-kurkowski](https://github.com/john-kurkowski))
* [#709](https://github.com/ember-template-lint/ember-template-lint/pull/709) Update `@glimmer/compiler` to avoid errors when forwarding element modifiers to component invocations ([@dmzza](https://github.com/dmzza))
* [#639](https://github.com/ember-template-lint/ember-template-lint/pull/639) Fix `no-bare-strings` to allow whitelisting empty string ([@lifeart](https://github.com/lifeart))
* [#618](https://github.com/ember-template-lint/ember-template-lint/pull/618) Allow `{{else}} {{#unless ...}}` in the `simple-unless` and `no-negated-condition` rules ([@bmish](https://github.com/bmish))
* [#613](https://github.com/ember-template-lint/ember-template-lint/pull/613) Avoid suggesting `unless` with helpers in condition in `no-negated-condition` rule ([@bmish](https://github.com/bmish))

#### :memo: Documentation
* [#678](https://github.com/ember-template-lint/ember-template-lint/pull/678) Add documentation on how to ignore modules when using ember-template-lint and ember-cli-template-lint together ([@DingoEatingFuzz](https://github.com/DingoEatingFuzz))
* [#695](https://github.com/ember-template-lint/ember-template-lint/pull/695) Fixed 404 URL in `sourceForNode` comment ([@kevinansfield](https://github.com/kevinansfield))
* [#686](https://github.com/ember-template-lint/ember-template-lint/pull/686) Fix link to spec in `self-closing-void-elements` documentation ([@woprandi](https://github.com/woprandi))
* [#675](https://github.com/ember-template-lint/ember-template-lint/pull/675) Add allowed example to `no-bare-strings` rule documentation ([@bmish](https://github.com/bmish))
* [#671](https://github.com/ember-template-lint/ember-template-lint/pull/671) Add command for generating pending list to README ([@TristanToye](https://github.com/TristanToye))
* [#670](https://github.com/ember-template-lint/ember-template-lint/pull/670) Fix a typo in the `style-concatenation` rule documentation ([@dmzza](https://github.com/dmzza))
* [#652](https://github.com/ember-template-lint/ember-template-lint/pull/652) Update documentation to show `no-element-event-actions` and `no-action-modifiers` as related rules ([@keanedawg](https://github.com/keanedawg))
* [#641](https://github.com/ember-template-lint/ember-template-lint/pull/641) Add template for writing documentation for new rules ([@bmish](https://github.com/bmish))

#### :house: Internal
* [#627](https://github.com/ember-template-lint/ember-template-lint/pull/627) Add `-test` suffix to some test files that were not running in CI ([@bmish](https://github.com/bmish))

#### Committers: 16
- Alex Kanunnikov ([@lifeart](https://github.com/lifeart))
- Bryan Mishkin ([@bmish](https://github.com/bmish))
- Cameron Fife ([@keanedawg](https://github.com/keanedawg))
- David Mazza ([@dmzza](https://github.com/dmzza))
- Eli Dupuis ([@elidupuis](https://github.com/elidupuis))
- Gabriel Csapo ([@gabrielcsapo](https://github.com/gabrielcsapo))
- John Kurkowski ([@john-kurkowski](https://github.com/john-kurkowski))
- Kevin Ansfield ([@kevinansfield](https://github.com/kevinansfield))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- Michael Lange ([@DingoEatingFuzz](https://github.com/DingoEatingFuzz))
- Ray Cohen ([@raycohen](https://github.com/raycohen))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Sean O'Hara ([@sohara](https://github.com/sohara))
- Tristan Toye ([@TristanToye](https://github.com/TristanToye))
- William Oprandi ([@woprandi](https://github.com/woprandi))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

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
- Update `invocation-blacklist` rule to accommodate angle bracket invocation.
- Update `no-unused-block-param` rule to accommodate angle bracket invocation.
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

- add whitelist to simple-unless [#356](https://github.com/ember-template-lint/ember-template-lint/pull/356)
- add no-partial rule [#369](https://github.com/ember-template-lint/ember-template-lint/pull/369)
- unused-block-params: Disable rule when partial is used in scope [#368](https://github.com/ember-template-lint/ember-template-lint/pull/368)
- Remove unused `lodash` dependency [#367](https://github.com/ember-template-lint/ember-template-lint/pull/367)
- add no-unnecessary-concat rule [#365](https://github.com/ember-template-lint/ember-template-lint/pull/365)
- update @glimmer/compiler to version 0.32.3 [#362](https://github.com/ember-template-lint/ember-template-lint/pull/362)
- Remove explicit `@glimmer/syntax` dependency [#363](https://github.com/ember-template-lint/ember-template-lint/pull/363)
- add no-outlet-outside-routes rule [#359](https://github.com/ember-template-lint/ember-template-lint/pull/359)
- add no-input-block and no-input-tagname rules [#361](https://github.com/ember-template-lint/ember-template-lint/pull/361)
- add no-unbound rule [#360](https://github.com/ember-template-lint/ember-template-lint/pull/360)
- fix attribute-indentation) [#358](https://github.com/ember-template-lint/ember-template-lint/pull/358)
- fix eol-last [#344](https://github.com/ember-template-lint/ember-template-lint/pull/344)
- fix attribute-indentation [#334](https://github.com/ember-template-lint/ember-template-lint/pull/334)
- Allow form elements to have reset actions [#355](https://github.com/ember-template-lint/ember-template-lint/pull/355)
- No trailing dot(s) in a path expression [#342](https://github.com/ember-template-lint/ember-template-lint/pull/342)
- Allow sharing and extending configs [#322](https://github.com/ember-template-lint/ember-template-lint/pull/322)
- table-groups improvements [#335](https://github.com/ember-template-lint/ember-template-lint/pull/335)

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

You can read more about the rule [in the documentation](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/quotes.md).

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

You can read more about the rule [in the documentation](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-trailing-spaces.md).

- Add new `eol-last` rule. Examples:

Enforce either:

```hbs
<div>test</div>
```

or:

```hbs
<div>test</div>

```

You can read more about the rule [in the documentation](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/eol-last.md).

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

You can read more about the rule [in the documentation](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/table-groups.md).

## 0.8.7

- Ensure that the contents of else blocks (a.k.a. `inverse` blocks) are checked for indentation.

## 0.8.6

- Fix error in `simple-unless` rule when an `{{if` or `{{unless` block was empty.

## 0.8.5

- Add new `template-length` rule. When enabled, this rule restricts the total number of lines in a template file to the configured number. You can read more about the rule (and configuration) [in the documentation](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/template-length.md).

## 0.8.4

- Add new `attribute-indentation` rule.  Examples:

```hbs
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

```hbs
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

You can read more about the rule (and configuration) [in the documentation](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/attribute-indentation.md).


## 0.8.3

- Update @glimmer packages to 0.27.0.
- Update `block-indentation` rule to allow `{{#if foo}}stuff{{else}}stuff{{/if}}`.
- Fix error being thrown by `linebreak-style` rule when dynamic attributes were being used (e.g. `<img alt="example" src={{some/thing here}}>`).

## 0.8.2

- Add new rule `no-duplicate-attributes` to prevent duplicating the same attributes in a single mustache/block/element. Read the [documentation](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-duplicate-attributes.md) for more details.
- Add new rule `linkbreak-style` to ensure all templates use the same style of linebreaks throughout the template. Read the [documentation](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/linebreak-style.md) for more details.

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

- Add support for user supplied rules and configuration. Please review [the documentation](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/plugins.md) for more details.
- Add `ember-template-lint` command line script. This enable much easier running of the linter from the command line, editor plugins, etc. Supports `--json` flag to enable easier consumption by tools. See [documentation](https://github.com/ember-template-lint/ember-template-lint#cli-executable) for more details.
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
- Add configurable option to `link-rel-noopener` to require **both** `noopener` and `noreferrer`. See the [documentation](https://github.com/ember-template-lint/ember-template-lint#link-rel-noopener) for more details.
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
- Add `invalid-interactive` rule ([full documentation](https://github.com/ember-template-lint/ember-template-lint#invalid-interactive)).
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

- Add `img-alt-attributes` rule ([full documentation](https://github.com/ember-template-lint/ember-template-lint#img-alt-attributes)).
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

- Remove `bare-strings` from `recommended` configuration. See [#27](https://github.com/ember-template-lint/ember-template-lint/pull/27) for more details.

## v0.5.5

- Fix invalid rule name in `recommended` configuration.
- Add ability to mark files as `pending` in the `.template-lintrc.js` configuration file.  When a module is listed in the `pending` list, it will be checked but any errors detected will be marked as warnings (and will not trigger a failing test when using ember-cli-template-lint). If there are no errors detected when checking a pending file, a new error will be triggered. The goal of this process is to allow large existing projects begin utilizing `ember-template-lint` / `ember-cli-template-lint` and slowly fix their template files to comply with the rules here.  Feedback welcome on this idea/process...

## v0.5.4

- Move rule configuration into `rules` property inside `.template-lintrc.js`. Configuration in the root is still supported,
  but triggers a deprecation warning. Migration should be very straightforward.

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
