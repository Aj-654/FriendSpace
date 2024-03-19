import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4qx6Fhl2hnpW1cH71aH3gSKdgKx2uWNc",
  authDomain: "chat-app-a79f9.firebaseapp.com",
  projectId: "chat-app-a79f9",
  storageBucket: "chat-app-a79f9.appspot.com",
  messagingSenderId: "742354148745",
  appId: "1:742354148745:web:a20fc46b76856661c89558"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
