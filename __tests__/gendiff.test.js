import fs from 'fs';
import path from 'path';
import genDiff from '../src';

describe('genDiff', () => {
  const pathToJSON1 = '__tests__/__fixtures__/testBefore.json';
  const pathToJSON2 = '__tests__/__fixtures__/testAfter.json';
  const pathToYml1 = '__tests__/__fixtures__/testBefore.yml';
  const pathTOYml2 = '__tests__/__fixtures__/testAfter.yml';
  const pathToIni1 = '__tests__/__fixtures__/testBefore.ini';
  const pathToIni2 = '__tests__/__fixtures__/testAfter.ini';
  const pathToJSONTree1 = '__tests__/__fixtures__/testBeforeTree.json';
  const pathToJSONTree2 = '__tests__/__fixtures__/testAfterTree.json';
  const pathToResult = '__tests__/__fixtures__/result';
  const pathToResultTree = '__tests__/__fixtures__/resultTree';
  test.each([
    [pathToJSON1, pathToJSON2, pathToResult],
    [pathToYml1, pathTOYml2, pathToResult],
    [pathToIni1, pathToIni2, pathToResult],
    [pathToJSONTree1, pathToJSONTree2, pathToResultTree],
  ])(
    '%s and %s',
    (path1, path2, path3) => {
      const actual = genDiff(path1, path2);
      const expected = fs.readFileSync(path.resolve(path.normalize(path3)), 'utf8');
      expect(actual).toBe(expected);
    },
  );
});
