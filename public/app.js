import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyAGQGxiggv1mz38G1L7rsF1xj4U7-B8mCQ",
    authDomain: "tuersensor-1b3cd.firebaseapp.com",
    databaseURL: "https://tuersensor-1b3cd-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tuersensor-1b3cd",
    storageBucket: "tuersensor-1b3cd.appspot.com",
    messagingSenderId: "352405331682",
    appId: "1:352405331682:web:f29f8356481d76cfdb88bb"
};

// Initialisiere Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const messaging = getMessaging(app);

function requestPermission() {
    Notification.requestPermission().then((permission) => {
        console.log('Notification permission status:', permission);
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            getToken(messaging, { vapidKey: 'BCoEljO3zbLSXN98FfOJEWXKKyyP_gOQtNiLNMGfZFInxnMG2XD5mMKdnIa3fZE3A02870eFfJM7zzSdOp4DGmw' }).then((currentToken) => {
                if (currentToken) {
                    console.log('Token received:', currentToken);
                    // Hier könntest du den Token an deinen Server senden
                } else {
                    console.log('No registration token available. Request permission to generate one.');
                }
            }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
            });
        } else {
            console.log('Unable to get permission to notify.');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    requestPermission();
    const statusElement = document.getElementById('status');
    let openTimer = null;

    function updateStatus(isOpen) {
        console.log('Updating status, isOpen:', isOpen);
        statusElement.textContent = isOpen ? 'Tür ist offen' : 'Tür ist geschlossen';
        handleOpenStatus(isOpen);
    }

    function handleOpenStatus(isOpen) {
        console.log('handleOpenStatus called, isOpen:', isOpen);
        if (isOpen) {
            if (openTimer === null) {
                console.log('Starting timer for 10 seconds');
                openTimer = setTimeout(() => {
                    sendNotification();
                }, 10000); // 10000 ms = 10 Sekunden
            }
        } else {
            if (openTimer) {
                console.log('Clearing timer');
                clearTimeout(openTimer);
                openTimer = null;
            }
        }
    }

    function sendNotification() {
        console.log('Sending notification');
        if (Notification.permission === "granted") {
            new Notification("Achtung!", {
                body: "Die Tür steht schon seit 10 Sekunden offen!",
                icon: 'Türe.jpg'
            });
        }
    }

    const statusRef = ref(database, 'doorStatus');
    onValue(statusRef, (snapshot) => {
        console.log('Firebase data snapshot:', snapshot.val());
        const isOpen = snapshot.val().isOpen;
        updateStatus(isOpen);
    }, (error) => {
        console.error('Fehler beim Abrufen des Türstatus:', error);
        statusElement.textContent = 'Fehler beim Laden des Türstatus.';
    });
});