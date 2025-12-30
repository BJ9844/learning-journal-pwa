document.addEventListener("DOMContentLoaded", () => {
  // Navbar
  const nav = document.getElementById("navbar");
  if (nav) {
    nav.innerHTML = `
      <div class="navbar">
        <a href="/">Home</a>
        <a href="/journal">Journal</a>
        <a href="/about">About</a>
        <a href="/projects">Projects</a>
      </div>
    `;
  }

  // Dark mode toggle
  const toggle = document.getElementById("darkModeToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  }

  // Date display
  const dateEl = document.getElementById("dateDisplay");
  if (dateEl) {
    dateEl.textContent = new Date().toDateString();
  }
});
