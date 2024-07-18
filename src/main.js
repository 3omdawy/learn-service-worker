/* eslint-env browser */
/* globals fetchCommits, render, hideSpinner, showSpinner, hideOfflineMessage, showOfflineMessage */
/* globals flashReadyForOfflineMessage, idbKeyval */

function onReceiveCommits() {
  debugger
  idbKeyval.get('commits') // Read commits from indexedDB
    .then(function (commits) {
      if (commits) {
        render(commits); // If there is something to render then render
        hideSpinner();
        hideOfflineMessage(); // We received new commits => we are not offline
      }
    })
}

function onMessage(event) {
  if (event.data.type === 'commits') {
    onReceiveCommits();
  }

  if (event.data.type === 'worker-installed') {
    flashReadyForOfflineMessage();
  }

  if (event.data.type === 'failed-to-load') {
    showOfflineMessage();
    hideSpinner();
  }

  if (event.data.type === 'start-loading') {
    showSpinner();
  }
}

/*** Register the service worker and listen to the Sync event for background refresh ***/
if ('serviceWorker' in navigator) {
  /* Task 2) Activate the worker */
  navigator.serviceWorker.register('/service-worker.js')
    .then(function (registration) { // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      navigator.serviceWorker.addEventListener('message', onMessage); // Event listener for messages related to the service worker
      if ('SyncManager' in window) { // Task 8b) Register background sync
        navigator.serviceWorker.ready
          .then(function (swRegistration) {
            return swRegistration.sync.register('commits'); // Send a 'sync' event with tag 'commits'
          });
      }
    })
    .catch(function (err) { // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
}

showSpinner(); // Show the loading spinner
fetchCommits() // Fetch commits from the server
  .then(async (commits) => await idbKeyval.set('commits', commits)) // save them to the indexedDB
  .then(onReceiveCommits)
  .catch(function (error) {
    console.error(error);
    showOfflineMessage(); // Could not fetch => means we are probably offline, or at least out of sync
    hideSpinner(); // Hide the loading spinner
  });

/* Task 7b) Get data from IndexedDB */
idbKeyval.get('commits') // Read commits from indexedDB
  .then(function (commits) {
    if (commits) {
      render(commits); // If there is something to render then render
    }
  })
