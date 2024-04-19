.PHONY: make

make:
	rm -rf venv
	python3 -m venv venv
	venv/bin/pip install PyQt6-WebEngine
	ln -sf $(PWD)/runweb.sh $(HOME)/.local/bin/runweb
