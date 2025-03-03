'use client';

import { useState, useMemo } from 'react';
import { useChain } from '@cosmos-kit/react';
import { StdFee } from '@cosmjs/amino';
import { Button } from './button';
import { useGetBalance } from '@/hooks/useGetBalance';
import { useCosmosContext } from '@/context/CosmosContext';
import { MsgSendEncodeObject } from '@cosmjs/stargate';
import { getExplorerTxUrl } from '../../utils/utils';
// import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';

export default function TransferTokens() {
  const { chainName } = useCosmosContext();

  const { address, status, chain, assets } = useChain(chainName);
  const { balance, isFetching, fetchBalance } = useGetBalance(address || '');
  const { signingClient, denom } = useCosmosContext();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [method, setMethod] = useState('sendTokens');
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);

  const nativeAsset = useMemo(() => {
    const nativeDenom = chain.staking?.staking_tokens[0]?.denom;
    return assets?.assets.find((asset) => asset.base === nativeDenom);
  }, [assets, chain]);

  const fee: StdFee = {
    amount: [{ denom: nativeAsset?.base || '', amount: '1000000' }],
    gas: '1000000',
  };

  const memo = 'Nice memo btw';

  const convert = (amount: string) => {
    const denomDecimals = nativeAsset?.denom_units[1].exponent || 0;
    return (BigInt(amount) * BigInt(10 ** denomDecimals)).toString();
  };

  const handleTransfer = async () => {
    if (status !== 'Connected') {
      alert('Please connect your wallet.');
      return;
    }

    if (!amount || !recipient) {
      alert('Please fill in both amount and recipient address.');
      return;
    }

    setLoading(true);
    setTxHash('');

    try {
      if (!signingClient || !address)
        throw new Error('Failed to get signing client or address is undefined');

      const amountToSend = convert(amount);

      let result;

      if (method === 'sendTokens') {
        result = await signingClient.sendTokens(
          address!,
          recipient,
          [
            {
              denom: nativeAsset?.base || '',
              amount: amountToSend,
            },
          ],
          fee,
          memo,
        );
      } else if (method === 'signAndBroadcast') {
        const msg: MsgSendEncodeObject = {
          typeUrl: '/cosmos.bank.v1beta1.MsgSend',
          value: {
            fromAddress: address,
            toAddress: recipient,
            amount: [{ amount: amountToSend, denom: denom || '' }],
          },
        };

        result = await signingClient.signAndBroadcast(
          address,
          [msg],
          fee,
          memo,
        );
      }

      if (result) {
        setTxHash(result.transactionHash);
      }
    } catch (error) {
      console.error('Transfer error:', error);
      if (error instanceof Error) {
        alert('Transfer failed: ' + error.message);
      } else {
        alert('Transfer failed: An unknown error occurred.');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {status !== 'Connected' ? (
        <p>Please connect your wallet to proceed.</p>
      ) : (
        <>
          <p>
            <strong>Your Address:</strong> {address}
          </p>

          <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <p>
              <strong>Balance:</strong> {balance.toString()}
            </p>
            <div>
              <Button onClick={() => fetchBalance()}>
                {isFetching ? 'Fetching Balance...' : 'Get Balance'}
              </Button>
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>
              Amount:
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
                placeholder="Enter amount"
              />
            </label>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>
              Recipient Address:
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                style={{
                  marginLeft: '10px',
                  padding: '5px',
                  width: '100%',
                }}
                placeholder="Enter recipient address"
              />
            </label>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>
              Transfer Method:
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
              >
                <option value="sendTokens">Use sendTokens method</option>
                <option value="signAndBroadcast">
                  Use signAndBroadcast method
                </option>
              </select>
            </label>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <Button onClick={handleTransfer} disabled={loading}>
              {loading ? 'Transferring...' : 'Transfer Tokens'}
            </Button>
          </div>

          {txHash && (
            <div>
              <p>
                <strong>Transaction Hash:</strong>
              </p>
              <a
                href={getExplorerTxUrl(chainName, txHash)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'blue',
                  textDecoration: 'underline',
                  wordBreak: 'break-all',
                }}
              >
                {txHash}
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
