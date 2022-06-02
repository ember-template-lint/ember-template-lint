import dasherizeComponentName from './dasherize-component-name.js';

export default function (name) {
  return typeof name === 'string' && name.length > 0 && dasherizeComponentName(name) === name;
}
