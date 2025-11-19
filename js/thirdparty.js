// === YOUTUBE EMBED API (Fixed embed URL) ===

const youtubeDiv = document.getElementById("youtube-container");

// Extract video ID from share link: JZBNOq-lxPk
const videoId = "JZBNOq-lxPk";

if (youtubeDiv) {
    youtubeDiv.innerHTML = `
        <iframe width="560" height="315"
            src="https://www.youtube.com/embed/${videoId}?si=N8oF7UYFy0XdVND"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen>
        </iframe>
    `;
}
