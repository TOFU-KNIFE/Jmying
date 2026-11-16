// Retire the 2.x offline archive when restoring the static 1.x profile.
// Keep this endpoint available so existing installations can discover the rollback.
const archivePrefix = `rhine-lab:${new URL(self.registration.scope).pathname}:`;

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key.startsWith(archivePrefix)) await caches.delete(key);
      }
      await self.clients.claim();
      const windows = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      await self.registration.unregister();
      await Promise.all(
        windows
          .filter((client) => client.url.startsWith(self.registration.scope))
          .map((client) => {
            // WebKit can treat an unchanged URL with a fragment as same-document
            // navigation. A release query forces a fresh document and keeps anchors.
            const url = new URL(client.url);
            url.searchParams.set("v", "1.15.5");
            return client.navigate(url.href).catch(() => {});
          }),
      );
    })(),
  );
});
