import React from 'react';

function About() {
  return (
    <div id="AboutPage" className="text-white p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">About MovieMate</h1>
        <p className="text-gray-400 italic mt-2">Your ultimate movie discovery companion</p>
      </div>
      
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <p className="text-lg text-gray-300 mb-6">
          MovieMate is your ultimate movie companion. Discover movies based on your favorite genres, explore trending titles, and get personalized recommendations!
        </p>
        <p className="text-lg text-gray-300 mb-6">
          Our goal is to make your movie discovery process easy, fun, and tailored to your tastes. Whether you're in the mood for action, comedy, or drama, we have something for everyone.
        </p>
        <p className="text-lg text-gray-300">
          Join us and start exploring the world of movies today!
        </p>
      </div>
    </div>
  );
}

export default About;