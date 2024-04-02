<script setup>
import { ref } from 'vue';
import { inject } from 'vue';

const { is_loggedin, onetimesignup, hasSpecificField } = inject('authState');

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
      <h1>This is the doctors homepage</h1>
    </div>
    <div v-else-if="ispatient" class="button grid text-center justify-center">
      <RouterLink to="/appointment">
        <button
          class="bg-purple-800 px-3 py-1 rounded-2x1 hover:text-white hover:border-solid hover:border-2 hover:border-purple-800 hover:bg-transparent mx-2 mb-2 rounded-md duration-500">Make
          an apointment
        </button>
      </RouterLink>


      <RouterLink to="/sign-in">
        <button
          class="bg-purple-800 px-3 py-1 text-white rounded-2x1 hover:text-white hover:border-solid hover:border-2 hover:border-purple-800 hover:bg-transparent mx-2 mb-2 rounded-md duration-500">See
          Updates about your appointment</button>
      </RouterLink>


    </div>
    <div v-else class="button grid text-center justify-center">
      <button @click="patient"
        class="bg-purple-800 px-3 py-1 rounded-2x1 hover:text-white hover:border-solid hover:border-2 hover:border-purple-800 hover:bg-transparent mx-2 mb-2 rounded-md duration-500">Continue
        As a patient
      </button>

      <RouterLink to="/sign-in">
        <button
          class="bg-purple-800 px-3 py-1 rounded-2x1 hover:text-white hover:border-solid hover:border-2 hover:border-purple-800 hover:bg-transparent mx-2 mb-2 rounded-md duration-500">Continue
          as a Doctor</button>
      </RouterLink>
    </div>

  </main>

</template>