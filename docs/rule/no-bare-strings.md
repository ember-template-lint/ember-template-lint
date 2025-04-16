# no-bare-strings

In order to be able to internationalize your application, you will need to avoid using plain strings in your templates. Instead, you would need to use a template helper specializing in translation ([ember-intl](https://github.com/ember-intl/ember-intl) is the recommended project to use this for).

## Examples

This rule **forbids** the following:

``` html
<h2>Some string here!</h2>
```

This rule **allows** the following:

``` html
{{!-- ember-intl example  --}}
<h2>{{t 'photos.banner' numPhotos=model.photos.length}}</h2>
```

## Configuration

 The following values are valid configuration:

* boolean -- `true` for enabled / `false` for disabled
* array -- an array of allowlisted strings (extends the default config)
* object -- An object with the following keys:
  * `allowlist` -- An array of allowlisted strings (extends the default config)
  * `ignoredElements` -- An array of ignored strings (extends the default config)
  * `globalAttributes` -- An array of attributes to check on every element (extends the default config)
  * `elementAttributes` -- An object whose keys are tag names and value is an array of attributes to check for that tag name (extends the default config)

When the config value of `true` is provided, the following default configuration is used:

* `allowlist` - refer to the `DEFAULT_CONFIG.allowlist` property in the [rule](../../lib/rules/no-bare-strings.js)
* `ignoredElements` - refer to the `DEFAULT_CONFIG.ignoredElements` property in the [rule](../../lib/rules/no-bare-strings.js)
* `globalAttributes` - `title`, `aria-label`, `aria-placeholder`, `aria-roledescription`, `aria-valuetext`
* `elementAttributes` - `{ img: ['alt'], input: ['placeholder'] }`

## References

* [ECMA/i18n spec](https://tc39.es/ecma402)
* [ICU message syntax docs](https://formatjs.io/docs/core-concepts/icu-syntax/)
