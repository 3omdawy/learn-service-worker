# Using ServiceWorkers

This is a repository with the answer to a wonderful exercise here: https://itera.github.io/learn-service-worker/

The application is a simple application for listing commits from GitHub. The
goal is to make the application work offline by using ServiceWorkers.

## Tasks

1. Install the ServiceWorker (main.js) using `register` function
2. Pre-cache known files (service-worker.js) on the `install` event
3. Answer requests with stuff from cache (service-worker.js) by checking the `fetch` event
4. If not in cache (using `caches.match` function): request it and then cache it (service-worker.js)
5. Do not cache API responses (service-worker.js)
6. Store data to and get data from `IndexedDB` (main.js)
7. Add background sync

## About Service Workers
* Service workers are used to enhance performance (by caching), enable working offline (for progressive web applications), and enable receiving push notifications.
* More details can be found in [this note](https://docs.google.com/document/d/1pyh5-ZvEyiVEFqjixdCMCDL-wPl55gi54FCE65ljv-M/edit#heading=h.as8wt3rjzaut)

## About Progressive Web Apps
* Progressive Web Apps (PWA) are web apps built and enhanced with modern APIs to provide enhanced capabilities while still reaching any web user on any device with a single codebase. They combine the broad reach of web apps with the rich capabilities of platform-specific apps to enhance the user experience.
* More details can be found in [this note](https://docs.google.com/document/d/1GZwejjM7QmXvAH5-2pTqPo0TxaRYbgsSPcu7cpmrfQc/edit?usp=sharing)
