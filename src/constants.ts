export const supportedChains = [
  {
    chain_id: 'mantra-dukong-1',
    chain_name: 'mantrachaintestnet2',
    pretty_name: 'MANTRA Dukong Testnet',
  },
  {
    chain_id: 'mocha-4',
    chain_name: 'celestiatestnet3',
    pretty_name: 'Mocha Testnet',
  },
  { chain_id: 'grand-1', chain_name: 'nobletestnet', pretty_name: 'Noble' },
  {
    chain_id: 'osmo-test-5',
    chain_name: 'osmosistestnet',
    pretty_name: 'Osmosis Testnet',
  },
];

export const mintscanChainRoutes: { [key: string]: string } = {
  mantrachaintestnet2: 'mantra-testnet',
  celestiatestnet3: 'celestia-testnet',
  nobletestnet: 'noble-testnet',
  osmosistestnet: 'osmosis-testnet',
};
