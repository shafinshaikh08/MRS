import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserPreferences = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setUserPreferences(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching user preferences:", error);
    }
  }, [currentUser]);

  async function signup(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });
      
      // Create user document in Firestore with more robust error handling
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        email,
        displayName,
        createdAt: new Date(),
        preferences: {
          genres: [],
          directors: []
        },
        watchlist: []
      }, { merge: true }); // Using merge to prevent overwriting existing data
      
      return userCredential;
    } catch (error) {
      // More detailed error logging
      console.error("Signup Error Details:", {
        code: error.code,
        message: error.message,
        fullError: error
      });
      // Throw a more specific error to help debugging
      throw new Error(`Signup failed: ${error.message}`);
    }
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  async function addToWatchlist(movieId, movieData) {
    if (!currentUser) return;
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const watchlist = userData.watchlist || [];
        
        // Check if movie is already in watchlist
        if (!watchlist.some(movie => movie.id === movieId)) {
          const updatedWatchlist = [...watchlist, { id: movieId, ...movieData, addedAt: new Date() }];
          
          // Update genres in user preferences
          const genres = userData.preferences.genres || [];
          let updatedGenres = [...genres];
          
          if (movieData.genres) {
            const movieGenres = typeof movieData.genres === 'string' 
              ? movieData.genres.split(',').map(g => g.trim()) 
              : movieData.genres;
              
            movieGenres.forEach(genre => {
              if (!updatedGenres.includes(genre)) {
                updatedGenres.push(genre);
              }
            });
          }
          
          // Update directors in user preferences if available
          const directors = userData.preferences.directors || [];
          let updatedDirectors = [...directors];
          
          if (movieData.director) {
            if (!updatedDirectors.includes(movieData.director)) {
              updatedDirectors.push(movieData.director);
            }
          }
          
          await setDoc(userDocRef, {
            ...userData,
            watchlist: updatedWatchlist,
            preferences: {
              ...userData.preferences,
              genres: updatedGenres,
              directors: updatedDirectors
            }
          });
          
          // Update local state
          setUserPreferences({
            ...userData,
            watchlist: updatedWatchlist,
            preferences: {
              ...userData.preferences,
              genres: updatedGenres,
              directors: updatedDirectors
            }
          });
        }
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  }

  async function removeFromWatchlist(movieId) {
    if (!currentUser || !userPreferences) return;
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userData = userPreferences;
      
      const updatedWatchlist = userData.watchlist.filter(movie => movie.id !== movieId);
      
      await setDoc(userDocRef, {
        ...userData,
        watchlist: updatedWatchlist
      });
      
      // Update local state
      setUserPreferences({
        ...userData,
        watchlist: updatedWatchlist
      });
    } catch (error) {
      console.error("Error removing from watchlist:", error);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  // Fetch user preferences whenever current user changes
  useEffect(() => {
    if (currentUser) {
      fetchUserPreferences();
    } else {
      setUserPreferences(null);
    }
  }, [currentUser, fetchUserPreferences]);

  const value = {
    currentUser,
    userPreferences,
    login,
    signup,
    logout,
    addToWatchlist,
    removeFromWatchlist,
    fetchUserPreferences
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}