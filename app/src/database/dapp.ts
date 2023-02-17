import { openDB, deleteDB, wrap, unwrap } from 'idb';

const DAPP_DB = 'Dapps';
const DAPP_STORE = 'dapps';

async function doDatabaseStuff() {
  const db = openDB(DAPP_DB, 1, {
    upgrade(db) {
      // Create a store of objects
      const store = db.createObjectStore(DAPP_STORE, {
        // The 'id' property of the object will be the key.
        keyPath: 'address',
        autoIncrement: false,
      });
      // Create an index on the 'address' property of the objects.
      store.createIndex('address', 'address');
    },
  });

  return db;
}

export interface IDapp {
  chainId: number;
  chainName: string;
  address: string;
  abi: string;
  name?: string;
  description?: string;
  createAt?: Date;
  updateAt?: Date;
}

export async function addDapp(dapp: IDapp) {
  const db = await doDatabaseStuff();
  const old = await getDapp(dapp.address);
  if (!old) {
    dapp.createAt = new Date();
  }
  dapp.updateAt = new Date();

  return await db.put(DAPP_STORE, dapp);

  // return await db.add(DAPP_STORE, dapp);
}

export async function deleteDapp(address: string) {
  const db = await doDatabaseStuff();

  return await db.delete(DAPP_STORE, address);
}

export async function getDapp(address: string) {
  const db = await doDatabaseStuff();
  const dapp = await db.get(DAPP_STORE, address);

  return dapp;
}

export async function getDapps() {
  const db = await doDatabaseStuff();
  const dapps = await db.getAll(DAPP_STORE);

  return dapps;
}
