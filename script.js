import { db } from './firebase-config.js';
import { collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- UI Elements ---
const platformsGrid = document.getElementById('platforms-grid');
const searchButton = document.getElementById('searchButton');
const urlInput = document.getElementById('urlInput');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// --- Default Sites (Fallback) ---
const defaultSites = [
    { name: "Doser Portfolio", url: "https://abdelrahman-doser.vercel.app", icon: "fas fa-user-tie", className: "doser-portfolio" },
    { name: "يوتيوب", url: "https://www.youtube.com", icon: "fab fa-youtube", className: "youtube" },
    { name: "فيسبوك", url: "https://www.facebook.com", icon: "fab fa-facebook-f", className: "facebook" },
    { name: "إنستاجرام", url: "https://www.instagram.com", icon: "fab fa-instagram", className: "instagram" },
    { name: "تيك توك", url: "https://www.tiktok.com", icon: "fab fa-tiktok", className: "tiktok" },
    { name: "X (تويتر)", url: "https://x.com", icon: "fab fa-twitter", className: "x-twitter" },
    { name: "ChatGPT", url: "https://chat.openai.com", icon: "fas fa-robot", className: "chatgpt" },
    { name: "جيميناي", url: "https://gemini.google.com", icon: "fas fa-brain", className: "gemini" },
    { name: "Gmail", url: "https://mail.google.com/", icon: "fas fa-envelope", className: "gmail" },
    { name: "Drive", url: "https://drive.google.com/", icon: "fab fa-google-drive", className: "drive" },
    { name: "GitHub", url: "https://github.com", icon: "fab fa-github", className: "github" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: "fab fa-linkedin", className: "linkedin" },
    { name: "Canva", url: "https://www.canva.com", icon: "fas fa-palette", className: "canva" },
    { name: "Pinterest", url: "https://www.pinterest.com", icon: "fab fa-pinterest", className: "pinterest" },
    { name: "ترجمة", url: "https://translate.google.com/", icon: "fas fa-language", className: "translate" },
    { name: "StackOverflow", url: "https://stackoverflow.com", icon: "fab fa-stack-overflow", className: "stackoverflow" },
    { name: "Spotify", url: "https://www.spotify.com", icon: "fab fa-spotify", className: "spotify" },
    { name: "Netflix", url: "https://www.netflix.com", icon: "fas fa-film", className: "netflix" }
];

function renderCard(data) {
    const card = document.createElement('a');
    card.href = data.url;
    card.target = "_blank";
    card.className = `platform-card ${data.className || ''}`;
    if (data.bgColor) card.style.background = data.bgColor;
    card.innerHTML = `
        <i class="${data.icon || 'fas fa-link'}"></i>
        <span>${data.name}</span>
    `;
    platformsGrid.appendChild(card);
}

// --- Load Links from Firestore ---
function loadLinks() {
    const q = query(collection(db, "links"), orderBy("order", "asc"));
    
    onSnapshot(q, (snapshot) => {
        platformsGrid.innerHTML = ''; // Clear current grid
        
        if (snapshot.empty) {
            // Show default sites if DB is empty
            defaultSites.forEach(renderCard);
            return;
        }

        snapshot.forEach((doc) => {
            renderCard(doc.data());
        });
    });
}

// --- Search Functionality ---
function executeSearch() {
    const input = urlInput.value.trim();
    if (input === "") return;

    let url;
    if (input.startsWith('http://') || input.startsWith('https://')) {
        url = input;
    } else if (input.includes('.')) {
        url = 'https://' + input;
    } else {
        url = 'https://www.google.com/search?q=' + encodeURIComponent(input);
    }
    window.open(url, '_blank');
}

searchButton.addEventListener('click', executeSearch);
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') executeSearch();
});

// --- Live Clock ---
function updateClock() {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const time = now.toLocaleTimeString('ar-EG', timeOptions);
    const date = now.toLocaleDateString('ar-EG', dateOptions);
    
    const clockElement = document.getElementById('liveClock');
    if (clockElement) {
        clockElement.textContent = `${time} | ${date}`;
        
        // Secret shortcut: Double click to admin
        if (!clockElement.dataset.listener) {
            clockElement.addEventListener('dblclick', () => {
                window.location.href = 'admin.html';
            });
            clockElement.dataset.listener = "true";
        }
    }
}

setInterval(updateClock, 1000);
updateClock();

// --- Theme Management ---
function updateToggleIcon(currentTheme) {
    const iconSpan = themeToggle.querySelector('.icon');
    if (iconSpan) {
        iconSpan.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    }
}

themeToggle.addEventListener('click', () => {
    const isDarkMode = body.classList.toggle('dark-mode');
    const newTheme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
});

// Init Theme
const savedTheme = localStorage.getItem('theme') || 'light';
body.classList.toggle('dark-mode', savedTheme === 'dark');
updateToggleIcon(savedTheme);

// Start
loadLinks();
