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
    name: 'not changed',
    check: (data1, data2, key) => (_.has(data1, key) && _.has(data2, key)
      && (data1[key] === data2[key])),
    process: (data1, data2, key) => [`    ${key}: ${data1[key]}`],
  },
  {
    name: 'changed',
    check: (data1, data2, key) => (_.has(data1, key) && _.has(data2, key)
      && (data1[key] !== data2[key])),
    process: (data1, data2, key) => [`  + ${key}: ${data2[key]}`, `  - ${key}: ${data1[key]}`],
  },
  {
    name: 'deleted',
    check: (data1, data2, key) => (_.has(data1, key) && !_.has(data2, key)),
    process: (data1, data2, key) => [`  - ${key}: ${data1[key]}`],
  },
  {
    name: 'added',
    check: (data1, data2, key) => (!_.has(data1, key) && _.has(data2, key)),
    process: (data1, data2, key) => [`  + ${key}: ${data2[key]}`],
  },
];

const getPropertyAction = (data1, data2, key) => propertyActions
  .find(({ check }) => check(data1, data2, key));

const buildAst = (data1 = {}, data2 = {}) => {
  const dataKeys = _.union(Object.keys(data1), Object.keys(data2));
  return dataKeys.reduce((acc, key) => {
    const { process } = getPropertyAction(data1, data2, key);
    const value = process(data1, data2, key);
    return [...acc, value];
  }, []);
};

const render = elements => `{\n${_.flatten(elements).join('\n')}\n}`;

export default (pathToFile1, pathToFile2) => {
  const data1 = getData(pathToFile1);
  const data2 = getData(pathToFile2);

  const ast = buildAst(data1, data2);

  return render(ast);
};
