/**===============================
 * Contact Page Animations
 ===============================*/
function initContactAnimations() {
    // Use GSAP if available
    if (window.gsap) {
        initGSAPAnimations();
    } else if (window.ScrollReveal) {
        // Fallback to ScrollReveal
        initScrollRevealAnimations();
    }
}

/**=========================
 * GSAP Animations
 =========================*/
function initGSAPAnimations() {
    const { gsap, ScrollTrigger } = window;

    // Animate form container
    gsap.from('.contact__form-container', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.contact__form-container',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    // Animate contact info
    gsap.from('.contact__info', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.contact__info',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    // Animate info items with stagger
    gsap.from('.contact__info-item', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.contact__info-items',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    // Create parallax effect for floating elements
    gsap.to('.float__element', {
        y: (i, el) => (parseFloat(el.getAttribute('data-speed') || 0.2) * -150),
        ease: 'none',
        scrollTrigger: {
            trigger: '.contact__form',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}

/**=============================
 * ScrollReveal Animations
 =============================*/
function initScrollRevealAnimations() {
    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '30px',
        duration: 800,
        reset: false,
        easing: 'ease-out'
    });

    // Reveal elements with staggered delay
    sr.reveal('.contact__form-container', { delay: 100 });
    sr.reveal('.contact__info', { delay: 200 });
    sr.reveal('.contact__info-item', { interval: 150 });
    sr.reveal('.contact__social', { delay: 400 });
}

/**==============================
 * Handle Contact Form Inputs
 ==============================*/
function initFormInputHandling() {
    const formInputs = document.querySelectorAll('.form__input, .form__select, .form__textarea');

    formInputs.forEach(input => {
        // Add focus and blur events for animation
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });

        // Check if input already has value (e.g., on page reload)
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

/**==========================
 * Initialize Contact Page
 ==========================*/
function initContactPage() {
    initContactAnimations();
}

/**=================
 * INITIALIZATION
 =================*/
document.addEventListener('DOMContentLoaded', () => {
    initContactPage();
});