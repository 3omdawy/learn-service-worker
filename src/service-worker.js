/* globals self, caches, fetch, fetchCommits, sendMessageToClients */

self.importScripts('/vendor/idb-keyval-min.js');
self.importScripts('/helpers.js');
const CACHE_NAME = 'awesome-app--cache-v1';

/* Task 3a) Create list of known files */
const urls = [
  '/',
  '/vendor/idb-keyval-min.js',
  '/icons/github.png',
  '/helpers.js',
  '/main.css',
  '/main.js',
];

/*** Update commits by fetching and saving them ***/
function updateCommits() {
  self.clients.matchAll()
    .then(function (clients) {
      clients.forEach(function (client) {
        client.postMessage({ type: 'start-loading' });
      });
    });

  return fetchCommits()
    .then(async function (commits) {
      if (commits) {
        await idbKeyval.set('commits', commits);
        return sendMessageToClients({ type: 'commits' });
      }
    })
    .catch(function (error) {
      return sendMessageToClients({ type: 'failed-to-load', error: error.toString() });
    });
}

self.addEventListener('install', function (event) {
  /* Task 3b) Pre-cache known files */
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => { cache.addAll(urls); })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith((async () => {
    /* Task 4) Answer requests with stuff from cache */
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {
      console.log('Served: ', event.request.url, 'from cache');
      return cachedResponse;
    }
    /* Task 5) If not in cache: request it and then cache it */
    console.log('Served: ', event.request.url, 'from server');
    const response = await fetch(event.request.clone());

    // NOK response => do not cache
    if (!response || response.status !== 200 || response.type !== 'basic') {
    }
    else {
      /* Task 6) Do not cache API responses */
      if (event.request.url.indexOf('/api') === -1) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, response.clone());
      }
    }
    return response;
  })());

});

/* Task 8a) Add background sync */
self.addEventListener('sync', function (event) {
  if (event.tag === 'commits') {
    // Update commits
    event.waitUntil(
      updateCommits()
    );
    console.log(event);
  }
});