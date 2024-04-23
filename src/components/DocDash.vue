<script setup>
// import EndPatient from "@/components/EndPatient.vue";
import { onMounted, ref, onBeforeMount } from 'vue';
import { inject, provide } from 'vue';

const { auth_user } = inject('authState');

import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

// Access the router instance
const router = useRouter();
const patients = ref([]);

// Access Firestore instance
const db = getFirestore();
const appoint_id = ref(null)
const loading = ref(Array(10).fill(false));
const rejecting = ref(Array(10).fill(false));
const is_ongoing = ref(Array(10).fill(false));

onBeforeMount(async () => {
    try {
        const today = get_current_day();
        console.log(today);
        patients.value = await fetchPatients(today)
        loading.value = Array(patients.value.length).fill(false);
        rejecting.value = Array(patients.value.length).fill(false);
        is_ongoing.value = Array(patients.value.length).fill(false);

    } catch (error) {
        console.error('Error fetching patients:', error);
        // Handle error appropriately, such as showing an error message to the user.
    }
});




// Function to fetch patients with a specific doctor ID and today's day
async function fetchPatients(today) {
    try {
        const db = getFirestore();
        console.log("docid: ", auth_user.value)

        // Reference to the 'patient' collection
        const patientsCollectionRef = collection(db, 'EspData', 'ADSM', 'patient');

        // Construct a query to filter documents based on doctor ID and today's day
        const q = query(
            patientsCollectionRef,
            where('doctor_id', '==', auth_user.value),
        );

        // Execute the query and get the matching documents
        const querySnapshot = await getDocs(q);

        // Iterate through the query snapshot to retrieve patient data
        const filteredPatients = [];
        querySnapshot.forEach(doc => {
            const data = doc.data();
            //   console.log(data);
            // Check if the document matches the additional condition (e.g., 'day')
            if (data.day === today) {
                // If the document matches, add it to the filteredPatients array
                filteredPatients.push({ id: doc.id, ...data });
            }
        });
        // console.log(filteredPatients)

        // Return the fetched patients
        // return filteredPatients;
        return filteredPatients.sort((a, b) => a.serial - b.serial);
    } catch (error) {
        console.error('Error fetching patients:', error);
        // Handle error appropriately, such as showing an error message to the user.
        return [];
    }
};


function get_current_day() {
    // Get the current date
    const currentDate = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // Get the current day name
    // const currentDayName = dayNames[currentDate.getDay()];
    const currentDayName = "Wednesday";
    return currentDayName
}

// const is_started = ref(false);
const is_started = ref(JSON.parse(localStorage.getItem('is_started')) || false);

const ongoing = async (serial, index) => {
    is_ongoing.value = Array(is_ongoing.value.length).fill(false);
    is_ongoing.value[index] = true;
    const doctorDocRef = doc(db, "EspData", "ADSM", "Doctors", auth_user.value);
    const doctorDocSnapshot = await getDoc(doctorDocRef);
    console.log(doctorDocSnapshot);
    const doctorData = doctorDocSnapshot.data()
    if (doctorDocSnapshot.exists) {
        try {
            const updateData = {};
            updateData["current_serial"] = serial;
            // Update the field in the doctor's document
            await updateDoc(doctorDocRef, updateData);
        } catch (error) {
            console.log("couldnot set ongoing");
        }
        // finally {
        //     is_ongoing.value[index] = false; // Set loading to false after deletion completes
        // }

    }
}

const reject_serial = async (id, index, serial) => {
    rejecting.value[index] = true;
    const doctorDocRef = doc(db, "EspData", "ADSM", "Doctors", auth_user.value);
    const patientRef = doc(db, "EspData", "ADSM", "patient", id);
    const doctorDocSnapshot = await getDoc(doctorDocRef);
    console.log(doctorDocSnapshot);
    const doctorData = doctorDocSnapshot.data()
    if (doctorDocSnapshot.exists) {
        console.log(doctorData)
        const today = get_current_day();
        const today_serial = doctorData[today] - 1;
        const updateData = {};

        updateData["current_serial"] = serial;
        updateData[today] = today_serial;

        // Update the field in the doctor's document
        await updateDoc(doctorDocRef, updateData);
        try {
            await deleteDoc(patientRef);
            console.log(today);
            patients.value = await fetchPatients(today)
        } catch (error) {
            console.error('Error deleting patient:', error);

        }
        finally {
            rejecting.value[index] = false; // Set loading to false after deletion completes
            is_ongoing.value[index] = false;
        }
    }
}

const update_serial = async (id, index, serial) => {
    loading.value[index] = true;
    const doctorDocRef = doc(db, "EspData", "ADSM", "Doctors", auth_user.value);
    const patientRef = doc(db, "EspData", "ADSM", "patient", id);
    const doctorDocSnapshot = await getDoc(doctorDocRef);
    console.log(doctorDocSnapshot);
    const doctorData = doctorDocSnapshot.data()
    if (doctorDocSnapshot.exists) {
        console.log(doctorData)
        const today = get_current_day();
        const today_serial = doctorData[today] - 1;
        const updateData = {};

        updateData["current_serial"] = serial;
        updateData[today] = today_serial;

        // Update the field in the doctor's document
        await updateDoc(doctorDocRef, updateData);
        try {
            await deleteDoc(patientRef);
            console.log(today);
            patients.value = await fetchPatients(today)
        } catch (error) {
            console.error('Error deleting patient:', error);

        }
        finally {
            loading.value[index] = false; // Set loading to false after deletion completes
            is_ongoing.value[index] = false;
        }
    }
}

const start_appoint = async () => {
    const doctorDocRef = doc(db, "EspData", "ADSM", "Doctors", auth_user.value);
    const doctorDocSnapshot = await getDoc(doctorDocRef);
    const doctorData = doctorDocSnapshot.data();
    if (doctorDocSnapshot.exists) {
        console.log(doctorData)
        const updatedData = {
            ...doctorData,
            "current_serial": 1 // Update or set the current_serial field to "1"
        };
        await updateDoc(doctorDocRef, updatedData);
        is_started.value = true;
        localStorage.setItem('is_started', JSON.stringify(is_started.value));
    }
}




</script>

<template>
    <div class="mx-auto">
        <div v-if="patients.length" class="w-2/3 mx-auto">
            <button v-show="!is_started" @click="start_appoint"
                class="button w-full bg-slate-500 p-2 rounded-md flex ml-auto mb-7">Start Today's Schedule</button>
            <h2 class="text-2xl font-bold mb-4 text-center">Today's Patients</h2>
            <table class="w-full mx-auto">

                <thead>
                    <tr>
                        <th class="py-2 px-4 ">Serial</th>
                        <th class="py-2 px-4 ">Patient Name</th>
                        <th class="py-2 px-4 ">Phone</th>
                        <!-- <th v-show="!is_started" class="py-2 px-4 ">Patient Name</th>
                        <th v-show="!is_started" class="py-2 px-4 ">Phone</th> -->

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(patient, index) in patients" :key="patient.id" class="text-center">
                        <td class="py-2 px-4">{{ patient.serial }}</td>
                        <td class="py-2 px-4 ">{{ patient.name }}</td>
                        <td class="py-2 px-4 ">{{ patient.phone }}</td>

                        <td v-show="is_started" class="py-2 px-4 ">
                            <button @click="update_serial(patient.id, index, patient.serial)"
                                class="bg-slate-500 w-full px-2 rounded-md">
                                <div v-if="loading[index]">
                                    <svg aria-hidden="true"
                                        class="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                        viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor" />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill" />
                                    </svg>
                                </div>
                                <div v-else><font-awesome-icon :icon="['fas', 'check']"
                                        class="hover:scale-150 duration-300" /></div>

                            </button>
                        </td>
                        <td v-show="is_started" class="py-2 px-4"><button
                                @click="reject_serial(patient.id, index, patient.serial)">
                                <div v-if="rejecting[index]">
                                    <svg aria-hidden="true"
                                        class="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                        viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor" />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill" />
                                    </svg>
                                </div>
                                <div v-else><font-awesome-icon :icon="['fas', 'ban']"
                                        class="text-red-500 hover:scale-150 duration-300" /></div>

                            </button></td>
                        <td v-show="is_started" class="py-2 px-4">
                            <button @click="ongoing(patient.serial, index)">
                                <div v-if="is_ongoing[index]" class="flex gap-1">
                                    <!-- <svg aria-hidden="true"
                                        class="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                        viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor" />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill" />
                                    </svg> -->
                                    <div class='h-2 w-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]'>
                                    </div>
                                    <div class='h-2 w-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s]'>
                                    </div>
                                    <div class='h-2 w-2 bg-green-400 rounded-full animate-bounce'></div>
                                </div>
                                <div v-else><font-awesome-icon :icon="['fas', 'bed']"
                                        class="hover:text-green-400 hover:scale-150 duration-300" /></div>

                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- <button v-show="is_started" @click="start_appoint" class="button w-full bg-slate-500 p-2 rounded-md flex ml-auto mb-7">End Today's Schedule</button> -->
        </div>
        <div v-else>
            <h1 class="text-center text-4xl">You Do not have any appointment Today</h1>
        </div>
    </div>
</template>