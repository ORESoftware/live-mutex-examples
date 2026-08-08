import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { Broker1, Client } from 'live-mutex';

export interface LiveMutexHarness {
  broker: Broker1;
  clients: Client[];
  socketPath: string;
  close(): Promise<void>;
}

function closeBroker(broker: Broker1): Promise<void> {
  return new Promise((resolve) => {
    broker.close(() => resolve());
  });
}

/**
 * Start an isolated broker and one or more clients over a Unix-domain socket.
 * The examples run on Linux/macOS CI without claiming a shared TCP port, and
 * every resource is closed explicitly so a successful process exits cleanly.
 */
export async function createHarness(clientCount = 1): Promise<LiveMutexHarness> {
  if (!Number.isInteger(clientCount) || clientCount < 1) {
    throw new TypeError('clientCount must be a positive integer');
  }

  const socketPath = join(
    tmpdir(),
    `live-mutex-examples-${process.pid}-${randomUUID()}.sock`,
  );

  await rm(socketPath, { force: true });

  const broker = new Broker1({ udsPath: socketPath });
  broker.emitter.on('warning', () => undefined);
  await broker.ensure();

  const clients: Client[] = [];
  try {
    for (let index = 0; index < clientCount; index += 1) {
      const client = new Client({ udsPath: socketPath });
      client.emitter.on('warning', () => undefined);
      await client.ensure();
      clients.push(client);
    }
  } catch (error) {
    for (const client of clients) {
      client.close();
    }
    await closeBroker(broker);
    await rm(socketPath, { force: true });
    throw error;
  }

  let closed = false;
  return {
    broker,
    clients,
    socketPath,
    async close() {
      if (closed) {
        return;
      }
      closed = true;
      for (const client of clients) {
        client.close();
      }
      await closeBroker(broker);
      await rm(socketPath, { force: true });
    },
  };
}

export function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
