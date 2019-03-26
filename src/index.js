import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const getContent = pathFile => fs.readFileSync(path.resolve(path.normalize(pathFile)), 'utf8');

const genDiff = (pathToFile1, pathToFile2) => {
  const contentFile1 = getContent(pathToFile1);
  const contentFile2 = getContent(pathToFile2);
  const dataFile1 = JSON.parse(contentFile1);
  const dataFile2 = JSON.parse(contentFile2);
  const getAST = (data1 = {}, data2 = {}) => {
    const dataKeys = _.union(Object.keys(data1), Object.keys(data2));
    return `{\n${dataKeys.reduce((acc, key) => {
      if (_.has(data1, key) && _.has(data2, key) && (data1[key] === data2[key])) return `${acc}    ${key}: ${data1[key]}\n`;
      if (_.has(data1, key) && _.has(data2, key) && (data1[key] !== data2[key])) return `${acc}  + ${key}: ${data2[key]}\n  - ${key}: ${data1[key]}\n`;
      if (_.has(data1, key) && !_.has(data2, key)) return `${acc}  - ${key}: ${data1[key]}\n`;
      if (!_.has(data1, key) && _.has(data2, key)) return `${acc}  + ${key}: ${data2[key]}\n`;
      return acc;
    }, '')}}`;
  };
  return getAST(dataFile1, dataFile2);
};

export default genDiff;
