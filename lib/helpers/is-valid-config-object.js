export default function isValidConfigObjectFormat(config, DEFAULT_CONFIG) {
  const validLiteralValues = [true, false, 'warn', 'error'];
  if (validLiteralValues.includes(config)) {
    return true;
  }

  if (config === null) {
    return false;
  }

  if (typeof config !== 'object') {
    return false;
  }

  for (let key in config) {
    let value = config[key];
    let valueType = typeof value;

    if (!(key in DEFAULT_CONFIG)) {
      return false;
    } else if (valueType !== typeof DEFAULT_CONFIG[key]) {
      return false;
    }
  }

  return true;
}
