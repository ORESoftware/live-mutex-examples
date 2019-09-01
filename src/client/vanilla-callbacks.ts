'use strict';

import {LMXClient} from "live-mutex";
import {LMLockSuccessData} from "live-mutex/dist/client";

const c = new LMXClient();

type EVCb<T> = (err: any, val: T) => void;

const runSimple = (cb: EVCb<boolean>) => {
  
  c.ensure(err => {
    
    if (err) {
      return cb(err, false);
    }
    
    c.lock('foo', (err, unlock) => {
      
      if (err) {
        return cb(err, false);
      }
      
      console.log('lock callback val looks like:', unlock);
      
      unlock((err, val) => {
        
        if (err) {
          return cb(err, false);
        }
        
        console.log('unlock callback val looks like:', val);
        cb(null, true);
        
      });
    });
    
  });
  
};

const runRaw = (cb: EVCb<boolean>) => {
  
  c.ensure(err => {
    
    if (err) {
      return cb(err, false);
    }
    
    c.lock('foo', (err, v) => {
      
      if (err) {
        return cb(err, false);
      }
      
      console.log('lock callback val looks like:', v);
      
      c.unlock(v.key, {id: v.id}, (err, val) => {
        
        if (err) {
          return cb(err, false);
        }
        
        console.log('unlock callback val looks like:', val);
        cb(null, true);
        
      });
    });
    
  });
  
};

runSimple((err, val) => {
  
  if (err) {
    throw err;
  }
  
  runRaw((err, val) => {
  
    if (err) {
      throw err;
    }
    
    console.log('all good in the hood.');
    process.exit(0);
    
  });
  
});
