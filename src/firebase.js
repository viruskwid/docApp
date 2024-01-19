// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBedYh3zde4BiK0UVKHZh2bnY-PdJ7rzfg",
  authDomain: "doc-app-162bc.firebaseapp.com",
  databaseURL: "https://doc-app-162bc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "doc-app-162bc",
  storageBucket: "doc-app-162bc.appspot.com",
  messagingSenderId: "984147186215",
  appId: "1:984147186215:web:4bb97eeeaa41af52d17402",
  measurementId: "G-CHJDQ4J1VX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db=getFirestore(app)