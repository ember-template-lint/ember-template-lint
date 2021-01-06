# TODOs

Linting is a fundamental tool to help ensure the quality of a codebase. Ensuring there are as few linting errors as possible (ideally 0), is a useful measure of a baseline of code hygiene.

It's common to leverage linting not just for syntax adherence, but also to direct developers to employ standardized patterns. As such, it's a fairly routine activity to introduce new lint rules into a codebase. This introduction, while necessary, can cause unintended friction, such as:

- new lint errors being introduced where they previously didn't exist
- causing unintended delays to shipping new fixes and features
- an "all or nothing" approach, where new rules require fixing before rollout

Having the ability to identify violations as `todo`s allows for this incremental roll out, while providing tools that allow maintainers to view the full list of todo violations.

## Usage

TODOs are stored in a `.lint-todo` directory that should be checked in with other source code. Each error generates a unique file, allowing for multiple errors within a single file to be resolved individually with minimal conflicts.

To convert errors to TODOs, you can use the `--update-todo` option. This will convert all active errors to TODOs, hiding them from the linting output.

```bash
ember-template-lint . --update-todo
```

If you want to see TODOs as part of `ember-template-lint`'s output, you can include them

```bash
ember-template-lint . --include-todo
```

If an error is fixed manually, `ember-template-lint` will let you know that there's an outstanding TODO file. You can remove this file by running `--fix`

```bash
ember-template-lint . --fix
```

### Configuring Due Dates

TODOs can be created with optional due dates. These due dates allow for TODOs to, over a period of time, 'decay' the severity to a **warning** and/or **error** after a certain date. This helps ensure that TODOs are created but not forgotten, and can allow for better managing incremental roll-outs of large-scale or slow-to-fix rules.

Due dates can be configured in multiple ways, but all specify integers for `warn` and `error` to signify the number of days from the TODO created date to decay the severity.

:bulb: Both `warn` and `error` are optional. The value for `warn` should be greater than the value of `error`.

1. Via package.json configuration

```json
{
  "lintTodo": {
    "decayDays": {
      "warn": 5,
      "error": 10
    }
  }
}
```

2. Via environment variables

```bash
TODO_DAYS_TO_WARN="5" TODO_DAYS_TO_ERROR="10" ember-template-lint . --update-todo
```

3. Via command line options

```bash
ember-template-lint . --update-todo --todo-days-to-warn=5 --todo-days-to-error=10
```

In order of precedence:

- command line options override both environment variables and package.json configuration values
- environment variables override package.json configuration values

If no values are provided in one of the options that have higher precedence, the value from the next level of precedence will act as the default. For example, if you've specified the following values in the package.json configuration...

```json
{
  "lintTodo": {
    "decayDays": {
      "warn": 5,
      "error": 10
    }
  }
}
```

...and you supply the following command line arguments:

```bash
ember-template-lint . --update-todo --todo-days-to-warn=2
```

...the TODOs will be created with a `warn` date 2 days from the created date, and an `error` date 10 days from the created date.

### Due Date Workflows

Converting errors to TODOs with `warn` and `error` dates that transition the TODO to `warn` after 10 days and `error` after 20 days:

```bash
ember-template-lint . --update-todo --todo-days-to-warn=10 --todo-days-to-error=20
```

Converting errors to TODOs with `warn` and `error` dates that transition the TODO `error` after 20 days, but doesn't include a `warn` date:

```bash
ember-template-lint . --update-todo --no-todo-days-to-warn --todo-days-to-error=20
```
