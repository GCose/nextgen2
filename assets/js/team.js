/**=========================================================================
 * TEAM SLIDER CLASS
 * Manages the team member showcase with efficient thumbnail navigation
 =========================================================================*/
class TeamSlider {
    /**=================================
     * Constructor - Initialize elements
     =================================*/
    constructor() {
        // Main DOM elements
        this.nextBtn = document.getElementById('next');
        this.prevBtn = document.getElementById('prev');
        this.pauseBtn = document.getElementById('pause');
        this.pauseIcon = this.pauseBtn.querySelector('.pause-icon');
        this.playIcon = this.pauseBtn.querySelector('.play-icon');
        this.sliderContainer = document.querySelector('.team__slider');
        this.profilesContainer = document.querySelector('.team__profiles');
        this.profiles = this.profilesContainer.querySelectorAll('.team__profile');
        this.thumbnailsWrapper = document.querySelector('.team__thumbnails-wrapper');
        this.thumbnailsContainer = document.querySelector('.team__thumbnails');
        this.thumbnails = this.thumbnailsContainer.querySelectorAll('.team__thumbnail');

        // Timing variables
        this.timeRunning = 700; // Animation duration
        this.timeAutoNext = 7000; // Auto-slide interval

        // Animation timers
        this.runTimeOut = null;
        this.runNextAuto = null;

        // Animation state tracking
        this.isAnimating = false;
        this.isPaused = false;
        this.pendingClicks = [];

        // Moves first thumbnail to end to match original behavior
        this.thumbnailsContainer.appendChild(this.thumbnails[0]);
        this.teamImageAdjuster();

        // Initializes events and starts the auto slide
        this.initEvents();
        this.startAutoSlide();
        this.initTouchNavigation();
    }

    /**========================================
     * Directly targets specific team members
     ========================================*/
    teamImageAdjuster() {
        // Lists of team members to adjust (indices starting from 0)
        const targetIndices = [1, 2, 3, 5, 6, 10, 11, 15, 17, 18];

        // Gets all team profile images
        const profileImages = document.querySelectorAll('.team__profile-img');

        // Applies the adjustment to the specified images
        targetIndices.forEach(index => {
            if (profileImages[index]) {
                profileImages[index].style.objectPosition = 'center 25%';
            }
        });
    }

    /**===============================
     * Initializes event listeners
     ===============================*/
    initEvents() {
        // Next button click event
        this.nextBtn.onclick = () => {
            if (!this.isAnimating) {
                this.showSlider('next');
            }
        };

        // Previous button click event
        this.prevBtn.onclick = () => {
            if (!this.isAnimating) {
                this.showSlider('prev');
            }
        };

        // Pauses button click event
        this.pauseBtn.onclick = () => {
            this.togglePause();
        };

        // Sets up thumbnail click handlers
        this.thumbnailsContainer.querySelectorAll('.team__thumbnail').forEach((thumbnail) => {
            thumbnail.addEventListener('click', () => {
                if (this.isAnimating) return;

                // Clears any pending auto navigation
                clearTimeout(this.runNextAuto);

                // Gets all thumbnails as an array
                const thumbnails = Array.from(this.thumbnailsContainer.querySelectorAll('.team__thumbnail'));
                const targetIndex = thumbnails.indexOf(thumbnail);

                // Skips if this is already the current thumbnail (first one)
                if (targetIndex === 0) return;

                // Calculates the most efficient path
                const forwardClicks = targetIndex;
                const backwardClicks = thumbnails.length - targetIndex;

                // Chooses the shortest path
                if (forwardClicks <= backwardClicks) {
                    // Go forward
                    this.navigateToThumbnail(forwardClicks, 'next');
                } else {
                    // Go backward
                    this.navigateToThumbnail(backwardClicks, 'prev');
                }
            });
        });

        // Adds keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;

            if (e.key === 'ArrowRight') {
                this.nextBtn.click();
            } else if (e.key === 'ArrowLeft') {
                this.prevBtn.click();
            } else if (e.key === ' ' || e.key === 'Spacebar') {
                // Space bar toggles pause/play
                this.togglePause();
                e.preventDefault(); // Prevent page scrolling
            }
        });
    }

    /**====================================
     * Initializes touch-based navigation
     ====================================*/
    initTouchNavigation() {
        const teamSection = document.querySelector('.team');
        let touchStartX = 0;
        let touchEndX = 0;

        // Touch start event
        teamSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        // Touch end event
        teamSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });

        // Handle swipe direction
        const handleSwipe = () => {
            const swipeThreshold = 50; // Minimum distance for a swipe

            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipes left - next slide
                if (!this.isAnimating) {
                    this.showSlider('next');
                }
            }

            if (touchEndX > touchStartX + swipeThreshold) {
                // Swipes right - previous slide
                if (!this.isAnimating) {
                    this.showSlider('prev');
                }
            }
        }

        // Attaches the handler to the class instance
        this.handleSwipe = handleSwipe;
    }

    /**=====================================
     * Toggle pause/play functionality
     =====================================*/
    togglePause() {
        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            // Pauses auto-sliding
            clearTimeout(this.runNextAuto);
            this.pauseBtn.classList.add('paused');
            this.pauseIcon.style.display = 'none';
            this.playIcon.style.display = 'block';
        } else {
            // Resumes auto-sliding
            this.startAutoSlide();
            this.pauseBtn.classList.remove('paused');
            this.pauseIcon.style.display = 'block';
            this.playIcon.style.display = 'none';
        }
    }

    /**====================================================
     * Navigates to specific thumbnail efficiently
     * @param {number} clicks - Number of clicks needed
     * @param {string} direction - 'next' or 'prev'
     ====================================================*/
    navigateToThumbnail(clicks, direction) {
        if (this.isAnimating) return;

        // Execute the sequence of clicks with appropriate delays
        for (let i = 0; i < clicks; i++) {
            setTimeout(() => {
                // Executes the click in the appropriate direction
                this.showSlider(direction);

                // If this is the last click, restart auto-slide
                if (i === clicks - 1 && !this.isPaused) {
                    setTimeout(() => {
                        this.startAutoSlide();
                    }, this.timeRunning * 2);
                }
            }, i * (this.timeRunning + 50)); // Spaces out animations to prevent overlap
        }
    }

    /**=====================================================
     * Shows slider based on direction
     * @param {string} type - Direction ('next' or 'prev')
     =====================================================*/
    showSlider(type) {
        // Sets animation flag
        this.isAnimating = true;

        // Get fresh references to DOM elements
        const profileItems = this.profilesContainer.querySelectorAll('.team__profile');
        const thumbnailItems = this.thumbnailsContainer.querySelectorAll('.team__thumbnail');

        // Rearranges DOM elements based on direction
        if (type === 'next') {
            // Moves first items to the end
            this.profilesContainer.appendChild(profileItems[0]);
            this.thumbnailsContainer.appendChild(thumbnailItems[0]);

            // Adds animation class
            this.sliderContainer.classList.add('next');
        } else {
            // Moves last items to the beginning
            this.profilesContainer.prepend(profileItems[profileItems.length - 1]);
            this.thumbnailsContainer.prepend(thumbnailItems[thumbnailItems.length - 1]);

            // Adds animation class
            this.sliderContainer.classList.add('prev');
        }

        // Removes animation class after transition completes
        clearTimeout(this.runTimeOut);
        this.runTimeOut = setTimeout(() => {
            this.sliderContainer.classList.remove('next');
            this.sliderContainer.classList.remove('prev');

            // Resets animation flag
            this.isAnimating = false;

            // Processes next click if there are pending clicks
            if (this.pendingClicks.length > 0) {
                const nextAction = this.pendingClicks.shift();
                nextAction();
            }
        }, this.timeRunning);
    }

    /**===================================
     * Start auto-slide functionality
     ===================================*/
    startAutoSlide() {
        // Clears any existing timer
        clearTimeout(this.runNextAuto);

        // Only set a new timer if not paused
        if (!this.isPaused) {
            this.runNextAuto = setTimeout(() => {
                if (!this.isAnimating) {
                    this.showSlider('next');
                    this.startAutoSlide();
                } else {
                    // Try again after the animation finishes
                    this.pendingClicks.push(() => this.startAutoSlide());
                }
            }, this.timeAutoNext);
        }
    }
}

/**=============================================
 * Initialize navigation toggle functionality
 =============================================*/
function initNavToggle() {
    const navToggle = document.querySelector('.nav__toggle');
    const navOverlay = document.querySelector('.nav__overlay');
    const nav = document.querySelector('.nav');

    if (!navToggle || !navOverlay || !nav) return;

    // Toggle navigation on button click
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('nav--active');
        navOverlay.classList.toggle('nav--active');

        // Toggle body scroll when menu is open
        if (navOverlay.classList.contains('nav--active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close navigation when clicking on a link
    const navLinks = document.querySelectorAll('.nav__menu-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('nav--active');
            navOverlay.classList.remove('nav--active');
            document.body.style.overflow = '';
        });
    });

    // Closes navigation on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navOverlay.classList.contains('nav--active')) {
            nav.classList.remove('nav--active');
            navOverlay.classList.remove('nav--active');
            document.body.style.overflow = '';
        }
    });
}

/**========================================
 * Initializes everything when DOM is ready
 ========================================*/
document.addEventListener('DOMContentLoaded', () => {
    initNavToggle();
    new TeamSlider();
});