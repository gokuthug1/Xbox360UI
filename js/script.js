let currentCategoryIndex = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    handleStartupAnimation();
    updateCarousel(0, false);
});

function handleStartupAnimation() {
    const video = document.getElementById('startup-video');
    const overlay = document.getElementById('startup-overlay');
    const prompt = document.getElementById('start-prompt');
    const dashboard = document.querySelector('.dashboard-container');

    // Function to run when video ends
    const finishStartup = () => {
        // 1. Fade out the video overlay
        overlay.style.opacity = '0';
        
        // 2. Play the Welcome Sound
        playSound('welcome');

        // 3. Trigger Dashboard Slide Up Animation
        dashboard.classList.add('entrance-anim');

        // 4. Remove overlay from DOM after fade completes
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);
    };

    // Event Listener: When video ends, run the transition
    video.onended = finishStartup;

    // Attempt to play automatically
    video.muted = false; 
    const playPromise = video.play();

    if (playPromise !== undefined) {
        playPromise.catch(error => {
            // Autoplay blocked -> Show prompt
            console.log("Autoplay prevented. Waiting for user input.");
            prompt.style.display = 'block';
            
            const startInteraction = () => {
                video.play();
                prompt.style.display = 'none';
                document.removeEventListener('click', startInteraction);
                document.removeEventListener('keydown', startInteraction);
            };

            document.addEventListener('click', startInteraction);
            document.addEventListener('keydown', startInteraction);
        });
    }
}

// Sound Player
function playSound(type) {
    const leftSound = document.getElementById('snd-left');
    const rightSound = document.getElementById('snd-right');
    const selectSound = document.getElementById('snd-select');
    const welcomeSound = document.getElementById('snd-welcome');
    
    if (type === 'left' && leftSound) { 
        leftSound.currentTime = 0; leftSound.play().catch(e=>{}); 
    } 
    else if (type === 'right' && rightSound) { 
        rightSound.currentTime = 0; rightSound.play().catch(e=>{}); 
    } 
    else if (type === 'select' && selectSound) { 
        selectSound.currentTime = 0; selectSound.play().catch(e=>{}); 
    }
    else if (type === 'welcome' && welcomeSound) {
        welcomeSound.currentTime = 0; welcomeSound.play().catch(e=>{});
    }
}

// Click Navigation
function clickNav(index) {
    if(index > currentCategoryIndex) playSound('right');
    else if(index < currentCategoryIndex) playSound('left');
    updateCarousel(index);
}

// Main Carousel Logic
function updateCarousel(currentIndex, shouldPlaySound = true) {
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > 6) currentIndex = 6;

    currentCategoryIndex = currentIndex;

    const h1 = document.querySelectorAll('.navbar h1');
    h1.forEach((list) => {list.classList.remove('selected');})
    if(h1[currentIndex + 1]) h1[currentIndex + 1].classList.add('selected');

    const tile = document.querySelectorAll('.tile');
    tile.forEach((list) => {list.classList.remove('selected');})
    if(tile[currentIndex]) tile[currentIndex].classList.add('selected');

    const slider = document.querySelector('.tiles');
    const searchbar = document.querySelector('.searchbar');
    
    if (currentIndex == 0) {
        const bigTile = document.querySelectorAll('.tile.big');
        bigTile.forEach((list) => {list.style.margin = '3vw 7vw';})
        slider.style.transform = 'translateX(0)';
        if(searchbar) searchbar.style.display = 'flex';
    }
    
    if (currentIndex > 0 && currentIndex < 3) {
        const tileEl = document.querySelector('.tile');
        if(tileEl) {
            const tileWidth = tileEl.offsetWidth;
            const bigTile = document.querySelectorAll('.tile.big');
            bigTile.forEach((list) => {list.style.margin = '3vw 7vw';})
            const newPosition = (-currentIndex * tileWidth) - (window.innerWidth * .14 * currentIndex);
            slider.style.transform = `translateX(${newPosition}px)`;
            if(searchbar) searchbar.style.display = 'none';
        }
    }
    
    if (currentIndex > 2) {
        const tileEl = document.querySelector('.tile');
        const bigTileEl = document.querySelector('.tile.big');
        if(tileEl && bigTileEl) {
            const tileWidth = tileEl.offsetWidth;
            const tileBigWidth = bigTileEl.offsetWidth;
            const behindIndex = currentIndex - 2;
            const bigTile = document.querySelectorAll('.tile.big');
            
            bigTile.forEach((list) => {list.style.margin = '3vw 7vw';})
            if(bigTile[currentIndex - 3]) bigTile[currentIndex - 3].style.margin = '3vw 0.05vw';
            
            const newPosition = (-2 * tileWidth) - (window.innerWidth * .14 * (currentIndex - 1)) - (tileBigWidth * behindIndex) - (window.innerWidth * .001);
            slider.style.transform = `translateX(${newPosition}px)`;
            if(searchbar) searchbar.style.display = 'none';
        }
    }
}

// Keyboard Inputs
document.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('startup-overlay');
    if(overlay && overlay.style.display !== 'none' && overlay.style.opacity !== '0') return;

    switch(e.key) {
        case 'ArrowLeft':
        case 'PageUp': 
            if (currentCategoryIndex > 0) {
                playSound('left');
                updateCarousel(currentCategoryIndex - 1);
            }
            break;

        case 'ArrowRight':
        case 'PageDown':
            if (currentCategoryIndex < 6) {
                playSound('right');
                updateCarousel(currentCategoryIndex + 1);
            }
            break;

        case 'Enter':
        case ' ': 
        case 'e': 
            playSound('select');
            const activeTile = document.querySelector('.tile.selected .banner');
            if(activeTile) {
                activeTile.style.transform = "scale(0.98)";
                setTimeout(() => activeTile.style.transform = "scale(1)", 100);
            }
            break;
    }
});
