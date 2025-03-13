/**=======================
 * PRELOADER ANIMATION
 =======================*/
const preloader = document.querySelector('.preloader');
const preloaderBar = document.querySelector('.preloader__bar');
const preloaderText = document.querySelector('.preloader__text');

function initPreloader() {
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 10 + 5;

        if (progress > 100) {
            progress = 100;
            clearInterval(interval);

            // Fades in the preloader text
            gsap.to(preloaderText, {
                opacity: 1,
                y: 0,
                duration: 0.5
            });

            // Completes the loading animation
            setTimeout(() => {
                gsap.to(preloader, {
                    opacity: 0,
                    duration: 0.8,
                    onComplete: () => {
                        preloader.style.display = 'none';
                        initHeroSection();
                    }
                });
            }, 800);
        }

        // Updates the progress bar width
        preloaderBar.style.width = `${progress}%`;
    }, 150);
}

// Linear interpolation helper function
function lerp(start, end, factor) {
    return (1 - factor) * start + factor * end;
}

/**========================
 * NAVIGATION MENU TOGGLE
 ========================*/
const header = document.querySelector('.header');
const navMenu = document.querySelector('.nav__menu');
const navClose = document.getElementById('nav-close');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav__link');

function initNavigation() {
    // Toggles menu
    navToggle?.addEventListener('click', () => {
        navMenu.classList.add('active');
    });

    navClose?.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });

    // Closes menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Changes header background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scroll-active');
        } else {
            header.classList.remove('scroll-active');
        }
    });

    // Activates link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href*="${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add('active');
            } else {
                navLink?.classList.remove('active');
            }
        });
    });
}

/**===============
 * HERO SECTION
 ===============*/
function initHeroSection() {
    const heroSection = {
        init: function () {
            this.setupNetworkVisualization();
            this.setupScrollBasedAnimations();
            this.animateTitleLines();
        },

        /**==========================
         * AI Network Visualization
         ==========================*/
        setupNetworkVisualization: function () {
            const canvas = document.getElementById('ai__network-canvas');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');

            // Sets canvas size to match window
            const resizeCanvas = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };

            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            // Network parameters
            const nodes = [];
            const connections = [];
            const maxNodes = 100;
            let activeNodes = 5; // Start with a few visible nodes
            let networkComplexity = 0.1; // Start with minimal complexity

            // Creates the center node (AI Core)
            const centerNode = {
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: 0,
                vy: 0,
                radius: 10,
                color: '#0055ff',
                active: true,
                isCenter: true
            };

            nodes.push(centerNode);

            // Creates initial nodes 
            for (let i = 0; i < maxNodes; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = 50 + Math.random() * (canvas.width / 2 - 100);

                nodes.push({
                    x: centerNode.x + Math.cos(angle) * distance,
                    y: centerNode.y + Math.sin(angle) * distance,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 2,
                    color: this.getRandomBlueColor(),
                    active: i < activeNodes, // Start with first few active
                    activationThreshold: i / maxNodes // For progressive activation based on scroll
                });
            }

            // Tracks mouse position to influence the network
            let mouseX = canvas.width / 2;
            let mouseY = canvas.height / 2;
            let mouseMoved = false;

            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                mouseMoved = true;

                // After a while, reset mouseMoved to let the center return to default position
                clearTimeout(this.mouseTimeout);
                this.mouseTimeout = setTimeout(() => {
                    mouseMoved = false;
                }, 5000);
            });

            // Updates network on scroll
            window.addEventListener('scroll', () => {
                const scrollProgress = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);

                // Gradually increases complexity with scroll
                networkComplexity = 0.1 + (scrollProgress * 0.7); // Max 0.8

                // Gradually activates more nodes with scroll
                activeNodes = 5 + Math.floor((nodes.length - 5) * scrollProgress * 0.9);

                // Updates node active states
                for (let i = 1; i < nodes.length; i++) {
                    nodes[i].active = i < activeNodes;
                }
            });

            // Animation loop
            const updateNetwork = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Updates positions with smooth movement
                nodes.forEach(node => {
                    if (!node.active) return;

                    // Center node follows mouse with a delay
                    if (node.isCenter && mouseMoved) {
                        node.x += (mouseX - node.x) * 0.03;
                        node.y += (mouseY - node.y) * 0.03;
                    } else if (!node.isCenter) {
                        // Other nodes move slightly and are attracted to center
                        node.vx += (Math.random() - 0.5) * 0.05;
                        node.vy += (Math.random() - 0.5) * 0.05;

                        // Attraction to center
                        const dx = centerNode.x - node.x;
                        const dy = centerNode.y - node.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        node.vx += dx / dist * 0.01;
                        node.vy += dy / dist * 0.01;

                        // Apply velocity with dampening
                        node.vx *= 0.98;
                        node.vy *= 0.98;
                        node.x += node.vx;
                        node.y += node.vy;

                        // Boundary check
                        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
                    }
                });

                // Updates connections
                connections.length = 0;

                // Connects nodes based on distance and complexity
                for (let i = 0; i < nodes.length; i++) {
                    if (!nodes[i].active) continue;

                    for (let j = i + 1; j < nodes.length; j++) {
                        if (!nodes[j].active) continue;

                        const node1 = nodes[i];
                        const node2 = nodes[j];

                        const dx = node2.x - node1.x;
                        const dy = node2.y - node1.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        // Connection probability increases with complexity
                        const maxDistance = 150 + (networkComplexity * 150);
                        const shouldConnect = distance < maxDistance || node1.isCenter || node2.isCenter;

                        if (shouldConnect && Math.random() < networkComplexity) {
                            connections.push({
                                from: node1,
                                to: node2,
                                distance: distance,
                                opacity: node1.isCenter || node2.isCenter
                                    ? 0.5
                                    : 0.3 * (1 - distance / maxDistance)
                            });
                        }
                    }
                }

                // Draws connections
                ctx.lineWidth = 1;
                connections.forEach(conn => {
                    ctx.beginPath();
                    ctx.moveTo(conn.from.x, conn.from.y);
                    ctx.lineTo(conn.to.x, conn.to.y);

                    const gradient = ctx.createLinearGradient(
                        conn.from.x, conn.from.y, conn.to.x, conn.to.y
                    );

                    gradient.addColorStop(0, conn.from.isCenter
                        ? `rgba(0, 85, 255, ${conn.opacity})`
                        : `rgba(0, 217, 255, ${conn.opacity})`);

                    gradient.addColorStop(1, conn.to.isCenter
                        ? `rgba(0, 85, 255, ${conn.opacity})`
                        : `rgba(0, 217, 255, ${conn.opacity})`);

                    ctx.strokeStyle = gradient;
                    ctx.stroke();
                });

                // Draws pulse rings for center node
                const time = Date.now() * 0.001;
                const pulseIntensity = 0.5 + (networkComplexity * 1.5); // Increase pulse with complexity

                for (let i = 0; i < 3; i++) {
                    const pulseFactor = ((time + i * 0.5) % 2) / 2;
                    const pulseRadius = centerNode.radius + pulseFactor * 50 * pulseIntensity;
                    const pulseOpacity = 0.4 * (1 - pulseFactor) * pulseIntensity;

                    ctx.beginPath();
                    ctx.arc(centerNode.x, centerNode.y, pulseRadius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 85, 255, ${pulseOpacity})`;
                    ctx.fill();
                }

                // Draw nodes
                nodes.forEach(node => {
                    if (!node.active) return;

                    // Adds glow effect based on network complexity
                    const glowSize = node.isCenter ? 2.5 : 1.5 + networkComplexity;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.radius * glowSize, 0, Math.PI * 2);

                    const gradient = ctx.createRadialGradient(
                        node.x, node.y, 0,
                        node.x, node.y, node.radius * glowSize
                    );

                    gradient.addColorStop(0, node.isCenter
                        ? 'rgba(0, 85, 255, 0.5)'
                        : 'rgba(0, 217, 255, 0.5)');
                    gradient.addColorStop(1, 'rgba(0, 85, 255, 0)');

                    ctx.fillStyle = gradient;
                    ctx.fill();

                    // Draw the node
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                    ctx.fillStyle = node.color;
                    ctx.fill();
                });

                requestAnimationFrame(updateNetwork);
            };
            updateNetwork(); // Starts animation
        },

        /**================================================
         * Generates a random blue color for network nodes
         ================================================*/
        getRandomBlueColor: function () {
            const blueHue = 210;
            const hue = blueHue + Math.random() * 30;
            const saturation = 70 + Math.random() * 30;
            const lightness = 40 + Math.random() * 20;

            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        },

        /**=========================
         * Scroll-based animations
         =========================*/
        setupScrollBasedAnimations: function () {
            const subtitleContainer = document.querySelector('.subtitle__container');
            const narrativeBlocks = document.querySelectorAll('.narrative__block');
            const growthBars = document.querySelectorAll('.growth__bar');
            const approachContent = document.querySelector('.approach__content');
            const approachCenter = document.querySelector('.approach__center');
            const approachNodes = document.querySelectorAll('.approach__node');
            const ctaContainer = document.querySelector('.cta__container');

            // Creates IntersectionObserver
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.2 // Triggers when 20% visible
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    const target = entry.target;

                    // Handles subtitle section
                    if (target.classList.contains('subtitle__container')) {
                        target.style.opacity = '1';
                        target.style.transform = 'translateY(0)';
                    }

                    // Handles narrative blocks
                    if (target.classList.contains('narrative__block')) {
                        target.style.opacity = '1';
                        target.style.transform = 'translateY(0)';

                        // Animates growth bars
                        const growthBar = target.querySelector('.growth__bar');
                        if (growthBar) {
                            setTimeout(() => {
                                growthBar.querySelector('::before')
                                const barStyle = document.createElement('style');
                                const barClass = growthBar.classList.contains('accelerated')
                                    ? '.growth__bar.accelerated::before'
                                    : '.growth__bar::before';

                                barStyle.textContent = `${barClass} { transform: translateX(0) !important; }`;
                                document.head.appendChild(barStyle);

                                // Cleans up after animation completes
                                setTimeout(() => {
                                    document.head.removeChild(barStyle);
                                    growthBar.style.setProperty('--animated', 'true');
                                }, 1500);
                            }, 300);
                        }
                    }

                    // Handles approach section
                    if (target.classList.contains('approach__content')) {
                        target.style.opacity = '1';
                        target.style.transform = 'translateY(0)';

                        // Animates approach nodes
                        setTimeout(() => {
                            approachNodes.forEach((node, index) => {
                                setTimeout(() => {
                                    node.style.opacity = '1';
                                    node.style.transform = 'scale(1)';
                                }, 150 * index);
                            });

                            // Animates center node with delay
                            setTimeout(() => {
                                approachCenter.style.opacity = '1';
                                approachCenter.style.transform = 'translate(-50%, -50%) scale(1)';

                                // Creates connections
                                setTimeout(() => {
                                    this.createApproachConnections();
                                }, 300);
                            }, 600);
                        }, 400);
                    }

                    // Handles CTA container
                    if (target.classList.contains('cta__container')) {
                        target.style.opacity = '1';
                        target.style.transform = 'translateY(0)';
                    }

                    // Stops observing once animation is applied
                    observer.unobserve(target);
                });
            }, observerOptions);

            // Starts observing elements
            if (subtitleContainer) observer.observe(subtitleContainer);
            narrativeBlocks.forEach(block => observer.observe(block));
            if (approachContent) observer.observe(approachContent);
            if (ctaContainer) observer.observe(ctaContainer);

            // Animates the growth bars using scroll trigger
            window.addEventListener('scroll', () => {
                growthBars.forEach(bar => {
                    if (this.isElementInViewport(bar) && !bar.classList.contains('animated')) {
                        bar.classList.add('animated');
                        bar.style.setProperty('--transform', 'translateX(0)');

                        const before = document.createElement('style');
                        before.textContent = `
                            .growth__bar.animated::before,
                            .growth__bar.accelerated.animated::before {
                                transform: translateX(0) !important;
                            }
                        `;
                        document.head.appendChild(before);
                    }
                });
            });
        },

        /**==================================
         * Check if element is in viewport
         ==================================*/
        isElementInViewport: function (el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                rect.bottom >= 0
            );
        },

        /**==================================
         * Animate title lines sequentially
         ==================================*/
        animateTitleLines: function () {
            const titleLines = document.querySelectorAll('.title__line');
            const heroTitle = document.querySelector('.hero__title');

            if (!heroTitle || !titleLines.length) return;

            // Makes title visible first
            setTimeout(() => {
                heroTitle.style.opacity = '1';

                // Animates each line with staggered delay
                titleLines.forEach((line, index) => {
                    setTimeout(() => {
                        line.style.opacity = '1';
                        line.style.transform = 'translateY(0)';
                    }, 300 * index);
                });
            }, 500);
        },

        /**=========================================
         * Create connections for approach visual
         =========================================*/
        createApproachConnections: function () {
            const approach = document.querySelector('.approach__visual');
            if (!approach) return;

            const center = approach.querySelector('.approach__center');
            const nodes = approach.querySelectorAll('.approach__node');

            if (!center || !nodes.length) return;

            // Removes existing SVG if any
            const existingSvg = approach.querySelector('svg');
            if (existingSvg) {
                existingSvg.remove();
            }

            // Creates SVG
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.setAttribute('class', 'approach__connections');

            // Adds definitions for gradients
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            svg.appendChild(defs);

            // Adds SVG to approach visual
            approach.appendChild(svg);

            // Calculates positions
            const centerRect = center.getBoundingClientRect();
            const approachRect = approach.getBoundingClientRect();

            const centerX = centerRect.left + centerRect.width / 2 - approachRect.left;
            const centerY = centerRect.top + centerRect.height / 2 - approachRect.top;

            // Creates connections from center to each node
            nodes.forEach((node, index) => {
                const nodeRect = node.getBoundingClientRect();
                const nodeX = nodeRect.left + nodeRect.width / 2 - approachRect.left;
                const nodeY = nodeRect.top + nodeRect.height / 2 - approachRect.top;

                // Creates gradient
                const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
                gradient.setAttribute('id', `gradient-${index}`);
                gradient.setAttribute('x1', '0%');
                gradient.setAttribute('y1', '0%');
                gradient.setAttribute('x2', '100%');
                gradient.setAttribute('y2', '100%');

                const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop1.setAttribute('offset', '0%');
                stop1.setAttribute('stop-color', '#0055ff');

                const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop2.setAttribute('offset', '100%');
                stop2.setAttribute('stop-color', '#00d9ff');

                gradient.appendChild(stop1);
                gradient.appendChild(stop2);
                defs.appendChild(gradient);

                // Creates line
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', centerX);
                line.setAttribute('y1', centerY);
                line.setAttribute('x2', nodeX);
                line.setAttribute('y2', nodeY);
                line.setAttribute('stroke', `url(#gradient-${index})`);
                line.setAttribute('stroke-width', '2');
                line.setAttribute('stroke-dasharray', '4,4');

                svg.appendChild(line);

                // Animates the line with a drawing effect
                const length = Math.sqrt(Math.pow(nodeX - centerX, 2) + Math.pow(nodeY - centerY, 2));
                line.setAttribute('stroke-dasharray', length);
                line.setAttribute('stroke-dashoffset', length);

                setTimeout(() => {
                    line.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
                    line.style.strokeDashoffset = '0';
                }, 100 * index);
            });
        },
    };
    heroSection.init();
};

/**=====================
 * CHALLENGES SECTION
 =====================*/
function initChallengesSection() {
    const flowPath = document.querySelector('.flow__path');
    const pulseDot = document.querySelector('.pulse__dot');
    const linesSvg = document.querySelector('.lines__svg');
    const displayHeadings = document.querySelectorAll('.display__heading');
    const solutionElements = document.querySelectorAll('.floating__solution');
    const challengeElements = document.querySelectorAll('.floating__challenge');
    const conclusionElements = document.querySelectorAll('.conclusion__text, .highlight__statement, .floating__cta');

    /**=======================
     * Flow Field Background
     =======================*/
    function initFlowField() {
        const canvas = document.getElementById('flow-field');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Sets canvas dimensions
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = document.querySelector('.challenges').offsetHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Flow field parameters
        const particleCount = 300;
        const particles = [];
        const flowFieldResolution = 30;
        const flowFieldTime = 0;

        // Creates flow field grid
        const cols = Math.floor(canvas.width / flowFieldResolution) + 1;
        const rows = Math.floor(canvas.height / flowFieldResolution) + 1;
        const flowField = new Array(cols * rows);

        // Initializes particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: 0,
                vy: 0,
                size: Math.random() * 1.5 + 0.5,
                color: getRandomColor(),
                speed: Math.random() * 0.8 + 0.2,
                lifetime: Math.random() * 100 + 100
            });
        }

        function getRandomColor() {
            const colors = [
                'rgba(0, 85, 255, 0.5)',
                'rgba(0, 217, 255, 0.5)',
                'rgba(0, 149, 255, 0.5)'
            ];

            return colors[Math.floor(Math.random() * colors.length)];
        }

        // Animation loop
        function animate() {
            // Clear canvas with fade effect
            ctx.fillStyle = 'rgba(5, 9, 18, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update flow field
            let i = 0;
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const angle = noise(x * 0.1, y * 0.1, flowFieldTime * 0.0002) * Math.PI * 2;
                    flowField[i] = {
                        x: Math.cos(angle),
                        y: Math.sin(angle)
                    };
                    i++;
                }
            }

            // Updates and draw particles
            particles.forEach(particle => {
                // Finds the flow field vector at particle position
                const col = Math.floor(particle.x / flowFieldResolution);
                const row = Math.floor(particle.y / flowFieldResolution);
                const index = col + row * cols;
                const flow = flowField[index] || { x: 0, y: 0 };

                // Updates velocity
                particle.vx = lerp(particle.vx, flow.x * particle.speed, 0.1);
                particle.vy = lerp(particle.vy, flow.y * particle.speed, 0.1);

                // Updates position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Decreases lifetime
                particle.lifetime--;

                // Resets if off-screen or end of life
                if (
                    particle.x < 0 ||
                    particle.x > canvas.width ||
                    particle.y < 0 ||
                    particle.y > canvas.height ||
                    particle.lifetime <= 0
                ) {
                    particle.x = Math.random() * canvas.width;
                    particle.y = Math.random() * canvas.height;
                    particle.lifetime = Math.random() * 100 + 100;
                }

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });
            requestAnimationFrame(animate);
        }

        function noise(x, y, z) {
            return Math.sin(x + y + z) * 0.5 + 0.5;
        }

        // Linear interpolation
        function lerp(a, b, t) {
            return a + t * (b - a);
        }
        animate(); // Starts animation
    }

    /**=======================
     * Intersection Observer
     =======================*/
    const observerOptions = {
        root: null,
        threshold: 0.2,
        rootMargin: '-100px'
    };

    const elementObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adds active class for various elements
                entry.target.classList.add('active');

                if (entry.target.classList.contains('display__heading')) {
                    const section = entry.target.closest('.challenges__display, .solutions__display');

                    if (section.classList.contains('challenges__display')) {
                        // Activates path and challenges
                        if (flowPath) {
                            flowPath.classList.add('active');
                        }

                        // Activates challenges with staggered delay
                        challengeElements.forEach((challenge, index) => {
                            setTimeout(() => {
                                challenge.classList.add('active');
                            }, 300 * index);
                        });

                    } else if (section.classList.contains('solutions__display')) {
                        // Activates central point
                        if (pulseDot) {
                            pulseDot.classList.add('active');
                        }

                        // Activates connection lines
                        if (linesSvg) {
                            setTimeout(() => {
                                linesSvg.classList.add('active');
                            }, 500);
                        }

                        // Activates solutions with staggered delay
                        solutionElements.forEach((solution, index) => {
                            setTimeout(() => {
                                solution.classList.add('active');
                            }, 800 + (300 * index));
                        });
                    }
                }
            }
        });
    }, observerOptions);

    // Starts observing elements
    displayHeadings.forEach(heading => {
        elementObserver.observe(heading);
    });

    conclusionElements.forEach(element => {
        elementObserver.observe(element);
    });

    /**=======================
     * Mouse Parallax
     =======================*/
    function initParallax() {
        const challengeItems = document.querySelectorAll('.floating__challenge');

        document.addEventListener('mousemove', e => {
            if (window.innerWidth <= 992) return;

            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            challengeItems.forEach(item => {
                const depth = parseFloat(item.getAttribute('data-depth') || 0.5);
                const moveX = mouseX * 30 * depth;
                const moveY = mouseY * 30 * depth;

                item.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    }

    /**=============
     * Initialize
     =============*/
    initFlowField();
    initParallax();
}

/**=============================================
 * Particles Animation for Ecosystem Section
 =============================================*/
function initEcosystemSection() {
    const container = document.querySelector('.ecosystem__particles');
    if (!container) return;

    // Create canvas element
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Set canvas size
    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle properties
    const particles = [];
    const particleCount = 250;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            color: `rgba(${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 100) + 150}, 255, ${Math.random() * 0.5 + 0.2})`,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        });
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particles.forEach(particle => {
            // Move particle
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });

        // Connect particles that are close to each other
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 85, 255, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

/**==================================
 * ECOSYSTEM DIAGRAM INITIALIZATION
 ==================================*/
function initEcosystemDiagram() {
    const ecosystemDiagram = document.querySelector('.ecosystem__diagram');
    const ecosystemCenter = document.querySelector('.ecosystem__center');
    const ecosystemRings = document.querySelectorAll('.ecosystem__ring');
    const ecosystemNodes = document.querySelectorAll('.ecosystem__node');

    if (!ecosystemDiagram || !ecosystemCenter || !ecosystemRings.length || !ecosystemNodes.length) return;

    /**=======================
     * Intersection Observer
     =======================*/
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start animations sequence
                setTimeout(() => {
                    // Make diagram visible
                    ecosystemDiagram.classList.add('visible');

                    // Animate center
                    setTimeout(() => {
                        ecosystemCenter.classList.add('visible');
                    }, 200);

                    // Animate rings with staggered delay (already handled by CSS delay)
                    ecosystemRings.forEach(ring => {
                        ring.classList.add('visible');
                    });

                    // Animate nodes with staggered delay (already handled by CSS delay)
                    ecosystemNodes.forEach(node => {
                        node.classList.add('visible');
                    });

                    // Create connections after elements are visible
                    setTimeout(() => {
                        createEcosystemConnections();
                    }, 1200);
                }, 300);

                // Stop observing once animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    // Start observing the diagram
    observer.observe(ecosystemDiagram);

    /**==========================================
     * Handle window resize for connection lines
     ==========================================*/
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Debounce to prevent excessive recalculations
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recreate connections when window is resized
            if (ecosystemDiagram.classList.contains('visible')) {
                createEcosystemConnections();
            }
        }, 250);
    });
}

/**=============================================
 * Create SVG connections between center & nodes
 =============================================*/
function createEcosystemConnections() {
    const diagram = document.querySelector('.ecosystem__diagram');
    const center = document.querySelector('.ecosystem__center');
    const nodes = document.querySelectorAll('.ecosystem__node');

    if (!diagram || !center || !nodes.length) return;

    // Remove existing SVG if any
    const existingSvg = diagram.querySelector('svg.ecosystem__connections');
    if (existingSvg) {
        existingSvg.remove();
    }

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'ecosystem__connections');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    // Add definitions for gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);

    // Calculate center position relative to diagram
    const centerRect = center.getBoundingClientRect();
    const diagramRect = diagram.getBoundingClientRect();
    const centerX = centerRect.left + centerRect.width / 2 - diagramRect.left;
    const centerY = centerRect.top + centerRect.height / 2 - diagramRect.top;

    // Create connections from center to each node
    nodes.forEach((node, index) => {
        // Calculate node position
        const nodeRect = node.getBoundingClientRect();
        const nodeX = nodeRect.left + nodeRect.width / 2 - diagramRect.left;
        const nodeY = nodeRect.top + nodeRect.height / 2 - diagramRect.top;

        // Create gradient for this connection
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', `ecosystem-gradient-${index}`);
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');

        // Add gradient stops
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#0055ff');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#00d9ff');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);

        // Create path for connection with slight curve for visual interest
        const dx = nodeX - centerX;
        const dy = nodeY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate control point for curve (perpendicular to line)
        const midX = (centerX + nodeX) / 2;
        const midY = (centerY + nodeY) / 2;
        const controlX = midX + (dy * 0.2);
        const controlY = midY - (dx * 0.2);

        // Create path element
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${centerX},${centerY} Q${controlX},${controlY} ${nodeX},${nodeY}`);
        path.setAttribute('stroke', `url(#ecosystem-gradient-${index})`);
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');

        // Add path to SVG
        svg.appendChild(path);
    });

    // Add SVG to diagram
    diagram.appendChild(svg);
    svg.classList.add('visible');
}

/**=========================================
 * Initialize Ecosystem Scroll Experience
 =========================================*/
function initEcosystemScrollExperience() {
    const ecosystemVisual = document.querySelector('.ecosystem__visual');
    const ecosystemDiagram = document.querySelector('.ecosystem__diagram');
    const ecosystemSteps = document.querySelectorAll('.ecosystem__step');

    // Exits if elements don't exist
    if (!ecosystemVisual || !ecosystemDiagram || !ecosystemSteps.length) return;

    // Verifies if GSAP and ScrollTrigger are available
    if (!window.gsap || !window.gsap.ScrollTrigger) {
        console.warn('GSAP or ScrollTrigger not available for ecosystem scroll experience');
        initFallbackScrollAnimation();
        return;
    }

    const { gsap, ScrollTrigger } = window;

    /**==============================
     * Initializes GSAP animations
     ==============================*/
    // Reveals diagram with scale effect when in view
    ScrollTrigger.create({
        trigger: ecosystemDiagram,
        start: 'center center',
        onEnter: () => ecosystemDiagram.classList.add('visible'),
        once: true
    });

    // Reveals steps one by one with alternating positions as user scrolls
    ecosystemSteps.forEach((step, index) => {
        ScrollTrigger.create({
            trigger: step,
            start: 'top 70%', // Triggers when step is 70% in view
            onEnter: () => step.classList.add('active'),
            onLeaveBack: () => {
                // Only remove active class when scrolling back up 
                // Keep first step visible for better UX
                if (index > 0) {
                    step.classList.remove('active');
                }
            }
        });
    });

    // Creates connections between nodes in the ecosystem diagram
    ScrollTrigger.create({
        trigger: ecosystemDiagram,
        start: 'top center',
        onEnter: () => {
            setTimeout(createEcosystemConnections, 500);
        },
        once: true
    });

    /**=================================================
     * Fallback animation using Intersection Observer 
     * (in case GSAP is not available)
     =================================================*/
    function initFallbackScrollAnimation() {
        // Makes diagram visible
        ecosystemDiagram.classList.add('visible');

        // Creates observer for steps
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    if (entry.target !== ecosystemSteps[0]) {
                        entry.target.classList.remove('active');
                    }
                }
            });
        }, { threshold: 0.3 });

        // Observes each step
        ecosystemSteps.forEach(step => {
            observer.observe(step);
        });

        // Creates connections
        setTimeout(createEcosystemConnections, 1000);

        // Makes diagram sticky using scroll events with proper centering
        window.addEventListener('scroll', () => {
            const rect = ecosystemVisual.getBoundingClientRect();
            if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                ecosystemDiagram.style.position = 'fixed';
                ecosystemDiagram.style.top = '50%';
                ecosystemDiagram.style.left = '50%';
                ecosystemDiagram.style.transform = 'translate(-50%, -50%)';
            } else if (rect.top > 0) {
                ecosystemDiagram.style.position = 'absolute';
                ecosystemDiagram.style.top = '0';
                ecosystemDiagram.style.left = '50%';
                ecosystemDiagram.style.transform = 'translateX(-50%)';
            } else {
                ecosystemDiagram.style.position = 'absolute';
                ecosystemDiagram.style.top = `${ecosystemVisual.offsetHeight - ecosystemDiagram.offsetHeight}px`;
                ecosystemDiagram.style.left = '50%';
                ecosystemDiagram.style.transform = 'translateX(-50%)';
            }
        });
    }
}

/**========================
 * Case Studies Slider
 ========================*/
function initCaseStudiesSlider() {
    const wrapper = document.querySelector('.cases__wrapper');
    const dots = document.querySelectorAll('.cases__dot');
    const prevBtn = document.querySelector('.cases__arrow--prev');
    const nextBtn = document.querySelector('.cases__arrow--next');
    const slides = document.querySelectorAll('.case__study');

    if (!wrapper || !slides.length) return;

    let currentIndex = 0;

    // Sets initial state for navigation buttons
    updateButtonStates();

    // Sets initial position to ensure no content bleed
    updateSlider(true); // true = force refresh

    // Initializes first slide's chart
    initCaseStudyCharts(0);

    // Adds event listeners
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
        });
    });

    prevBtn?.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextBtn?.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    // Adds swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold && currentIndex < slides.length - 1) {
            // Swipes left - next slide
            currentIndex++;
            updateSlider();
        } else if (touchEndX > touchStartX + swipeThreshold && currentIndex > 0) {
            // Swipes right - previous slide
            currentIndex--;
            updateSlider();
        }
    }

    function updateSlider(forceRefresh = false) {
        // Forces redraw if needed (helps with positioning)
        if (forceRefresh) {
            wrapper.style.display = 'none';
            // Forces a reflow
            void wrapper.offsetHeight;
            wrapper.style.display = 'flex';
        }

        // Applies precise position with exact pixel calculation to prevent bleed
        const slideWidth = slides[0].offsetWidth;
        const exactPosition = currentIndex * slideWidth;

        // Updates slider position with pixelated position rather than percentage
        // This ensures more precise positioning especially on mobile
        wrapper.style.transform = `translateX(-${exactPosition}px)`;

        // Hides all slides that aren't active from screen readers
        slides.forEach((slide, idx) => {
            slide.setAttribute('aria-hidden', idx !== currentIndex);
            // Applies additional transform to ensure clean separation
            if (window.innerWidth <= 576) {
                slide.style.transform = `translateX(${(idx - currentIndex) * 100}%)`;
            }
        });

        // Updates active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Updates button states
        updateButtonStates();

        // Initializes chart for current slide
        initCaseStudyCharts(currentIndex);
    }

    function updateButtonStates() {
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
            prevBtn.setAttribute('aria-disabled', currentIndex === 0);
        }

        if (nextBtn) {
            nextBtn.disabled = currentIndex === slides.length - 1;
            nextBtn.setAttribute('aria-disabled', currentIndex === slides.length - 1);
        }
    }

    // Handles resize to ensure proper positioning
    window.addEventListener('resize', () => {
        // Delays the update slightly to allow layout to settle
        setTimeout(() => updateSlider(true), 10);
    });

    // Forces an initial positioning after images might have loaded
    window.addEventListener('load', () => {
        updateSlider(true);
    });
}

/**====================
 * Case Study Charts
 ====================*/
function initCaseStudyCharts(activeIndex) {
    // Checks if Chart.js is available
    if (!window.Chart) return;

    // Sets chart defaults
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Poppins', sans-serif";

    // Defines chart configurations
    const chartConfigs = [
        {
            id: 'urbancare-chart',
            type: 'line',
            data: {
                labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
                datasets: [
                    {
                        label: 'Before NextGen',
                        data: [20000, 20000, 20000, 20000, 20000, 20000],
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'With NextGen',
                        data: [20000, 25000, 32000, 38000, 42000, 45000],
                        borderColor: '#0055ff',
                        backgroundColor: 'rgba(0, 85, 255, 0.2)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#e2e8f0',
                        bodySpacing: 6,
                        padding: 12,
                        borderColor: 'rgba(0, 85, 255, 0.3)',
                        borderWidth: 1,
                        callbacks: {
                            label: function (context) {
                                return '$' + context.raw.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: {
                            callback: function (value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: { grid: { color: 'rgba(255, 255, 255, 0.05)' } }
                },
                animations: {
                    tension: { duration: 1000, easing: 'linear' }
                }
            }
        },
        {
            id: 'shopease-chart',
            type: 'radar',
            data: {
                labels: [
                    'Monthly Sales',
                    'Customer Acquisition Cost',
                    'Profit Margin',
                    'Customer Retention',
                    'New Segments'
                ],
                datasets: [
                    {
                        label: 'Before NextGen',
                        data: [50, 70, 30, 40, 20],
                        fill: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        pointBackgroundColor: 'rgba(255, 255, 255, 0.8)',
                        pointBorderColor: '#fff',
                        pointRadius: 4
                    },
                    {
                        label: 'With NextGen',
                        data: [85, 35, 75, 65, 80],
                        fill: true,
                        backgroundColor: 'rgba(0, 85, 255, 0.2)',
                        borderColor: '#0055ff',
                        pointBackgroundColor: '#0055ff',
                        pointBorderColor: '#fff',
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#e2e8f0',
                        bodySpacing: 6,
                        padding: 12,
                        borderColor: 'rgba(0, 85, 255, 0.3)',
                        borderWidth: 1
                    }
                },
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: { display: false },
                        pointLabels: { font: { size: 12 } },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                animations: {
                    tension: { duration: 1000, easing: 'linear' }
                }
            }
        },
        {
            id: 'technova-chart',
            type: 'bar',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [
                    {
                        label: 'Qualified Leads',
                        data: [50, 80, 95, 110],
                        backgroundColor: '#0055ff',
                        borderRadius: 4
                    },
                    {
                        label: 'Sales Cycle (Weeks)',
                        data: [24, 18, 10, 6],
                        backgroundColor: '#00d9ff',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#e2e8f0',
                        bodySpacing: 6,
                        padding: 12,
                        borderColor: 'rgba(0, 85, 255, 0.3)',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    },
                    x: { grid: { color: 'rgba(255, 255, 255, 0.05)' } }
                },
                animations: {
                    y: { duration: 1000, easing: 'easeOutCubic' }
                }
            }
        }
    ];

    // Initializes the active chart
    const config = chartConfigs[activeIndex];
    if (!config) return;

    const canvas = document.getElementById(config.id);
    if (!canvas) return;

    // Destroys existing chart if it exists
    if (canvas.chart) {
        canvas.chart.destroy();
    }

    // Creates a new chart
    canvas.chart = new Chart(canvas, {
        type: config.type,
        data: config.data,
        options: config.options
    });
}

/**=========================================
 * CTA Section Animations and Interactions
 =========================================*/
function initCTASection() {
    animateCounters();
    initParallaxEffect();
}

/**================================
 * Counter Animation for Stats
 ================================*/
function animateCounters() {
    const counters = document.querySelectorAll('.counter');

    // Checks if IntersectionObserver is available for better performance
    if ('IntersectionObserver' in window) {
        const options = {
            threshold: 0.5 // Triggers when element is 50% visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    startCounting(counter, target);
                    observer.unobserve(counter); // Only animate once
                }
            });
        }, options);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            startCounting(counter, target);
        });
    }

    function startCounting(counter, target) {
        let count = 0;
        const duration = 2000; // 2 seconds
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        const increment = target / totalFrames;

        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(count);
            }
        }, frameDuration);
    }
}

/**=========================================
 * Parallax Effect for Floating Elements
 =========================================*/
function initParallaxEffect() {
    const floatingElements = document.querySelectorAll('.float__element');

    // Only adds parallax if there are floating elements and on non-touch devices
    if (floatingElements.length && window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            floatingElements.forEach(element => {
                // Creates different movement speeds for various elements
                const depthX = parseFloat(element.getAttribute('data-depth-x') || 20);
                const depthY = parseFloat(element.getAttribute('data-depth-y') || 20);

                const translateX = mouseX * depthX;
                const translateY = mouseY * depthY;

                element.style.transform = `translate(${translateX}px, ${translateY}px)`;
            });
        });
    }
}

/**==================================================================
 * Handles animations with GSAP/ScrollTrigger for targeted elements
 ==================================================================*/
function initScrollReveal() {
    // Checks for GSAP
    if (typeof gsap !== 'object') {
        console.warn('GSAP not available');
        return;
    }

    // Register ScrollTrigger
    if (gsap.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    /**==============================
     * Animates hero title section
     ==============================*/
    function animateHeroTitle() {
        const titleLines = document.querySelectorAll('.hero__title .title__line');
        const accentElements = document.querySelectorAll('.hero__title .accent');
        const scrollIndicator = document.querySelector('.scroll__indicator');

        if (!titleLines.length) return;

        // Sets initial states
        gsap.set(titleLines, { opacity: 0, y: 40 });
        gsap.set(accentElements, { opacity: 0.5, scale: 0.9 });
        gsap.set(scrollIndicator, { opacity: 0 });

        // Overrides default animation if exists
        if (window.heroSection && window.heroSection.animateTitleLines) {
            window.heroSection.animateTitleLines = function () { };
        }

        // Creates animation sequence
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(scrollIndicator, {
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                });
            }
        });

        // Staggered line animation
        tl.to(titleLines, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.3,
            ease: "power3.out"
        });

        // Accent elements animation
        tl.to(accentElements, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)"
        }, "-=0.5");
    }

    /**=======================================
     * Sets up scroll-triggered animations
     =======================================*/
    function setupScrollAnimations() {
        const animatedElements = [
            // Hero section
            { el: '.hero__subtitle', y: 30 },
            { el: '.narrative__block .narrative__text', y: 30, stagger: 0.2 },
            { el: '.approach__text', y: 30 },
            { el: '.scene__cta .btn', y: 20, stagger: 0.2 },

            // Challenges section
            { el: '.floating__title', y: 40 },
            { el: '.floating__paragraph', y: 30, stagger: 0.2 },
            { el: '.big__question', scale: 0.8, y: 0 },

            // Ecosystem section
            { el: '#ecosystem .section__title', y: 30 },
            { el: '.ecosystem__intro p', y: 30 },
            { el: '.comparison__row', x: -30, stagger: 0.15 }
        ];

        // Applies animations to each element
        animatedElements.forEach(item => {
            const elements = document.querySelectorAll(item.el);
            if (!elements.length) return;

            // Hides elements initially
            elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = item.scale ?
                    `scale(${item.scale})` :
                    item.x ?
                        `translateX(${item.x}px)` :
                        `translateY(${item.y}px)`;
                el.style.transition = 'none';
            });

            // Creates animations with staggering if needed
            if (item.stagger && elements.length > 1) {
                gsap.to(elements, {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: item.stagger,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: elements[0].parentNode || elements[0],
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                });
            } else {
                // Single element animation
                elements.forEach(el => {
                    gsap.to(el, {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 80%",
                            toggleActions: "play none none none"
                        }
                    });
                });
            }
        });
    }

    /**===============================
     * Handles preloader integration
     ===============================*/
    function initWithPreloader() {
        const preloader = document.querySelector('.preloader');

        if (preloader) {
            // Checks if it is already hidden
            if (preloader.style.display === 'none') {
                animateHeroTitle();
                setupScrollAnimations();
                return;
            }

            // Watches for preloader completion
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'style' &&
                        preloader.style.display === 'none') {
                        animateHeroTitle();
                        setupScrollAnimations();
                        observer.disconnect();
                    }
                });
            });

            observer.observe(preloader, { attributes: true });
        } else {
            animateHeroTitle();
            setupScrollAnimations();
        }
    }
    initWithPreloader();
}

/**===========================
 * Initialize All Functions
 ===========================*/
function init() {
    initPreloader();
    initNavigation();
    initHeroSection();
    initChallengesSection();
    initEcosystemSection();
    initEcosystemScrollExperience();
    initEcosystemDiagram();
    initCaseStudiesSlider();
    initCTASection();
    initScrollReveal();
}

/**================
 * INITIALIZATION
 ================*/
window.addEventListener("DOMContentLoaded", () => {
    init();
});