// === DYNAMIC NAVIGATION ===
const navHTML = `
<nav class="navbar">
    <a href="index.html">Home</a>
    <a href="journal.html">Journal</a>
    <a href="about.html">About</a>
    <a href="projects.html">Projects</a>
</nav>
`;

document.getElementById("nav-placeholder").innerHTML = navHTML;


// === THEME TOGGLER ===
const themeButton = document.getElementById("theme-toggle");

if (themeButton) {
    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
}


// === SHOW CURRENT DATE ===
const dateDisplay = document.getElementById("date-display");

if (dateDisplay) {
    const today = new Date();
    dateDisplay.textContent = "Today's Date: " + today.toDateString();
}
