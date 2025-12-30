// === NOTIFICATION API ===

function notifyUser(message) {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
        new Notification(message);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification(message);
            }
        });
    }
}


// === VALIDATION API ===
const journalField = document.getElementById("journal-text");

if (journalField) {
    journalField.addEventListener("input", () => {
        if (journalField.validity.valueMissing) {
            journalField.setCustomValidity("Please write something before saving.");
        } else {
            journalField.setCustomValidity("");
        }
    });
}
