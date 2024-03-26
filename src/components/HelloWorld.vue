<template>
  <div>
    <h1>Create account</h1>

    <p><input type="email" name="email" placeholder="Email" v-model="email"></p>
    <p><input type="password" name="password" placeholder="Password" v-model="password"></p>
    <button @click="register">Register</button>
    <button @click="signInWithGoogle">Sign in with google</button>
    <button v-if="is_loggedin" @click="sign_out">sign out</button>

  </div>
</template>


<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

import { getFirestore, setDoc, collection, doc } from "firebase/firestore"; // Import Firestore methods
import { useRouter } from 'vue-router';

const router = useRouter();
const is_loggedin = ref(false);

let auth;
onMounted(() => {
    auth = getAuth();
    onAuthStateChanged(auth, (user) =>{
        if(user){
            is_loggedin.value = true;
        }
        else {
            is_loggedin.value = false;
        }
    })
})

const email = ref("");
const password = ref("");

const register = () => {
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
      alert('succesfully registered');
    })
    .catch((error) => {
      console.log(error.code);
      alert(error.message);
    });
}

const signInWithGoogle = async () => {
  try {
    const auth = getAuth(); // Get a reference to the auth instance
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Access user information
    const user = result.user;
    console.log("Logged in user:", user); // For debugging or logging purposes

    alert(`Welcome back, ${user.displayName || user.email}!`); // Use display name or email

    // Firestore access (assuming Firestore is initialized in firebase.js)
    const db = getFirestore(); // Get a reference to the Firestore instance
    // Create a reference to the doctors subcollection within the Espdata collection
    const doctorsCollection = collection(db, "EspData", "ADSM", "Doctors"); // Ensure capitalization matches

    // Create a reference to the doctor document using user.uid
    const doctorDocRef = doc(doctorsCollection, user.uid);
    const doctorData = {
      uid: user.uid,
      name: user.displayName, // Use Google profile information if enabled
      email: user.email, // Use Google profile information if enabled
      role: 'doctor' // Specify user role if applicable
    };

    console.log(await setDoc(doctorDocRef, doctorData));
    console.log("User data successfully stored in Firestore!");
    router.push('/additional-info');

  } catch (error) {
    console.error("Sign-in error:", error.code, error.message);
    alert("Sign-in failed. Please check your connection or try again."); // More informative message
  }

};

const sign_out = () => {
  signOut(auth).then(() => {
    alert("succesfully signed out")
    is_loggedin.value = false;
    router.push('/');
  })
}
</script>

<style scoped>
/* Optional styling for the login component */
button {
  /* Add styles for your button */
}
</style>
