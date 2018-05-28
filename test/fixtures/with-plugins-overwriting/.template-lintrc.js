module.exports = {
  plugins: [
    './plugins/plugin1',
    './plugins/plugin2'
  ],
  extends: [
    'plugin2:disable-inline-component',
    'plugin1:enable-inline-component',
  ],
  rules: {
    'no-bare-strings': true
  }
};
