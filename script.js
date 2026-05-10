// Global Reveal on Scroll
const reveal = () => {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        const revealPoint = 100;
        if (revealTop < windowHeight - revealPoint) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', reveal);

// Hero Carousel Logic
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

const showSlide = (n) => {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
};

const nextSlide = () => showSlide(currentSlide + 1);

// Auto-advance carousel
let carouselInterval = setInterval(nextSlide, 6000);

// Fetch Impact Stories
const fetchStories = async () => {
    const grid = document.getElementById('story-grid');
    if (!grid) return;

    try {
        const response = await fetch('data/stories.json');
        const data = await response.json();
        
        grid.innerHTML = data.map(story => `
            <div class="problem-card reveal">
                <img src="${story.image}" alt="${story.name}">
                <p><strong>${story.name}:</strong> ${story.story}</p>
            </div>
        `).join('');
        
        reveal();
    } catch (error) {
        console.error('Error loading stories:', error);
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchStories();
    reveal();

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            clearInterval(carouselInterval);
            carouselInterval = setInterval(nextSlide, 6000);
        });
    });
});
