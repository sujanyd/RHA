let current = 0;

const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function goSlide(n) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = n;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    goSlide(Number(dot.dataset.slide));
  });
});

setInterval(() => goSlide((current + 1) % slides.length), 5000);
