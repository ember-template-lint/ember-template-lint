// from ember-cli/ember-cli

module.exports = {
  root: true,
  extends: 'eslint:recommended',

  rules: {
    semi: [2, 'always'],

    'no-unused-expressions': [2, {
      allowShortCircuit: true,
      allowTernary: true
    }],

    'strict': [2, 'global'],

    'indent': [2, 2, {
      'SwitchCase': 0,
      'VariableDeclarator': { 'var': 2, 'let': 2, 'const': 3 }
    }],

    'no-cond-assign': [2, 'except-parens'],
    curly: 2,
    'no-use-before-define': [2, 'nofunc'],
    'no-debugger': 2,

    eqeqeq: 2,
    'no-eval': 2,
    'linebreak-style': [2, 'unix'],
    'no-caller': 2,
    'no-empty': 2,
    quotes: [2, 'single', 'avoid-escape'],
    'no-undef': 2,
    'no-unused-vars': 2,
    'no-trailing-spaces': 2,
    'no-eq-null': 2,
    'no-console': 2
  }
};
