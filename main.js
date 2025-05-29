
// -------------------------------
// Firebase: Configuração e Inicialização
// -------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAEmwH746N1ebPpxVImboyXgP74IaTULl0",
  authDomain: "imtla-app-e7b78.firebaseapp.com",
  projectId: "imtla-app-e7b78",
  storageBucket: "imtla-app-e7b78.appspot.com",
  messagingSenderId: "787422407393",
  appId: "1:787422407393:web:275cb3669c80c46a1b65a0"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// -------------------------------
// Autenticação: Redireciona se não logado
// -------------------------------
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  }
});

// -------------------------------
// Função: Logout
// -------------------------------
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  }).catch(error => {
    console.error("Erro ao sair:", error);
  });
}

// -------------------------------
// Navegação entre Seções
// -------------------------------
let historicoSecoes = [];

function showSection(id) {
  const secaoAtual = document.querySelector('.secao.ativa');
  if (secaoAtual && secaoAtual.id !== id) {
    historicoSecoes.push(secaoAtual.id);
  }
  document.querySelectorAll('.secao').forEach(secao => secao.classList.remove('ativa'));
  document.getElementById(id).classList.add('ativa');
}

function voltarParaAnterior() {
  if (historicoSecoes.length > 0) {
    const ultimaSecao = historicoSecoes.pop();
    showSection(ultimaSecao);
  }
}

// -------------------------------
// Função: Mostrar Boletim
// -------------------------------
function mostrarBoletim(event) {
  event.preventDefault();
  const id = document.getElementById('idAluno').value;
  const resultado = document.getElementById('resultadoBoletim');

  if (id === '123') {
    resultado.innerHTML = `
      <h3>Boletim do Aluno 123</h3>
      <ul>
        <li>Lingua Portuguesa: 14</li>
        <li>Matemática: 16</li>
        <li>Física: 12</li>
        <li>Química: 12</li>
        <li>TREI: 12</li>
        <li>OGI: 17</li>
        <li>Empreendedorismo: 17</li>
        <li>Educação Física: 18</li>
        <li>FAI: 19</li>
      </ul>`;
  } else {
    resultado.innerHTML = `<p>ID do aluno não encontrado.</p>`;
  }
}

// -------------------------------
// Função: Trocar Foto de Perfil
// -------------------------------
function trocarFotoPerfil(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const perfilIcon = document.getElementById('perfilIcon');
      perfilIcon.innerHTML = `<img src="${e.target.result}" alt="Foto de Perfil" />`;
    };
    reader.readAsDataURL(file);
  }
}

// -------------------------------
// Função: Abrir WhatsApp
// -------------------------------
function abrirWhatsapp() {
  window.open('https://wa.me/244946605295', '_blank');
}

// -------------------------------
// Função: Adicionar Nota ao Calendário
// -------------------------------
function adicionarNota() {
  const data = document.getElementById("data").value;
  const nota = document.getElementById("nota").value;

  if (data && nota) {
    const lista = document.getElementById("listaNotas");

    const itemWrapper = document.createElement("div");
    itemWrapper.className = "nota-wrapper";

    const item = document.createElement("div");
    item.className = "nota-item";
    item.innerHTML = `<strong>${data}</strong><br>${nota}`;

    const btnExcluir = document.createElement("button");
    btnExcluir.className = "btn-excluir";
    btnExcluir.innerHTML = `<i class="fas fa-trash-alt"></i>`;
    btnExcluir.onclick = () => {
      itemWrapper.remove();
      alert("Nota removida com sucesso!");
    };

    itemWrapper.appendChild(item);
    itemWrapper.appendChild(btnExcluir);
    lista.appendChild(itemWrapper);

    document.getElementById("data").value = "";
    document.getElementById("nota").value = "";
    alert("Nota adicionada com sucesso!");
  } else {
    alert("Por favor, preencha a data e a nota.");
  }
}

// -------------------------------
// Gráfico de Notas com Chart.js
// -------------------------------
function inicializarGrafico() {
  const ctx = document.getElementById('graficoNotas');
  if (ctx) {
    const notas = [8, 16, 12, 12, 16, 12, 17, 18];
    const disciplinas = ['Lingua Portuguesa', 'Matemática', 'Física', 'TREI', 'OGI', 'QUÍMICA', 'EMPREENDEDORISMO', 'EDUCAÇÃO FÍSICA'];
    const coresBarras = notas.map(nota =>
      nota < 10 ? 'rgba(255, 99, 132, 0.7)' :
      nota <= 15 ? 'rgba(255, 159, 64, 0.7)' :
      'rgba(75, 192, 192, 0.7)'
    );

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: disciplinas,
        datasets: [{
          label: 'Notas',
          data: notas,
          backgroundColor: coresBarras,
          borderColor: '#333',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 20,
            title: { display: true, text: 'Nota' }
          },
          x: {
            title: { display: true, text: 'Disciplina' }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `Nota: ${ctx.raw}`
            }
          }
        }
      }
    });
  }
}

// -------------------------------
// Notificações Push com VAPID
// -------------------------------
const publicVapidKey = 'BIdsCsBcsnkWE0vnR5y8hWlooxoCk4Dhzu2zJkURcWaXbwZzb5A-7mm1E441r_fIUDQd_APb-JOaBNCIrjxdpZI';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

function iniciarNotificacoesPush() {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        navigator.serviceWorker.register('service-worker.js').then(registration => {
          registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
          }).then(subscription => {
            console.log('Inscrito nas notificações push:', subscription);
            registration.showNotification("Notificações Ativadas", {
              body: "Você receberá novidades do IMTLA.",
              icon: "icone.png"
            });
          }).catch(err => {
            console.error('Erro ao se inscrever nas notificações:', err);
          });
        }).catch(error => {
          console.error("Erro ao registrar service worker:", error);
        });
      }
    });
  } else {
    console.warn("Navegador não suporta notificações push.");
  }
}

// -------------------------------
// Inicialização Geral
// -------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Ativa seção com base no hash da URL
  const hash = window.location.hash?.replace('#', '');
  if (hash && document.getElementById(hash)) {
    document.querySelectorAll('.secao').forEach(secao => secao.classList.remove('ativa'));
    document.getElementById(hash).classList.add('ativa');
  }

  inicializarGrafico();
  iniciarNotificacoesPush();
});

// -------------------------------
// Registro do Service Worker
// -------------------------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('Service Worker registrado com sucesso:', registration);
    }).catch(error => {
      console.error('Falha ao registrar Service Worker:', error);
    });
  });
}
