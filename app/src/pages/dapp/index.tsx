import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useEthers } from '@usedapp/core';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import { useMethods, useDapp } from '@/hooks/dapp';
import { IDapp } from '@/database/dapp';
import { TabName } from '@/constants';

import { TabsPannel } from '@/views/dapp/TabsPannel';
import { AbiFunction } from '@/views/dapp/AbiFunction';

interface ConnectOrSwitchChainProps {
  isRead: boolean;
  isWrite: boolean;
  isNetworkError: boolean;
  dapp?: IDapp;
}

function ConnectOrSwitchChain(props: ConnectOrSwitchChainProps) {
  const { account, activateBrowserWallet, switchNetwork } = useEthers();
  const { isWrite, isNetworkError, dapp } = props;

  if (!dapp) return null;

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      {isWrite && !account && (
        <Button variant="outlined" color="error" startIcon={<FiberManualRecordIcon />} onClick={activateBrowserWallet}>
          Connect to Web3
        </Button>
      )}

      {isWrite && isNetworkError && (
        <Button variant="outlined" color="error" onClick={() => switchNetwork(dapp?.chainId)}>
          Switch to {dapp.chainName || dapp.chainId}
        </Button>
      )}
    </Stack>
  );
}

export default function Dapp() {
  const { chainId } = useEthers();
  const { query } = useRouter();

  const [tab, setTab] = useState<TabName>(TabName.read);
  const dapp = useDapp(Number(query.chainId), String(query.address));
  const { reads, writes } = useMethods(dapp?.abi);

  const isNetworkError = !!chainId && !!dapp?.chainId && chainId !== dapp.chainId;
  const isRead = tab === TabName.read;
  const isWrite = tab === TabName.write;
  const methods = isRead ? reads : isWrite ? writes : [];

  if (!dapp) return null;

  console.log('isNetworkError', isNetworkError);

  return (
    <>
      <Head>
        <title>DApp</title>
      </Head>
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <TabsPannel tab={tab} setTab={setTab}></TabsPannel>
          <ConnectOrSwitchChain isWrite={isWrite} dapp={dapp} isNetworkError={isNetworkError} isRead={tab === TabName.read}></ConnectOrSwitchChain>

          <Alert severity={isWrite && isNetworkError ? 'error' : 'success'} sx={{ mb: 2 }}>
            {dapp.name} on {dapp.chainName}(chainId {dapp.chainId})
          </Alert>

          <Stack direction="column" spacing={2}>
            {methods.map((abiFunc, index) => (
              <AbiFunction
                key={`${dapp.address}_${index}_${abiFunc.name}`}
                index={index}
                abiFunc={abiFunc}
                address={dapp.address}
                chainId={dapp.chainId}
              ></AbiFunction>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
