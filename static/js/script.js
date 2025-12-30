document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     NAVBAR
  ========================== */
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

  /* =========================
     OFFLINE / ONLINE BANNER
  ========================== */
  function showNetworkBanner() {
    let banner = document.getElementById("net-banner");

    if (!banner) {
      banner = document.createElement("div");
      banner.id = "net-banner";
      banner.style.padding = "10px";
      banner.style.textAlign = "center";
      banner.style.fontWeight = "bold";
      banner.style.fontSize = "0.95rem";
      document.body.prepend(banner);
    }

    const updateStatus = () => {
      if (navigator.onLine) {
        banner.textContent = "Online";
        banner.style.background = "#d9ffd9";
        banner.style.color = "#123b12";
      } else {
        banner.textContent = "Offline – cached mode";
        banner.style.background = "#ffe0e0";
        banner.style.color = "#5a0f0f";
      }
    };

    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
  }

  showNetworkBanner();

  /* =========================
     DARK MODE TOGGLE
  ========================== */
  const toggle = document.getElementById("darkModeToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  }

  /* =========================
     DATE DISPLAY
  ========================== */
  const dateEl = document.getElementById("dateDisplay");
  if (dateEl) {
    dateEl.textContent = new Date().toDateString();
  }
});

/* =========================
   SERVICE WORKER REGISTRATION
========================== */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/static/sw.js");
  });
}
