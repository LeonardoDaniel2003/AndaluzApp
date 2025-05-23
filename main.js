// Importações do Firebase modular SDK
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAEmwH746N1ebPpxVImboyXgP74IaTULl0",
  authDomain: "imtla-app-e7b78.firebaseapp.com",
  projectId: "imtla-app-e7b78",
  storageBucket: "imtla-app-e7b78.appspot.com",
  messagingSenderId: "787422407393",
  appId: "1:787422407393:web:275cb3669c80c46a1b65a0"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Funções de autenticação
export function cadastrarUsuario(email, senha) {
  return createUserWithEmailAndPassword(auth, email, senha);
}

export function loginUsuario(email, senha) {
  return signInWithEmailAndPassword(auth, email, senha);
}

export function logoutUsuario() {
  return signOut(auth);
}

// Chave pública VAPID (para notificações push)
const publicVapidKey = "BIdsCsBcsnkWE0vnR5y8hWlooxoCk4Dhzu2zJkURcWaXbwZzb5A-7mm1E441r_fIUDQd_APb-JOaBNCIrjxdpZI";

// Quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");

  if (!role) {
    alert("Você precisa estar logado.");
    window.location.href = "index.html";
    return;
  }

  if (role === "aluno") {
    mostrarGraficoNotas();
  } else {
    const secaoNotas = document.getElementById("notas");
    if (secaoNotas) {
      secaoNotas.classList.remove("ativa");
    }
  }

  const formMensagem = document.getElementById("formMensagem");
  if (formMensagem && role !== "escola") {
    formMensagem.style.display = "none";
  }

  if (formMensagem) {
    formMensagem.addEventListener("submit", (e) => {
      e.preventDefault();
      const destino = document.getElementById("emailDestino")?.value;
      const texto = document.getElementById("mensagemTexto")?.value;

      if (destino && texto) {
        const mailto = `mailto:${destino}?subject=Mensagem do IMTLA&body=${encodeURIComponent(texto)}`;
        window.location.href = mailto;
      } else {
        alert("Por favor, preencha o email e a mensagem.");
      }
    });
  }

  // Notificações Push
  if ("Notification" in window && "serviceWorker" in navigator) {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log("Permissão de notificação concedida.");

        navigator.serviceWorker.ready.then(async (registration) => {
          try {
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            });

            await fetch('/subscribe', {
              method: 'POST',
              body: JSON.stringify(subscription),
              headers: {
                'Content-Type': 'application/json'
              }
            });

            console.log('Usuário inscrito para notificações push.');
          } catch (error) {
            console.error("Erro ao se inscrever para notificações:", error);
          }
        });
      }
    });
  }
});

// Função para exibir uma seção do app
export function showSection(id) {
  document.querySelectorAll(".secao").forEach(secao => {
    secao.classList.remove("ativa");
  });

  const alvo = document.getElementById(id);
  if (alvo) {
    alvo.classList.add("ativa");
    window.scrollTo(0, 0);
  }
}

// Função para exibir gráfico de notas
export function mostrarGraficoNotas() {
  const canvas = document.getElementById("graficoNotas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const notas = [15, 8, 12, 10, 18];
  const disciplinas = ["Português", "Matemática", "Física", "Química", "Biologia"];

  
  new Chart(ctx, {
    type: "line",
    data: {
      labels: disciplinas,
      datasets: [{
        label: "Notas",
        data: notas,
        borderColor: "#333",
        backgroundColor: "transparent",
        pointBackgroundColor: cores,
        pointBorderColor: cores,
        borderWidth: 2,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 20
        }
      }
    }
  });
}

// Função utilitária para converter a chave pública em formato adequado
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

function voltarParaLogin() {
  window.location.href = "index.html"; // ou o link para sua tela de login
}
