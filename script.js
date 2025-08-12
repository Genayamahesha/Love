let photoCurrentSlide = 0;
let photoAutoSlide;
let isPlaying = false;
let typingInProgress = false;

// Scroll-triggered animations
function checkScrollAnimation() {
    const elements = document.querySelectorAll('.fade-in-element');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Multi-line typing animation
function typeWriter() {
    if (typingInProgress) return;
    
    typingInProgress = true;
    const line1Text = "Happy Anniversary";
    const line2Text = "ke 9 Tahun Cintaku❤️";
    const dateText = "13 Agustus 2016 - 13 Agustus 2025";
    
    const line1Element = document.getElementById('titleLine1');
    const line2Element = document.getElementById('titleLine2');
    const dateElement = document.getElementById('typingDate');
    
    // Reset elements
    line1Element.textContent = '';
    line2Element.textContent = '';
    dateElement.textContent = '';
    line1Element.classList.remove('no-cursor');
    line2Element.classList.remove('no-cursor');
    dateElement.classList.remove('no-cursor');
    
    let i = 0;
    
    function typeLine1() {
        if (i < line1Text.length) {
            line1Element.textContent += line1Text.charAt(i);
            i++;
            setTimeout(typeLine1, 80);
        } else {
            line1Element.classList.add('no-cursor');
            line2Element.style.borderRight = '3px solid #ad1457';
            i = 0;
            setTimeout(typeLine2, 500);
        }
    }
    
    function typeLine2() {
        if (i < line2Text.length) {
            line2Element.textContent += line2Text.charAt(i);
            i++;
            setTimeout(typeLine2, 80);
        } else {
            line2Element.classList.add('no-cursor');
            dateElement.style.borderRight = '2px solid #6a1b9a';
            i = 0;
            setTimeout(typeDate, 500);
        }
    }
    
    function typeDate() {
        if (i < dateText.length) {
            dateElement.textContent += dateText.charAt(i);
            i++;
            setTimeout(typeDate, 60);
        } else {
            dateElement.classList.add('no-cursor');
            setTimeout(() => {
                typingInProgress = false;
                // Restart typing after 5 seconds
                setTimeout(typeWriter, 5000);
            }, 2000);
        }
    }
    
    typeLine1();
}

// Initialize slider
function initSlider() {
    startAutoSlide('photo');
}

function startAutoSlide(type) {
    photoAutoSlide = setInterval(() => {
        changeSlide(type, 1);
    }, 6000);
}

function changeSlide(type, direction) {
    const slides = document.getElementById(type + 'Slides');
    const totalSlides = slides.children.length;
    
    photoCurrentSlide += direction;
    if (photoCurrentSlide >= totalSlides) photoCurrentSlide = 0;
    if (photoCurrentSlide < 0) photoCurrentSlide = totalSlides - 1;
    slides.style.transform = `translateX(-${photoCurrentSlide * 100}%)`;
}

// Create floating hearts
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDelay = Math.random() * 3 + 's';
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
    document.getElementById('hearts').appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 7000);
}

// Music control
function toggleMusic() {
    const music = document.getElementById('backgroundMusic');
    const btn = document.getElementById('musicBtn');
    
    if (isPlaying) {
        music.pause();
        btn.innerHTML = '🎵';
        isPlaying = false;
    } else {
        // Set the start time to 2.35 minutes (155 seconds)
        music.currentTime = 155;
        music.play()
            .then(() => {
                btn.innerHTML = '⏸️';
                isPlaying = true;
                
                // Stop at 4 minutes (240 seconds)
                setTimeout(() => {
                    music.pause();
                    btn.innerHTML = '🎵';
                    isPlaying = false;
                }, 90000);
            })
            .catch(error => {
                console.error("Autoplay was prevented:", error);
            });
    }
}

function firstInteractionHandler() {
    const music = document.getElementById('backgroundMusic');
    music.play()
        .then(() => {
            isPlaying = true;
            document.getElementById('musicBtn').innerHTML = '⏸️';
        });
    
    // Remove event listeners after first interaction
    document.removeEventListener('click', firstInteractionHandler);
    document.removeEventListener('touchstart', firstInteractionHandler);
}

// Initialize everything when page loads
window.addEventListener('load', () => {
    typeWriter();
    initSlider();
    
    // Create hearts periodically
    setInterval(createHeart, 2000);
    
    // Setup scroll animations
    window.addEventListener('scroll', checkScrollAnimation);
    checkScrollAnimation();
    
    // Try autoplay, fallback to interaction handler
    const music = document.getElementById('backgroundMusic');
    music.currentTime = 155;
    const playPromise = music.play();
    
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Autoplay worked
            isPlaying = true;
            document.getElementById('musicBtn').innerHTML = '⏸️';
        })
        .catch(error => {
            // Autoplay was blocked, prepare for first interaction
            document.addEventListener('click', firstInteractionHandler);
            document.addEventListener('touchstart', firstInteractionHandler);
        });
    }
});

// Pause auto-slide when hovering over slider
document.getElementById('photoSlider').addEventListener('mouseenter', () => {
    clearInterval(photoAutoSlide);
});

document.getElementById('photoSlider').addEventListener('mouseleave', () => {
    startAutoSlide('photo');
});

// Event listeners for manual slide navigation
document.querySelectorAll('.slider-nav.prev').forEach(btn => {
    btn.addEventListener('click', () => changeSlide('photo', -1));
});

document.querySelectorAll('.slider-nav.next').forEach(btn => {
    btn.addEventListener('click', () => changeSlide('photo', 1));
});

// Music button event listener
document.getElementById('musicBtn').addEventListener('click', toggleMusic);