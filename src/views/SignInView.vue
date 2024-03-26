<template>
    <main>
        <div v-if="onetimesignup">
            <form @submit.prevent="submitInfo">
                <input type="text" v-model="formData.phone" placeholder="phone">
                <div v-for="day in days" :key="day">
                    <label>
                        <input type="checkbox" v-model="formData[day]" value="0">
                        {{ day }}
                    </label>
                </div>
                <button type="submit">Update Information</button>
            </form>
        </div>
        <div v-else class="grid mx-auto w-60 my-auto">
            <div class="grid grid-rows">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="signInWithGoogle">
                    <font-awesome-icon :icon="['fab', 'google']" class="mr-5"/>
                    Continue with google
                </button>

                <button v-if="is_loggedin" @click="sign_out">sign out</button>
            </div>
        </div>


    </main>
</template>


<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

import { getFirestore, setDoc, collection, doc, getDocs, query, where, getDoc } from "firebase/firestore"; // Import Firestore methods
import { useRouter } from 'vue-router';

const onetimesignup = ref(false);

const router = useRouter();
const is_loggedin = ref(false);

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


const formData = ref({
    phone: "",
});

function handleCheckboxChange(day) {
    formData.value[day] = !formData.value[day] || 0; // Toggle value (0 or undefined)
}

let auth;
onMounted(() => {
    auth = getAuth();
    const hasSpecificField = ref(true);


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

const signInWithGoogle = async () => {
    try {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        const user = result.user;
        console.log("Logged in user:", user);

        alert(`Welcome back, ${user.displayName || user.email}!`);

        // Firestore access (assuming Firestore is initialized in firebase.js)
        const db = getFirestore();

        // Check for existing doctor using email (assuming unique emails)
        const doctorsCollection = collection(db, "EspData", "ADSM", "Doctors");
        const doctorQuery = query(doctorsCollection, where("email", "==", user.email)); // Email equality check
        console.log(doctorQuery);
        const doctorSnapshot = await getDocs(doctorQuery);

        if (doctorSnapshot.empty) {
            // New doctor, create document
            const doctorDocRef = doc(doctorsCollection, user.uid);
            const doctorData = {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                role: 'doctor',
                // Add any additional data fields here
            };

            console.log(await setDoc(doctorDocRef, doctorData));
            console.log("New doctor data successfully stored in Firestore!");
            onetimesignup.value = true;
            // Navigate to additional info page (if applicable)
            // router.push('/additional-info');
        } else {
            const hasSpecificField = doctorSnapshot.docs[0].data().hasOwnProperty('phone'); // Replace 'specificField' with the actual field name
            console.log(hasSpecificField);
            console.log("Existing doctor, data not added.");
            onetimesignup.value = false
            // Handle existing doctor scenario (e.g., redirect to profile)
        }
    } catch (error) {
        console.error("Sign-in error:", error.code, error.message);
        alert("Sign-in failed. Please check your connection or try again.");
    }
};


const sign_out = () => {
    signOut(auth).then(() => {
        alert("succesfully signed out")
        is_loggedin.value = false;
        router.push('/');
    })
}



const submitInfo = async () => {

    for (const day in formData.value) {
        if (formData.value[day] === true) {
            handleCheckboxChange(day)
        }
    }
    const db = getFirestore();
    const user = await getUser(); // Retrieve signed-in user information (replace with your method)

    const doctorDocRef = doc(getDoctorsCollection(), user.uid); // Get doctor document reference

    // Fetch existing data (optional)
    const doctorSnap = await getDoc(doctorDocRef);
    let existingData = {};
    if (doctorSnap.exists) {
        existingData = doctorSnap.data();
    }

    const updatedData = {
        ...existingData,
        ...formData.value, // Spread operator to include additional information

    };

    await setDoc(doctorDocRef, updatedData)
        .then(() => {
            console.log("Doctor information updated successfully!");
            onetimesignup.value = false;
            router.push("/")
            // Redirect to another page or display a success message
        })
        .catch((error) => {
            console.error("Error updating doctor information:", error);
            // Handle errors (e.g., display an error message to the user)
        });
};

// Helper functions (replace with actual implementation)
const getUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                removeListener();
                resolve(user);
            },
            reject,
        )
    })
}

function getDoctorsCollection() {
    // Assuming you have a function to return the doctors collection reference
    // This could be a separate utility function or based on your structure
    const db = getFirestore();
    return collection(db, "EspData", "ADSM", "Doctors"); // Ensure capitalization matches
}
</script>

<style scoped>
/* Optional styling for the login component */
button {
    /* Add styles for your button */
}
</style>