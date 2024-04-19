#!/bin/sh -e
cd "$( dirname "$( realpath "$0" )" )"
. venv/bin/activate
./runweb.py "$@"
