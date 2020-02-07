function* iterateParents(path) {
  while (path.parent) {
    path = path.parent;
    yield path;
  }
}

module.exports = iterateParents;
