import { useEffect, useState } from 'react';
import { getDapp } from '@/database/dapp';

export function useDapp(address: string | undefined) {
  const [dapp, setDapp] = useState<any>();

  useEffect(() => {
    if (!address) return;

    (async () => {
      const _dapp = await getDapp(address);
      setDapp(_dapp);
    })();
  }, [address]);

  return dapp;
}

export function useMethods(abi: string) {
  const [methods, setMethods] = useState<{ reads: any[]; writes: any[] }>({
    reads: [],
    writes: [],
  });
  useEffect(() => {
    if (!abi) return;

    parseABI(abi);
  }, [abi]);

  const parseABI = (abi: string) => {
    try {
      const reads: string[] = [];
      const writes: string[] = [];

      for (const row of JSON.parse(abi)) {
        if (row.type === 'function' && row.name) {
          if (row.stateMutability === 'view') {
            reads.push(row);
          } else {
            writes.push(row);
          }
        }
      }

      setMethods({ reads, writes });
    } catch (error) {
      console.error(error);
    }
  };

  return methods;
}
