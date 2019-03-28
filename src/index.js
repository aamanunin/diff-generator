import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './parsers';

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

const getDifferences = (data1 = {}, data2 = {}) => {
  const dataKeys = _.union(Object.keys(data1), Object.keys(data2));
  return dataKeys.reduce((acc, key) => {
    const { process } = getPropertyAction(data1, data2, key);
    return [...acc, process(data1, data2, key)];
  }, []);
};

const render = elements => `{\n${_.flatten(elements).join('\n')}\n}`;

const genDiff = (path1, path2) => {
  const pathToFile1 = path.resolve(path1);
  const pathToFile2 = path.resolve(path2);
  const contentFile1 = fs.readFileSync(pathToFile1, 'utf8');
  const contentFile2 = fs.readFileSync(pathToFile2, 'utf8');
  const extensionFile1 = path.extname(pathToFile1);
  const extensionFile2 = path.extname(pathToFile2);
  const dataFile1 = parse(contentFile1, extensionFile1);
  const dataFile2 = parse(contentFile2, extensionFile2);

  const differences = getDifferences(dataFile1, dataFile2);

  return render(differences);
};

export default genDiff;
