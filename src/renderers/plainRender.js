const plainStringify = (data) => {
  if (typeof data === 'boolean') return data;
  if (!(data instanceof Object)) return `'${data}'`;

  return '[complex value]';
};

const plainActions = {
  parent: (difference, path, func) => func(difference.children, `${path}${difference.key}.`),
  notChanged: () => '',
  changed: (difference, path) => `Property '${path}${difference.key}' was updated. From ${plainStringify(difference.valueBefore)} to ${plainStringify(difference.valueAfter)}`,
  deleted: (difference, path) => `Property '${path}${difference.key}' was removed`,
  added: (difference, path) => `Property '${path}${difference.key}' was added with value: ${plainStringify(difference.value)}`,
};

export default (collection) => {
  const renderAst = (ast, path = '') => ast
    .map(difference => plainActions[difference.type](difference, path, renderAst))
    .filter(difference => difference)
    .join('\n');

  return `${renderAst(collection)}`;
};
