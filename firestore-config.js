// Inicialização do Firestore já está no main.js
// Aqui vai a função de salvar dados no Firestore após cadastro

function salvarUsuarioFirestore(uid, nome, numeroEstudante, email, tipoUsuario) {
  return db.collection("usuarios").doc(uid).set({
    nome: nome,
    numeroEstudante: numeroEstudante,
    email: email,
    tipoUsuario: tipoUsuario
  });
}
