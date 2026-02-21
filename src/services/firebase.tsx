import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Estas informações aparecem quando crias um "Web App" no Firebase
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "DOMAIN",
  projectId: "PROJECT_ID",
  storageBucket: "STORAGE_BUCKET",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Este 'db' será usado para salvar os funcionários