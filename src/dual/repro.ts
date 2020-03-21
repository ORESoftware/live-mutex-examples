import {LMXBroker, LMXClient} from 'live-mutex';

const b = new LMXBroker();
const c = new LMXClient();

b.emitter.on('warning', w => console.error('broker warning:', w));
c.emitter.on('warning', w => console.error('client warning', w));

// This function will be called by multiple requests
// I've just simplified to show the issue

const main = async () => {
  // Connect to mutex broker
  await Promise.all([b.ensure(), c.ensure()]);

  // Lock mutex
  const lock = await c.acquireLock('registered');

  // if (!lock) {   // if the acquireLock doesn't throw, then lock will always exist
  //   return;
  // }

  console.log('lock acquired:', lock);

  // Unlock mutex
  const released = await c.releaseLock('registered', {id: lock.id});

  console.log('lock released:', released);

};

let successCount = 0;

for(let i = 0 ; i < 5000; i++){
  main()
    .then(v => {
      successCount++;
      console.log({successCount});
    })
    .catch(error => {
    console.error('WOW:', error);
  });
}

