import assert from 'node:assert/strict';
import { createHarness, type LiveMutexHarness } from './support';

let harness: LiveMutexHarness | undefined;

createHarness()
  .then((created) => {
    harness = created;
    const [client] = created.clients;
    return client.acquire('examples:promises').then((grant) => ({ client, grant }));
  })
  .then(({ client, grant }) => {
    assert.equal(grant.acquired, true);
    return client.release(grant.key, { id: grant.id }).then((released) => ({
      grant,
      released,
    }));
  })
  .then(({ grant, released }) => {
    assert.equal(released.unlocked, true);
    console.log({
      key: grant.key,
      fencingToken: grant.fencingToken,
      unlocked: released.unlocked,
    });
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await harness?.close();
  });
