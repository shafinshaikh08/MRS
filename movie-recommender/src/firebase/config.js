//src\firebase\config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsbzCfpeQl8NWA8p7pL0UWsxtIppi7F2A",
    authDomain: "movie-recommender-system-e49c6.firebaseapp.com",
    projectId: "movie-recommender-system-e49c6",
    storageBucket: "movie-recommender-system-e49c6.firebasestorage.app",
    messagingSenderId: "461307110829",
    appId: "1:461307110829:web:c53a9b4a69cbd9fee46d24"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;