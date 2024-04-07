<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navigation from "./components/Navigation.vue"


import { provide, ref, onMounted } from 'vue';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

const is_loggedin = ref(false);
const onetimesignup = ref(false);
const hasSpecificField = ref(false);

let auth;
onMounted(() => {
    auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            is_loggedin.value = true;
            try {
                // Retrieve doctor data
                const db = getFirestore();
                const doctorsCollection = collection(db, "EspData", "ADSM", "Doctors");
                const doctorQuery = query(doctorsCollection, where("email", "==", user.email));
                const doctorSnapshot = await getDocs(doctorQuery);

                // Check if the specific field exists
                hasSpecificField.value = doctorSnapshot.docs[0].data().hasOwnProperty('phone'); // Replace 'specificField' with the actual field name

                if (!hasSpecificField.value) {
                    onetimesignup.value = true;
                } else {
                    onetimesignup.value = false;
                }
            } catch (error) {
                console.error("Error retrieving doctor data:", error);
                // Handle errors appropriately
            }

        }
        else {
            is_loggedin.value = false;
        }
    })
})

provide('authState', { is_loggedin, onetimesignup, hasSpecificField });


</script>

<template>
  <div class="app">
    <Navigation />
    <RouterView />
  </div>
</template>


<style lang="scss">
:root {
  --bg-color: #1f1f21;
  --primary: #4ade80;
  --gray: #64748b;
  --dark: #1e293b;
  --light: #f1f5f9;
  --dark-alt: #334155;
  --sidebar-width: 300px;
  --text-color: #fff;

}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  // background: var(--light);
  // background: rgba(0, 0, 0, 0.918);
  background-color: var(--bg-color);
  color: var(--text-color);
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.app {
  display: flex;

  main {
    max-height: 100vh;
    overflow-y: scroll;
    flex: 1 1 0;
    padding: 2rem;
  }
}


@media (max-width: 768px) {
  .app {
    main {
      padding-left: 5rem;
    }
  }
}
</style>