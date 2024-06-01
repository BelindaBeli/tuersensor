import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

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

document.addEventListener('DOMContentLoaded', function() {
    const statusElement = document.getElementById('status');

    function updateStatus(isOpen) {
        statusElement.textContent = isOpen ? 'Tür ist offen' : 'Tür ist geschlossen';
    }

    // Verwende Firebase Realtime Database Listener
    const statusRef = ref(database, 'doorStatus');
    onValue(statusRef, (snapshot) => {
        const isOpen = snapshot.val().isOpen;
        updateStatus(isOpen);
    }, (error) => {
        console.error('Fehler beim Abrufen des Türstatus:', error);
        statusElement.textContent = 'Fehler beim Laden des Türstatus.';
    });
});