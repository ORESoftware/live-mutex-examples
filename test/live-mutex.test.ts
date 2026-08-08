import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHarness, delay } from '../examples/support';

test('current live-mutex promise API acquires, fences, expires, and shuts down', async () => {
  const harness = await createHarness(2);
  const [firstClient, secondClient] = harness.clients;

  try {
    const firstGrant = await firstClient.acquire('contract:sequential');
    assert.equal(firstGrant.acquired, true);
    assert.equal(firstGrant.key, 'contract:sequential');
    assert.ok(
      firstGrant.fencingToken === null || Number.isSafeInteger(firstGrant.fencingToken),
    );

    const firstRelease = await firstClient.release(firstGrant.key, {
      id: firstGrant.id,
    });
    assert.equal(firstRelease.unlocked, true);

    const secondGrant = await secondClient.acquire('contract:sequential');
    if (firstGrant.fencingToken !== null && secondGrant.fencingToken !== null) {
      assert.ok(secondGrant.fencingToken > firstGrant.fencingToken);
    }
    await secondClient.release(secondGrant.key, { id: secondGrant.id });

    const held = await firstClient.acquire('contract:timeout', { ttl: 5_000 });
    await assert.rejects(
      secondClient.acquire('contract:timeout', {
        lockRequestTimeout: 75,
        maxRetries: 0,
      }),
    );
    await firstClient.release(held.key, { id: held.id });

    const expiring = await firstClient.acquire('contract:ttl', { ttl: 75 });
    await delay(200);
    const successor = await secondClient.acquire('contract:ttl', {
      lockRequestTimeout: 1_000,
      maxRetries: 5,
    });

    if (expiring.fencingToken !== null && successor.fencingToken !== null) {
      assert.ok(successor.fencingToken > expiring.fencingToken);
    }
    await secondClient.release(successor.key, { id: successor.id });
  } finally {
    await harness.close();
  }
});
