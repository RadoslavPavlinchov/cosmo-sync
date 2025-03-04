'use server';

import { sha256 } from '@cosmjs/crypto';
import { toHex } from '@cosmjs/encoding';
import { StargateClient } from '@cosmjs/stargate';

export async function getBlock(blockNumber: number, rpcEndpoint: string) {
  const client = await StargateClient.connect(rpcEndpoint);
  const block = await client.getBlock(blockNumber);

  const txHashes = block.txs.map((tx) => {
    const hash = sha256(tx);
    return toHex(hash).toUpperCase();
  });

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
