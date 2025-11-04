// ===================================
// Cyber Threats Intelligence Dashboard
// Tab and Subtab Navigation Script
// Enhanced with Modern Interactions
// Ali Syed - Premium Edition
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializeTabs();
    initializeSubtabs();
    initializeAnimations();
    initializeScrollEffects();
    initializeStatCounters();
    initializeSearch();
    initializeParticles();
    
    console.log('🔒 Cyber Threats Intelligence Dashboard loaded successfully');
    console.log('🎯 Use Alt+Arrow keys to navigate tabs, Ctrl+Arrow keys for subtabs');
});

// Main Tab Functionality
function initializeTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Trigger entrance animation
                targetContent.style.animation = 'none';
                setTimeout(() => {
                    targetContent.style.animation = 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                }, 10);
            }
            
            // Scroll to top of content smoothly
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Reset subtabs to first one when switching main tabs
            if (targetContent) {
                resetSubtabs(targetContent);
            }
            
            // Store current tab in session storage for page refresh
            sessionStorage.setItem('activeTab', targetTab);
            
            // Track event
            trackEvent('Navigation', 'Tab Switch', targetTab);
            
            // Announce to screen readers
            announcePageChange(`Navigated to ${this.textContent} section`);
        });
    });
    
    // Restore last active tab from session storage
    const savedTab = sessionStorage.getItem('activeTab');
    if (savedTab) {
        const savedTabLink = document.querySelector(`[data-tab="${savedTab}"]`);
        if (savedTabLink) {
            savedTabLink.click();
        }
    }
}

// Subtab Functionality
function initializeSubtabs() {
    const subtabButtons = document.querySelectorAll('.subtab-btn');
    
    subtabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSubtab = this.getAttribute('data-subtab');
            const parentTabContent = this.closest('.tab-content');
            
            if (!parentTabContent) return;
            
            // Get all subtab buttons and contents within this tab
            const siblingButtons = parentTabContent.querySelectorAll('.subtab-btn');
            const subtabContents = parentTabContent.querySelectorAll('.subtab-content');
            
            // Remove active class from all subtabs
            siblingButtons.forEach(btn => btn.classList.remove('active'));
            subtabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked subtab
            this.classList.add('active');
            const targetContent = document.getElementById(targetSubtab);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Trigger entrance animation
                targetContent.style.animation = 'none';
                setTimeout(() => {
                    targetContent.style.animation = 'slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                }, 10);
                
                // Smooth scroll to subtab content
                targetContent.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
                
                // Reinitialize stat counters for new content
                initializeStatCounters();
            }
            
            // Store current subtab in session storage
            const activeMainTab = parentTabContent.id;
            sessionStorage.setItem(`activeSubtab_${activeMainTab}`, targetSubtab);
        });
    });
}

// Reset subtabs to first one when switching main tabs
function resetSubtabs(tabContent) {
    const subtabButtons = tabContent.querySelectorAll('.subtab-btn');
    const subtabContents = tabContent.querySelectorAll('.subtab-content');
    
    if (subtabButtons.length > 0) {
        // Check if there's a saved subtab for this main tab
        const savedSubtab = sessionStorage.getItem(`activeSubtab_${tabContent.id}`);
        
        if (savedSubtab) {
            // Restore saved subtab
            const savedButton = tabContent.querySelector(`[data-subtab="${savedSubtab}"]`);
            const savedContent = document.getElementById(savedSubtab);
            
            if (savedButton && savedContent) {
                subtabButtons.forEach(btn => btn.classList.remove('active'));
                subtabContents.forEach(content => content.classList.remove('active'));
                
                savedButton.classList.add('active');
                savedContent.classList.add('active');
                return;
            }
        }
        
        // Default to first subtab if no saved state
        subtabButtons.forEach(btn => btn.classList.remove('active'));
        subtabContents.forEach(content => content.classList.remove('active'));
        
        subtabButtons[0].classList.add('active');
        subtabContents[0].classList.add('active');
    }
}

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    // Arrow key navigation for main tabs
    if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        navigateMainTabs(e.key === 'ArrowRight' ? 1 : -1);
    }
    
    // Arrow key navigation for subtabs
    if (e.ctrlKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        navigateSubtabs(e.key === 'ArrowRight' ? 1 : -1);
    }
});

function navigateMainTabs(direction) {
    const tabLinks = Array.from(document.querySelectorAll('.tab-link'));
    const activeIndex = tabLinks.findIndex(link => link.classList.contains('active'));
    
    if (activeIndex === -1) return;
    
    let newIndex = activeIndex + direction;
    
    // Wrap around
    if (newIndex < 0) newIndex = tabLinks.length - 1;
    if (newIndex >= tabLinks.length) newIndex = 0;
    
    tabLinks[newIndex].click();
}

function navigateSubtabs(direction) {
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;
    
    const subtabButtons = Array.from(activeTab.querySelectorAll('.subtab-btn'));
    if (subtabButtons.length === 0) return;
    
    const activeIndex = subtabButtons.findIndex(btn => btn.classList.contains('active'));
    if (activeIndex === -1) return;
    
    let newIndex = activeIndex + direction;
    
    // Wrap around
    if (newIndex < 0) newIndex = subtabButtons.length - 1;
    if (newIndex >= subtabButtons.length) newIndex = 0;
    
    subtabButtons[newIndex].click();
}

// Initialize Animations
function initializeAnimations() {
    // Add entrance animations to cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all threat cards and attack entries
    document.querySelectorAll('.threat-card, .attack-entry').forEach(el => {
        observer.observe(el);
    });
}

// Initialize Scroll Effects
function initializeScrollEffects() {
    let lastScroll = 0;
    const header = document.querySelector('header');
    const nav = document.querySelector('.main-nav');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow to header on scroll
        if (currentScroll > 50) {
            header.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 100px rgba(255, 46, 99, 0.2)';
            nav.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.6)';
        } else {
            header.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 100px rgba(255, 46, 99, 0.1)';
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
        }
        
        lastScroll = currentScroll;
    });
}

// Initialize Stat Counters with Animation
function initializeStatCounters() {
    const statBadges = document.querySelectorAll('.stat-badge');
    
    statBadges.forEach(badge => {
        // Extract numbers from badge text
        const text = badge.textContent;
        const numbers = text.match(/[\d,.]+/g);
        
        if (numbers) {
            // Add pulse animation to badges with numbers
            badge.style.animation = 'badgePulse 2s ease-in-out infinite';
        }
    });
}

// Initialize Search Functionality
function initializeSearch() {
    // Create search bar if it doesn't exist
    let searchBar = document.getElementById('dashboard-search');
    
    if (!searchBar) {
        searchBar = document.createElement('div');
        searchBar.id = 'dashboard-search';
        searchBar.innerHTML = `
            <input type="text" 
                   id="search-input" 
                   placeholder="🔍 Search threats, incidents, tools..." 
                   style="width: 100%; 
                          padding: 0.75rem 1.5rem; 
                          background: rgba(26, 31, 58, 0.8); 
                          border: 2px solid var(--border-color); 
                          border-radius: 25px; 
                          color: var(--text-color); 
                          font-size: 1rem;
                          backdrop-filter: blur(10px);
                          transition: all 0.3s ease;">
        `;
        
        const mainNav = document.querySelector('.main-nav .container');
        if (mainNav) {
            mainNav.appendChild(searchBar);
        }
    }
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        // Add focus effects
        searchInput.addEventListener('focus', function() {
            this.style.borderColor = 'var(--success-color)';
            this.style.boxShadow = '0 0 20px var(--glow-primary)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.style.borderColor = 'var(--border-color)';
            this.style.boxShadow = 'none';
        });
        
        // Search functionality
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase().trim();
                performSearch(searchTerm);
            }, 300);
        });
    }
}

function performSearch(searchTerm) {
    const allContent = document.querySelectorAll('.threat-card, .attack-entry, .subtab-content h3, .subtab-content h4, .subtab-content h5');
    
    if (!searchTerm) {
        // Show all content
        allContent.forEach(element => {
            element.style.display = '';
            element.style.backgroundColor = '';
        });
        return;
    }
    
    let matchCount = 0;
    
    allContent.forEach(element => {
        const text = element.textContent.toLowerCase();
        
        if (text.includes(searchTerm)) {
            element.style.display = '';
            element.style.backgroundColor = 'rgba(0, 245, 255, 0.1)';
            element.style.transition = 'background-color 0.3s ease';
            matchCount++;
            
            // Scroll to first match
            if (matchCount === 1) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            element.style.display = 'none';
        }
    });
    
    // Show notification
    showNotification(matchCount > 0 ? 
        `Found ${matchCount} match${matchCount !== 1 ? 'es' : ''}` : 
        'No matches found'
    );
}

// Show Notification
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.search-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'search-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--gradient-3);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Initialize Particle Background Effect
function initializeParticles() {
    // Create canvas for particles
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        opacity: 0.3;
    `;
    document.body.prepend(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.fillStyle = 'rgba(0, 245, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.strokeStyle = `rgba(0, 245, 255, ${0.2 * (1 - distance / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Print Functionality
function printCurrentTab() {
    window.print();
}

// Export Data Functionality
function exportTabData(format = 'text') {
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;
    
    const title = activeTab.querySelector('h2').textContent;
    const content = activeTab.innerText;
    
    if (format === 'text') {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('✅ Data exported successfully!');
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navTabs = document.querySelector('.nav-tabs');
    if (navTabs) {
        navTabs.classList.toggle('mobile-open');
    }
}

// Dark Mode Toggle (Optional Enhancement)
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    const isDarkMode = !document.body.classList.contains('light-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    showNotification(isDarkMode ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
}

// Restore dark mode preference
function restoreDarkModePreference() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'false') {
        document.body.classList.add('light-mode');
    }
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Performance Monitoring
const perfData = window.performance.timing;
const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

if (pageLoadTime > 0) {
    console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
}

// Analytics Event Tracking (Placeholder)
function trackEvent(category, action, label) {
    console.log(`📊 Event: ${category} - ${action} - ${label}`);
    // Integration with analytics service would go here
    // Example: gtag('event', action, { 'event_category': category, 'event_label': label });
}

// Track tab switches for analytics
document.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        trackEvent('Navigation', 'Tab Switch', tabName);
    });
});

// Error Handling
window.addEventListener('error', function(e) {
    console.error('❌ JavaScript Error:', e.message);
    // Optional: Send error to logging service
});

// Accessibility: Announce page changes to screen readers
function announcePageChange(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    announcement.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    `;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Add announcement when tabs change
document.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', function() {
        const tabName = this.textContent;
        announcePageChange(`Navigated to ${tabName} section`);
    });
});

// Badge Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const badges = document.querySelectorAll('.stat-badge, .episode-badge');
    
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(2deg)';
            this.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
});

// Copy to Clipboard Functionality for Code/Stats
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('📋 Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('❌ Failed to copy');
    });
}

// Add copy buttons to stat badges (optional)
document.addEventListener('DOMContentLoaded', function() {
    const statBadges = document.querySelectorAll('.stat-badge');
    
    statBadges.forEach(badge => {
        badge.style.cursor = 'pointer';
        badge.title = 'Click to copy';
        
        badge.addEventListener('click', function() {
            copyToClipboard(this.textContent);
        });
    });
});

// Lazy Loading Images (if images are added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize all features on load
restoreDarkModePreference();
lazyLoadImages();

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    .mobile-open {
        display: flex !important;
        flex-direction: column;
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts helper
document.addEventListener('keydown', function(e) {
    // Press '?' to show keyboard shortcuts
    if (e.key === '?' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        showKeyboardShortcuts();
    }
    
    // Press 'Esc' to close search highlights
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
            performSearch('');
        }
    }
});

function showKeyboardShortcuts() {
    const shortcuts = `
    ⌨️ KEYBOARD SHORTCUTS:
    
    Alt + ← / → : Navigate main tabs
    Ctrl + ← / → : Navigate subtabs
    ? : Show this help
    Esc : Clear search
    
    🔍 SEARCH TIPS:
    - Type to search across all content
    - Results highlight automatically
    - Press Esc to clear
    `;
    
    showNotification(shortcuts);
}

console.log('✨ All scripts initialized successfully!');
console.log('💡 Press "?" for keyboard shortcuts');
console.log('🎨 Enhanced features: Search, Animations, Particles, and more!');
