import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { DAppProvider, Config, Localhost, Hardhat, Mainnet, Goerli, BSC, BSCTestnet } from '@usedapp/core';
import { getDefaultProvider, providers } from 'ethers';
import Layout from '@/components/layout/index';

const NEXT_PUBLIC_ALCHEMY_MAINNET_APIKEY = process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_APIKEY as string;
const NEXT_PUBLIC_ALCHEMY_GOERLI_APIKEY = process.env.NEXT_PUBLIC_ALCHEMY_GOERLI_APIKEY as string;

const INFURA_APIKEY = process.env.NEXT_PUBLIC_INFURA_APIKEY as string;

export const networks = [Hardhat, Mainnet, Goerli, BSC, BSCTestnet];

const config: Config = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Hardhat.chainId]: getDefaultProvider(Hardhat.rpcUrl),
    // [Mainnet.chainId]: getDefaultProvider(Mainnet.chainId, { alchemy: NEXT_PUBLIC_ALCHEMY_MAINNET_APIKEY as string }),
    // [Goerli.chainId]: getDefaultProvider(Goerli.chainId, { infura: INFURA_APIKEY }),
    // [Goerli.chainId]: getDefaultProvider('https://goerli.infura.io/v3/3c09a2d37dfd44bc9715e7ceed1a8440'),
    // [Goerli.chainId]: new providers.InfuraProvider(Goerli.chainId, INFURA_APIKEY),
    [Goerli.chainId]: getDefaultProvider('https://goerli.infura.io/v3/3c09a2d37dfd44bc9715e7ceed1a8440'),

    // [Goerli.chainId]: getDefaultProvider(Goerli.chainId, { infura: '3c09a2d37dfd44bc9715e7ceed1a8440' }),
    // [BSC.chainId]: getDefaultProvider(BSC.rpcUrl),
    // [BSCTestnet.chainId]: getDefaultProvider(BSCTestnet.rpcUrl),
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
