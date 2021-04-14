# Contributing Guidelines

## Issues

If you think you've found a bug, or would like to request a new feature, please let us know.

### Reporting an Issue

1. Before you report an issue, please make sure you're on the latest version of the addon, as this may fix the issue for you.
2. When reporting a bug, please give us as much detail as possible. This allows us to more easily verify the issue.
3. After filing an issue, you are welcome to submit a PR to fix that issue if you wish!

### Requesting a New Feature

If you are opening an issue to request a new feature, please provide:

1. A detailed description of the feature you would like to add, and include the reason(s) for it.
2. Include references to standards or other docs as you are able.

## Working on the Package

```bash
# clone the latest ember-template-lint from github:
 - git clone https://github.com/ember-template-lint/ember-template-lint.git

# navigate to the cloned directory
 - cd ember-template-lint

# ensure Node.js and yarn are installed

# run tests to make sure everything will start out in a good state
 - yarn install
 - yarn test

```

### Creating a New Rule

```bash
# create a new rule
- yarn new:rule rule-name

# test rule
- yarn test:jest rule-name

```

### Updating rules index file

```bash
# update rules index file
- yarn update:rules-index

```

### Updating Rules Table in README

```bash
- yarn update:readme
```

### Supported Commands

When working on the linter, you'll need to lint and test your work.
For the linter, there are a few options:

1. Lint everything at once - `yarn lint`
2. Lint just the docs - `yarn lint:docs .` (to automatically fix issues, run `yarn lint:docs . --fix`)
3. Lint just the js files - `yarn lint:js` (to automatically fix issues, run `yarn lint:js --fix`)

To test:

1. To run tests and the linter at once, run `yarn test`
2. To just run the tests, run `yarn test:jest`
3. To just run a specific test (i.e., `require-valid-alt-text`), run `yarn test:jest require-valid-alt-text`

### Submitting a Pull Request(PR)

It's a great idea to run the linting and ensure all of your tests are passing before submitting a PR.
This will help ensure that everything is formatted and working as intended, and will help the reviewers.

Thank you for contributing to this addon!
