// src/components/Movies/MovieGrid.js
import React from 'react';

function MovieGrid({ movies, isLoading }) {
  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <div key={movie.imdbID} className="bg-white p-4 rounded-lg shadow-md">
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="w-full h-48 object-cover rounded-md"
          />
          <h3 className="mt-4 text-lg font-bold">{movie.Title}</h3>
          <p>{movie.Year}</p>
        </div>
      ))}
    </div>
  );
}

export default MovieGrid;
