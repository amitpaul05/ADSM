<template>
    <main class="w-screen">
        <h1 class="text-center text-3xl">
            Make an appointment
        </h1>
        <form @submit.prevent="handleSubmit" class="grid justify-center gap-2">
            <div class="w-full flex items-center">
                <label for="datefield" class="inline-block w-1/3">Date of Appointment : </label>
                <input class="text-black w-2/3 rounded-lg" type="date" v-model="date" id="datefield">
            </div>
            <div v-if="isDateValid">
                <select name="doctors" id="doctors" class="text-black w-full rounded-md" v-model="selectdoctor">
                    <option v-if="!date" value="" disabled selected>Please select a date</option>
                    <option v-for="doctor in doctorNames" :key="doctor.id" :value="doctor.id">
                        {{ doctor.name }}
                    </option>
                </select>
            </div>

            <div v-else>
                <p>You can make an appointment for the next 7 days only.</p>
            </div>
            <input class="text-black" type="text" v-model="name" placeholder="Name">
            <input class="text-black" type="text" v-model="phone" placeholder="phone">
            <button type="submit"
                class="bg-blue-950 hover:bg-transparent hover:border-solid hover:border-2 hover:text-blue-500 hover:border-blue-500 hover:translate-y-2 text-white font-bold py-2 px-4 hover:rounded-md rounded duration-200">Confirm
                Appointment
            </button>

            <div v-if="errormsz" class="text-red-500">
                {{ errormsz }}
            </div>
        </form>
    </main>


</template>

<script setup>
import { ref, watch } from 'vue'
import { getFirestore, collection, query, getDocs, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { useRouter } from 'vue-router';

// Access the router instance
const router = useRouter();

const date = ref(null)
const doctorNames = ref([]);
const name = ref(null);
const phone = ref(null);
const currentDay = ref(null);
const selectdoctor = ref(null);
const errormsz = ref("");

const isDateValid = ref(true);

const fetchDoctorNames = async () => {
    if (date.value) {
        const dateObj = new Date(date.value)
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        currentDay.value = dayNames[dateObj.getDay()]; // Store day name in a variable

        try {
            const db = getFirestore();
            const doctorsCollection = collection(db, "EspData", "ADSM", "Doctors");
            const doctorQuery = query(doctorsCollection);
            const doctorSnapshot = await getDocs(doctorQuery);
            const doctorsWithField = doctorSnapshot.docs.filter(doc => doc.data().hasOwnProperty(currentDay.value));

            doctorNames.value = doctorsWithField.map(doctor => ({ id: doctor.data().uid, name: doctor.data().name }));
            console.log(doctorNames.value)

            if (doctorNames.value.length === 0) {
                doctorNames.value = [
                    { "name": "No doctor is available today", "id": null }
                ]
            }

        } catch (error) {
            console.error("Error retrieving doctor data:", error);
            doctorNames.value = []; // Reset doctor names on error
        }
    } else {
        doctorNames.value = []; // Reset doctor names if date is not selected
    }
}



const makeAppointment = async () => {
    try {
        const db = getFirestore();

        // get the serial Number
        const doctorDocRef = doc(db, "EspData", "ADSM", "Doctors", selectdoctor.value);
        const doctorDocSnapshot = await getDoc(doctorDocRef);
        const doctorData = doctorDocSnapshot.data();
        console.log(doctorData[currentDay.value]);
        let serial = doctorData[currentDay.value] + 1;
        let doctorname = doctorData["name"]

        

        const appointmentsCollection = collection(db, "EspData", "ADSM", "patient");
        const appoint = await addDoc(appointmentsCollection, {
            day: currentDay.value,
            doctor_id: selectdoctor.value, // Assuming only one doctor can be selected
            name: name.value,
            phone: phone.value,
            serial: serial,
            doctor_name: doctorname,
        });
        console.log("Appointment added successfully!");
        alert("appointment succesfull")



        // Update the serial number for doctor
        const updateData = {};
        updateData[currentDay.value] = serial;

        // Update the field in the doctor's document
        await updateDoc(doctorDocRef, updateData);


        // Reset the error message when the form is submitted successfully
        errormsz.value = "";
        // You can add further actions here, such as showing a success message or redirecting the user.


        router.push({ name: 'appoint-detail', params: { id: appoint.id } });


    } catch (error) {
        console.error("Error adding appointment:", error);
        // Handle error appropriately, such as showing an error message to the user.
    }
}

const handleSubmit = () => {
    if (!date.value || !name.value || !phone.value || selectdoctor.value === null) {
        console.error("Please fill all the fields.");
        errormsz.value = "Please fill all the fields.";
    } else {
        try {
            makeAppointment();
            // Reset the error message when all fields are filled and the form is submitted successfully
            errormsz.value = "";
        } catch (error) {
            console.error("Error adding appointment:", error);
        }
    }
}

// Watch for changes in date value and update currentDay accordingly
watch(date, (newValue) => {
    if (newValue) {
        const selectedDate = new Date(newValue);
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // Calculate the date 7 days from today
        if (selectedDate >= today && selectedDate <= nextWeek) {
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            currentDay.value = dayNames[selectedDate.getDay()];
            isDateValid.value = true;
        } else {
            currentDay.value = null;
            isDateValid.value = false;
        }

        // Check if selected date is in the past
        if (selectedDate < today) {
            errormsz.value = "Please select a date that is not in the past.";
        } else {
            errormsz.value = "";
        }
    } else {
        currentDay.value = null;
        isDateValid.value = false;
        errormsz.value = "";
    }
});
// Initialize doctor names when component is mounted and when date changes
watch(currentDay, fetchDoctorNames, { immediate: true });
</script>
