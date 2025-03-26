//src\pages\SearchResults.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/Movies/MovieCard';
import axios from 'axios';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const moviesPerPage = 20;

  useEffect(() => {
    if (query) {
      fetchMovies(query);
    }
  }, [query]);

  const fetchMovies = async (searchQuery) => {
    setIsLoading(true);
    setError(null);
    setPage(1);
    
    try {
      console.log("Searching for movies:", searchQuery);
      const response = await axios.get(`http://localhost:5000/api/movies/search?query=${encodeURIComponent(searchQuery)}`);
      
      console.log("API Response:", response.data);

      if (response.data && Array.isArray(response.data.movies)) {
        setMovies(response.data.movies);
        setDisplayedMovies(response.data.movies.slice(0, moviesPerPage));
        setHasMoreMovies(response.data.movies.length > moviesPerPage);
        console.log("Movies loaded successfully:", response.data.movies.length);
      } else {
        console.error("Movies data missing or not an array in API response");
        setMovies([]); 
        setDisplayedMovies([]);
        setHasMoreMovies(false);
        setError("No movies data found");
      }
    } catch (error) {
      console.error("Error searching movies:", error);
      setError("Failed to search movies. Please try again.");
      setMovies([]);
      setDisplayedMovies([]);
      setHasMoreMovies(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMovies = () => {
    const nextPage = page + 1;
    const startIdx = (nextPage - 1) * moviesPerPage;
    const endIdx = nextPage * moviesPerPage;
    
    const newMovies = movies.slice(startIdx, endIdx);
    setDisplayedMovies([...displayedMovies, ...newMovies]);
    setPage(nextPage);
    setHasMoreMovies(endIdx < movies.length);
  };

  return (
    <div className="text-white p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Search Results for "{query}"
      </h1>
      
      {isLoading && page === 1 ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">Searching movies...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">
          <p>{error}</p>
          <button 
            onClick={() => fetchMovies(query)} 
            className="mt-4 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedMovies.length > 0 ? (
              displayedMovies.map((movie) => (
                <MovieCard
                  key={movie._id}
                  id={movie._id}
                  title={movie.title || 'Unknown Title'}
                  genre={movie.genres || 'Unknown Genre'}
                  rating={movie.vote_average || 'N/A'}
                  image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
                />
              ))
            ) : (
              <p className="text-center col-span-4 py-10">No movies found matching "{query}". Try a different search term.</p>
            )}
          </div>
          
          {hasMoreMovies && (
            <div className="text-center mt-8">
              <button
                onClick={loadMoreMovies}
                className="px-6 py-3 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                    Loading...
                  </span>
                ) : (
                  'Load More Movies'
                )}
              </button>
              
              <p className="mt-2 text-gray-400">
                Showing {displayedMovies.length} of {movies.length} movies
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SearchResults;