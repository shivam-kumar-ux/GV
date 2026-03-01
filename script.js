document.addEventListener('DOMContentLoaded', () => {
    const intro = document.getElementById('intro-scene');
    const main = document.getElementById('main-scene');
    const footer = document.querySelector('.footer');

    // 1. Wait 4 seconds for the intro animation to play out
    setTimeout(() => {
        // Fade out intro
        intro.style.opacity = '0';
        
        setTimeout(() => {
            // Hide intro and show main scene
            intro.classList.add('hidden');
            main.classList.remove('hidden');
            footer.classList.remove('hidden');
            
            // Trigger a small delay for the fade-in effect
            setTimeout(() => {
                main.style.opacity = '1';
                footer.style.opacity = '1';
            }, 50);
        }, 1500); // Wait for fade-out transition to finish

    }, 4000); 
});