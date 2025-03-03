'use client';

import { useEffect, useState } from 'react';
import { useChain } from '@cosmos-kit/react';
import { useCosmosContext } from '@/context/CosmosContext';

interface Balance {
  denom: string;
  amount: string;
}

export default function WalletBalance() {
  const { chainName, rpcEndpoint, stargateClient } = useCosmosContext();
  const { status, address } = useChain(chainName);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalances = async () => {
      if (status === 'Connected' && address && rpcEndpoint) {
        setLoading(true);
        try {
          if (!stargateClient) return;

          const result = await stargateClient.getAllBalances(address);
          setBalances([...result]);
        } catch (error) {
          console.error('Error fetching balances:', error);
        }
        setLoading(false);
      }
    };

    fetchBalances();
  }, [status, address, rpcEndpoint, stargateClient]);

  if (status !== 'Connected') {
    return <p>Please connect your wallet to view your balances.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Wallet Balances</h2>
      {loading ? (
        <p>Loading balances...</p>
      ) : balances.length > 0 ? (
        <ul className="space-y-2">
          {balances.map((balance, idx) => (
            <li key={idx} className="flex items-center space-x-2">
              <span className="font-medium">{balance.amount}</span>
              <span>{balance.denom.toUpperCase()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No balances found.</p>
      )}
    </div>
  );
}
