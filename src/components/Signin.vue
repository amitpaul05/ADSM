<template>
    <div>
        <h1>Sign in</h1>

        <p><input type="email" name="email" placeholder="Email" v-model="email"></p>
        <p><input type="password" name="password" placeholder="Password" v-model="password"></p>
        <button @click="sign_in">Log in</button>
        <button @click="signInWithGoogle">Sign in with google</button>
        <button v-if="is_loggedin" @click="sign_out">sign out</button>

    </div>
</template>


<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { onMounted } from 'vue';

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

const sign_out = () => {
    signOut(auth).then(() => {
        alert("succesfully signed out")
        is_loggedin.value = false;
    })
}




const email = ref("");
const password = ref("");
const userRef = ref(null)

const sign_in = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      getAuth(),
      email.value,
      password.value
    );

    userRef.value = userCredential.user; // Update reactive userRef

    console.log("Logged in user:", userRef.value); // For debugging or logging

    // Use reactive user (e.g., display username, personalize content)
    const username = userRef.value.displayName || userRef.value.email;
    alert(`Welcome back, ${username}!`);

    // Optionally, store user data securely (avoid alerts for production)
    // ... (code to store user data in a secure way)
  } catch (error) {
    console.error("Sign-in error:", error.code, error.message);
    alert("Sign-in failed. Please check your credentials and try again.");
  }
};

const signInWithGoogle = async() => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(getAuth(), provider);

    // Access user information
    const user = result.user;
    console.log("Logged in user:", user); // For debugging or logging purposes

    alert(`Welcome back, ${user.displayName || user.email}!`); // Use display name or email

    // Optionally, store user data securely (avoid alerts for production)
    // ... (code to store user data securely)
  } catch (error) {
    console.error("Sign-in error:", error.code, error.message);
    alert("Sign-in failed. Please check your connection or try again."); // More informative message
  }
}

</script>

<style scoped>
/* Optional styling for the login component */
button {
    /* Add styles for your button */
}
</style>