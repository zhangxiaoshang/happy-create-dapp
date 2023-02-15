import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useEthers, useChainMeta, shortenIfAddress } from "@usedapp/core";

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

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "none", md: "flex" },
        columnGap: 2,
        justifyContent: "flex-end",
        mr: 2,
      }}
    >
      {active ? (
        <>
          <span>ChainName: {chainMeta.chainName}</span>
          <span>Account: {shortenIfAddress(account)}</span>
        </>
      ) : (
        <Button variant="contained" onClick={activateBrowserWallet}>
          Connect Wallet
        </Button>
      )}
    </Box>
  );
}
