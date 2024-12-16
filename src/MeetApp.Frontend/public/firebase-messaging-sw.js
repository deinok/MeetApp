importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyCErdQtp81Uhe0COJooMsrgvvTThUOKY64",
    authDomain: "meetapp-udl.firebaseapp.com",
    projectId: "meetapp-udl",
    storageBucket: "meetapp-udl.firebasestorage.app",
    messagingSenderId: "11747595208",
    appId: "1:11747595208:web:089f43cf2b1eee251ee6fd",
    measurementId: "G-7J9N4VQFCS"
  };
  
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
const analytics = getAnalytics(app);


messaging.onBackgroundMessage((payload) => {
  console.log("Background notification received:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
