import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useEthers } from '@usedapp/core';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import { useMethods, useDapp } from '@/hooks/dapp';
import { MethodItem } from '@/views/dapp/MethadItem';

export default function Dapp() {
  const { account, library, chainId, switchNetwork, activateBrowserWallet } = useEthers();
  const { query } = useRouter();

  const dapp = useDapp(Number(query.chainId), String(query.address));
  const { reads, writes } = useMethods(dapp?.abi);

  const [tab, setTab] = useState<'read' | 'write'>('read');

  const netwrokError = !!chainId && !!dapp?.chainId && chainId !== dapp.chainId;

  return (
    <>
      <Head>
        <title>DApp</title>
      </Head>
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            {
              <>
                <Button variant={tab === 'read' ? 'contained' : 'outlined'} onClick={() => setTab('read')}>
                  Read Contract
                </Button>
                <Button variant={tab === 'write' ? 'contained' : 'outlined'} onClick={() => setTab('write')}>
                  Write Contract
                </Button>
              </>
            }
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            {!account && (
              <Button variant="outlined" color="error" startIcon={<FiberManualRecordIcon />} onClick={activateBrowserWallet}>
                Connect to Web3
              </Button>
            )}

            {!!account && netwrokError && (
              <Button variant="outlined" color="error" onClick={() => switchNetwork(dapp.chainId)}>
                Switch Network
              </Button>
            )}
          </Stack>

          <Stack direction="column" spacing={2}>
            {tab === 'read' &&
              reads.map((ifac, index) => (
                <MethodItem
                  key={`${index}_${ifac.name}`}
                  disabled={!account || netwrokError}
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
                  disabled={!account || netwrokError}
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
    </>
  );
}
