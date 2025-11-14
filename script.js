

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


const toggleButton = document.getElementById('modeToggle');
const body = document.body;

function switchMode() {
   
    body.classList.toggle('light-mode');
    
  
    if (body.classList.contains('light-mode')) {
       
        toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('mode', 'light');
    } else {
        // 
        toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('mode', 'dark');
    }
}


toggleButton.addEventListener('click', switchMode);


document.addEventListener('DOMContentLoaded', (event) => {
    const savedMode = localStorage.getItem('mode');
    
  
    if (savedMode === 'light') {
       
        switchMode(); 
    } 
  
    else if (savedMode === 'dark') {
         toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
    }

});
