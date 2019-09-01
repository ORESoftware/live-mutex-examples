'use strict';


import {LMXClient} from "live-mutex";

const c = new LMXClient();

c.ensure(err => {
  
  if (err) {
    throw err;
  }
  
  c.lock('foo', (err, unlock) => {
    
    if (err) {
      throw err;
    }
    
    console.log('lock callback val looks like:', unlock);
    
    unlock((err, val) => {
      
      if (err) {
        throw err;
      }
      
      console.log('unlock callback val looks like:', val);
      console.log('all good in the hood.');
      process.exit(0);
      
    });
  });
  
});
