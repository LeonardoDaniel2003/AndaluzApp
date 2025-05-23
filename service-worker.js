const CACHE_NAME = "imtla-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/cadastro.html",
  "/home.html",
  "/style.css",
  "/main.js",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// Instala o service worker e faz cache dos arquivos
self.addEventListener("install", (event) => {
  self.skipWaiting(); // força ativação imediata
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Ativação do novo service worker e limpeza de caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // assume controle imediatamente
});

// Intercepta fetch para servir do cache ou fazer request à rede
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Lida com notificações push recebidas do servidor
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {
    title: "Notificação",
    body: "Você recebeu uma nova mensagem."
  };

  const options = {
    body: data.body,
    icon: "/icon-192.png",
    badge: "/icon-192.png"
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Ao clicar na notificação, abre a aplicação
self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/") // Você pode mudar para "/home.html" se quiser
  );
});
