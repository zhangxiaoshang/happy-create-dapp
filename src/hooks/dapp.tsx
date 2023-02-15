import { useEffect, useState } from "react";
import { getDapp } from "@/database/dapp";

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
  const [methods, setMethods] = useState<{ read: string[]; write: string[] }>({
    read: [],
    write: [],
  });
  useEffect(() => {
    if (!abi) return;

    parseABI(abi);
  }, [abi]);

  const parseABI = (abi: string) => {
    try {
      const read: string[] = [];
      const write: string[] = [];

      for (const row of JSON.parse(abi)) {
        if (row.type === "function") {
          if (row.stateMutability === "view" && row.name) {
            read.push(row.name);
          }

          if (row.stateMutability === "nonpayable" && row.name) {
            write.push(row.name);
          }
        }
      }

      setMethods({ read, write });
    } catch (error) {
      console.error(error);
    }
  };

  return methods;
}
