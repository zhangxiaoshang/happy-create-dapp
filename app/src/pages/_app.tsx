import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { DAppProvider, Config, Hardhat, Mainnet, Goerli, BSC, BSCTestnet } from '@usedapp/core';
import { getDefaultProvider } from 'ethers';
import Layout from '@/components/layout/index';

const MAINNET_RPCURL = process.env.NEXT_PUBLIC_MAINNET_RPCURL as string;
const GOERLI_RPCURL = process.env.NEXT_PUBLIC_GOERLI_RPCURL as string;

export const networks = [Hardhat, Mainnet, Goerli, BSC, BSCTestnet];

const config: Config = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Hardhat.chainId]: getDefaultProvider(Hardhat.rpcUrl),
    [Mainnet.chainId]: MAINNET_RPCURL,
    [Goerli.chainId]: GOERLI_RPCURL,

    [BSC.chainId]: getDefaultProvider(BSC.rpcUrl),
    [BSCTestnet.chainId]: getDefaultProvider(BSCTestnet.rpcUrl),
  },
  networks,
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DAppProvider config={config}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </DAppProvider>
  );
}
