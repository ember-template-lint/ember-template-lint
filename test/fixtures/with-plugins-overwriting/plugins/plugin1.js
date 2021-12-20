import inlineComponent from './inline-component.js';

export default {
  name: 'plugin1',

  rules: {
    'inline-component': inlineComponent,
  },

  configurations: {
    'enable-inline-component': {
      rules: {
        'inline-component': true,
      },
    },
  },
};
