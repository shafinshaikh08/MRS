import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query) {
      onSearch(query);  // Pass the search query to the parent component (App.js)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 text-center w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for movies..."
        className="px-4 py-2 rounded-md border border-white bg-transparent text-white"
      />
      <button type="submit" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Search
      </button>
    </form>
  );
}

export default SearchBar;