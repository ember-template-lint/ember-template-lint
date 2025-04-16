import { match } from './node-matcher.js';

export default function hasParentTag(path, tag) {
  let parents = [...path.parents()];
  let refParentNode = {
    tag,
    type: 'ElementNode',
  };
  let hasHeadElementInParentPath = parents.some((parent) => match(parent.node, refParentNode));
  return Boolean(hasHeadElementInParentPath);
}
