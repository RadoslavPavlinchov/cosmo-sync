'use client';

import { useState, useTransition } from 'react';
import { decodeTransaction, getExplorerTxUrl } from '../../utils/utils';
import { useCosmosContext } from '@/context/CosmosContext';
// import { IndexedTx } from "@cosmjs/stargate";
// import { Tx } from "cosmjs-types/cosmos/tx/v1beta1/tx";
// import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";

interface TxViewerProps {
  getTxDetails: (txHash: string, rpcEndpoint: string) => Promise<any>;
}

export default function TxViewer({ getTxDetails }: TxViewerProps) {
  const { chainName, rpcEndpoint } = useCosmosContext();

  const [txHash, setTxHash] = useState('');
  const [decodedTx, setDecodedTx] = useState<any>(null);
  const [sendMessage, setSendMessage] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearchTx = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!txHash.trim()) return;

    startTransition(async () => {
      try {
        const txData = await getTxDetails(txHash, rpcEndpoint);
        const { decodedTx, sendMessage } = decodeTransaction(txData);

        setDecodedTx(decodedTx);
        setSendMessage(sendMessage);
      } catch (error) {
        console.error('Error decoding transaction', error);
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSearchTx} className="mb-4">
        <input
          type="text"
          placeholder="Enter Transaction Hash"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Search Transaction
        </button>
      </form>

      {isPending && <p>Loading transaction details...</p>}
      
      {decodedTx && (
        <div>
          <h2 className="text-xl font-bold">Decoded Transaction Details</h2>
          <p>
            <strong>Memo:</strong> {decodedTx.body.memo || 'N/A'}
          </p>
          <p>
            <strong>Fee:</strong>{' '}
            {decodedTx.authInfo?.fee?.amount
              ?.map(
                (coin: { amount: string; denom: string }) =>
                  `${coin.amount} ${coin.denom}`,
              )
              .join(', ') || 'N/A'}
          </p>
          {sendMessage && (
            <div>
              <h3 className="text-lg font-semibold">
                Decoded Message (MsgSend)
              </h3>
              <p>
                <strong>From:</strong> {sendMessage.fromAddress}
              </p>
              <p>
                <strong>To:</strong> {sendMessage.toAddress}
              </p>
              <p>
                <strong>Amount:</strong>{' '}
                {sendMessage.amount
                  ?.map(
                    (coin: { amount: string; denom: string }) =>
                      `${coin.amount} ${coin.denom}`,
                  )
                  .join(', ') || 'N/A'}
              </p>
            </div>
          )}
          <p>
            <strong>Explorer:</strong>{' '}
            <a
              href={getExplorerTxUrl(chainName, txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View on Mintscan
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
