import React, { useState, useEffect, useCallback } from 'react';
import { fetchInsectData, isInsect } from './services/geminiService';
import type { InsectData } from './types';
import SearchBar from './components/SearchBar';
import InsectDetail from './components/InsectDetail';
import Loader from './components/Loader';
import SplashScreen from './components/SplashScreen';
import Dashboard from './components/Dashboard';
import { LadybugIcon } from './components/icons';

const App: React.FC = () => {
  const [insectData, setInsectData] = useState<InsectData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    setInsectData(null);
    try {
      if (!(await isInsect(query))) {
        setError("Its an INSECTVERSE please search only INSECTS");
        return;
      }
      const data = await fetchInsectData(query);
      setInsectData(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetSearch = () => {
    setInsectData(null);
    setError(null);
    setIsLoading(false);
  }

  if (isInitialLoad) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-yellow-50/50 font-sans text-gray-800">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-8 flex flex-col items-center">
            <div onClick={resetSearch} className="cursor-pointer flex items-center gap-2 group">
                <LadybugIcon className="w-10 h-10 text-amber-600 group-hover:animate-pulse" />
                <h1 className="text-4xl font-bold text-green-900 tracking-tight">InsectVerse</h1>
            </div>
            <p className="text-md text-gray-600">The Intelligent Insect Explorer</p>
        </header>

        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        <div className="mt-8">
          {isLoading && <Loader text="Generating a high-quality image and info..." />}
          {error && (
            <div className="text-center p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-md mx-auto">
              <h3 className="font-bold">Oops! Something went wrong.</h3>
              <p>{error}</p>
            </div>
          )}
          {!isLoading && !error && insectData && <InsectDetail data={insectData} />}
          {!isLoading && !error && !insectData && <Dashboard onSearch={handleSearch} />}
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-gray-500">
        <p>Powered by Gemini API. Created for educational purposes.</p>
      </footer>
    </div>
  );
};

export default App;