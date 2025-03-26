// GenreButton.js
import React from 'react';

function GenreButton({ genre, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full transition-colors focus:outline-none active:scale-95 ${
        isSelected ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      {genre}
    </button>
  );
}

export default GenreButton;