## no-bare-strings

In order to be able to internationalize your application, you will need to avoid using plain strings in your templates. Instead, you would need to use a template helper specializing in translation ([ember-intl](https://github.com/ember-intl/ember-intl) is the recommended project to use this for).

This rule **forbids** the following:

``` html
<h2>Some string here!</h2>
```

### Configuration

 The following values are valid configuration:

   * boolean -- `true` for enabled / `false` for disabled
   * array -- an array of whitelisted strings
   * object -- An object with the following keys:
     * `whitelist` -- An array of whitelisted strings
       * Default: `['(', ')', ',', '.', '&', '+', '-', '=', '*', '/', '#', '%', '!', '?', ':', '[', ']', '{', '}', '<', '>', '•', '—', ' ', '|']`
     * `globalAttributes` -- An array of attributes to check on every element
       * Default: `['title', 'aria-label', 'aria-placeholder', 'aria-roledescription', 'aria-valuetext']`
     * `elementAttributes` -- An object whose keys are tag names and value is an array of attributes to check for that tag name
       * Default: `{ img: ['alt'], input: ['placeholder'] }`
