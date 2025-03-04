import { useState, useTransition, useEffect } from 'react';
import { decodeTransaction, getExplorerTxUrl } from '../../utils/utils';
import { useCosmosContext } from '@/context/CosmosContext';

interface BlockViewerProps {
  getBlock: (blockNumber: number, rpcEndpoint: string) => Promise<any>;
  getCurrentBlockNumber: (rpcEndpoint: string) => Promise<number>;
  getTxDetails: (txHash: string, rpcEndpoint: string) => Promise<any>;
}

export default function BlockViewer({
  getBlock,
  getCurrentBlockNumber,
  getTxDetails,
}: BlockViewerProps) {
  const { chainName, rpcEndpoint } = useCosmosContext();

  const [currentBlock, setCurrentBlock] = useState<number | null>(null);
  const [inputBlock, setInputBlock] = useState<string>('');
  const [blockData, setBlockData] = useState<any>(null);
  const [txDetails, setTxDetails] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  // On component mount, fetch the current block number.
  useEffect(() => {
    async function fetchCurrentBlock() {
      try {
        const current = await getCurrentBlockNumber(rpcEndpoint);
        startTransition(() => {
          setCurrentBlock(current);
        });
      } catch (error) {
        console.error('Error fetching current block number:', error);
      }
    }
    fetchCurrentBlock();
  }, [getCurrentBlockNumber, rpcEndpoint]);

  // Fetch block data when a block number is submitted.
  const handleFetchBlock = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const num = Number(inputBlock);
    if (!num) return;
    try {
      const data = await getBlock(num, rpcEndpoint);
      startTransition(() => {
        setBlockData(data);
        setTxDetails(null); // Reset previous tx details.
      });
    } catch (error) {
      console.error('Error fetching block data:', error);
    }
  };

  // When a transaction hash is clicked, fetch and decode its details.
  const handleTxClick = async (txHash: string) => {
    startTransition(async () => {
      try {
        const txData = await getTxDetails(txHash, rpcEndpoint);
        // Guard: Check that txData is valid and contains the 'tx' property.
        if (!txData || !txData.tx) {
          console.error('Invalid transaction data received:', txData);
          return;
        }
        const { decodedTx, sendMessage } = decodeTransaction(txData);
        setTxDetails({ decodedTx, sendMessage, txHash });
      } catch (error) {
        console.error('Error decoding transaction:', error);
      }
    });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Block Viewer</h1>
      {currentBlock !== null && (
        <p>
          <strong>Current Block:</strong> {currentBlock}
        </p>
      )}

      <form onSubmit={handleFetchBlock} style={{ marginBottom: '1rem' }}>
        <input
          type="number"
          placeholder="Enter block number"
          value={inputBlock}
          onChange={(e) => setInputBlock(e.target.value)}
          style={{ marginRight: '0.5rem', padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Fetch Block
        </button>
      </form>

      {isPending && <p>Loading block data...</p>}

      {blockData && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Block Details</h2>
          <p>
            <strong>Height:</strong> {blockData.header.height}
          </p>
          <p>
            <strong>Timestamp:</strong>{' '}
            {new Date(blockData?.header?.time).toString()}
          </p>

          <h3>Transactions</h3>
          {blockData.txs && blockData.txs.length > 0 ? (
            <ul>
              {blockData.txs.map((tx: string, idx: number) => {
                // Show a short placeholder of the tx hash.
                const txHashPlaceholder = tx.substring(0, 10) + '...';
                return (
                  <li
                    key={idx}
                    style={{
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: 'blue',
                      marginBottom: '0.5rem',
                    }}
                    onClick={() => handleTxClick(tx)}
                  >
                    {txHashPlaceholder}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No transactions in this block.</p>
          )}
        </div>
      )}

      {txDetails && (
        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Transaction Details</h2>
          <p>
            <strong>Tx Hash:</strong> {txDetails.txHash}
          </p>
          {txDetails.decodedTx && (
            <>
              <p>
                <strong>Memo:</strong> {txDetails.decodedTx.body.memo || 'N/A'}
              </p>
              <p>
                <strong>Fee:</strong>{' '}
                {txDetails.decodedTx.authInfo?.fee?.amount
                  ?.map(
                    (coin: { amount: string; denom: string }) =>
                      `${coin.amount} ${coin.denom}`,
                  )
                  .join(', ') || 'N/A'}
              </p>
            </>
          )}
          {txDetails.sendMessage && (
            <div>
              <h3>Decoded Message (MsgSend)</h3>
              <p>
                <strong>From:</strong> {txDetails.sendMessage.fromAddress}
              </p>
              <p>
                <strong>To:</strong> {txDetails.sendMessage.toAddress}
              </p>
              <p>
                <strong>Amount:</strong>{' '}
                {txDetails.sendMessage.amount
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
              href={getExplorerTxUrl(chainName, txDetails.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline', color: 'blue' }}
            >
              View on Mintscan
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
