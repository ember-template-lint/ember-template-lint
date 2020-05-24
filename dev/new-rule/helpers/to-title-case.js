function toTitleCase(newRuleName) {
  let newRuleClassArray = newRuleName.split('-');
  let newRuleClassArrayCaps = newRuleClassArray.map((element) =>
    element.replace(element.charAt(0), element.charAt(0).toUpperCase())
  );
  let newRuleClassName = newRuleClassArrayCaps.join('');
  return newRuleClassName;
}

module.exports = toTitleCase;
