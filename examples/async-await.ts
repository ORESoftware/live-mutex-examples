import assert from 'node:assert/strict';
import { createHarness } from './support';

async function main(): Promise<void> {
  const harness = await createHarness();
  const [client] = harness.clients;

  try {
    const grant = await client.acquire('examples:async-await');
    assert.equal(grant.acquired, true);
    assert.equal(grant.key, 'examples:async-await');
    assert.ok(
      grant.fencingToken === null || Number.isSafeInteger(grant.fencingToken),
      'the broker returns either a legacy null or an integer fencing token',
    );

    const released = await client.release(grant.key, { id: grant.id });
    assert.equal(released.unlocked, true);

    console.log({
      key: grant.key,
      lockId: grant.id,
      fencingToken: grant.fencingToken,
      unlocked: released.unlocked,
    });
  } finally {
    await harness.close();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
