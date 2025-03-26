import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import MovieDetail from './pages/MovieDetails';
import SearchResults from './pages/SearchResults';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserProfile from './components/Auth/UserProfile';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import axios from 'axios';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMovies = async (query) => {
    try {
      console.log("Fetching movies for:", query);
      const response = await axios.get(`http://localhost:5000/api/movies?query=${query}&page=1`);
      console.log("API Response:", response.data);
      setMovies(response.data.movies || []);
    } catch (error) {
      console.error('Error fetching movies', error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      fetchMovies(searchQuery);
    }
  }, [searchQuery]);

  return (
    <AuthProvider>
      <Router>
        <Layout setSearchQuery={setSearchQuery}>
          <Routes>
            <Route path="/" element={<Home movies={movies} setSearchQuery={setSearchQuery} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/search" element={<SearchResults movies={movies} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;