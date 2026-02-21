import { collection, addDoc } from "firebase/firestore";
import { db } from "./services/firebase";

export const testarConexao = async () => {
  try {
    const docRef = await addDoc(collection(db, "teste"), {
      mensagem: "Conexão funcionando!",
      data: new Date().toISOString()
    });
    console.log("Documento escrito com ID: ", docRef.id);
    alert("Sucesso! O dado foi para o Firebase.");
  } catch (e) {
    console.error("Erro ao adicionar documento: ", e);
    alert("Erro na conexão. Verifique o console.");
  }
};