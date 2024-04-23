<!-- ItemDetail.vue -->
<template>
  <div class="mx-auto">
    <div v-if="appointment" class="grid grid-cols-2 p-5 gap-10">
      <div class="justify-start">
        <h1 class="text-center text-3xl">Patient's Info</h1>
        <hr class="mb-10">
        <div class="font-semibold mb-2">Patient Name: {{ appointment.name }}</div>
        <div class="font-semibold mb-2">Phone Number: {{ appointment.phone }}</div>
        <div class="font-semibold mb-2">Serial Number: {{ appointment.serial }}</div>
        <div class="font-semibold mb-2">Day: {{ appointment.day }}</div>

      </div>
      <div>
        <h1 class="text-center text-3xl">Doctor's Info</h1>
        <hr class="mb-10">
        <div class="font-semibold mb-2">Doctor Name: {{ appointment.doctor_name }}</div>
        <div v-if="today === appointment.day" class="font-semibold mb-2">Current Serial: {{ current_serial }}</div>
        <div v-else>You may view the current serial number of the doctor only on {{ appointment.day }}</div>

      </div>
    </div>
    <div v-else>
      <h1>No appointmet found with id - {{ itemId }}</h1>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Define a ref for itemId
const itemId = ref('');

// Use onMounted to access the itemId
onMounted(() => {
  console.log(itemId.value); // Access itemId through ref
});

// Extract itemId from useRoute().params
const routeParams = useRoute().params;
itemId.value = routeParams.id;

// Fetch appointment information from Firestore
const appointment = ref(null);
const current_serial = ref(0);
const today = get_current_day();

// Access Firestore instance
const db = getFirestore();

// Function to fetch appointment information
const fetchAppointment = async () => {
  try {
    const appointmentDocRef = doc(db, 'EspData', 'ADSM', 'patient', itemId.value);
    const appointmentDocSnapshot = await getDoc(appointmentDocRef);
    if (appointmentDocSnapshot.exists()) {
      appointment.value = appointmentDocSnapshot.data();
      console.log(appointment.value.doctor_id)
      const doctorDocRef = doc(db, 'EspData', 'ADSM', 'Doctors', appointment.value.doctor_id);
      const doctorDocSnapshot = await getDoc(doctorDocRef);
      const doctorData = doctorDocSnapshot.data();
      console.log(doctorData["name"])
      if(doctorData["current_serial"]){
        current_serial.value = doctorData["current_serial"]
      }

    } else {
      console.log('Appointment not found');
    }
  } catch (error) {
    console.error('Error fetching appointment:', error);
    // Handle error appropriately, such as showing an error message to the user.
  }
};

// Call fetchAppointment when component is mounted
onMounted(fetchAppointment);
function get_current_day() {
    // Get the current date
    const currentDate = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // Get the current day name
    // const currentDayName = dayNames[currentDate.getDay()];
    const currentDayName = "Wednesday";
    return currentDayName
}
</script>
