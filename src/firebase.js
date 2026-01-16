import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBKLJv8YLcYGXkW9yC23xO7G6KyqxN415o",
  authDomain: "netflix-ui-assessment.firebaseapp.com",
  projectId: "netflix-ui-assessment",
  storageBucket: "netflix-ui-assessment.firebasestorage.app",
  messagingSenderId: "416773393192",
  appId: "1:416773393192:web:78bd992b3628c17a8d5e1d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// This function fetches movies and stores them in localStorage
export const fetchAndStoreMovies = async () => {
  try {
    const response = await fetch('API_ENDPOINT_FOR_MOVIES');
    const movies = await response.json();
    localStorage.setItem('shows', JSON.stringify(movies));
  } catch (error) {
    console.error("Error fetching movies: ", error);
  }
};