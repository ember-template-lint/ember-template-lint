module.exports = {
  plugins: [
    './plugins/plugin1',
    './plugins/plugin2'
  ],
  extends: [
    'plugin1:enable-inline-component',
    'plugin2:disable-inline-component',
  ],
  rules: {
    'bare-strings': true
  }
};
