#!/usr/bin/env bash

set -e;

cd `dirname "$BASH_SOURCE"`

"$HOME/.oresoftware/bin/run-tsc-if" "$PWD"

(node dist/server/cli.js) &> /dev/null &
export pid_to_kill="$!"

kill_server(){
  kill -9 "$pid_to_kill"
}

trap kill_server EXIT;

node dist/client/vanilla-callbacks.js
node dist/client/promises.js
node dist/client/async-await.js
