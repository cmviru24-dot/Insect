
import React from 'react';
import { LadybugIcon } from './icons';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-yellow-50/50">
      <div className="text-center">
        <LadybugIcon className="w-24 h-24 mx-auto text-amber-500 animate-pulse" />
        <h1 className="mt-4 text-4xl font-bold text-green-900 tracking-tight">InsectVerse</h1>
        <p className="text-lg text-gray-600">The Intelligent Insect Explorer</p>
      </div>
    </div>
  );
};

export default SplashScreen;
