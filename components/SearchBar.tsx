
import React, { useState } from 'react';
import { SearchIcon } from './icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for an insect (e.g., Monarch Butterfly)"
          className="w-full px-5 py-4 text-lg text-gray-700 bg-white border-2 border-gray-300 rounded-full focus:outline-none focus:border-amber-500 shadow-sm transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center px-6 text-white bg-amber-500 rounded-r-full hover:bg-amber-600 disabled:bg-gray-400"
          disabled={isLoading}
        >
          <SearchIcon className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
