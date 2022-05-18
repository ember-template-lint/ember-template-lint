import { hbs } from 'ember-cli-htmlbars';

export default class Foo extends Service {
  indentedThing = hbs`
  Hahaha, this is just a plain string. Definitely not a template.
`;
