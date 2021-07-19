module.exports = function interpolate(text, data) {
  if (!data) {
    return text;
  }

  // Substitution content for any <% %> markers.
  return text.replace(/<%([^<%]+?)%>/gu, (fullMatch, termWithWhitespace) => {
    const term = termWithWhitespace.trim();

    if (term in data) {
      return data[term];
    }

    return fullMatch;
  });
};
