'use client';

import { useState } from 'react';
import BlockViewer from '../../components/blockViewer';
import TxViewer from '../../components/txViewer';
import SearchToggle from '../../components/searchToggle';
import {
  getBlock,
  getCurrentBlockNumber,
  getTxDetails,
} from '../../../utils/actions';

export default function Page() {
  const [mode, setMode] = useState<'block' | 'tx'>('block');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <SearchToggle mode={mode} setMode={setMode} />
      {mode === 'block' ? (
        <BlockViewer
          getBlock={getBlock}
          getCurrentBlockNumber={getCurrentBlockNumber}
          getTxDetails={getTxDetails}
        />
      ) : (
        <TxViewer getTxDetails={getTxDetails} />
      )}
    </div>
  );
}
