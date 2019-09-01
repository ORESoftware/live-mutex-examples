#!/usr/bin/env node
'use strict';

import {LMXBroker} from "live-mutex";

const c = new LMXBroker();

c.ensure().then(v => {
  console.log('broker listening on port:', c.getListeningInterface());
});
