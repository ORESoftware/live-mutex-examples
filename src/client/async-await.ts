'use strict';

export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};

import {LMXClient} from "live-mutex";

const client = new LMXClient();

async function run() {
  
  const c = await client.ensure();  // c === client (result of ensure call is the same object as the client)
  
  const k = await c.acquire('foo');  // acquire is alias to acquireLock
  
  console.log('lock val looks like:', k);
  
  const u = await c.release(k.key, {id: k.id});
  
  console.log('unlock val looks like:', u);
  console.log('all good in the hood.');
  process.exit(0);
  
}

async function aBitMoreSlick() {
  
  const c = await client.ensure();  // c === client
  const {key, id} = await c.acquire('foo');  // acquire is alias to acquireLock
  const u = await c.release(key, {id});
  
  console.log('unlock val looks like:', u);
  console.log('all good in the hood.');
  process.exit(0);
  
}

run()
  .then(aBitMoreSlick)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
