#!/bin/bash
export TZ=UTC
export BABEL_ENV=meteor:coverage

NODE=`meteor node -e "process.stdout.write(process.execPath)"`
METEORJS=`meteor node -e "process.stdout.write(require('path').resolve(process.execPath, '../../../tools/index.js'))"`

#node_modules/.bin/nyc $NODE $METEORJS $* test --full-app --settings settings-testing.json \
#  --raw-logs --once --driver-package meteortesting:mocha --port 4004

node_modules/.bin/nyc $NODE $METEORJS $* --settings settings-testing.json --port 4004