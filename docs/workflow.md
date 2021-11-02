# Workflow Examples

Basic usage with a single file

```bash
ember-template-lint "app/templates/application.hbs"
```

Output errors with source description

```bash
ember-template-lint "app/templates/application.hbs" --verbose
```

Multiple file/directory/wildcard paths are accepted

```bash
ember-template-lint "app/templates/components/**/*" "app/templates/application.hbs"
```

Output errors as pretty-printed JSON string

```bash
ember-template-lint "app/templates/application.hbs" --json
```

Ignore warnings / only report errors

```bash
ember-template-lint "app/templates/application.hbs" --quiet
```

Convert errors to TODOs in order to resolve at a later date

```bash
ember-template-lint . --update-todo
```

Number of warnings to trigger nonzero exit code

```bash
ember-template-lint "app/templates/application.hbs" --max-warnings=2
```

Include TODOs with other output results

```bash
ember-template-lint . --include-todo
```

Define custom config path

```bash
ember-template-lint "app/templates/application.hbs" --config-path .my-template-lintrc.js
```

Read from stdin

```bash
ember-template-lint --filename app/templates/application.hbs < app/templates/application.hbs
```

Specify custom ignore pattern `['**/dist/**', '**/tmp/**', '**/node_modules/**']` by default

```bash
ember-template-lint "/tmp/template.hbs" --ignore-pattern "**/foo/**" --ignore-pattern "**/bar/**"
```

Disable ignore pattern entirely

```bash
ember-template-lint "/tmp/template.hbs" --no-ignore-pattern
```

Running a single rule without options

```bash
ember-template-lint --no-config-path app/templates --rule 'no-implicit-this:error'
```

Running a single rule with options

```bash
ember-template-lint --no-config-path app/templates --rule 'no-implicit-this:["error", { "allow": ["some-helper"] }]'
```

Running a single rule, disabling inline configuration

```bash
ember-template-lint --no-config-path app/templates --rule 'no-implicit-this:error' --no-inline-config
```

Specify a config object to use instead of what exists locally

```bash
ember-template-lint --config '{ "rules": { "no-implicit-this": { "severity": 2, "config": true } } }' test/fixtures/no-implicit-this-allow-with-regexp/app/templates
```

Specify a configuration to override the normally loaded config file:

```bash
ember-template-lint . --config='{"extends": "a11y"}'
```

Provide a custom formatter from a relative path

```bash
ember-template-lint --format ./my-shwanky-formatter.js
```

Provide a custom formatter from a formatter package

```bash
ember-template-lint --format ember-template-lint-formatter-snazzy
```

💡 Ensure you wrap all glob patterns in quotes so that it won't be interpreted by the CLI. `ember-template-lint app/templates/**` (this will expand all paths in app/templates) and `ember-template-lint "app/templates/**"` (this will pass the glob to ember-template-lint and not interpret the glob).

For more information about the todo functionality, see [the documentation](./todos.md).
