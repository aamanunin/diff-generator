install:
	npm install

run:
	npx babel-node 'src/bin/gendiff.js' __tests__/__fixtures__/testBefore.json __tests__/__fixtures__/testAfter.json

runPlain:
	npx babel-node 'src/bin/gendiff.js' --format plain __tests__/__fixtures__/testBefore.json __tests__/__fixtures__/testAfter.json

build:
	rm -rf dist
	npm run build

test:
	npm test

lint:
	npx eslint .

publish:
	npm publish

test-coverage:
	npm test -- --coverage