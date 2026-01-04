import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your project's config keys
const firebaseConfig = {
    apiKey: "AIzaSyChQmIvY6ymJwSiv2hzV9Zn_9PHwCJlHus",
    authDomain: "task-reminder-69ca7.firebaseapp.com",
    projectId: "task-reminder-69ca7",
    storageBucket: "task-reminder-69ca7.firebasestorage.app",
    messagingSenderId: "600214373098",
    appId: "1:600214373098:web:0e95fb0cf6e576addfcd93",
    measurementId: "G-KZFJB3BJ34"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
