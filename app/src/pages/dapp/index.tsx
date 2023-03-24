import Head from 'next/head';
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import { useEthers } from '@usedapp/core';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import { useMethods, useDapp } from '@/hooks/dapp';
import { OneMethod } from '@/views/dapp/OneMethod';
import { IDapp } from '@/database/dapp';
import { TabName } from '@/constants';

interface PannelTabsProps {
  tab: TabName;
  setTab: Dispatch<SetStateAction<TabName>>;
}

interface ConnectOrSwitchChainProps {
  isRead: boolean;
  isNetworkError: boolean;
  dapp?: IDapp;
}

function PannelTabs(props: PannelTabsProps) {
  const { tab, setTab } = props;

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <Button variant={tab === TabName.read ? 'contained' : 'outlined'} onClick={() => setTab(TabName.read)}>
        Read Contract
      </Button>
      <Button variant={tab === TabName.write ? 'contained' : 'outlined'} onClick={() => setTab(TabName.write)}>
        Write Contract
      </Button>
    </Stack>
  );
}

function ConnectOrSwitchChain(props: ConnectOrSwitchChainProps) {
  const { account, activateBrowserWallet, switchNetwork } = useEthers();
  const { isNetworkError, dapp } = props;

  if (!dapp) return null;

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      {!account && (
        <Button variant="outlined" color="error" startIcon={<FiberManualRecordIcon />} onClick={activateBrowserWallet}>
          Connect to Web3
        </Button>
      )}

      {!!account && isNetworkError && (
        <Button variant="outlined" color="error" onClick={() => switchNetwork(dapp?.chainId)}>
          Switch to {dapp.chainName}
        </Button>
      )}
    </Stack>
  );
}

export default function Dapp() {
  const { account, library, chainId, switchNetwork, activateBrowserWallet } = useEthers();
  const { query } = useRouter();

  const dapp = useDapp(Number(query.chainId), String(query.address));
  const { reads, writes } = useMethods(dapp?.abi);

  const [tab, setTab] = useState<TabName>(TabName.read);

  const isNetworkError = !!chainId && !!dapp?.chainId && chainId !== dapp.chainId;

  const isRead = tab === TabName.read;
  const isWrite = tab === TabName.write;
  const methods = isRead ? reads : isWrite ? writes : [];
  const disableMethod = !account || isNetworkError; // 所有都方法需要连接正确的网络

  if (!dapp) return null;

  return (
    <>
      <Head>
        <title>DApp</title>
      </Head>
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <PannelTabs tab={tab} setTab={setTab}></PannelTabs>
          <ConnectOrSwitchChain dapp={dapp} isNetworkError={isNetworkError} isRead={tab === TabName.read}></ConnectOrSwitchChain>

          <Stack direction="column" spacing={2}>
            {methods.map((ifac, index) => (
              <OneMethod
                key={`${dapp.address}_${index}_${ifac.name}`}
                disabled={disableMethod}
                type={tab}
                index={index}
                name={ifac.name}
                ifac={ifac}
                library={library}
                address={dapp.address}
                signAccount={account}
              ></OneMethod>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
