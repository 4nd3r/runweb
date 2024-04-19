from setuptools import setup

setup(
    name="runweb",
    version="0",
    install_requires="PyQt6-WebEngine",
    entry_points={
        "console_scripts": [
            "runweb = runweb.runweb:main"
        ]
    }
)
