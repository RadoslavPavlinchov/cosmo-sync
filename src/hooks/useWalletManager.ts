import { useMemo } from 'react';
import { WalletManager, Logger } from '@cosmos-kit/core';
import { wallets as leapWallets } from '@cosmos-kit/leap';
import { wallets as keplrWallets } from '@cosmos-kit/keplr';
import {
  assets,
  // chains
} from 'chain-registry';
// import { supportedChains } from "@/constants";

export function useWalletManager() {
  // const chainIds = supportedChains.map((chain) => chain.chain_name);

  const walletManager = useMemo(() => {
    // desktop only for now
    const walletList = [keplrWallets[0], leapWallets[0]];

    return new WalletManager(
      [],
      walletList,
      new Logger('NONE'),
      false,
      undefined,
      undefined,
      assets,
    );
  }, []); // chainIds

  return { walletManager };
}
