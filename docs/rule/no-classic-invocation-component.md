## Use angle bracket invocation for components

### Rule name: `no-classic-invocation-component`

There are two ways to invoke a component in a template: classic invocation syntax (`{{my-component}}`), and angle bracket invocation syntax (`<MyComponent />`). The difference between them is syntactical. You should favour angle bracket invocation syntax as it improves readability of templates, i.e. disambiguates components from helpers, and is also the future direction Ember is going with Glimmer components.

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
To be able to differentiate between components and helpers used within mustaches, e.g. `{{my-helper}}`, you can add a whitelist of all your known helpers to this rule's configuration. To do this add the following to your `.template-lintrc.js` which enables your rule.

```js
module.exports = {
  rules: {
    'no-classic-invocation-component': {
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