'use strict';

export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};

import {LMXClient} from "live-mutex";

const c = new LMXClient();
const p = c.ensure();

const z = p.then(v => {
    
    return c.acquire('foo').then(v => {
      console.log('locked/acquired val looks like:', v);
      return v;
    });
    
  })
  .then(v => {
    return c.release(v.key, {id: v.id});
  })
  .then(v => {
    console.log('unlock/released val looks like:', v);
    console.log('all good in the hood.');
    process.exit(0);
    
  });


z.catch(err => {
  console.error(err);
  process.exit(1);
});
