import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 1. Adicione este import para autenticação

const firebaseConfig = {
  apiKey: "AIzaSyD5y4oDxigku2nNIbvyMuHj934eEmx6KDE",
  authDomain: "flugo-3e1b2.firebaseapp.com",
  projectId: "flugo-3e1b2",
  storageBucket: "flugo-3e1b2.firebasestorage.app",
  messagingSenderId: "860777731203",
  appId: "1:860777731203:web:7ec61754340915e6d237b6",
  measurementId: "G-P1Y1KYGFME"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// 2. Inicialize e exporte o serviço de Autenticação
export const auth = getAuth(app); 

// 3. Mantenha a exportação do Firestore para o CRUD de colaboradores
export const db = getFirestore(app);