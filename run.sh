

set -e;

cd `dirname "$BASH_SOURCE"`

tsc -p tsconfig.json

(node dist/server/cli.js ) &> /dev/null &

node dist/client/vanilla-callbacks.js
node dist/client/promises.js
node dist/client/async-await.js
