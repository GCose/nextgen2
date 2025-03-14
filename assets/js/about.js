/**============================
 * Hero Section Animation
 ============================*/
function initHeroSection() {
    const heroGrid = document.querySelector('.hero-grid');
    if (!heroGrid) return;

    const gridItems = heroGrid.querySelectorAll('.hero-grid__item');

    // Animate grid items sequentially with GSAP
    if (window.gsap) {
        gsap.set(gridItems, { opacity: 0, scale: 0.95 });

        gsap.timeline({
            delay: 0.5,
            defaults: {
                duration: 0.8,
                ease: "back.out(1.7)"
            }
        })
            .to(gridItems, {
                opacity: 1,
                scale: 1,
                stagger: 0.15
            });

        // Animate heading text
        const heading = document.querySelector('.hero__split-heading');
        const subHeading = document.querySelector('.hero__split-subheading');
        const text = document.querySelector('.hero__split__text');
        const indicator = document.querySelector('.scroll-indicator');

        if (heading && subHeading && text && indicator) {
            gsap.set([heading, subHeading, text, indicator], { opacity: 0, y: 30 });

            gsap.timeline({
                delay: 0.8,
                defaults: {
                    duration: 0.8,
                    ease: "power3.out"
                }
            })
                .to(heading, { opacity: 1, y: 0 })
                .to(subHeading, { opacity: 1, y: 0 }, "-=0.6")
                .to(text, { opacity: 1, y: 0 }, "-=0.6")
                .to(indicator, { opacity: 1, y: 0 }, "-=0.5");
        }

        // Parallax effect on scroll
        gsap.to('.hero-grid', {
            y: -100,
            opacity: 0.5,
            scrollTrigger: {
                trigger: '.hero__split',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
}

/**=============================
 * Narrative Section Animation
 =============================*/
function initNarrativeSection() {
    // Problem diagram animation
    initProblemDiagram();

    // Solution ecosystem animation
    initSolutionEcosystem();

    // Animate narrative blocks on scroll
    if (window.gsap && window.ScrollTrigger) {
        const blocks = document.querySelectorAll('.narrative__block');

        blocks.forEach(block => {
            const title = block.querySelector('.narrative__block-title');
            const text = block.querySelector('.narrative__text');

            if (!title || !text) return;

            gsap.set([title, text], { opacity: 0, y: 30 });

            gsap.timeline({
                scrollTrigger: {
                    trigger: block,
                    start: 'top 70%',
                    end: 'center center',
                    toggleActions: 'play none none reverse'
                }
            })
                .to(title, { opacity: 1, y: 0, duration: 0.8 })
                .to(text, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6");
        });
    }
}

/**============================
 * Problem Diagram Animation
 ============================*/
function initProblemDiagram() {
    const diagram = document.querySelector('.problem__diagram');
    if (!diagram) return;

    const services = diagram.querySelectorAll('.service__pill');
    const center = diagram.querySelector('.problem__diagram-center');
    const result = diagram.querySelector('.problem__diagram__result');

    if (!center || !services.length || !result) return;

    // Create canvas for connections
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    diagram.prepend(canvas);

    // Set canvas dimensions
    function resizeCanvas() {
        const rect = diagram.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        drawConnections();
    }

    window.addEventListener('resize', resizeCanvas);

    // Draw connections between services and center
    function drawConnections() {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get positions
        const centerRect = center.getBoundingClientRect();
        const diagramRect = diagram.getBoundingClientRect();

        const centerX = centerRect.left + centerRect.width / 2 - diagramRect.left;
        const centerY = centerRect.top + centerRect.height / 2 - diagramRect.top;

        // Draw connections to each service
        services.forEach((service, index) => {
            const serviceRect = service.getBoundingClientRect();
            const serviceX = serviceRect.left + serviceRect.width / 2 - diagramRect.left;
            const serviceY = serviceRect.top + serviceRect.height / 2 - diagramRect.top;

            // Create gradient
            const gradient = ctx.createLinearGradient(centerX, centerY, serviceX, serviceY);
            gradient.addColorStop(0, 'rgba(0, 85, 255, 0.5)');
            gradient.addColorStop(1, 'rgba(0, 85, 255, 0.1)');

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(serviceX, serviceY);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Draw connection to result
        const resultRect = result.getBoundingClientRect();
        const resultX = resultRect.left + resultRect.width / 2 - diagramRect.left;
        const resultY = resultRect.top + resultRect.height / 2 - diagramRect.top;

        const gradient = ctx.createLinearGradient(centerX, centerY, resultX, resultY);
        gradient.addColorStop(0, 'rgba(255, 62, 108, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 62, 108, 0.2)');

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(resultX, resultY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Animate with GSAP if available
    if (window.gsap) {
        // Set initial state
        gsap.set(center, { opacity: 0, scale: 0 });
        gsap.set(services, { opacity: 0, y: 20 });
        gsap.set(result, { opacity: 0, y: 20 });

        // Create scroll-triggered animation
        gsap.timeline({
            scrollTrigger: {
                trigger: diagram,
                start: 'top 70%',
                end: 'center center',
                toggleActions: 'play none none reverse',
                onUpdate: drawConnections
            }
        })
            .to(center, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "back.out(1.7)"
            })
            .to(services, {
                opacity: 1,
                y: 0,
                stagger: 0.15,
                duration: 0.6,
                ease: "power3.out",
                onComplete: drawConnections
            }, "-=0.5")
            .to(result, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out"
            }, "-=0.3");
    }

    // Initialize canvas
    resizeCanvas();
}

/**================================
 * Solution Ecosystem Animation
 ================================*/
function initSolutionEcosystem() {
    const ecosystem = document.querySelector('.solution__ecosystem');
    if (!ecosystem) return;

    const core = ecosystem.querySelector('.solution__ecosystem-core');
    const orbits = ecosystem.querySelectorAll('.solution__ecosystem-orbit');
    const nodes = ecosystem.querySelectorAll('.solution__ecosystem-node');
    const result = ecosystem.querySelector('.solution__ecosystem-result');

    if (!core || !orbits.length || !nodes.length || !result) return;

    // Create connections between nodes and core
    function createConnections() {
        // Create SVG for connections
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '1';
        ecosystem.prepend(svg);

        // Add definitions for gradients
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svg.appendChild(defs);

        // Create gradient
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'nodeGradient');
        gradient.setAttribute('gradientUnits', 'userSpaceOnUse');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', 'rgba(0, 217, 255, 0.8)');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', 'rgba(0, 217, 255, 0.2)');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);

        // Update connections on window resize
        function updateConnections() {
            // Remove existing lines
            while (svg.lastChild !== defs) {
                svg.removeChild(svg.lastChild);
            }

            // Get core position
            const coreRect = core.getBoundingClientRect();
            const ecosystemRect = ecosystem.getBoundingClientRect();

            const coreX = coreRect.left - ecosystemRect.left + coreRect.width / 2;
            const coreY = coreRect.top - ecosystemRect.top + coreRect.height / 2;

            // Draw lines to each node
            nodes.forEach((node, index) => {
                const nodeRect = node.getBoundingClientRect();
                const nodeX = nodeRect.left - ecosystemRect.left + nodeRect.width / 2;
                const nodeY = nodeRect.top - ecosystemRect.top + nodeRect.height / 2;

                // Update gradient coordinates
                gradient.setAttribute('x1', coreX);
                gradient.setAttribute('y1', coreY);
                gradient.setAttribute('x2', nodeX);
                gradient.setAttribute('y2', nodeY);

                // Create line
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', coreX);
                line.setAttribute('y1', coreY);
                line.setAttribute('x2', nodeX);
                line.setAttribute('y2', nodeY);
                line.setAttribute('stroke', 'url(#nodeGradient)');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('stroke-dasharray', '5,5');
                line.style.opacity = '0.7';

                svg.appendChild(line);
            });

            // Draw line to result
            const resultRect = result.getBoundingClientRect();
            const resultX = resultRect.left - ecosystemRect.left + resultRect.width / 2;
            const resultY = resultRect.top - ecosystemRect.top + resultRect.height / 2;

            const resultGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            resultGradient.setAttribute('id', 'resultGradient');
            resultGradient.setAttribute('x1', coreX);
            resultGradient.setAttribute('y1', coreY);
            resultGradient.setAttribute('x2', resultX);
            resultGradient.setAttribute('y2', resultY);

            const resultStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            resultStop1.setAttribute('offset', '0%');
            resultStop1.setAttribute('stop-color', 'rgba(0, 217, 255, 0.8)');

            const resultStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            resultStop2.setAttribute('offset', '100%');
            resultStop2.setAttribute('stop-color', 'rgba(0, 217, 255, 0.2)');

            resultGradient.appendChild(resultStop1);
            resultGradient.appendChild(resultStop2);
            defs.appendChild(resultGradient);

            const resultLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            resultLine.setAttribute('x1', coreX);
            resultLine.setAttribute('y1', coreY);
            resultLine.setAttribute('x2', resultX);
            resultLine.setAttribute('y2', resultY);
            resultLine.setAttribute('stroke', 'url(#resultGradient)');
            resultLine.setAttribute('stroke-width', '2');
            resultLine.style.opacity = '0.8';

            svg.appendChild(resultLine);
        }

        window.addEventListener('resize', updateConnections);
        updateConnections();

        return updateConnections;
    }

    const updateConnections = createConnections();

    // Animate with GSAP if available
    if (window.gsap) {
        // Set initial state
        gsap.set(core, { opacity: 0, scale: 0 });
        gsap.set(orbits, { opacity: 0, scale: 0 });
        gsap.set(nodes, { opacity: 0 });
        gsap.set(result, { opacity: 0, y: 20 });

        // Create scroll-triggered animation
        gsap.timeline({
            scrollTrigger: {
                trigger: ecosystem,
                start: 'top 70%',
                end: 'center center',
                toggleActions: 'play none none reverse',
                onUpdate: updateConnections
            }
        })
            .to(core, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "elastic.out(1, 0.7)"
            })
            .to(orbits, {
                opacity: 0.7,
                scale: 1,
                stagger: 0.2,
                duration: 0.6,
                ease: "power3.out"
            }, "-=0.5")
            .to(nodes, {
                opacity: 1,
                stagger: 0.15,
                duration: 0.6,
                ease: "back.out(1.7)",
                onComplete: updateConnections
            }, "-=0.5")
            .to(result, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out"
            }, "-=0.3");
    }
}

/**=================================
 * Mission & Vision Section Animation
 =================================*/
function initMissionVisionSection() {
    const missionVisionBlocks = document.querySelectorAll('.mission-vision__block');
    if (!missionVisionBlocks.length) return;

    if (window.gsap) {
        missionVisionBlocks.forEach(block => {
            const icon = block.querySelector('.mission-vision__icon');
            const title = block.querySelector('.mission-vision__title');
            const intro = block.querySelector('.mission-vision__intro');
            const quote = block.querySelector('.mission-vision__quote');

            if (!icon || !title || !intro || !quote) return;

            gsap.set([icon, title, intro, quote], { opacity: 0, y: 30 });

            gsap.timeline({
                scrollTrigger: {
                    trigger: block,
                    start: 'top 70%',
                    end: 'center center',
                    toggleActions: 'play none none reverse'
                }
            })
                .to(icon, { opacity: 1, y: 0, duration: 0.6 })
                .to(title, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
                .to(intro, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
                .to(quote, { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" }, "-=0.4");
        });
    }
}

/**=============================
 * Difference Section Animation
 =============================*/
function initDifferenceSection() {
    const differenceBlocks = document.querySelectorAll('.difference__block');
    if (!differenceBlocks.length) return;

    // Add image error handling
    initImageErrorHandling();

    // Animate blocks on scroll with GSAP if available
    if (window.gsap && window.ScrollTrigger) {
        // Animate each block when it scrolls into view
        differenceBlocks.forEach((block, index) => {
            // Calculate stagger delay based on block index
            const delay = index * 0.1;

            // Determine animation direction based on whether it's a reverse block
            const isReverse = block.classList.contains('difference__block--reverse');
            const xOffset = isReverse ? -50 : 50;

            // Set initial state
            gsap.set(block, {
                opacity: 0,
                y: 30,
            });

            // Create content and image elements
            const content = block.querySelector('.difference__block-content');
            const image = block.querySelector('.difference__block-image');

            if (!content || !image) return;

            // Set initial state for content and image
            gsap.set(content, { x: isReverse ? 50 : -50, opacity: 0 });
            gsap.set(image, { x: isReverse ? -50 : 50, opacity: 0 });

            // Create scroll trigger animation
            ScrollTrigger.create({
                trigger: block,
                start: 'top 75%',
                once: false, // Animate every time it scrolls into view
                toggleActions: 'play none none reverse',
                onEnter: () => {
                    // Animate block container
                    gsap.to(block, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        delay: delay
                    });

                    // Animate content
                    gsap.to(content, {
                        x: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out',
                        delay: delay + 0.2
                    });

                    // Animate image
                    gsap.to(image, {
                        x: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out',
                        delay: delay + 0.4
                    });
                }
            });
        });

        // Create a parallax effect for images
        differenceBlocks.forEach(block => {
            const image = block.querySelector('.difference__image');
            if (!image) return;

            gsap.to(image, {
                y: -30,
                ease: 'none',
                scrollTrigger: {
                    trigger: block,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    } else {
        // Fallback for when GSAP is not available
        differenceBlocks.forEach(block => {
            block.style.opacity = 1;
            block.style.transform = 'none';
        });
    }
}

/**============================
 * Image Error Handling
 ============================*/
function initImageErrorHandling() {
    const images = document.querySelectorAll('.difference__image');

    images.forEach(img => {
        // Handle image load errors
        img.addEventListener('error', () => {
            img.classList.add('error');
            const imageContainer = img.closest('.difference__block-image');

            if (imageContainer) {
                // Get alt text to display as fallback
                imageContainer.setAttribute('data-alt', img.alt || 'Image Unavailable');
            }
        });

        // Check if src is empty or undefined
        if (!img.src || img.src === window.location.href) {
            img.classList.add('error');
            const imageContainer = img.closest('.difference__block-image');

            if (imageContainer) {
                imageContainer.setAttribute('data-alt', img.alt || 'Image Unavailable');
            }
        }
    });

    // Create placeholder images for development
    createPlaceholderImages();
}

/**==============================
 * Create Placeholder Images
 ==============================*/
function createPlaceholderImages() {
    const images = document.querySelectorAll('.difference__image');

    images.forEach((img, index) => {
        // Skips if image already has a valid src
        if (img.src && !img.src.endsWith('.jpg') && !img.src.endsWith('.png')) {
            // Creates a canvas to generate a placeholder
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Sets dimensions
            canvas.width = 800;
            canvas.height = 600;

            // Generates colors based on index
            const hue = (index * 30) % 360;

            // Creates gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, `hsla(${hue}, 70%, 30%, 1)`);
            gradient.addColorStop(1, `hsla(${hue + 60}, 70%, 40%, 1)`);

            // Fills background
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Adds some decoration
            for (let i = 0; i < 8; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const size = Math.random() * 50 + 20;

                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${hue + 120}, 70%, 60%, 0.2)`;
                ctx.fill();
            }

            // Adds section name
            ctx.fillStyle = 'white';
            ctx.font = 'bold 36px Poppins, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            let title;
            switch (index) {
                case 0: title = "AI-First Approach"; break;
                case 1: title = "Revenue Ecosystem"; break;
                case 2: title = "Growth Operator Mindset"; break;
                case 3: title = "Relentless Innovation"; break;
                default: title = "NextGen Difference"; break;
            }

            ctx.fillText(title, canvas.width / 2, canvas.height / 2);
            ctx.font = 'normal 24px Poppins, sans-serif';
            ctx.fillText("Image Placeholder", canvas.width / 2, canvas.height / 2 + 50);

            // Replaces image src with canvas data URL
            img.src = canvas.toDataURL('image/jpeg');
        }
    });
}

/**=======================
 * Values Section Animation
 =======================*/
function initValuesSection() {
    const valueCards = document.querySelectorAll('.value-card');
    if (!valueCards.length) return;

    // Add hover effect for desktop
    const isDesktop = window.innerWidth >= 768;

    if (isDesktop) {
        valueCards.forEach(card => {
            const front = card.querySelector('.value-card__front');
            const back = card.querySelector('.value-card__back');

            if (!front || !back) return;

            // Make sure back is initially hidden on mobile
            if (!isDesktop) {
                back.style.display = 'none';
            }

            // Toggle display on click for mobile
            card.addEventListener('click', () => {
                if (!isDesktop) {
                    const isBackVisible = back.style.display !== 'none';
                    back.style.display = isBackVisible ? 'none' : 'flex';
                }
            });
        });
    }

    // Animate with GSAP
    if (window.gsap) {
        gsap.set(valueCards, { opacity: 0, y: 30 });

        gsap.timeline({
            scrollTrigger: {
                trigger: '.values__cards',
                start: 'top 70%',
                end: 'center center',
                toggleActions: 'play none none reverse'
            }
        })
            .to(valueCards, {
                opacity: 1,
                y: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: "back.out(1.2)"
            });
    }
}

/**===================================
 * Team Image Placeholder Function
 ===================================*/
function initTeamImagePlaceholders() {
    const memberImages = document.querySelectorAll('.member__img');

    // Function to handle image loading errors
    function handleImageError(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 200;
        canvas.height = 200;

        // Gets member name from alt attribute
        const name = img.alt || 'Team Member';
        const initials = name.split(' ').map(n => n[0]).join('');

        // Generates a unique color based on name
        const hue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;

        // Creates gradient background
        const gradient = ctx.createLinearGradient(0, 0, 200, 200);
        gradient.addColorStop(0, `hsla(${hue}, 70%, 30%, 1)`);
        gradient.addColorStop(1, `hsla(${hue + 60}, 70%, 40%, 1)`);

        // Fills background
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 200, 200);

        // Adds initials
        ctx.fillStyle = 'white';
        ctx.font = 'bold 72px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, 100, 100);

        // Replaces image src with canvas data URL
        img.src = canvas.toDataURL('image/png');
    }

    // Adds error handler to each image
    memberImages.forEach(img => {
        // Tries to load from src
        img.addEventListener('error', () => handleImageError(img));

        // If src is empty or undefined, generate placeholder immediately
        if (!img.src || img.src === window.location.href) {
            handleImageError(img);
        }
    });
}

/**==============================
 * Adds to Team Section Animation
 ==============================*/
function initTeamSection() {
    const teamLeader = document.querySelector('.team__leader');
    const teamMembers = document.querySelectorAll('.team__grid .team__member');

    initTeamImagePlaceholders();

    if (!teamLeader && !teamMembers.length) return;

    // Animates with GSAP
    if (window.gsap) {
        // Team leader animation
        if (teamLeader) {
            const portrait = teamLeader.querySelector('.team__member-portrait');
            const info = teamLeader.querySelector('.team__member-info');

            if (portrait && info) {
                gsap.set([portrait, info], { opacity: 0, y: 30 });

                gsap.timeline({
                    scrollTrigger: {
                        trigger: teamLeader,
                        start: 'top 70%',
                        end: 'center center',
                        toggleActions: 'play none none reverse'
                    }
                })
                    .to(portrait, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "back.out(1.2)"
                    })
                    .to(info, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power3.out"
                    }, "-=0.5");
            }
        }

        // Team members animation
        if (teamMembers.length) {
            gsap.set(teamMembers, { opacity: 0, y: 30 });

            gsap.timeline({
                scrollTrigger: {
                    trigger: '.team__grid',
                    start: 'top 70%',
                    end: 'center center',
                    toggleActions: 'play none none reverse'
                }
            })
                .to(teamMembers, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.15,
                    duration: 0.8,
                    ease: "back.out(1.2)"
                });
        }

        // Enhanced hover effects for portrait images
        teamMembers.forEach(member => {
            const portrait = member.querySelector('.team__member-portrait');
            const image = member.querySelector('.member__img');

            if (portrait && image) {
                member.addEventListener('mouseenter', () => {
                    gsap.to(portrait, {
                        y: -10,
                        duration: 0.4,
                        ease: "power2.out"
                    });

                    gsap.to(image, {
                        scale: 1.1,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                });

                member.addEventListener('mouseleave', () => {
                    gsap.to(portrait, {
                        y: 0,
                        duration: 0.4,
                        ease: "power2.out"
                    });

                    gsap.to(image, {
                        scale: 1,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                });
            }
        });
    }
}

/**======================
 * Scroll Animations
 ======================*/
function initScrollAnimations() {
    // Uses ScrollReveal if available
    if (window.ScrollReveal) {
        const sr = ScrollReveal({
            distance: '30px',
            duration: 800,
            reset: false,
            easing: 'ease-out',
            origin: 'bottom',
            viewFactor: 0.2
        });

        // Applies to various sections
        sr.reveal('.section__title', { delay: 100 });
        sr.reveal('.mission-vision__block', { interval: 200 });
        sr.reveal('.cta__title', { delay: 100 });
        sr.reveal('.cta__text', { delay: 200 });
        sr.reveal('.form__button', { delay: 300 });
    }

    // Parallax effects with GSAP
    if (window.gsap && window.ScrollTrigger) {
        // Parallax for mission-vision decorations
        const decorations = document.querySelectorAll('.mission-vision__decoration');

        decorations.forEach(decoration => {
            gsap.to(decoration, {
                y: Math.random() < 0.5 ? -30 : 30,
                x: Math.random() < 0.5 ? -20 : 20,
                scrollTrigger: {
                    trigger: '.mission-vision',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });
    }
}

/**===========================
 * Initialize All Functions
 ===========================*/
function initAboutPage() {
    initHeroSection();
    initNarrativeSection();
    initMissionVisionSection();
    initDifferenceSection();
    initValuesSection();
    initTeamImagePlaceholders();
    initTeamSection();
    initScrollAnimations();
}

/**================
 * INITIALIZATION
 ================*/
document.addEventListener('DOMContentLoaded', () => {
    initAboutPage();
});