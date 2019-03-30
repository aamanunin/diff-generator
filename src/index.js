import fs from 'fs';
import path from 'path';
import parse from './parsers';
import buildAst from './astBuilder';
import render from './renders';

const getData = (pathToFile) => {
  const absolutePath = path.resolve(pathToFile);
  const contentFile = fs.readFileSync(absolutePath, 'utf8');
  const extensionFile = path.extname(absolutePath);
  const data = parse(contentFile, extensionFile);

  return data;
};

export default (pathToFile1, pathToFile2, format = 'standart') => {
  const data1 = getData(pathToFile1);
  const data2 = getData(pathToFile2);

  const ast = buildAst(data1, data2);

  return render(ast, format);
};
