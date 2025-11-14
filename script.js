

document.getElementById('searchButton').addEventListener('click', function() {
    executeSearch();
});

document.getElementById('urlInput').addEventListener('keypress', function(e) {
   
    if (e.key === 'Enter') {
        executeSearch();
    }
});

function executeSearch() {
    const input = document.getElementById('urlInput').value.trim();
    
    if (input === "") {
        return; 
    }

    let url;
    

    if (input.startsWith('http://') || input.startsWith('https://')) {
        url = input;
    } 
    else if (input.includes('.')) {
        url = 'https://' + input; // إضافة https:// فقط
    } 
    else {
       
        url = 'https://www.google.com/search?q=' + encodeURIComponent(input);
    }

   
    window.open(url, '_blank');
}

function updateClock() {
    const now = new Date();
    
  
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
    };
    
    
    const dateOptions = { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };

    const time = now.toLocaleTimeString('ar-EG', timeOptions);
    const date = now.toLocaleDateString('ar-EG', dateOptions);
    
    const clockElement = document.getElementById('liveClock');
    
    clockElement.textContent = `${time} | ${date}`;
}


updateClock(); 


setInterval(updateClock, 1000);



/* -------------------------------------- */
/* تعديل وظيفة الوضع الداكن/الفاتح */
/* -------------------------------------- */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check stored theme preference or default to light
function loadTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.classList.toggle('dark-mode', currentTheme === 'dark');
    updateToggleIcon(currentTheme);
}

// Update the button icon based on the current theme
function updateToggleIcon(currentTheme) {
    const iconSpan = themeToggle.querySelector('.icon');
    if (currentTheme === 'dark') {
        iconSpan.textContent = '☀️'; // قمر للوضع الداكن
        iconSpan.setAttribute('aria-label', 'Light Mode');
    } else {
        iconSpan.textContent = '🌙'; // شمس للوضع الفاتح
        iconSpan.setAttribute('aria-label', 'Dark Mode');
    }
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const isDarkMode = body.classList.toggle('dark-mode');
    const newTheme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
});

// Load the theme when the page loads
loadTheme();
