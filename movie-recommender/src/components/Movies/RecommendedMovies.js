//src\components\Movies\RecommendedMovies.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';
import { useAuth } from '../../context/AuthContext';

function RecommendedMovies() {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, userPreferences } = useAuth();
  
  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      if (!currentUser || !userPreferences) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Get user preferences
        const { genres = [], directors = [] } = userPreferences.preferences || {};
        
        if (genres.length === 0 && directors.length === 0) {
          // No preferences yet
          setRecommendedMovies([]);
          setLoading(false);
          return;
        }
        
        // Prepare query parameters
        const params = new URLSearchParams();
        
        if (genres.length > 0) {
          // Join multiple genres for the API
          params.append('genres', genres.join(','));
        }
        
        if (directors.length > 0) {
          // Join multiple directors for the API
          params.append('directors', directors.join(','));
        }
        
        // Create the API endpoint
        const endpoint = `http://localhost:5000/api/movies/recommendations?${params.toString()}`;
        
        const response = await axios.get(endpoint);
        
        if (response.data && Array.isArray(response.data.movies)) {
          // Filter out movies that are already in the watchlist
          const watchlistIds = userPreferences.watchlist?.map(m => m.id) || [];
          const filteredMovies = response.data.movies.filter(movie => !watchlistIds.includes(movie._id));
          
          setRecommendedMovies(filteredMovies);
        } else {
          setRecommendedMovies([]);
        }
        
      } catch (error) {
        console.error("Error fetching recommended movies:", error);
        setError("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendedMovies();
  }, [currentUser, userPreferences]);
  
  if (!currentUser) {
    return null;
  }
  
  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Recommended For You</h2>
        <div className="text-center py-6">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-white">Loading recommendations...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Recommended For You</h2>
        <div className="text-center text-red-500 py-6">
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (recommendedMovies.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Recommended For You</h2>
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-400">
            {userPreferences.preferences?.genres?.length > 0 || userPreferences.preferences?.directors?.length > 0
              ? "We couldn't find any new recommendations based on your preferences."
              : "Add some favorite genres or directors in your profile to get personalized recommendations."}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">Recommended For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {recommendedMovies.slice(0, 10).map(movie => (
          <MovieCard 
            key={movie._id} 
            movie={movie} 
            showAddButton={true} 
          />
        ))}
      </div>
      {recommendedMovies.length > 10 && (
        <div className="mt-4 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200">
            View More Recommendations
          </button>
        </div>
      )}
    </div>
  );
}

export default RecommendedMovies;