install:
	npm install

run:
	npx babel-node 'src/bin/gendiff.js'

publish:
	npm publish

lint:
	npx eslint .

installg:
	npm install -g gendiffaam