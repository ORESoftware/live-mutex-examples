#!/usr/bin/env bash

set -e;

cd `dirname "$BASH_SOURCE"`

npm run tsc

(node dist/server/cli.js ) &> /dev/null &

node dist/client/vanilla-callbacks.js
node dist/client/promises.js
node dist/client/async-await.js
