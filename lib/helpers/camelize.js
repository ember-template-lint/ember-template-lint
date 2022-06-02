// Implementation taken from `Ember.String.camelize`.

const REG_EXP_SYMBOLS = /([\s._-])+(.)?/g;
const REG_EXP_LETTERS = /(^|\/)([A-Z])/g;

export default function camelize(string) {
  return string
    .replace(REG_EXP_SYMBOLS, (match, separator, char) => (char ? char.toUpperCase() : ''))
    .replace(REG_EXP_LETTERS, (match) => match.toLowerCase());
}
