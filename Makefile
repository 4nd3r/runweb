.PHONY: make

make:
	rm -rf venv
	python3 -m venv venv
	venv/bin/pip install .
