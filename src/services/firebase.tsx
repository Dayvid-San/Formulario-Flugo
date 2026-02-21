import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyD5y4oDxigku2nNIbvyMuHj934eEmx6KDE",
  authDomain: "flugo-3e1b2.firebaseapp.com",
  projectId: "flugo-3e1b2",
  storageBucket: "flugo-3e1b2.firebasestorage.app",
  messagingSenderId: "860777731203",
  appId: "1:860777731203:web:7ec61754340915e6d237b6",
  measurementId: "G-P1Y1KYGFME"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Este 'db' será usado para salvar os funcionários