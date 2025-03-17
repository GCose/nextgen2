/**========================
 * Newsletter Form Handling
 ========================*/
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = document.getElementById('newsletter-email');
        const messageContainer = document.getElementById('newsletter-message');

        if (!emailInput || !messageContainer) return;

        const email = emailInput.value.trim();

        // Basic email validation
        if (!email || !isValidEmail(email)) {
            showMessage(messageContainer, 'Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission (replace with actual API call in production)
        simulateFormSubmission(email, messageContainer, emailInput);
    });
}

/**======================
 * Validate Email Format
 ======================*/
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**========================
 * Show Success/Error Message
 ========================*/
function showMessage(container, message, type) {
    container.textContent = message;
    container.className = `newsletter__message ${type}`;

    if (type === 'error') {
        // Auto-clear error messages after 5 seconds
        setTimeout(() => {
            container.textContent = '';
            container.className = 'newsletter__message';
        }, 5000);
    }
}

/**==========================
 * Simulate Form Submission
 ==========================*/
function simulateFormSubmission(email, messageContainer, emailInput) {
    // Show loading state
    messageContainer.textContent = 'Subscribing...';
    messageContainer.className = 'newsletter__message';

    // Simulate API delay
    setTimeout(() => {
        // Show success message
        showMessage(messageContainer, 'Thank you for subscribing! Check your email to confirm.', 'success');

        // Clear the form
        emailInput.value = '';

        // In a real implementation, this would be an API call to your subscription service
        console.log(`Newsletter subscription for: ${email}`);
    }, 1500);
}

/**===================================
 * Initialize when DOM is fully loaded
 ===================================*/
document.addEventListener('DOMContentLoaded', initNewsletterForm);