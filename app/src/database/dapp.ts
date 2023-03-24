import { openDB } from 'idb';

const DAPP_DB = 'Dapps';
const DAPP_STORE = 'dapps';

export const getKeyPath = (chainId: number, address: string) => `${chainId}_${address}`;

async function doDatabaseStuff() {
  const db = openDB(DAPP_DB, 1, {
    async upgrade(db, oldVersion) {
      // Create a store of objects
      const store = db.createObjectStore(DAPP_STORE, {
        // The 'id' property of the object will be the key.
        keyPath: 'id',
        autoIncrement: false,
      });
      // Create an index on the 'address' property of the objects.
      store.createIndex('id', 'id');
    },
  });

  return db;
}

export interface IDapp {
  id: string;
  chainId: number;
  chainName: string;
  address: string;
  abi: any[];
  name?: string;
  description?: string;
  createAt?: Date;
  updateAt?: Date;
}

export async function addDapp(dapp: IDapp) {
  const db = await doDatabaseStuff();
  const old = await getDapp(dapp.chainId, dapp.address);
  if (!old) {
    dapp.createAt = new Date();
  }
  dapp.updateAt = new Date();

  return await db.put(DAPP_STORE, { ...dapp, id: getKeyPath(dapp.chainId, dapp.address) });

  // return await db.add(DAPP_STORE, dapp);
}

export async function deleteDapp(id: string) {
  const db = await doDatabaseStuff();

  return await db.delete(DAPP_STORE, id);
}

export async function getDapp(chainId: number, address: string): Promise<IDapp> {
  const db = await doDatabaseStuff();
  const dapp = await db.get(DAPP_STORE, getKeyPath(chainId, address));

  return dapp;
}

export async function getDapps() {
  const db = await doDatabaseStuff();
  const dapps = await db.getAll(DAPP_STORE);

  return dapps;
}
