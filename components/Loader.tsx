
import React from 'react';
import { LadybugIcon } from './icons';

interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "Exploring the InsectVerse..." }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center text-green-800">
    <LadybugIcon className="w-16 h-16 text-amber-500 animate-bounce" />
    <p className="mt-4 text-lg font-semibold">{text}</p>
    <p className="text-sm text-gray-600">Our AI is gathering fascinating details for you.</p>
  </div>
);

export default Loader;
