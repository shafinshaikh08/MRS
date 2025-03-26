//MovieDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        console.log(`Fetching movie details for ID: ${id}`);
        const response = await axios.get(`http://localhost:5000/api/movie/${id}`);

        console.log("Movie API Response:", response.data);

        if (response.data && response.data.movie) {
          setMovie(response.data.movie);
        } else {
          console.error("Movie data missing in API response");
          setError("Movie details not found");
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setError("Failed to load movie details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="text-white text-center py-20">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2">Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/" className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 text-white">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-white text-center py-20">
        <p className="mb-4">Movie not found</p>
        <Link to="/" className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 text-white">
          Back to Home
        </Link>
      </div>
    );
  }

  // Format release date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    if (dateString.$date) {
      return new Date(dateString.$date).toLocaleDateString();
    }
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <Link to="/" className="inline-block mb-6 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700">
        ← Back to Movies
      </Link>
      
      <h1 className="text-4xl font-bold text-center mb-8">{movie.title || 'Unknown Title'}</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
          alt={movie.title}
          className="w-full md:w-1/3 rounded-lg shadow-md object-cover max-h-96 md:max-h-full"
        />
        
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-semibold mb-6">Details</h2>
          
          <div className="space-y-4">
            <p><strong>Genre:</strong> {movie.genres || 'N/A'}</p>
            <p><strong>Rating:</strong> {movie.vote_average || 'N/A'} ⭐ ({movie.vote_count || 0} votes)</p>
            <p><strong>Release Date:</strong> {formatDate(movie.release_date)}</p>
            <p><strong>Language:</strong> {movie.original_language || 'N/A'}</p>
            <p><strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} minutes` : 'N/A'}</p>
            <p><strong>Description:</strong> {movie.overview || 'No description available.'}</p>
            
            {movie.tagline && <p><strong>Tagline:</strong> "{movie.tagline}"</p>}
            {movie.budget && <p><strong>Budget:</strong> ${Number(movie.budget).toLocaleString()}</p>}
            {movie.revenue && <p><strong>Revenue:</strong> ${Number(movie.revenue).toLocaleString()}</p>}
            {movie.production_companies && <p><strong>Production:</strong> {movie.production_companies}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;