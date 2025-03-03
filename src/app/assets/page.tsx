import Link from 'next/link';
import Image from 'next/image';
import { assets } from 'chain-registry';
import { supportedChains } from '@/constants';

export default function AssetsPage() {
  const filteredAssets = assets.filter((chainAsset: any) =>
    supportedChains.some((chain) => chain.chain_name === chainAsset.chain_name),
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Assets List</h1>
      {filteredAssets.length > 0 ? (
        <div className="space-y-8">
          {filteredAssets.map((chainAsset: any, idx: number) => (
            <div key={idx}>
              <h2 className="text-xl font-semibold mb-2">
                {chainAsset.chain_name || chainAsset.chainId}
              </h2>
              <ul className="grid grid-cols-2 gap-4">
                {chainAsset.assets.map((asset: any, index: number) => (
                  <li
                    key={index}
                    className="flex items-center space-x-4 p-2 border rounded"
                  >
                    {asset.logo_URIs?.png ? (
                      <Image
                        src={asset.logo_URIs?.png}
                        alt={asset?.coinDenom || ''}
                        width={32}
                        height={32}
                        className="w-8 h-8"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200" />
                    )}
                    <span className="font-medium">{asset.symbol}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>No assets available for the selected networks.</p>
      )}

      <div className="mt-8">
        <Link href="/" className="text-blue-500 underline">
          Go back to Home
        </Link>
      </div>
    </div>
  );
}
