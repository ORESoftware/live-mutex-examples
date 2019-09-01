'use strict';

import {LMXClient} from "live-mutex";

const c = new LMXClient();
const p = c.ensure();

const run = () => {
  return p.then(v => {
      
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
      
    });
};

const aBitMoreSlick = () => {
  return p.then(c => {   // c === client
      
      return c.acquire('foo').then(v => {
        console.log('locked/acquired val looks like:', v);
        return v;
      });
      
    })
    .then(({key,id}) => {
      return c.release(key, {id});
    })
    .then(v => {
      console.log('unlock/released val looks like:', v);
      console.log('all good in the hood.');
      
    });
};

const anotherWay = () => {
  
  return p.then(c => {   // c === client
      
      return c.acquire('foo').then(v => {
        console.log('locked/acquired val looks like:', v);
        return v;
      });
      
    })
    .then(unlock => {
      // unlock is a vanilla callback function bound to the right key and call id
      // runUnlock returns a promise and runs our unlock fn for us
      return c.runUnlock(unlock);
    })
    .then(v => {
      console.log('unlock/released val looks like:', v);
   
      
    });
};

run()
  .then(aBitMoreSlick)
  .then(anotherWay)
  .then(v => {
    console.log('all good in the hood.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
