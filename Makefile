.PHONY: build clean install

build:
	npm install
	npm run mkdeb

clean:
	rm -rf dist node_modules package-lock.json

install:
	dpkg -i dist/*.deb
