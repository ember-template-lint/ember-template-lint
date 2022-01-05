import inlineComponent from './inline-component.js';

export default {
  name: 'plugin1',

  rules: {
    'inline-component': inlineComponent,
  },

  configurations: {
    recommended: {
      rules: {
        'inline-component': true,
        'no-bare-strings': true,
      },
    },
  },
};
