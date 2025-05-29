const CACHE_NAME = "imtla-cache-v1";

// Arquivos locais a serem armazenados em cache
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/cadastro.html",
  "/home.html",
  "/style.css",
  "/main.js",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/offline.html"
];

// Instala o service worker e faz cache dos arquivos locais
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Ativa o novo service worker imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

// Ativa o novo service worker e remove caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // Assume controle das páginas abertas
});

// Intercepta requisições e tenta servir do cache primeiro
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((liveResponse) => {
          // Clona a resposta da rede e armazena no cache
          const clonedResponse = liveResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return liveResponse;
        }).catch(() => {
          // Se estiver offline e for uma página HTML, mostra offline.html
          if (event.request.destination === "document") {
            return caches.match("/offline.html");
          }
        })
      );
    })
  );
});

// Recebe notificações push
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = {
      title: "Notificação do IMTLA",
      body: "Você recebeu uma nova mensagem."
    };
  }

  const options = {
    body: data.body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: {
      url: data.url || "/home.html"
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Ao clicar na notificação, abre a URL associada
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});

// Registro automático do service worker (coloque no seu main.js ou index.html)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => console.log("✅ Service Worker registrado com sucesso"))
      .catch((err) => console.error("❌ Falha ao registrar o Service Worker", err));
  });
}
