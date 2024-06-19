# runweb

Run website like an app.

## Install

```
$ sudo apt install xdg-utils libnotify-bin
```

### Use local PyQt6

```
$ sudo apt install python3-pyqt6.qtwebengine
$ ln -sf "$PWD/bin/runweb" "$HOME/.local/bin/runweb"
```

### Use PyQt6 from PyPI

```
$ make
$ ln -sf "$PWD/.venv/bin/runweb" "$HOME/.local/bin/runweb"
```

## Usage

```
$ runweb -h
usage: runweb [-h] [-p NAME] URL [URL ...]

run website like an app

positional arguments:
  URL         first URL is initial, others are permitted when navigating

options:
  -h, --help  show this help message and exit
  -p NAME     persistent profile name
```
