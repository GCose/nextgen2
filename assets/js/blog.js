/**======================
 * BLOG FUNCTIONALITY
 ======================*/
function initBlog() {
    initCategoryFilters();
    initBlogPagination();
    initNewsletterForm();
    initBlogPostTOC();
    initShareButtons();
}

/**=========================
 * Category Filter Handling
 =========================*/
function initCategoryFilters() {
    const categoryLinks = document.querySelectorAll('.blog__category');
    if (!categoryLinks.length) return;

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all categories
            categoryLinks.forEach(cat => cat.classList.remove('blog__category--active'));

            // Add active class to clicked category
            link.classList.add('blog__category--active');

            // Get category name
            const category = link.textContent.trim();

            // In a real implementation, you would filter posts by category here
            // For this demo, we'll just show a message in the console
            console.log(`Filtering by category: ${category}`);

            // Animation effect for smooth transition
            const blogGrid = document.querySelector('.blog__grid');
            if (blogGrid) {
                blogGrid.style.opacity = '0.5';
                setTimeout(() => {
                    blogGrid.style.opacity = '1';
                }, 300);
            }
        });
    });
}

/**=======================
 * Pagination Handling
 =======================*/
function initBlogPagination() {
    const paginationLinks = document.querySelectorAll('.blog__pagination-number, .blog__pagination-prev, .blog__pagination-next');
    if (!paginationLinks.length) return;

    paginationLinks.forEach(link => {
        if (link.classList.contains('disabled')) return;

        link.addEventListener('click', (e) => {
            e.preventDefault();

            // For number links
            if (link.classList.contains('blog__pagination-number')) {
                const pageNumbers = document.querySelectorAll('.blog__pagination-number');
                pageNumbers.forEach(num => num.classList.remove('active'));
                link.classList.add('active');
            }

            // In a real implementation, you would load the appropriate page here
            // For this demo, we'll just show a message in the console
            console.log(`Navigating to page: ${link.textContent.trim()}`);

            // Scroll to top of blog posts with smooth animation
            const blogPosts = document.getElementById('blog-posts');
            if (blogPosts) {
                blogPosts.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

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
            messageContainer.textContent = 'Please enter a valid email address.';
            messageContainer.className = 'newsletter__message error';
            return;
        }

        // In a real implementation, you would send the form data to your server
        // For this demo, we'll simulate a successful submission
        messageContainer.textContent = 'Thank you for subscribing!';
        messageContainer.className = 'newsletter__message success';

        // Clear the form
        emailInput.value = '';

        // Reset the message after a delay
        setTimeout(() => {
            messageContainer.textContent = '';
            messageContainer.className = 'newsletter__message';
        }, 5000);
    });

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
}

/**=====================
 * Blog Post TOC Handling
 =====================*/
function initBlogPostTOC() {
    const tocLinks = document.querySelectorAll('.blog-post__toc-list a');
    if (!tocLinks.length) return;

    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Smooth scroll to section with offset for header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL hash without jumping
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });

    // Highlight active TOC item on scroll
    window.addEventListener('scroll', debounce(() => {
        const sections = document.querySelectorAll('.blog-post__section');

        if (!sections.length) return;

        let currentSection = '';
        const headerHeight = document.querySelector('.header').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;

            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        tocLinks.forEach(link => {
            link.classList.remove('active');

            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }, 100));

    // Debounce helper function
    function debounce(func, wait) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
}

/**=======================
 * Share Buttons Handling
 =======================*/
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.blog-post__share-button');
    if (!shareButtons.length) return;

    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const pageUrl = window.location.href;
            const pageTitle = document.title;

            // Determine which share button was clicked
            if (button.getAttribute('aria-label') === 'Share on LinkedIn') {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`, '_blank');
            } else if (button.getAttribute('aria-label') === 'Share on Twitter') {
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`, '_blank');
            } else if (button.getAttribute('aria-label') === 'Share on Facebook') {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank');
            } else if (button.getAttribute('aria-label') === 'Copy Link') {
                // Copy to clipboard functionality
                navigator.clipboard.writeText(pageUrl)
                    .then(() => {
                        // Show a temporary message
                        const originalHTML = button.innerHTML;
                        button.innerHTML = `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                                stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        `;

                        setTimeout(() => {
                            button.innerHTML = originalHTML;
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy: ', err);
                    });
            }
        });
    });
}

/**==========================
 * Initialize when DOM loads
 ==========================*/
document.addEventListener('DOMContentLoaded', initBlog);