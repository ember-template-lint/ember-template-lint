## Use angle bracket syntax for components

### Rule name: `no-curly-component-invocation`

There are two ways to invoke a component in a template: curly compoment syntax (`{{my-component}}`), and angle bracket syntax (`<MyComponent />`). The difference between them is syntactical. You should favour angle bracket syntax as it improves readability of templates, i.e. disambiguates components from helpers, and is also the future direction Ember is going with Glimmer components.

#### Bad

```hbs
{{bad-code}}
{{#bad-code}}{{/bad-code}}
{{nested/bad-code}}
{{#nested/bad-code}}{{/nested/bad-code}}
```

#### Good

```hbs
<GoodCode />
<GoodCode></GoodCode>
<Nested::GoodCode />
<Nested::GoodCode></Nested::GoodCode>

{{! whitelisted helpers}}
{{some-valid-helper param}}
{{some/some-valid-helper param}}

{{! in-built helpers}}
{{if someProperty "yay"}}
{{#each items as |item|}}
  {{item}}
{{/each}}
```

### Whitelisting helpers
To be able to differentiate between components and helpers used within curlies, e.g. `{{my-helper}}`, you can add a whitelist of all your known helpers to this rule's configuration. To do this add the following to your `.template-lintrc.js` which enables your rule.

```js
module.exports = {
  rules: {
    'no-curly-component-invocation': {
        allow: [
        'some-random-helper',
        'another-helper',
      ],
    },
  },
};
```

To get a list of of all the helpers in your app run the following code in your browser's Developer Tools Console when your app has loaded:

``` js
var componentLikeHelpers = Object.keys(require.entries)
    .filter(name=>(name.includes('/helpers/')|| name.includes('/helper')))
    .filter(name=>!name.includes('/-')).map(name=>{
        let path = name.split('/helpers/');
        return path.pop();
    }).filter(name=>!name.includes('/')).uniq();

copy(JSON.stringify(componentLikeHelpers))
```

Hat tip to @lifeart for [this code](https://github.com/lifeart/ember-ast-hot-load#how-to-use-this-addon).

### Blacklisting components without dashes
Since Ember 3.8 components have not required dashes in their name, e.g. `{{datepicker}}`. To help the linter throw an error on these curly component invocations, which it would otherwise have thought to be a helper or property, you can explicitly add it to the `disallow` section of the rule's config. Any curly statements matching an entry in `disallow` will throw a lint error.

```js
module.exports = {
  rules: {
    'no-curly-component-invocation': {
        disallow: [
        'heading',
        'datepicker',
      ],
    },
  },
};
```