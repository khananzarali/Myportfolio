// Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Create mailto link with form data
        const mailtoLink = `mailto:anzarali2003@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        
        window.location.href = mailtoLink;
        
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
}

// Loading Screen
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 500);
});

// Scroll Progress Indicator
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
    
    // Update ARIA attribute
    if (scrollProgress) {
        scrollProgress.setAttribute('aria-valuenow', Math.round(scrolled));
    }
});

// Animated Counters for About Section
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
};

// Intersection Observer for animated counters
const aboutSection = document.getElementById('about');
if (aboutSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(aboutSection);
}

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const html = document.documentElement;

// Check for saved theme preference or system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Apply saved theme or system preference
if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
} else if (systemPrefersDark) {
    html.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
}

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Update ARIA pressed state
    themeToggle.setAttribute('aria-pressed', newTheme === 'dark');
});

// View Counter (using localStorage for demo - replace with real analytics in production)
const viewCountEl = document.getElementById('visitor-count');

function updateViewCount() {
    let count = localStorage.getItem('portfolioViews');
    if (!count) {
        count = 0;
    }
    
    // Increment count (simulate unique visitors)
    const sessionKey = 'portfolio_session_' + new Date().toDateString();
    if (!sessionStorage.getItem(sessionKey)) {
        count = parseInt(count) + 1;
        localStorage.setItem('portfolioViews', count);
        sessionStorage.setItem(sessionKey, 'true');
    }
    
    viewCountEl.textContent = count.toLocaleString();
}

updateViewCount();

// Three.js Animation
let scene, camera, renderer, particles;
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
const canvas = document.getElementById('three-canvas');

// Track mouse movement
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

function initThree() {
    if (typeof THREE === 'undefined') return;
    
    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create particles
    const geometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x6366f1,
        transparent: true,
        opacity: 0.8
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation
    animateThree();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animateThree() {
    requestAnimationFrame(animateThree);
    
    if (particles) {
        // Smooth rotation based on mouse position
        targetRotationX = mouseY * 0.5;
        targetRotationY = mouseX * 0.5;
        
        particles.rotation.x += (targetRotationX - particles.rotation.x) * 0.02;
        particles.rotation.y += (targetRotationY - particles.rotation.y) * 0.02;
        
        // Auto rotation
        particles.rotation.y += 0.0005;
    }
    
    renderer.render(scene, camera);
}

// Initialize Three.js when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThree);
} else {
    initThree();
}

// Easter Eggs
const easterEggTrigger = document.getElementById('easter-egg-trigger');
let clickCount = 0;
let clickTimer = null;

easterEggTrigger.addEventListener('click', () => {
    clickCount++;
    
    if (clickTimer) {
        clearTimeout(clickTimer);
    }
    
    clickTimer = setTimeout(() => {
        clickCount = 0;
    }, 2000);
    
    if (clickCount === 5) {
        triggerEasterEgg();
        clickCount = 0;
    }
});

function triggerEasterEgg() {
    // Create a fun effect
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
    const body = document.body;
    
    body.style.transition = 'background-color 0.5s ease';
    
    let colorIndex = 0;
    const colorInterval = setInterval(() => {
        body.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
        
        if (colorIndex === 0) {
            clearInterval(colorInterval);
            body.style.backgroundColor = '';
        }
    }, 200);
    
    // Show alert
    setTimeout(() => {
        alert('🎉 You found the easter egg! 🐰\n\nHint: Try pressing "K" on your keyboard...');
    }, 500);
}

// Konami code easter egg
let konamiCode = [];
const konamiPattern = ['k', 'e', 'y'];
let isKonamiActive = false;

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    if (key === 'k') {
        if (!isKonamiActive) {
            konamiCode = [key];
            isKonamiActive = true;
            
            setTimeout(() => {
                isKonamiActive = false;
                konamiCode = [];
            }, 2000);
        } else {
            konamiCode.push(key);
        }
    } else if (key === 'e' && isKonamiActive) {
        konamiCode.push(key);
    } else if (key === 'y' && isKonamiActive && konamiCode.length === 2) {
        konamiCode.push(key);
        if (konamiCode.join('') === 'key') {
            triggerKonamiEasterEgg();
            konamiCode = [];
            isKonamiActive = false;
        }
    } else {
        isKonamiActive = false;
        konamiCode = [];
    }
});

function triggerKonamiEasterEgg() {
    // Create floating emojis
    const emojis = ['🚀', '⭐', '💻', '🎉', '🔥', '💡', '🎯', '🏆'];
    
    for (let i = 0; i < 20; i++) {
        const emoji = document.createElement('div');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}vw;
            top: -50px;
            font-size: ${Math.random() * 2 + 1}rem;
            pointer-events: none;
            z-index: 9999;
            animation: fall ${Math.random() * 2 + 3}s linear forwards;
        `;
        document.body.appendChild(emoji);
        
        setTimeout(() => emoji.remove(), 5000);
    }
    
    // Add falling animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Lazy loading images (if you add images later)
if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    console.log('Native lazy loading supported');
} else {
    // Fallback for older browsers
    console.log('Using fallback lazy loading');
}

// Performance monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
            console.log(`${entry.name}: ${entry.duration.toFixed(2)}ms`);
        });
    });
    
    observer.observe({ entryTypes: ['paint'] });
}

// Project Search and Sort Functionality
(function() {
    const projectSearch = document.getElementById('project-search');
    const projectSort = document.getElementById('project-sort');
    const projectsGrid = document.getElementById('projects-grid');
    const resultsCount = document.querySelector('.results-count');
    
    if (!projectSearch || !projectSort || !projectsGrid) return;
    
    // Get all project cards
    function getProjectCards() {
        return projectsGrid.querySelectorAll('.project-card');
    }
    
    // Get all tech tags from a card
    function getTechTags(card) {
        const tags = card.querySelectorAll('.tech-tag');
        return Array.from(tags).map(tag => tag.textContent.toLowerCase());
    }
    
    // Filter projects by search term
    function filterProjects(searchTerm) {
        const cards = getProjectCards();
        let visibleCount = 0;
        
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const techTags = getTechTags(card).join(' ');
            
            const searchString = `${title} ${description} ${techTags}`;
            const isVisible = searchString.includes(searchTerm.toLowerCase());
            
            card.style.display = isVisible ? '' : 'none';
            if (isVisible) visibleCount++;
        });
        
        // Update results count
        if (resultsCount) {
            if (searchTerm.trim() === '') {
                resultsCount.textContent = `Showing all ${cards.length} projects`;
            } else {
                resultsCount.textContent = `Found ${visibleCount} project${visibleCount !== 1 ? 's' : ''} matching "${searchTerm}"`;
            }
        }
        
        return visibleCount;
    }
    
    // Sort projects
    function sortProjects(sortValue) {
        const cards = Array.from(getProjectCards());
        
        cards.sort((a, b) => {
            const titleA = a.querySelector('h3').textContent;
            const titleB = b.querySelector('h3').textContent;
            
            switch (sortValue) {
                case 'name-asc':
                    return titleA.localeCompare(titleB);
                case 'name-desc':
                    return titleB.localeCompare(titleA);
                case 'tech':
                    const techA = getTechTags(a).join(' ');
                    const techB = getTechTags(b).join(' ');
                    return techA.localeCompare(techB);
                default:
                    return 0;
            }
        });
        
        // Re-append cards in sorted order
        cards.forEach(card => projectsGrid.appendChild(card));
    }
    
    // Search input handler with debounce
    let searchTimeout;
    projectSearch.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value;
            const visibleCount = filterProjects(searchTerm);
            
            // Show no results message if needed
            const existingNoResults = projectsGrid.querySelector('.no-results');
            if (visibleCount === 0 && searchTerm.trim() !== '') {
                if (!existingNoResults) {
                    const noResults = document.createElement('div');
                    noResults.className = 'no-results';
                    noResults.innerHTML = `
                        <h3>No projects found</h3>
                        <p>Try adjusting your search terms</p>
                    `;
                    projectsGrid.appendChild(noResults);
                }
            } else if (existingNoResults) {
                existingNoResults.remove();
            }
        }, 200);
    });
    
    // Sort handler
    projectSort.addEventListener('change', (e) => {
        const sortValue = e.target.value;
        sortProjects(sortValue);
        
        // Re-apply search filter after sorting
        const searchTerm = projectSearch.value;
        if (searchTerm.trim() !== '') {
            filterProjects(searchTerm);
        }
    });
    
    // Initialize results count
    if (resultsCount) {
        resultsCount.textContent = `Showing all ${getProjectCards().length} projects`;
    }
})();

// Project Modal Functionality
(function() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;
    
    const modalTitle = document.getElementById('modal-title');
    const modalProblem = document.getElementById('modal-problem');
    const modalRole = document.getElementById('modal-role');
    const modalProcess = document.getElementById('modal-process');
    const modalTech = document.getElementById('modal-tech');
    const modalResults = document.getElementById('modal-results');
    const modalGithub = document.getElementById('modal-github');
    const modalDemo = document.getElementById('modal-demo');
    const modalClose = document.querySelector('.modal-close');
    
    // Project data
    const projectData = {
        ecommerce: {
            title: 'E-Commerce Platform',
            problem: 'Customers needed a seamless online shopping experience with secure payment processing and inventory management.',
            role: 'Full Stack Developer - Designed and implemented the entire platform from scratch, including user authentication, product catalog, shopping cart, and checkout functionality.',
            process: 'Started with requirements gathering, then created wireframes and mockups. Implemented the backend API with Node.js and MongoDB, then built the React frontend with responsive design.',
            tech: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'Stripe API'],
            results: 'Achieved 40% increase in conversion rate and reduced page load time by 60%. Platform handles 1000+ daily orders.',
            github: '#',
            demo: '#'
        },
        taskmanager: {
            title: 'Task Management App',
            problem: 'Teams needed a collaborative tool to manage projects, assign tasks, and track progress in real-time.',
            role: 'Lead Developer - Built the entire application including real-time collaboration features, user management, and task tracking.',
            process: 'Designed RESTful API with Python and Django. Implemented real-time updates using Firebase. Built responsive Vue.js frontend.',
            tech: ['Vue.js', 'Python', 'Django', 'Firebase', 'Vuex', 'SCSS'],
            results: 'Adopted by 50+ teams with 95% user satisfaction rating. Improved team productivity by 30%.',
            github: '#',
            demo: '#'
        },
        portfolio: {
            title: 'Portfolio Website',
            problem: 'Needed a professional portfolio to showcase skills, projects, and attract potential employers.',
            role: 'Developer - Designed and built a modern, accessible, and performant portfolio website.',
            process: 'Started with wireframes and design system. Implemented with vanilla HTML/CSS/JS for maximum performance. Added Three.js for visual effects.',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'Three.js', 'Accessibility'],
            results: 'Achieved 95+ Lighthouse performance score. Fully accessible (WCAG compliant). Responsive across all devices.',
            github: '#',
            demo: '#'
        },
        qaframework: {
            title: 'QA Automation Framework',
            problem: 'Manual testing was time-consuming and error-prone. Needed an automated testing solution.',
            role: 'QA Engineer - Designed and implemented a comprehensive automation framework.',
            process: 'Evaluated testing tools and selected Playwright. Created reusable test components, integrated with CI/CD pipeline.',
            tech: ['Playwright', 'JavaScript', 'GitHub Actions', 'CI/CD', 'API Testing'],
            results: 'Reduced testing time by 70%. Increased test coverage from 40% to 90%. Caught 50+ critical bugs before production.',
            github: '#',
            demo: '#'
        }
    };
    
    // Open modal
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectKey = btn.getAttribute('data-project');
            const project = projectData[projectKey];
            
            if (project) {
                modalTitle.textContent = project.title;
                modalProblem.textContent = project.problem;
                modalRole.textContent = project.role;
                modalProcess.textContent = project.process;
                modalResults.textContent = project.results;
                
                modalTech.innerHTML = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
                modalGithub.href = project.github;
                modalDemo.href = project.demo;
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Focus trap for accessibility
                modalClose.focus();
            }
        });
    });
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
})();

console.log('Portfolio loaded successfully! 🚀');
