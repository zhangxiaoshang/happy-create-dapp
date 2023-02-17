import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useEthers } from '@usedapp/core';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { useMethods, useDapp } from '@/hooks/dapp';
import { MethodItem } from '@/views/dapp/MethadItem';

export default function Dapp() {
  const { account, library, chainId, switchNetwork } = useEthers();
  const { query } = useRouter();
  const dapp = useDapp(query.address as string);
  const { reads, writes } = useMethods(dapp?.abi);

  const [tab, setTab] = useState<'read' | 'write'>('read');

  useEffect(() => {
    if (chainId && dapp?.chainId && chainId !== dapp.chainId) {
      switchNetwork(dapp?.chainId);
    }
  }, [dapp?.chainId, chainId, switchNetwork]);

  return (
    <Card variant="outlined">
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
