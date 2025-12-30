function setDate() {
  const d = new Date();
  document.getElementById("todayDate").innerText = d.toDateString();
}

async function loadReflections() {
  const view = document.getElementById("viewAll");
  view.innerHTML = "Loading...";

  try {
    const res = await fetch("/api/reflections");
    if (!res.ok) throw new Error("GET failed");

    const reflections = await res.json();

    if (reflections.length === 0) {
      view.innerHTML = "<i>No reflections found.</i>";
      return;
    }

    let output = "";
    for (const r of reflections) {
      output += `
        <div class="card">
          <b>${escapeHtml(r.name)}</b><br>
          <i>${escapeHtml(r.date)}</i><br>
          <p>${escapeHtml(r.reflection)}</p>
          <button class="danger" onclick="deleteReflection('${
            r.id
          }')">Delete</button>
        </div>
      `;
    }
    view.innerHTML = output;
  } catch (e) {
    view.innerHTML = "<i>Error loading reflections.</i>";
  }
}

async function submitReflection() {
  const name = document.getElementById("fname").value.trim();
  const reflection = document.getElementById("reflection").value.trim();

  const entry = { name, reflection };

  const res = await fetch("/api/reflections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });

  if (res.ok) {
    document.myForm.reset();
    await loadReflections();
  } else {
    const data = await res.json().catch(() => ({}));
    alert(data.error || "Failed to submit reflection");
  }

  return false; // stop page reload
}

async function deleteReflection(id) {
  if (!confirm("Delete this reflection?")) return;

  const res = await fetch(`/api/reflections/${id}`, { method: "DELETE" });

  if (res.ok) {
    await loadReflections();
  } else {
    alert("Delete failed");
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function init() {
  setDate();
  loadReflections();
}
