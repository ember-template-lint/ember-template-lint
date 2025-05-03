import inlineComponent from './rules/inline-component.js';

export default {
  plugins: [
    {
      name: 'plugin1',
      rules: {
        'inline-component': inlineComponent
      }
    }
  ],
  rules: {
    'inline-component': 'error',
    'no-bare-strings': 'error'
  }
};
