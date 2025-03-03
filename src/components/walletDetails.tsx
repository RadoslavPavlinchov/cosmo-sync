'use client';

import { useCosmosContext } from '@/context/CosmosContext';
import { useChain } from '@cosmos-kit/react';

export default function WalletDetails() {
  const { chainName } = useCosmosContext();

  const { status, username, address, message } = useChain(chainName);

  return (
    <div>
      <p>Status: {status}</p>
      {username && <p>Username: {username}</p>}
      {address && <p>Address: {address}</p>}
      {message && <p>Message: {message}</p>}
    </div>
  );
}
