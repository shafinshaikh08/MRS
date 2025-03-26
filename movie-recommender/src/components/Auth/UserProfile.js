//src\components\Auth\UserProfile.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../Movies/MovieCard';

function UserProfile() {
  const { currentUser, userPreferences, logout, removeFromWatchlist, fetchUserPreferences } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && userPreferences === null) {
      fetchUserPreferences();
    }
  }, [currentUser, userPreferences, fetchUserPreferences]);

  async function handleLogout() {
    setError('');
    
    try {
      setLoading(true);
      await logout();
      navigate('/login');
    } catch {
      setError('Failed to log out');
    }
    
    setLoading(false);
  }

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-md text-white">
        <p className="text-center">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 text-white">
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
        
        {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
        
        <div className="mb-4">
          <p><strong>Name:</strong> {currentUser.displayName}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
        </div>
        
        <button 
          onClick={handleLogout} 
          disabled={loading}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
        >
          {loading ? 'Logging Out...' : 'Log Out'}
        </button>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Your Preferences</h2>
        
        {userPreferences ? (
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Favorite Genres</h3>
              {userPreferences.preferences.genres && userPreferences.preferences.genres.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userPreferences.preferences.genres.map((genre) => (
                    <span key={genre} className="px-3 py-1 bg-blue-600 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No favorite genres yet. Start adding movies to your watchlist!</p>
              )}
            </div>
            
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Favorite Directors</h3>
              {userPreferences.preferences.directors && userPreferences.preferences.directors.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userPreferences.preferences.directors.map((director) => (
                    <span key={director} className="px-3 py-1 bg-purple-600 rounded-full text-sm">
                      {director}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No favorite directors yet. Start adding movies to your watchlist!</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2">Loading your preferences...</p>
          </div>
        )}
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Your Watchlist</h2>
        
        {userPreferences && userPreferences.watchlist ? (
          userPreferences.watchlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {userPreferences.watchlist.map((movie) => (
                <div key={movie.id} className="relative">
                  <MovieCard
                    id={movie.id}
                    title={movie.title || 'Unknown Title'}
                    genre={movie.genres || 'Unknown Genre'}
                    rating={movie.vote_average || 'N/A'}
                    image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
                  />
                  <button 
                    onClick={() => removeFromWatchlist(movie.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    title="Remove from watchlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-6">Your watchlist is empty. Start adding movies!</p>
          )
        ) : (
          <div className="text-center py-6">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2">Loading your watchlist...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;