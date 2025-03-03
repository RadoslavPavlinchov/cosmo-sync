import '../globals.css';

import Navbar from '../components/navbar';
import { Providers } from '../providers';

export const metadata = {
  title: 'Cosmosync',
  description: 'Cosmos Kit integration with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <Navbar />
          <main className="container mx-auto p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
