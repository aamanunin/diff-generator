import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parsers from './parsers';

const getContent = pathFile => fs.readFileSync(path.resolve(path.normalize(pathFile)), 'utf8');
const getExtension = pathFile => path.extname(path.resolve(path.normalize(pathFile)));

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
    return [...acc, ...process(data1, data2, key)];
  }, []);
};

const render = elements => `{\n${elements.join('\n')}\n}`;

const genDiff = (pathToFile1, pathToFile2) => {
  const contentFile1 = getContent(pathToFile1);
  const contentFile2 = getContent(pathToFile2);
  const extensionFile1 = getExtension(pathToFile1);
  const extensionFile2 = getExtension(pathToFile2);
  const dataFile1 = parsers(contentFile1, extensionFile1);
  const dataFile2 = parsers(contentFile2, extensionFile2);

  const differences = getDifferences(dataFile1, dataFile2);

  return render(differences);
};

export default genDiff;
