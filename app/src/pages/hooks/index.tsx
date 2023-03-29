import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';

import { useMethods, useDapp } from '@/hooks/dapp';
import { TabName } from '@/constants';

import { TabsPannel } from '@/views/dapp/TabsPannel';
import { CallFunctionCode } from '@/views/hooks/CallFunctionCode';
import { FullHooksCode } from '@/views/hooks/FullHooksCode';

export default function Hooks() {
  const { query } = useRouter();
  const { chainId, address } = query ?? {};

  const [tab, setTab] = useState<TabName>(TabName.read);

  const dapp = useDapp(Number(chainId), String(address));
  const { reads, writes } = useMethods(dapp?.abi);

  const isRead = tab === TabName.read;

  if (!dapp) return null;

  return (
    <>
      <Head>
        <title>Hooks</title>
      </Head>
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          {/* <TabsPannel tab={tab} setTab={setTab}></TabsPannel> */}

          <Stack direction="column" spacing={2}>
            {/* full hooks code */}
            <FullHooksCode address={dapp.address} abiFuncs={reads}></FullHooksCode>

            {/* sigle hook */}
            {isRead &&
              reads.map((abiFunc, index) => (
                <CallFunctionCode key={`${dapp.chainId}_${dapp.address}_${index}_${abiFunc.name}`} index={index} abiFunc={abiFunc}></CallFunctionCode>
              ))}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
