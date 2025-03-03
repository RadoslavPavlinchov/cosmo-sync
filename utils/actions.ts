'use server';

import { sha256 } from '@cosmjs/crypto';
import { StargateClient } from '@cosmjs/stargate';

export async function getBlock(blockNumber: number, rpcEndpoint: string) {
  const client = await StargateClient.connect(rpcEndpoint);
  const block = await client.getBlock(blockNumber);

  console.log('HOLY SHIT 1', block);

  const txHashes = block.txs.map((txBase64) => {
    const txBytes = Buffer.from(txBase64.toString(), 'base64');
    return Buffer.from(sha256(txBytes)).toString('hex').toUpperCase();
  });

  console.log('HOLY SHIT 2', txHashes);

  return {
    id: block.id,
    header: block.header,
    txs: txHashes,
  };
}

export async function getCurrentBlockNumber(rpcEndpoint: string) {
  const client = await StargateClient.connect(rpcEndpoint);
  const height = await client.getHeight();
  return height;
}

export async function getTxDetails(txHash: string, rpcEndpoint: string) {
  const client = await StargateClient.connect(rpcEndpoint);
  const tx = await client.getTx(txHash);
  return tx;
}
