import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyADxIkwAT3wjZjuDEAuZtPtAHGiGjs5uZs",
  authDomain: "doser-hub.firebaseapp.com",
  projectId: "doser-hub",
  storageBucket: "doser-hub.firebasestorage.app",
  messagingSenderId: "676983507988",
  appId: "1:676983507988:web:bd60071aff755e8af72b01",
  measurementId: "G-L03ZK34FYM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
