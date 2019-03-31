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

export default (collection) => {
  const renderAst = (ast, depth = 1) => _.flatten(ast.map(difference => standartActions[difference.type](difference, depth, renderAst))).join('\n');

  return `{\n${renderAst(collection)}\n}`;
};
