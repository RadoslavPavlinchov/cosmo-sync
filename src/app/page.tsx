import Head from 'next/head';
import WalletBalance from '../components/walletBalance';
import WalletDetails from '@/components/walletDetails';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Cosmosync - Wallet Connection</title>
        <meta
          name="description"
          content="Connect your wallet, view balances, and interact with the Cosmos ecosystem."
        />
      </Head>
      <main className="container mx-auto px-4 py-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Wallet Connection</h2>
          <WalletDetails />
          <WalletBalance />
        </section>
      </main>
    </>
  );
}
