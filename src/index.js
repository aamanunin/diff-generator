import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './parsers';

const getData = (pathToFile) => {
  const absolutePath = path.resolve(pathToFile);
  const contentFile = fs.readFileSync(absolutePath, 'utf8');
  const extensionFile = path.extname(absolutePath);
  const data = parse(contentFile, extensionFile);

  return data;
};

const propertyActions = [
  {
    type: 'parent',
    check: (data1, data2, key) => (data1[key] instanceof Object && data2[key] instanceof Object),
    process: (value1, value2, func) => func(value1, value2),
  },
  {
    type: 'notChanged',
    check: (data1, data2, key) => (_.has(data1, key) && _.has(data2, key)
      && (data1[key] === data2[key])),
    process: value1 => value1,
  },
  {
    type: 'changed',
    check: (data1, data2, key) => (_.has(data1, key) && _.has(data2, key)
      && (data1[key] !== data2[key])),
    process: (value1, value2) => ({ before: value1, after: value2 }),
  },
  {
    type: 'deleted',
    check: (data1, data2, key) => (_.has(data1, key) && !_.has(data2, key)),
    process: value1 => value1,
  },
  {
    type: 'added',
    check: (data1, data2, key) => (!_.has(data1, key) && _.has(data2, key)),
    process: (value1, value2) => value2,
  },
];

const getPropertyAction = (data1, data2, key) => propertyActions
  .find(({ check }) => check(data1, data2, key));

const buildAst = (data1 = {}, data2 = {}) => {
  const dataKeys = _.union(Object.keys(data1), Object.keys(data2));

  return dataKeys.map((key) => {
    const { type, process } = getPropertyAction(data1, data2, key);
    const value = process(data1[key], data2[key], buildAst);
    const valueOrChildren = () => ((type === 'parent') ? 'children' : 'value');

    return { key, type, [valueOrChildren()]: value };
  });
};

const stringify = (data, depth) => {
  if (!(data instanceof Object)) return data;
  const keys = Object.keys(data);
  return `{\n${keys.map(key => `${' '.repeat(depth * 4 + 4)}${key}: ${data[key]}\n`)}${' '.repeat(depth * 4)}}`;
};


const typeActions = {
  parent: (difference, depth, func) => `${' '.repeat(depth * 4)}${difference.key}: {\n${func(difference.children, depth + 1)}\n${' '.repeat(depth * 4)}}`,
  notChanged: (difference, depth) => `${' '.repeat(depth * 4)}${difference.key}: ${stringify(difference.value, depth)}`,
  changed: (difference, depth) => `${' '.repeat(depth * 4 - 2)}- ${difference.key}: ${stringify(difference.value.before, depth)}\n${' '.repeat(depth * 4 - 2)}+ ${difference.key}: ${stringify(difference.value.after, depth)}`,
  deleted: (difference, depth) => `${' '.repeat(depth * 4 - 2)}- ${difference.key}: ${stringify(difference.value, depth)}`,
  added: (difference, depth) => `${' '.repeat(depth * 4 - 2)}+ ${difference.key}: ${stringify(difference.value, depth)}`,
};

const action = (difference, depth, func) => typeActions[difference.type](difference, depth, func);

const render = (collection) => {
  const renderAst = (ast, depth = 1) => _.flatten(ast.map(difference => `${action(difference, depth, renderAst)}`)).join('\n');

  return `{\n${renderAst(collection)}\n}`;
};
export default (pathToFile1, pathToFile2) => {
  const data1 = getData(pathToFile1);
  const data2 = getData(pathToFile2);

  const ast = buildAst(data1, data2);

  return render(ast);
};
