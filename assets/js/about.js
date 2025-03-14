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
    const tabs = document.querySelectorAll('.difference__tab');
    const panels = document.querySelectorAll('.difference__tab-panel');

    if (!tabs.length || !panels.length) return;

    // Initialize tab functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            const targetPanel = document.getElementById(tabId);

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active panel
            panels.forEach(p => p.classList.remove('active'));
            targetPanel.classList.add('active');

            // Initialize the specific visual for this tab
            initTabVisual(tabId);
        });
    });

    // Initialize AI visual
    function initAIVisual() {
        const aiVisual = document.querySelector('.ai-visual');
        if (!aiVisual) return;

        // Clear existing nodes
        const existingNodes = aiVisual.querySelectorAll('.ai-node:not(.ai-node--center)');
        existingNodes.forEach(node => node.remove());

        // Create nodes
        for (let i = 0; i < 20; i++) {
            const node = document.createElement('div');
            node.classList.add('ai-node');

            // Random size
            const size = Math.random() * 10 + 5;
            node.style.width = `${size}px`;
            node.style.height = `${size}px`;

            // Random position
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 120 + 40;
            const x = 50 + Math.cos(angle) * distance;
            const y = 50 + Math.sin(angle) * distance;

            node.style.left = `${x}%`;
            node.style.top = `${y}%`;
            node.style.opacity = '0';
            node.style.transform = 'scale(0)';

            aiVisual.appendChild(node);
        }

        // Create canvas for connections
        const connectionsContainer = aiVisual.querySelector('.ai-connections');
        if (connectionsContainer) {
            const canvas = document.createElement('canvas');
            canvas.width = connectionsContainer.offsetWidth;
            canvas.height = connectionsContainer.offsetHeight;
            connectionsContainer.appendChild(canvas);

            const ctx = canvas.getContext('2d');

            function drawConnections() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Get center position
                const center = aiVisual.querySelector('.ai-node--center');
                if (!center) return;

                const centerRect = center.getBoundingClientRect();
                const containerRect = connectionsContainer.getBoundingClientRect();

                const centerX = centerRect.left + centerRect.width / 2 - containerRect.left;
                const centerY = centerRect.top + centerRect.height / 2 - containerRect.top;

                // Get nodes
                const nodes = aiVisual.querySelectorAll('.ai-node:not(.ai-node--center)');

                // Draw connections
                nodes.forEach(node => {
                    if (window.getComputedStyle(node).opacity > 0.1) {
                        const nodeRect = node.getBoundingClientRect();
                        const nodeX = nodeRect.left + nodeRect.width / 2 - containerRect.left;
                        const nodeY = nodeRect.top + nodeRect.height / 2 - containerRect.top;

                        // Create gradient
                        const gradient = ctx.createLinearGradient(centerX, centerY, nodeX, nodeY);
                        gradient.addColorStop(0, 'rgba(0, 85, 255, 0.6)');
                        gradient.addColorStop(1, 'rgba(0, 85, 255, 0.1)');

                        // Draw line
                        ctx.beginPath();
                        ctx.moveTo(centerX, centerY);
                        ctx.lineTo(nodeX, nodeY);
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            }

            // Animate with GSAP
            if (window.gsap) {
                const nodes = aiVisual.querySelectorAll('.ai-node:not(.ai-node--center)');
                const center = aiVisual.querySelector('.ai-node--center');

                gsap.set(center, { opacity: 0, scale: 0 });

                gsap.to(center, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.7)",
                    onComplete: () => {
                        gsap.to(nodes, {
                            opacity: 0.7,
                            scale: 1,
                            stagger: 0.03,
                            duration: 0.4,
                            ease: "power2.out",
                            onUpdate: drawConnections
                        });
                    }
                });

                // Pulse animation for center node
                gsap.to(center, {
                    boxShadow: '0 0 30px rgba(0, 85, 255, 0.7)',
                    repeat: -1,
                    yoyo: true,
                    duration: 1.5
                });
            }

            // Handle window resize
            window.addEventListener('resize', () => {
                canvas.width = connectionsContainer.offsetWidth;
                canvas.height = connectionsContainer.offsetHeight;
                drawConnections();
            });
        }
    }

    // Initialize Ecosystem visual
    function initEcosystemVisual() {
        const ecosystemVisual = document.querySelector('.ecosystem-visual');
        if (!ecosystemVisual) return;

        // Create nodes
        const connectionsContainer = ecosystemVisual.querySelector('.ecosystem-connections');
        if (!connectionsContainer) return;

        // Create orbits
        for (let i = 0; i < 3; i++) {
            const orbit = document.createElement('div');
            orbit.classList.add('ecosystem-orbit');
            orbit.style.position = 'absolute';
            orbit.style.top = '50%';
            orbit.style.left = '50%';
            orbit.style.width = `${(i + 1) * 70 + 50}px`;
            orbit.style.height = `${(i + 1) * 70 + 50}px`;
            orbit.style.borderRadius = '50%';
            orbit.style.border = '1px dashed rgba(0, 85, 255, 0.2)';
            orbit.style.transform = 'translate(-50%, -50%)';
            orbit.style.opacity = '0';

            connectionsContainer.appendChild(orbit);
        }

        // Create nodes on orbits
        for (let i = 0; i < 6; i++) {
            const node = document.createElement('div');
            node.classList.add('ecosystem-node');
            node.style.position = 'absolute';
            node.style.width = '12px';
            node.style.height = '12px';
            node.style.borderRadius = '50%';
            node.style.backgroundColor = 'rgba(0, 217, 255, 0.8)';

            // Position around different orbits
            const angle = (i / 6) * Math.PI * 2;
            const orbitRadius = 80 + (i % 3) * 50;
            node.style.top = `calc(50% + ${Math.sin(angle) * orbitRadius}px)`;
            node.style.left = `calc(50% + ${Math.cos(angle) * orbitRadius}px)`;
            node.style.transform = 'translate(-50%, -50%)';
            node.style.opacity = '0';

            connectionsContainer.appendChild(node);
        }

        // Create canvas for connections
        const canvas = document.createElement('canvas');
        canvas.width = connectionsContainer.offsetWidth;
        canvas.height = connectionsContainer.offsetHeight;
        connectionsContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        function drawConnections() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const core = ecosystemVisual.querySelector('.ecosystem-core');
            if (!core) return;

            const coreRect = core.getBoundingClientRect();
            const containerRect = connectionsContainer.getBoundingClientRect();

            const coreX = coreRect.left + coreRect.width / 2 - containerRect.left;
            const coreY = coreRect.top + coreRect.height / 2 - containerRect.top;

            // Get nodes
            const nodes = connectionsContainer.querySelectorAll('.ecosystem-node');

            // Draw connections
            nodes.forEach(node => {
                if (window.getComputedStyle(node).opacity > 0.1) {
                    const nodeRect = node.getBoundingClientRect();
                    const nodeX = nodeRect.left + nodeRect.width / 2 - containerRect.left;
                    const nodeY = nodeRect.top + nodeRect.height / 2 - containerRect.top;

                    // Create gradient
                    const gradient = ctx.createLinearGradient(coreX, coreY, nodeX, nodeY);
                    gradient.addColorStop(0, 'rgba(0, 217, 255, 0.6)');
                    gradient.addColorStop(1, 'rgba(0, 217, 255, 0.1)');

                    // Draw line
                    ctx.beginPath();
                    ctx.moveTo(coreX, coreY);
                    ctx.lineTo(nodeX, nodeY);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        }

        // Animate with GSAP
        if (window.gsap) {
            const core = ecosystemVisual.querySelector('.ecosystem-core');
            const orbits = connectionsContainer.querySelectorAll('.ecosystem-orbit');
            const nodes = connectionsContainer.querySelectorAll('.ecosystem-node');

            gsap.set(core, { opacity: 0, scale: 0 });

            gsap.to(core, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "elastic.out(1, 0.7)",
                onComplete: () => {
                    gsap.to(orbits, {
                        opacity: 0.7,
                        stagger: 0.15,
                        duration: 0.6
                    });

                    gsap.to(nodes, {
                        opacity: 0.8,
                        stagger: 0.1,
                        duration: 0.6,
                        onUpdate: drawConnections
                    });
                }
            });

            // Rotate orbits
            orbits.forEach((orbit, index) => {
                gsap.to(orbit, {
                    rotation: 360,
                    transformOrigin: 'center center',
                    repeat: -1,
                    duration: 20 + index * 10,
                    ease: "none"
                });
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = connectionsContainer.offsetWidth;
            canvas.height = connectionsContainer.offsetHeight;
            drawConnections();
        });
    }

    // Initialize Growth visual
    function initGrowthVisual() {
        const growthVisual = document.querySelector('.growth-visual');
        if (!growthVisual) return;

        const chart = growthVisual.querySelector('.growth-chart');
        const bar = chart?.querySelector('.growth-chart__bar');
        const line = chart?.querySelector('.growth-chart__line');

        if (!chart || !bar || !line) return;

        // Animate with GSAP
        if (window.gsap) {
            gsap.set(bar, { width: 0 });
            gsap.set(line, { clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' });

            gsap.to(bar, {
                width: '80%',
                duration: 1.5,
                ease: "power3.out"
            });

            gsap.to(line, {
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
                duration: 1.5,
                ease: "power3.out"
            });
        }
    }

    // Initialize Innovation visual
    function initInnovationVisual() {
        const innovationVisual = document.querySelector('.innovation-visual');
        if (!innovationVisual) return;

        const cycle = innovationVisual.querySelector('.innovation-cycle');
        const segments = cycle?.querySelectorAll('.cycle-segment');
        const center = cycle?.querySelector('.cycle-center');

        if (!cycle || !segments.length || !center) return;

        // Animate with GSAP
        if (window.gsap) {
            gsap.set(segments, { opacity: 0, scale: 0.8 });
            gsap.set(center, { opacity: 0, scale: 0 });

            gsap.to(center, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "elastic.out(1, 0.7)",
                onComplete: () => {
                    gsap.to(segments, {
                        opacity: 1,
                        scale: 1,
                        stagger: 0.15,
                        duration: 0.6,
                        ease: "back.out(1.7)"
                    });
                }
            });

            // Pulse animation for center
            gsap.to(center, {
                boxShadow: '0 0 25px rgba(0, 85, 255, 0.6)',
                repeat: -1,
                yoyo: true,
                duration: 1.5
            });
        }
    }

    // Initialize the visual for a specific tab
    function initTabVisual(tabId) {
        switch (tabId) {
            case 'tab-1':
                initAIVisual();
                break;
            case 'tab-2':
                initEcosystemVisual();
                break;
            case 'tab-3':
                initGrowthVisual();
                break;
            case 'tab-4':
                initInnovationVisual();
                break;
        }
    }

    // Initialize first tab
    initTabVisual('tab-1');
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
    // Get all member images
    const memberImages = document.querySelectorAll('.member__img');

    // Function to handle image loading errors
    function handleImageError(img) {
        // Create canvas for placeholder
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions
        canvas.width = 200;
        canvas.height = 200;

        // Get member name from alt attribute
        const name = img.alt || 'Team Member';
        const initials = name.split(' ').map(n => n[0]).join('');

        // Generate a unique color based on name
        const hue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;

        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 200, 200);
        gradient.addColorStop(0, `hsla(${hue}, 70%, 30%, 1)`);
        gradient.addColorStop(1, `hsla(${hue + 60}, 70%, 40%, 1)`);

        // Fill background
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 200, 200);

        // Add initials
        ctx.fillStyle = 'white';
        ctx.font = 'bold 72px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, 100, 100);

        // Replace image src with canvas data URL
        img.src = canvas.toDataURL('image/png');
    }

    // Add error handler to each image
    memberImages.forEach(img => {
        // Try to load from src
        img.addEventListener('error', () => handleImageError(img));

        // If src is empty or undefined, generate placeholder immediately
        if (!img.src || img.src === window.location.href) {
            handleImageError(img);
        }
    });
}

/**==============================
 * Add to Team Section Animation
 ==============================*/
function initTeamSection() {
    const teamLeader = document.querySelector('.team__leader');
    const teamMembers = document.querySelectorAll('.team__grid .team__member');

    // Initialize placeholders for missing images
    initTeamImagePlaceholders();

    if (!teamLeader && !teamMembers.length) return;

    // Animate with GSAP
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