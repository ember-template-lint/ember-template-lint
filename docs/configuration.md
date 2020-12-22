# Configuration

## Project Wide

You can turn on specific rules by toggling them in a
`.template-lintrc.js` file at the base of your project, or at a custom relative
path which may be identified using the CLI:

```javascript
module.exports = {
  extends: 'recommended',

  rules: {
    'no-bare-strings': true,
  },
};
```

This extends from the builtin recommended configuration ([lib/config/recommended.js](lib/config/recommended.js)),
and also enables the `no-bare-strings` rule (see [here](docs/rule/no-bare-strings.md)).

Using this mechanism allows you to extend from the builtin, and modify specific rules as needed.

Some rules also allow setting additional configuration, for example if you would like to configure
some "bare strings" that are allowed you might have:

```javascript
module.exports = {
  rules: {
    'no-bare-strings': ['ZOMG THIS IS ALLOWED!!!!'],
  },
};
```

## Configuration Properties

The following properties are allowed in the root of the `.template-lintrc.js` configuration file:

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`rules`</td>
      <td>`Object`</td>
      <td>
        This is an object containing rule specific configuration (see details for each rule below).
      </td>
    </tr>
    <tr>
      <td>`extends`</td>
      <td>`string|string[]`</td>
      <td>
        Either a string or an array of strings. Each string allows you to specify an internally
        curated list of rules (we suggest `recommended` here).
      </td>
    </tr>
    <tr>
      <td>`pending`</td>
      <td>`string[]`</td>
      <td>
        An array of module id&#39;s that are still pending. The goal of this array is to allow
        incorporating template linting into an existing project without changing every single
        template file. You can add all existing templates to this `pending` listing and slowly work
        through them while at the same time ensuring that new templates added to the project pass
        all defined rules. You can generate this list with the: `ember-template-lint *
        --print-pending`.
      </td>
    </tr>
    <tr>
      <td>`ignore`</td>
      <td>`string[]|glob[]`</td>
      <td>
        An array of module id&#39;s that are to be completely ignored. See [ignore
        documentation](docs/ignore.md) for more details.
      </td>
    </tr>
    <tr>
      <td>`plugins`</td>
      <td>`(string|Object)[]`</td>
      <td>
        An array of plugin objects or strings that resolve to files that export plugin objects. See
        [plugin documentation](docs/plugins.md) for more details.
      </td>
    </tr>
    <tr>
      <td>`overrides`</td>
      <td>`Array`</td>
      <td>
        An array of overrides that would allow overriding of specific rules for user specified
        files/folders. See [overrides documentation](docs/overrides.md) for more details.
      </td>
    </tr>
  </tbody>
</table>                            |

## Severity Levels

Each rule can have its own severity level which can be a string or could be the first element of the array that contains the custom rule configuration.

Supported severity levels are:

- `off`
- `warn`
- `error`

You can define a severity level directly on the rule:

Eg: `'no-bare-strings': 'warn'`

OR

If your rule has a custom configuration, and you want to define the severity level you would need to add the `severity` as the first element of the array.

Eg:

```js
{
   "no-implicit-this": ['warn', { "allow": [ "fooData" ] }
}
```

## Per Template File

It is also possible to disable specific rules (or all rules) in a template itself:

```hbs
<!-- disable all rules -->
{{!-- template-lint-disable  --}}

<!-- disable no-bare-strings -->
{{!-- template-lint-disable no-bare-strings  --}}

<!-- disable no-bare-strings and no-triple-curlies -->
{{!-- template-lint-disable no-bare-strings no-triple-curlies  --}}

<!-- enable all rules -->
{{!-- template-lint-enable  --}}

<!-- enable no-bare-strings -->
{{!-- template-lint-enable no-bare-strings  --}}

<!-- enable no-bare-strings and no-triple-curlies -->
{{!-- template-lint-enable no-bare-strings no-triple-curlies  --}}
```

and to configure rules in the template:

```hbs
{{!-- template-lint-configure no-bare-strings ["ZOMG THIS IS ALLOWED!!!!"]  --}}

{{!-- template-lint-configure no-bare-strings {"allowlist": "(),.", "globalAttributes": ["title"]}  --}}

{{!-- template-lint-configure no-bare-strings ["warn", ["ZOMG THIS IS ALLOWED!!!!"]]  --}}

{{!-- template-lint-configure no-bare-strings "warn"  --}}

```

The configure instruction can only configure a single rule, and the configuration value must be valid JSON that parses into a configuration for that rule.

These configuration instructions do not modify the rule for the rest of the template, but instead modify it within whatever DOM scope the comment instruction appears.

An instruction will apply to all later siblings and their descendants:

```hbs
<!-- disable for <p> and <span> and their contents, but not for <div> or <hr> -->
<div>
  <hr>
  {{!-- template-lint-disable  --}}
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
  <p {{!-- template-lint-enable  --}}>
    <span>Hello!</span>
  </p>
</div>
```

An in-element instruction with the `-tree` suffix will apply to that element and all its descendants:

```hbs
<!-- configure for <p>, <span> and their contents, but not for <div> or <hr> -->
<div>
  <hr>
  <p {{!-- template-lint-configure-tree block-indentation "tab"  --}}>
    <span>Hello!</span>
  </p>
</div>
```

Note that enabling a rule (`{{!-- template-lint-enable --}}`) that has been configured in-template (`{{!-- template-lint-configure --}}`), will restore it to its default configuration rather than the modified in-template configuration for the scope of the `{{!-- template-lint-enable --}}` instruction.

## Defining your own rules

You can define and use your own custom rules using the plugin system. See [plugin documentation](docs/plugins.md) for more details.
