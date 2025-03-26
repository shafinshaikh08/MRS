//MovieCard.js
import React from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ id, title, genre, rating, image }) {
  return (
    <Link to={`/movie/${id}`} className="block">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl h-full flex flex-col">
        <div className="h-64 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
            }}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold mb-2 text-white line-clamp-2">{title}</h3>
          
          <div className="mt-auto">
            <p className="text-sm text-gray-300 mb-2">{genre}</p>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span className="text-white">{rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;