import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faAddressBook, faAddressCard, faHouse, faArrowRight, faAngleDoubleRight, faEye, faPhoneVolume, faDownload, faPhone, faEnvelope, faLocationDot, faC } from '@fortawesome/free-solid-svg-icons';
import { faBitbucket, faFacebook, faGithub, faGoogle, faJsSquare, faLinkedin, faPython, faVuejs } from '@fortawesome/free-brands-svg-icons'


// Add imported icons to the library
library.add(faAddressBook, faAddressCard, faHouse, faArrowRight, faAngleDoubleRight, faEye, faPhoneVolume, faDownload, faPython, faPhone, faEnvelope, faLocationDot, faFacebook, faLinkedin, faBitbucket, faGithub, faC, faJsSquare, faVuejs, faGoogle);


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAipivCHxgu7K1Y81k9vCUWDo6MvOePnN0",
  authDomain: "cse3152.firebaseapp.com",
  databaseURL: "https://cse3152-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cse3152",
  storageBucket: "cse3152.appspot.com",
  messagingSenderId: "206292190867",
  appId: "1:206292190867:web:cbdc4f5783b3cbbf84ef66"
};

initializeApp(firebaseConfig);

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)

app.mount('#app')
