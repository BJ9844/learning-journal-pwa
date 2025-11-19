// === SAVE JOURNAL ENTRY ===
const form = document.getElementById("journal-form");
const journalText = document.getElementById("journal-text");
const entriesDiv = document.getElementById("entries");

// Load saved entries on page load
function loadEntries() {
    const saved = JSON.parse(localStorage.getItem("journalEntries")) || [];
    entriesDiv.innerHTML = "";

    saved.forEach((entry, index) => {
        const p = document.createElement("p");
        p.textContent = entry;
        entriesDiv.appendChild(p);
    });
}

// Save new entry
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let saved = JSON.parse(localStorage.getItem("journalEntries")) || [];
        saved.push(journalText.value);
        localStorage.setItem("journalEntries", JSON.stringify(saved));

        journalText.value = "";
        loadEntries();

        // Trigger browser API notification
        notifyUser("Journal entry saved!");
    });
}

loadEntries();


// === SAVE THEME PREFERENCE ===
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

document.addEventListener("click", (event) => {
    if (event.target.id === "theme-toggle") {
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }
});
