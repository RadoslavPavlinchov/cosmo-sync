'use client';

import '@interchain-ui/react/styles';

import { ChainProvider } from '@cosmos-kit/react';
import { chains, assets } from 'chain-registry';
import { useWalletManager } from './hooks/useWalletManager';
import { CosmosProvider } from '@/context/CosmosContext';

// export interface SessionOptions {
//   duration: number; // ms
//   callback?: () => void; // when session expires
// }

export function Providers({ children }: { children: React.ReactNode }) {
  const { walletManager } = useWalletManager();
  const mainWallets = walletManager.mainWallets;

  // const sessionOptions: SessionOptions = {
  //   duration: 60000,
  //   callback: () => {
  //     mainWallets.forEach((w) => w.disconnectAll(false));
  //     window?.localStorage.removeItem("cosmos-kit@2:core//current-wallet");
  //   },
  // };

  return (
    <ChainProvider
      chains={chains}
      assetLists={assets}
      wallets={mainWallets}
      //   endpointOptions={{
      //     isLazy: true, // optional: delays endpoint validation until needed
      //     endpoints: {
      //       cosmoshub: {
      //         rpc: [{ url: 'https://rpc.cosmos.directory/cosmoshub', headers: {} }],
      //         rest: ['https://lcd.cosmos.directory/cosmoshub']
      //       },
      //       // add other chain endpoints as needed.
      //     },
      //   }}
      //   sessionOptions={sessionOptions}
    >
      <CosmosProvider>{children}</CosmosProvider>
    </ChainProvider>
  );
}
