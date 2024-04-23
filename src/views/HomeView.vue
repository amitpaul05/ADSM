<script setup>
import DocDash from "@/components/DocDash.vue";

import { ref } from 'vue';
import { inject } from 'vue';

const { is_loggedin, onetimesignup, hasSpecificField, auth_user } = inject('authState');

import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'vue-router';

// Access the router instance
const router = useRouter();
const patients = ref([]);

// Access Firestore instance
const db = getFirestore();
const appoint_id = ref(null)

// onMounted(async () => {
//   console.log("Id: ",auth_user.value);
//     try {
//       const today = get_current_day();
//       console.log(today);
//       patients.value = fetchPatients(today)
      
//     } catch (error) {
//       console.error('Error fetching patients:', error);
//       // Handle error appropriately, such as showing an error message to the user.
//     }
// });



const track_appoint = () => {
  if (appoint_id.value) {
    router.push({ name: 'appoint-detail', params: { id: appoint_id.value } });
  }
}

const ispatient = ref(false);

const patient = () => {
  ispatient.value = true
}

</script>

<template>
  <main>

    <nav class="text-yellow-100  w-full text-center py-8">
      <div class="text-6xl">
        Autometic Doctor Serial management</div>
    </nav>
    <div v-if="is_loggedin">
      <DocDash/>
    </div>
    <div v-else-if="ispatient" class="button grid text-center justify-center">
      <RouterLink to="/appointment">
        <button
          class="text-white bg-purple-800 px-3 py-1 rounded-2x1 hover:text-white hover:border-solid hover:border-2 hover:border-purple-800 hover:bg-transparent mx-2 mb-2 rounded-md duration-500">Make
          an apointment
        </button>
      </RouterLink>
      <div class="flex grid-cols-3 gap-4 mx-auto">
        <p>-------</p>
        <p>or</p>
        <p>-------</p>
      </div>
      <form @submit.prevent="track_appoint" class="max-w-md mx-auto p-6 rounded-lg shadow-md">
        <div class="mb-4">
          <!-- <label for="patientID" class="block text-gray-300 font-semibold mb-2">Patient ID:</label> -->
          <input v-model="appoint_id" type="text" id="patientID" name="patientID" placeholder="Enter your ID" required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-black">
        </div>
        <div class="flex justify-center">
          <button class="bg-purple-800 px-3 py-1 rounded-2x1 hover:text-white hover:border-solid hover:border-2 hover:border-purple-800 hover:bg-transparent mx-2 mb-2 rounded-md duration-500">
            Track appointment
          </button>
        </div>
      </form>


    </div>
    <div v-else class="button grid text-center justify-center">
      <button @click="patient"
        class="bg-purple-800 px-3 py-1 rounded-2x1 hover:text-white hover:border-solid hover:border-2 hover:border-purple-800 hover:bg-transparent mx-2 mb-2 rounded-md duration-500">Continue
        As a patient
      </button>

      <div class="flex grid-cols-3 gap-4 mx-auto">
        <p>-------</p>
        <p>or</p>
        <p>-------</p>
      </div>

      <RouterLink to="/sign-in">
        <button
          class="text-white bg-purple-800 px-3 py-1 rounded-2x1 hover:text-white hover:border-solid hover:border-2 hover:border-purple-800 hover:bg-transparent mx-2 mb-2 rounded-md duration-500">Continue
          as a Doctor</button>
      </RouterLink>
    </div>

  </main>

</template>