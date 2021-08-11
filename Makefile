all: clean build install
HAS_YARNPKG := $(shell command -v yarnpkg)
HAS_YARN := $(shell command -v yarn)
HAS_NPM := $(shell command -v npm)
ifdef HAS_YARNPKG
BIN := "yarnpkg"
else ifdef HAS_YARN
BIN := "yarn"
else ifdef HAS_NPM
BIN := "npm"
endif

clean:
	rm -rf dist node_modules package-lock.json yarn.lock

build:
	@$(BIN) install
	@$(BIN) run mkdeb

install:
	sudo dpkg -i dist/*.deb
