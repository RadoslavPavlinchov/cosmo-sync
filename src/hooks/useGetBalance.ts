import { useState, useCallback } from 'react';
import BigNumber from 'bignumber.js';
import { useCosmosContext } from '@/context/CosmosContext';

export const useGetBalance = (address: string) => {
  const { stargateClient, denom } = useCosmosContext();
  const [balance, setBalance] = useState(new BigNumber(0));
  const [isFetching, setFetching] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!address || !stargateClient) {
      setBalance(new BigNumber(0));
      setFetching(false);
      return;
    }

    setFetching(true);

    const balance = await stargateClient.getBalance(address, denom || '');

    setBalance(new BigNumber(balance.amount));
    setFetching(false);
  }, [stargateClient, address, denom]);

  return { balance, isFetching, fetchBalance };
};
