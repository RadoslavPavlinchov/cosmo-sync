import { IndexedTx } from '@cosmjs/stargate';
import { Tx } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { mintscanChainRoutes } from '@/constants';

export function decodeTransaction(txData: IndexedTx) {
  const decodedTx = Tx.decode(txData.tx);
  let sendMessage = null;

  if (decodedTx.body?.messages && decodedTx.body.messages.length > 0) {
    try {
      sendMessage = MsgSend.decode(decodedTx.body.messages[0].value);
    } catch (msgError) {
      console.error('Message is not a MsgSend', msgError);
    }
  }
  return { decodedTx, sendMessage };
}

export function getExplorerTxUrl(chainName: string, txHash: string): string {
  const routeSegment = mintscanChainRoutes[chainName] || chainName;
  return `https://www.mintscan.io/${routeSegment}/tx/${txHash}`;
}
