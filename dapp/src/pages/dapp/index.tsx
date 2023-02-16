import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useEthers } from '@usedapp/core';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import MethodList from '@/views/dapp/MethodList';
import IfacList from '@/views/dapp/IfacList';
import ResultPannel from '@/views/dapp/ExecResult';

import { useMethods, useDapp } from '@/hooks/dapp';
import { MethodItem } from '@/views/dapp/MethadItem';

export default function Dapp() {
  const { account, library, chainId, switchNetwork } = useEthers();
  const { query } = useRouter();
  const dapp = useDapp(query.address as string);
  const { reads, writes } = useMethods(dapp?.abi);

  const [methodIfacs, setMethodIfacs] = useState<any[]>([]); // 可能存在同名方法
  const [execResult, setExecResult] = useState<{ ifac: any; ret: any }>({
    ifac: null,
    ret: null,
  }); // 调用结果

  const [tab, setTab] = useState<'read' | 'write'>('read');

  useEffect(() => {
    if (chainId && dapp?.chainId && chainId !== dapp.chainId) {
      switchNetwork(dapp?.chainId);
    }
  }, [dapp?.chainId, chainId]);

  const onClickMethod = (method: string) => {
    const abi = JSON.parse(dapp?.abi);

    const interfaces = abi.filter((i: any) => i.type === 'function' && i.name === method);

    setMethodIfacs(interfaces);
  };

  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant={tab === 'read' ? 'contained' : 'outlined'} onClick={() => setTab('read')}>
            Read Contract
          </Button>
          <Button variant={tab === 'write' ? 'contained' : 'outlined'} onClick={() => setTab('write')}>
            Write Contract
          </Button>
        </Stack>
        {/* <Stack direction="row" spacing={2}>
          <Button variant="outlined">Connect to Web3</Button>
        </Stack> */}

        <Stack direction="column" spacing={2}>
          {tab === 'read' &&
            reads.map((ifac, index) => (
              <MethodItem
                key={`${index}_${ifac.name}`}
                type="read"
                index={index}
                name={ifac.name}
                ifac={ifac}
                library={library}
                address={dapp.address}
              ></MethodItem>
            ))}

          {tab === 'write' &&
            writes.map((ifac, index) => (
              <MethodItem
                key={`${index}_${ifac.name}`}
                type="write"
                index={index}
                name={ifac.name}
                ifac={ifac}
                library={library}
                address={dapp.address}
                signAccount={account}
              ></MethodItem>
            ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
