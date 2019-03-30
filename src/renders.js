import _ from 'lodash';

const stringify = (data, depth) => {
  if (!(data instanceof Object)) return data;
  const keys = Object.keys(data);
  return `{\n${keys.map(key => `${' '.repeat(depth * 4 + 4)}${key}: ${data[key]}\n`)}${' '.repeat(depth * 4)}}`;
};

const standartActions = {
  parent: (difference, depth, func) => `${' '.repeat(depth * 4)}${difference.key}: {\n${func(difference.children, depth + 1)}\n${' '.repeat(depth * 4)}}`,
  notChanged: (difference, depth) => `${' '.repeat(depth * 4)}${difference.key}: ${stringify(difference.value, depth)}`,
  changed: (difference, depth) => [`${' '.repeat(depth * 4 - 2)}- ${difference.key}: ${stringify(difference.valueBefore, depth)}`, `${' '.repeat(depth * 4 - 2)}+ ${difference.key}: ${stringify(difference.valueAfter, depth)}`],
  deleted: (difference, depth) => `${' '.repeat(depth * 4 - 2)}- ${difference.key}: ${stringify(difference.value, depth)}`,
  added: (difference, depth) => `${' '.repeat(depth * 4 - 2)}+ ${difference.key}: ${stringify(difference.value, depth)}`,
};

const standartRender = (collection) => {
  const renderAst = (ast, depth = 1) => _.flatten(ast.map(difference => standartActions[difference.type](difference, depth, renderAst))).join('\n');

  return `{\n${renderAst(collection)}\n}`;
};

const plainStringify = (data) => {
  if (typeof data === 'boolean') return data;
  if (!(data instanceof Object)) return `'${data}'`;

  return '[complex value]';
};

const plainActions = {
  parent: (difference, acc, path, func) => `${acc}${func(difference.children, `${path}${difference.key}.`)}`,
  notChanged: (difference, acc) => `${acc}`,
  changed: (difference, acc, path) => `${acc}\nProperty '${path}${difference.key}' was updated. From ${plainStringify(difference.valueBefore)} to ${plainStringify(difference.valueAfter)}`,
  deleted: (difference, acc, path) => `${acc}\nProperty '${path}${difference.key}' was removed`,
  added: (difference, acc, path) => `${acc}\nProperty '${path}${difference.key}' was added with value: ${plainStringify(difference.value)}`,
};

const plainRender = (collection) => {
  const renderAst = (ast, path = '') => ast.reduce((cAcc, difference) => `${plainActions[difference.type](difference, cAcc, path, renderAst)}`, '');

  return renderAst(collection);
};

const formatActions = {
  standart: standartRender,
  plain: plainRender,
};

const render = (collection, format) => formatActions[format](collection);

export default render;
