import fs from 'fs';
import path from 'path';
import genDiff from '../src';

test('genDiffJson', () => {
  const pathToJSON1 = '__tests__/__fixtures__/testBefore.json';
  const pathTOJSON2 = '__tests__/__fixtures__/testAfter.json';
  const pathToResult = '__tests__/__fixtures__/result';
  const actual = genDiff(pathToJSON1, pathTOJSON2);
  const expected = fs.readFileSync(path.resolve(path.normalize(pathToResult)), 'utf8');
  expect(actual).toBe(expected);
});

test('genDiffYml', () => {
  const pathToYml1 = '__tests__/__fixtures__/testBefore.yml';
  const pathTOYml2 = '__tests__/__fixtures__/testAfter.yml';
  const pathToResult = '__tests__/__fixtures__/result';
  const actual = genDiff(pathToYml1, pathTOYml2);
  const expected = fs.readFileSync(path.resolve(path.normalize(pathToResult)), 'utf8');
  expect(actual).toBe(expected);
});
