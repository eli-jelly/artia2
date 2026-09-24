import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFYRBJCwi9gB2bEfLtL-Atk9Zob7wT5ZY",
  authDomain: "digi-oghs-2026.firebaseapp.com",
  projectId: "digi-oghs-2026",
  storageBucket: "digi-oghs-2026.firebasestorage.app",
  messagingSenderId: "150189316045",
  appId: "1:150189316045:web:bac068bf80b4887fd19684",
  measurementId: "G-4TTYSYKQZB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth, collection, addDoc, getDocs, query, where, orderBy };
