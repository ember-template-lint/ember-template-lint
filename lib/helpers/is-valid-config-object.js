export default function isValidConfigObjectFormat(config, POSSIBLE_CONFIG) {
  const validLiteralValues = [true, false, 'warn', 'error'];
  if (validLiteralValues.includes(config)) {
    return true;
  }

  if (config === null && typeof config !== 'undefined') {
    return false;
  }

  if (typeof config === 'object') {
    for (let key in config) {
      let value = config[key];
      let valueType = typeof value;

      if (Array.isArray(value)) {
        const isValidArrayValues = value.every((element) => POSSIBLE_CONFIG[key].includes(element));
        if (!isValidArrayValues) {
          return false;
        }
      }

      if (!(key in POSSIBLE_CONFIG)) {
        return false;
      } else if (valueType !== typeof POSSIBLE_CONFIG[key]) {
        return false;
      }
    }

    return true;
  }

  return false;
}
