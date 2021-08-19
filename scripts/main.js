
function invokeServiceWorkerUpdateFlow(registration) {
  // Need UI element
  // if (confirm('New version for the website has been pushed. Refresh now?')) {
  //var notification = new Notification("Clicekd allert");
  if (registration.waiting) {
    registration.waiting.postMessage('SKIP_WAITING')
  }
  //}
}

const applicationServerPublicKey = 'BLno_uYF0FR_23f5vgU8mr2Q61E24p9Bu6rfF-hdScybXpRkPmnElO9-RbzxV-rLmdEbkSYqBIgo2wldN7pqLKE';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function updateBtn() {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

function updateSubscriptionOnServer(subscription) {


  if (subscription) {


    //console.log(JSON.stringify(subscription)); //send to backend push.js script


    async function postData(url = '', data = {}) {
      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      return response.json(); // parses JSON response into native JavaScript objects
    }

    postData('https://fierce-waters-11286.herokuapp.com/v1/pushnotification/push', {
      "end": subscription
    })
      .then(data => {
        console.log(data); // JSON data parsed by `data.json()` call
      });

  } 
  //---------------------------------------------------------------------------
}

function subscribeUser() {

  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey

  })
    .then(function (subscription) {
      console.log('User is subscribed.');

      updateSubscriptionOnServer(subscription);

      isSubscribed = true;

      updateBtn();
    })
    .catch(function (err) {
      console.log('Failed to subscribe the user: ', err);
      updateBtn();
    });
}

function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
    .then(function (subscription) {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .catch(function (error) {
      console.log('Error unsubscribing', error);
    })
    .then(function () {
      updateSubscriptionOnServer(null);

      console.log('User is unsubscribed.');
      isSubscribed = false;

      updateBtn();
    });
}
//
function initializeUI() {
  pushButton.addEventListener('click', function () {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {//
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
    .then(function (subscription) {
      isSubscribed = !(subscription === null);

      updateSubscriptionOnServer(subscription);

      if (isSubscribed) {
        console.log('User IS subscribed.');
      } else {
        console.log('User is NOT subscribed.');
      }

      updateBtn();
    });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {

  navigator.serviceWorker.register('sw.js')
    .then(function (swReg) {
      console.log('Service Worker is registered', swReg);
      swRegistration = swReg;
      initializeUI();
      invokeServiceWorkerUpdateFlow(swRegistration);
    })
    .catch(function (error) {
      console.error('Service Worker Error', error);
    });


} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}

if (Notification.permission === "granted") {

} else if (Notification.permission !== "denied") {
  Notification.requestPermission().then(function (permission) {
    if (permission === "granted") {
      //var notification = new Notification("Notification enabled");
    }
  });
}

