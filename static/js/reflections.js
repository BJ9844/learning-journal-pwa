let allEntries = [];

// Load reflections from backend/reflections.json
async function loadReflections() {
  try {
    const res = await fetch("backend/reflections.json", { cache: "no-store" });
    allEntries = await res.json();
    renderEntries(allEntries);
  } catch (err) {
    console.error(err);
    document.getElementById("entries").innerHTML =
      "<p>Could not load backend/reflections.json. Check the file path and run via Live Server.</p>";
  }
}

// Display entries in the DOM
function renderEntries(entries) {
  const container = document.getElementById("entries");
  const countText = document.getElementById("countText");

  countText.textContent = `Total reflections: ${entries.length}`;

  if (!entries.length) {
    container.innerHTML =
      "<p>No reflections yet. Run <b>python backend/save_entry.py</b> to add one.</p>";
    return;
  }

  container.innerHTML = entries
    .slice()
    .reverse()
    .map(
      (e) => `
      <div class="entry">
        <h3>${e.date} ${e.time}</h3>
        <p>${escapeHtml(e.reflection)}</p>
      </div>
    `
    )
    .join("");
}

// Extra feature 1: Search filter
function setupSearch() {
  const input = document.getElementById("searchInput");
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();
    const filtered = allEntries.filter((e) =>
      (e.reflection || "").toLowerCase().includes(q)
    );
    renderEntries(filtered);
  });
}

// Extra feature 2: Export JSON
function setupExport() {
  const btn = document.getElementById("exportBtn");
  btn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(allEntries, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "reflections.json";
    a.click();

    URL.revokeObjectURL(url);
  });
}

// Important: Your form currently saves to browser storage.
// For this lab, entries are saved by Python, so we show a message instead.
function overrideFormBehavior() {
  const form = document.getElementById("journal-form");
  const note = document.getElementById("saveNote");

  note.textContent =
    "Lab 5: Entries are saved using Python into backend/reflections.json. Type here, then run python backend/save_entry.py (terminal) to actually save.";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(
      "To save: run Python script (backend/save_entry.py). Then refresh this page to see the new entry."
    );
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

document.addEventListener("DOMContentLoaded", () => {
  overrideFormBehavior();
  setupSearch();
  setupExport();
  loadReflections();
});
