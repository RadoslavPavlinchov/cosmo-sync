import Link from 'next/link';
import ChainDropdown from '../components/chainsDropdown';

export default function Navbar() {
  return (
    <nav className="bg-gray-100 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:underline"
        >
          Cosmosync
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/assets" className="text-blue-600 hover:underline">
              Assets
            </Link>
          </li>
          <li>
            <Link href="/transfer" className="text-blue-600 hover:underline">
              Send Transaction
            </Link>
          </li>
          <li>
            <Link href="/search" className="text-blue-600 hover:underline">
              Search
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <ChainDropdown />
      </div>
    </nav>
  );
}
