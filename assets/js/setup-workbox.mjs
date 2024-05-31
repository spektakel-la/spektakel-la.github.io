/*
 * Copied with pride from: https://developer.chrome.com/docs/workbox/handling-service-worker-updates/
 */
import { Workbox } from '/assets/3rd-party/workbox-v7.1.0/workbox-window.prod.mjs';

if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js');

  const showSkipWaitingPrompt = async (event) => {
    // Assuming the user accepted the update, set up a listener
    // that will reload the page as soon as the previously waiting
    // service worker has taken control.
    wb.addEventListener('controlling', () => {
      // At this point, reloading will ensure that the current
      // tab is loaded under the control of the new service worker.
      // Depending on your web app, you may want to auto-save or
      // persist transient state before triggering the reload.
      window.location.reload();
    });

    // When `event.wasWaitingBeforeRegister` is true, a previously
    // updated service worker is still waiting.
    // You may want to customize the UI prompt accordingly.

    // This code assumes your app has a promptForUpdate() method,
    // which returns true if the user wants to update.
    // Implementing this is app-specific; some examples are:
    // https://open-ui.org/components/alert.research or
    // https://open-ui.org/components/toast.research
    const updateAccepted = true; // await promptForUpdate();

    if (updateAccepted) {
      wb.messageSkipWaiting();
    }
  };

  // Add an event listener to detect when the registered
  // service worker has installed but is waiting to activate.
  wb.addEventListener('waiting', (event) => {
    showSkipWaitingPrompt(event);
  });

  wb.register();

  const swVersion = await wb.messageSW({ type: 'GET_VERSION' });
  console.log('Service Worker version:', swVersion);
}