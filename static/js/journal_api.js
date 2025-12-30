function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function fetchAllReflections() {
  const res = await fetch("/reflections");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load reflections");
  return data;
}

function renderReflections(reflections) {
  const container = document.getElementById("entriesContainer");

  if (!reflections || reflections.length === 0) {
    container.innerHTML = "<i>No reflections found.</i>";
    return;
  }

  // newest first
  const list = [...reflections].reverse();

  let html = "";
  for (const r of list) {
    html += `
      <div class="entry-card">
        <b>${escapeHtml(r.name || "Unknown")}</b><br>
        <small>${escapeHtml(r.date || "")} ${escapeHtml(r.time || "")}</small>
        <p>${escapeHtml(r.reflection || "")}</p>
        <button class="btn" data-delete="${r.id}">Delete</button>
      </div>
      <hr>
    `;
  }

  container.innerHTML = html;

  // Bind delete buttons
  container.querySelectorAll("button[data-delete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-delete");
      await deleteReflection(id);
    });
  });
}

async function loadReflectionsToPage() {
  const container = document.getElementById("entriesContainer");
  container.innerHTML = "<i>Loading reflections...</i>";

  try {
    const data = await fetchAllReflections();
    renderReflections(data);
  } catch (err) {
    container.innerHTML = `<i>${escapeHtml(err.message)}</i>`;
  }
}

async function submitReflection(name, reflection) {
  const res = await fetch("/add_reflection", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, reflection }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Submit failed");
  return data;
}

async function deleteReflection(id) {
  if (!confirm("Delete this reflection?")) return;

  const res = await fetch(`/delete_reflection/${id}`, { method: "DELETE" });
  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Delete failed");
    return;
  }

  await loadReflectionsToPage();
}

function setupForm() {
  const form = document.getElementById("journalForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("fname").value.trim();
    const reflection = document.getElementById("reflection").value.trim();

    if (name.length < 1) {
      alert("Please enter your name.");
      return;
    }
    if (reflection.length < 10) {
      alert("Reflection must be at least 10 characters.");
      return;
    }

    try {
      await submitReflection(name, reflection);
      form.reset();
      await loadReflectionsToPage();
    } catch (err) {
      alert(err.message);
    }
  });
}

function setupSearch() {
  const search = document.getElementById("searchBox");
  if (!search) return;

  search.addEventListener("input", async () => {
    const q = search.value.toLowerCase().trim();

    try {
      const data = await fetchAllReflections();
      const filtered = data.filter(
        (r) =>
          (r.name || "").toLowerCase().includes(q) ||
          (r.reflection || "").toLowerCase().includes(q)
      );
      renderReflections(filtered);
    } catch (err) {
      // ignore
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setupForm();
  setupSearch();
  loadReflectionsToPage();
});
