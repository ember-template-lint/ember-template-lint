# TODOs

Linting is a fundamental tool to help ensure the quality of a codebase. Ensuring there are as few linting errors as possible (ideally 0), is a useful measure of a baseline of code hygiene.

It's common to leverage linting not just for syntax adherence, but also to direct developers to employ standardized patterns. As such, it's a fairly routine activity to introduce new lint rules into a codebase. This introduction, while necessary, can cause unintended friction, such as:

- new lint errors being introduced where they previously didn't exist
- causing unintended delays to shipping new fixes and features
- an "all or nothing" approach, where new rules require fixing before rollout.

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
