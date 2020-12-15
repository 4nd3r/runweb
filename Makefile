make: clean build install

clean:
	rm -rf dist node_modules

build:
	npm install
	npm run mkdeb

install:
	sudo dpkg -i dist/*.deb
