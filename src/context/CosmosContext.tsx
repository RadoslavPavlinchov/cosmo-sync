import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SigningStargateClient, StargateClient } from '@cosmjs/stargate';
import { useChain } from '@cosmos-kit/react';
import { supportedChains } from '@/constants';

export type OfflineSigner = ReturnType<
  ReturnType<typeof useChain>['getOfflineSigner']
>;

interface CosmosContextProps {
  signingClient: SigningStargateClient | null;
  stargateClient: StargateClient | null;
  offlineSigner: OfflineSigner | null;
  rpcEndpoint: string;
  chainName: string;
  setChainName: (chain: string) => void;
  denom: string | undefined;
}

const CosmosClientContext = createContext<CosmosContextProps | undefined>(
  undefined,
);

export const CosmosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const defaultChainName = supportedChains[0].chain_name;
  const [chainName, setChainName] = useState<string>(defaultChainName);

  const { address, chain, getRpcEndpoint, getOfflineSigner } =
    useChain(chainName);

  const [rpcEndpoint, setRpcEndpoint] = useState<string>('');
  const [signingClient, setSigningClient] =
    useState<SigningStargateClient | null>(null);
  const [stargateClient, setStargateClient] = useState<StargateClient | null>(
    null,
  );
  const [offlineSigner, setOfflineSigner] = useState<OfflineSigner | null>(
    null,
  );

  const denom = useMemo(
    () => chain?.staking?.staking_tokens[0]?.denom,
    [chain],
  );

  useEffect(() => {
    async function init() {
      try {
        const rpc = await getRpcEndpoint();
        const rpcUrl = typeof rpc === 'string' ? rpc : rpc?.url || '';
        setRpcEndpoint(rpcUrl);

        if (rpcUrl) {
          const stargateClientInstance = await StargateClient.connect(rpcUrl);
          setStargateClient(stargateClientInstance);
        }

        if (address && rpcUrl) {
          const signer = await getOfflineSigner();
          setOfflineSigner(signer);

          const signingClientInstance =
            await SigningStargateClient.connectWithSigner(rpcUrl, signer);
          setSigningClient(signingClientInstance);
        }
      } catch (error) {
        console.error('Failed to initialize Cosmos client:', error);
      }
    }

    init();

    return () => {
      setSigningClient(null);
      setStargateClient(null);
      setOfflineSigner(null);
      setRpcEndpoint('');
    };
  }, [address, chainName, getRpcEndpoint, getOfflineSigner]);

  return (
    <CosmosClientContext.Provider
      value={{
        signingClient,
        stargateClient,
        offlineSigner,
        rpcEndpoint,
        chainName,
        setChainName,
        denom,
      }}
    >
      {children}
    </CosmosClientContext.Provider>
  );
};

export const useCosmosContext = (): CosmosContextProps => {
  const context = useContext(CosmosClientContext);
  if (!context) {
    throw new Error('useCosmosContext must be used within a CosmosProvider');
  }
  return context;
};
