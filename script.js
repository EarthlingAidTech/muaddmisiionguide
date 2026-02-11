// ===== PRELOADER =====
const preloader = document.getElementById('preloader');

function hidePreloader() {
    if (preloader && !preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
    }
}

// Hide preloader as soon as DOM is ready (don't wait for images)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(hidePreloader, 300);
});

// Fallback: force hide after 2 seconds no matter what
setTimeout(hidePreloader, 2000);

// ===== STICKY NAVBAR =====
const stickyNav = document.getElementById('stickyNav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 300) {
        stickyNav.classList.add('show');
    } else {
        stickyNav.classList.remove('show');
    }

    lastScroll = currentScroll;
});

// ===== MOBILE MENU TOGGLE =====
// Handle all mobile toggle buttons (main nav + sticky nav)
document.querySelectorAll('.mobile-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        // Find the sibling nav-menu within the same nav-container
        const navContainer = toggle.closest('.nav-container');
        const menu = navContainer ? navContainer.querySelector('.nav-menu') : document.getElementById('navMenu');
        if (menu) {
            menu.classList.toggle('open');
            // Close other menus
            document.querySelectorAll('.nav-menu.open').forEach(m => {
                if (m !== menu) m.classList.remove('open');
            });
        }
    });
});

// Mobile dropdown toggle
document.querySelectorAll('.has-dropdown > a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            // Close sibling dropdowns
            const parent = link.parentElement;
            const siblings = parent.parentElement.querySelectorAll('.has-dropdown');
            siblings.forEach(s => {
                if (s !== parent) s.classList.remove('open');
            });
            parent.classList.toggle('open');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        const isNavClick = e.target.closest('.navbar');
        if (!isNavClick) {
            document.querySelectorAll('.nav-menu.open').forEach(m => m.classList.remove('open'));
        }
    }
});

// Close mobile menu on window resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.querySelectorAll('.nav-menu.open').forEach(m => m.classList.remove('open'));
        document.querySelectorAll('.has-dropdown.open').forEach(d => d.classList.remove('open'));
    }
});

// ===== SCROLL ANIMATIONS =====
const animateElements = document.querySelectorAll('.animate-on-scroll');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

animateElements.forEach(el => observer.observe(el));

// ===== TESTIMONIAL SLIDER =====
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let autoSlideInterval;

if (testimonialCards.length > 0) {
    function showSlide(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            showSlide(index);
            resetAutoSlide();
        });
    });

    function autoSlide() {
        const next = (currentSlide + 1) % testimonialCards.length;
        showSlide(next);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(autoSlide, 5000);
    }

    autoSlideInterval = setInterval(autoSlide, 5000);

    // Touch swipe support for testimonials
    let touchStartX = 0;
    let touchEndX = 0;
    const slider = document.getElementById('testimonialSlider');

    if (slider) {
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Swipe left - next slide
                    showSlide((currentSlide + 1) % testimonialCards.length);
                } else {
                    // Swipe right - prev slide
                    showSlide((currentSlide - 1 + testimonialCards.length) % testimonialCards.length);
                }
                resetAutoSlide();
            }
        }, { passive: true });
    }
}

// ===== ACCORDION =====
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const isActive = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.accordion-item').forEach(i => {
            i.classList.remove('active');
        });

        // Open clicked (if it wasn't already open)
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== BACK TO TOP =====
const goToTop = document.getElementById('goToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        goToTop.classList.add('show');
    } else {
        goToTop.classList.remove('show');
    }
});

goToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== COUNTER ANIMATION (About page) =====
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                let current = 0;
                const increment = Math.ceil(target / 80);
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = current.toLocaleString();
                }, 20);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
}

// ===== CONTACT FORM (Contact page) =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
    });
}
