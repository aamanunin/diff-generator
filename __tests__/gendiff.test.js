import fs from 'fs';
import path from 'path';
import genDiff from '../src';

test('genDiff', () => {
  const relativePath1 = '__tests__/__fixtures__/testBefore.json';
  const relativePath2 = '__tests__/__fixtures__/testAfter.json';
  const absolutePath1 = '/home/aleksandr/WorkFolder/gendiff/__tests__/__fixtures__/testBefore.json';
  const absolutePath2 = '/home/aleksandr/WorkFolder/gendiff/__tests__/__fixtures__/testAfter.json';
  const pathToResult = '__tests__/__fixtures__/result';
  expect(genDiff(relativePath1, relativePath2)).toBe(fs.readFileSync(path.resolve(path.normalize(pathToResult)), 'utf8'));
  expect(genDiff(absolutePath1, absolutePath2)).toBe(fs.readFileSync(path.resolve(path.normalize(pathToResult)), 'utf8'));
});
