import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import image from '../Layout/logo.png';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser } = useAuth();

  const handleSurprise = async () => {
    try {
      setIsLoading(true);
      console.log('Getting a random movie surprise!');
      const response = await axios.get('http://localhost:5000/api/movies/random');
      
      if (response.data && response.data.movie) {
        console.log('Found random movie:', response.data.movie.title);
        navigate(`/movie/${response.data.movie._id}`);
      } else {
        console.error('No random movie found');
        alert('Could not find a random movie. Please try again.');
      }
    } catch (error) {
      console.error('Error getting random movie:', error);
      alert('Error loading surprise movie. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="shadow-lg relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-3">
          <Link to="/" className="flex items-center space-x-2">
            <img src={image} alt="MovieMate" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">MovieMate</span>
          </Link>

          <div className="flex-1 mx-4 my-3 md:my-0 w-full md:w-auto max-w-md">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies..."
                className="px-4 py-2 rounded-l-md border border-gray-700 bg-gray-900 text-white flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none"
              >
                Search
              </button>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/about" className="text-white hover:text-blue-400">About</Link>
            
            {currentUser ? (
              <Link to="/profile" className="text-white hover:text-blue-400">Profile</Link>
            ) : (
              <div className="relative">
                <button 
                  onClick={toggleDropdown}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
                >
                  Login
                  <svg 
                    className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-20">
                    <Link 
                      to="/login" 
                      className="block px-4 py-2 text-white hover:bg-gray-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="block px-4 py-2 text-white hover:bg-gray-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            )}

            <button 
              onClick={handleSurprise} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  Loading...
                </>
              ) : (
                'Surprise'
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;