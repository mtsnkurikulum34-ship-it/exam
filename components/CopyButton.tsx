
import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from './Icons';

interface CopyButtonProps {
  textToCopy: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
    >
      {copied ? (
        <>
          <CheckIcon className="h-5 w-5 text-green-500" />
          Copied!
        </>
      ) : (
        <>
          <ClipboardIcon className="h-5 w-5 text-slate-500" />
          Copy All
        </>
      )}
    </button>
  );
};
