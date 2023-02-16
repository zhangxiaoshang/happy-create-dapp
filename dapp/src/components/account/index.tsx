import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useEthers, useChainMeta, shortenIfAddress } from '@usedapp/core';

export default function Account() {
  const { account, chainId, activateBrowserWallet } = useEthers();
  const chainMeta = useChainMeta(chainId ?? 1);

  if (account)
    return (
      <>
        <span>ChainName: {chainMeta.chainName}</span>
        <span>Account: {shortenIfAddress(account)}</span>
      </>
    );

  return (
    <Button variant="contained" onClick={activateBrowserWallet}>
      Connect Wallet
    </Button>
  );
}
