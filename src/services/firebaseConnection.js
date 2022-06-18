//npm install firebase@^8.8.1

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBCXqHLEL9XCfSy5XR4j5Pg9Vv416nNoFw",
    authDomain: "atendimento-24c42.firebaseapp.com",
    projectId: "atendimento-24c42",
    storageBucket: "atendimento-24c42.appspot.com",
    messagingSenderId: "910403114198",
    appId: "1:910403114198:web:16ac4a191e9fdccd002577",
    measurementId: "G-6N8SY21Q2N"
  };
  
  
    firebase.initializeApp(firebaseConfig);
  

  export default firebase;
  