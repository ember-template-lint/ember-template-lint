export default function isValidConfigObjectFormat(config, POSSIBLE_CONFIG) {
  const validLiteralValues = [true, false, 'warn', 'error'];
  if (validLiteralValues.includes(config)) {
    return true;
  }

  if (config === null) {
    return false;
  }

  if (typeof config !== 'object' || Array.isArray(config)) {
    return false;
  }

  for (let key in config) {
    let value = config[key];
    let valueType = typeof value;

    if (!(key in POSSIBLE_CONFIG)) {
      return false;
    } else if (valueType !== typeof POSSIBLE_CONFIG[key]) {
      return false;
    }

    if (Array.isArray(value)) {
      const isValidArrayValues = value.every((element) => POSSIBLE_CONFIG[key].includes(element));
      if (!isValidArrayValues) {
        return false;
      }
    }
  }

  return true;
}
