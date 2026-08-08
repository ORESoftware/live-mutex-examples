# live-mutex examples

Runnable TypeScript examples and contract tests for the current `live-mutex` API.

## Requirements

- Node.js 22 or newer
- npm
- Linux or macOS for the Unix-domain-socket test harness

## Install and verify

```bash
npm install
npm test
```

`npm test` compiles the examples, starts an isolated broker, and verifies:

- promise-based acquire and release;
- monotonic fencing tokens when the connected broker supports them;
- lock-request timeout behavior;
- TTL expiry followed by a safe successor acquisition; and
- explicit client and broker shutdown.

CI runs the same contract on Node.js 22 and 24.

## Run the examples

Each example starts its own isolated broker and closes every client and broker resource before exiting.

```bash
npm run example:async
npm run example:promises
npm run example:ttl
```

### Async/await

[`examples/async-await.ts`](examples/async-await.ts) acquires a lock, inspects its fencing token, releases it, and verifies the unlock response.

### Promise chain

[`examples/promises.ts`](examples/promises.ts) demonstrates the same lifecycle without `async`/`await` at the call site.

### TTL and timeout

[`examples/ttl-timeout.ts`](examples/ttl-timeout.ts) proves that a contender times out while another owner is active, then demonstrates TTL expiry and a newer fencing token for the successor.

## External broker

Applications that already operate a broker can construct a client directly:

```ts
import { Client } from 'live-mutex';

const client = new Client({ host: '127.0.0.1', port: 6970 });
await client.ensure();

try {
  const grant = await client.acquire('jobs:example', { ttl: 5_000 });
  try {
    console.log(grant.fencingToken);
  } finally {
    await client.release(grant.key, { id: grant.id });
  }
} finally {
  client.close();
}
```
