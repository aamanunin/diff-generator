import fs from 'fs';
import path from 'path';
import genDiff from '../src';

test('genDiff', () => {
  const relativePath1 = '__tests__/__fixtures__/testBefore.json';
  const relativePath2 = '__tests__/__fixtures__/testAfter.json';
  const pathToResult = '__tests__/__fixtures__/result';
  const actual = genDiff(relativePath1, relativePath2);
  const expected = fs.readFileSync(path.resolve(path.normalize(pathToResult)), 'utf8');
  expect(actual).toBe(expected);
});
