/**================================
 * Form Validation & Submission
 ================================*/
function initFormHandling() {
    const form = document.getElementById('contact-form-element');
    if (!form) return;

    const formMessage = form.querySelector('.form__message');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Basic validation
        if (!validateForm(form)) {
            showFormMessage('Please fill out all required fields correctly.', 'error');
            return;
        }

        // Simulate form submission (will be replaced by HubSpot)
        simulateFormSubmission(form);
    });

    /**===========================
     * Form Validation Function
     ===========================*/
    function validateForm(form) {
        let isValid = true;

        // Get all required inputs
        const requiredInputs = form.querySelectorAll('[required]');

        // Check each required field
        requiredInputs.forEach(input => {
            // Remove existing error styling
            input.classList.remove('error');

            if (!input.value.trim()) {
                // Field is empty
                input.classList.add('error');
                isValid = false;
            } else if (input.type === 'email' && !isValidEmail(input.value)) {
                // Invalid email format
                input.classList.add('error');
                isValid = false;
            }
        });

        return isValid;
    }

    /**=======================
     * Email Validation
     =======================*/
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**=============================
     * Form Submission Simulation
     =============================*/
    function simulateFormSubmission(form) {
        // Disable submit button and show loading state
        const submitButton = form.querySelector('.form__button');
        submitButton.disabled = true;
        submitButton.innerHTML = 'Processing...';

        // Simulate API call with setTimeout
        setTimeout(() => {
            // Show success message
            showFormMessage('Thank you! Your consultation request has been received. We\'ll contact you shortly.', 'success');

            // Reset form
            form.reset();

            // Reset button
            submitButton.disabled = false;
            submitButton.innerHTML = '<span>Schedule Consultation</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
        }, 1500);
    }

    /**==============================
     * Show Form Success/Error Message
     ==============================*/
    function showFormMessage(message, type) {
        if (!formMessage) return;

        formMessage.textContent = message;
        formMessage.className = 'form__message ' + type;

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Clear message after 5 seconds if it's an error
        if (type === 'error') {
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form__message';
            }, 5000);
        }
    }
}

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
    initFormHandling();
    initContactAnimations();
}

/**=================
 * INITIALIZATION
 =================*/
document.addEventListener('DOMContentLoaded', () => {
    initContactPage();
    initFormInputHandling();
});