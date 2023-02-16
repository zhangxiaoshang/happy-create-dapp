import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import {
  DAppProvider,
  Config,
  // networks
  Localhost,
  Hardhat,
  Mainnet,
  Goerli,
  BSC,
  BSCTestnet,
} from '@usedapp/core';
import { getDefaultProvider } from 'ethers';
import Layout from '@/components/layout/index';

const NEXT_PUBLIC_ALCHEMY_MAINNET_APIKEY = process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_APIKEY as string;
const NEXT_PUBLIC_ALCHEMY_GOERLI_APIKEY = process.env.NEXT_PUBLIC_ALCHEMY_GOERLI_APIKEY as string;

export const networks = [Hardhat, Mainnet, Goerli];

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Hardhat.chainId]: getDefaultProvider(Hardhat.rpcUrl),
    [Mainnet.chainId]: getDefaultProvider(Mainnet.chainId, { alchemy: NEXT_PUBLIC_ALCHEMY_MAINNET_APIKEY as string }),
    [Goerli.chainId]: getDefaultProvider(Goerli.chainId, { alchemy: NEXT_PUBLIC_ALCHEMY_GOERLI_APIKEY }),
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
