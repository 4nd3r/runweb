#!/bin/sh -e
cd "$( dirname "$( readlink "$0" )" )"
[ -d node_modules ] || npm install
npm start "$@"
