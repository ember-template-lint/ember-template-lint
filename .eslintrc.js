module.exports = {
  parserOptions: {
    ecmaVersion: 6,
  },
  "env": {
    "node": true
  },
  "plugins": ["node"],
  "extends": ["eslint:recommended", "plugin:node/recommended"],
  "rules": {
    "indent": [
      2,
      2
    ],
    "linebreak-style": [
      2,
      "unix"
    ],
    "quotes": [
      2,
      "single"
    ],
    "semi": [
      2,
      "always"
    ]
  }
};
