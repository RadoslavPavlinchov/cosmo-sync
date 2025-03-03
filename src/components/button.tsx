'use client';

import { JSX } from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: JSX.Element | string | (JSX.Element | string)[];
  className?: string;
  disabled?: boolean;
}

export function Button({ onClick, children, className = '' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-500 text-white p-2 rounded ${className}`}
    >
      {children}
    </button>
  );
}
