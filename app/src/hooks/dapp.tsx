import { useEffect, useState } from 'react';
import { getDapp, IDapp } from '@/database/dapp';

export function useDapp(chainId: number, address: string | undefined) {
  const [dapp, setDapp] = useState<IDapp>();

  useEffect(() => {
    if (!address) return;

    (async () => {
      const _dapp = await getDapp(chainId, address);
      setDapp(_dapp);
    })();
  }, [chainId, address]);

  return dapp;
}

export function useMethods(abi?: any[]) {
  const [methods, setMethods] = useState<{ reads: any[]; writes: any[] }>({
    reads: [],
    writes: [],
  });
  useEffect(() => {
    if (!abi) return;

    parseABI(abi);
  }, [abi]);

  const parseABI = (abi: any[]) => {
    try {
      const reads: string[] = [];
      const writes: string[] = [];

      for (const row of abi) {
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
