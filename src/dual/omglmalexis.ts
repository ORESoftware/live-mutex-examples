import {LMXBroker, LMXClient} from 'live-mutex';

const broker = new LMXBroker({
  udsPath: '/tmp/lmx.sock'
});
const mutex = new LMXClient({
  lockRequestTimeout: 10000,
  udsPath: '/tmp/lmx.sock'
});

 // Connect to mutex broker
const mutexKey = '123';

(async () => {
    //
  await Promise.all([broker.ensure(), mutex.ensure()]).catch(error => {
    // This is where the error happens
    console.debug(`Couldn't connect to broker.`, error);
  });

    // Lock mutex
  const lock = await mutex.acquireLock(mutexKey, {
    lockRequestTimeout: 10000
  });

  console.log('lock acquired:', lock);

})();

