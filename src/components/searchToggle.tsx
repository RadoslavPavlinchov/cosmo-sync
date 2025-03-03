'use client';

interface SearchToggleProps {
  mode: 'block' | 'tx';
  setMode: (mode: 'block' | 'tx') => void;
}

export default function SearchToggle({ mode, setMode }: SearchToggleProps) {
  return (
    <div className="mb-4">
      <button
        onClick={() => setMode('block')}
        className={`px-4 py-2 rounded-l ${
          mode === 'block' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        Block
      </button>
      <button
        onClick={() => setMode('tx')}
        className={`px-4 py-2 rounded-r ${
          mode === 'tx' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        Transaction
      </button>
    </div>
  );
}
