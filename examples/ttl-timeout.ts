import assert from 'node:assert/strict';
import { createHarness, delay } from './support';

async function main(): Promise<void> {
  const harness = await createHarness(2);
  const [holder, contender] = harness.clients;

  try {
    const held = await holder.acquire('examples:timeout', { ttl: 5_000 });

    await assert.rejects(
      contender.acquire('examples:timeout', {
        lockRequestTimeout: 75,
        maxRetries: 0,
      }),
      'a contender must not silently acquire a lock that is still held',
    );

    await holder.release(held.key, { id: held.id });

    const expiring = await holder.acquire('examples:ttl', { ttl: 75 });
    await delay(200);
    const successor = await contender.acquire('examples:ttl', {
      lockRequestTimeout: 1_000,
      maxRetries: 5,
    });

    if (expiring.fencingToken !== null && successor.fencingToken !== null) {
      assert.ok(
        successor.fencingToken > expiring.fencingToken,
        'the post-TTL owner must receive a newer fencing token',
      );
    }

    await contender.release(successor.key, { id: successor.id });

    console.log({
      timedOutWhileHeld: true,
      expiredToken: expiring.fencingToken,
      successorToken: successor.fencingToken,
    });
  } finally {
    await harness.close();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
