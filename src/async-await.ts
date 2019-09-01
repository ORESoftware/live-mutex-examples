'use strict';

export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};

import {LMXClient} from "live-mutex";

const c = new LMXClient();

async function run() {
  
  await c.ensure();  // result of ensure call is the same object as the client c
  
  const lck = await c.acquire('foo');  // acquire is alias to lockp and acquireLock
  
  console.log('lock val looks like:', lck);
  
  const u = await c.release(lck.key, {id: lck.id});
  
  console.log('unlock val looks like:', u);
  console.log('all good in the hood.');
  process.exit(0);
  
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
