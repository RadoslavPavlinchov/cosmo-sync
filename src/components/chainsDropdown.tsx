'use client';

import { useCosmosContext } from '@/context/CosmosContext';
import { useChain } from '@cosmos-kit/react';
import { Button } from '../components/button';
import { supportedChains } from '../constants';

export default function ChainDropdown() {
  const { chainName, setChainName } = useCosmosContext();

  const selectedChainObj =
    supportedChains.find((chain) => chain.chain_name === chainName) ||
    supportedChains[0];

  const { status, connect, disconnect } = useChain(chainName);

  const handleChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newChain = supportedChains.find(
      (chain) => chain.chain_id === e.target.value,
    );

    if (newChain) {
      setChainName(newChain.chain_name);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        id="chain-select"
        value={selectedChainObj.chain_id}
        onChange={handleChainChange}
        className="rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {supportedChains.map((chain) => (
          <option key={chain.chain_id} value={chain.chain_id}>
            {chain.pretty_name}
          </option>
        ))}
      </select>
      {status === 'Connected' ? (
        <Button onClick={disconnect}>Disconnect</Button>
      ) : (
        <Button onClick={connect}>Connect</Button>
      )}
    </div>
  );
}
