import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, // Import Auth methods (replace with needed methods)
         getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
    apiKey: "AIzaSyAipivCHxgu7K1Y81k9vCUWDo6MvOePnN0",
    authDomain: "cse3152.firebaseapp.com",
    databaseURL: "https://cse3152-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "cse3152",
    storageBucket: "cse3152.appspot.com",
    messagingSenderId: "206292190867",
    appId: "1:206292190867:web:cbdc4f5783b3cbbf84ef66"
  };

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Create a single Firebase object with the needed services
const firebase = {
  auth: auth,
  db: db,
  // Add other services (e.g., signInWithEmailAndPassword) as needed
};

// Export the Firebase object as default
export default firebase;
