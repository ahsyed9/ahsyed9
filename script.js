// ===================================
// Cyber Threats Intelligence Dashboard
// Tab and Subtab Navigation Script
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializeTabs();
    initializeSubtabs();
    
    console.log('Cyber Threats Intelligence Dashboard loaded successfully');
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
            document.getElementById(targetTab).classList.add('active');
            
            // Scroll to top of content smoothly
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Reset subtabs to first one when switching main tabs
            const activeTabContent = document.getElementById(targetTab);
            if (activeTabContent) {
                resetSubtabs(activeTabContent);
            }
            
            // Store current tab in session storage for page refresh
            sessionStorage.setItem('activeTab', targetTab);
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
                
                // Smooth scroll to subtab content
                targetContent.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
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

// Search Functionality (Optional Enhancement)
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const allContent = document.querySelectorAll('.threat-card, .attack-entry');
        
        allContent.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                element.style.display = 'block';
                highlightText(element, searchTerm);
            } else {
                element.style.display = 'none';
            }
        });
    });
}

function highlightText(element, searchTerm) {
    // Simple text highlighting (can be enhanced)
    if (!searchTerm) return;
    
    const text = element.innerHTML;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    element.innerHTML = text.replace(regex, '<mark>$1</mark>');
}

// Print Functionality
function printCurrentTab() {
    window.print();
}

// Export Data Functionality (Optional)
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
        a.download = `${title.replace(/\s+/g, '_')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Scroll Progress Indicator
window.addEventListener('scroll', function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // Optional: Add a progress bar element to HTML and update it here
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
});

// Mobile Menu Toggle (if needed)
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

console.log(`Page loaded in ${pageLoadTime}ms`);

// Analytics Event Tracking (Placeholder)
function trackEvent(category, action, label) {
    console.log(`Event: ${category} - ${action} - ${label}`);
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
    console.error('JavaScript Error:', e.message);
    // Optional: Send error to logging service
});

// Accessibility: Announce page changes to screen readers
function announcePageChange(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
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

// Table of Contents Generator (Optional)
function generateTableOfContents() {
    const toc = document.getElementById('table-of-contents');
    if (!toc) return;
    
    const headings = document.querySelectorAll('.tab-content h3, .tab-content h4');
    const tocList = document.createElement('ul');
    
    headings.forEach((heading, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        
        heading.id = heading.id || `heading-${index}`;
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent;
        
        li.appendChild(a);
        tocList.appendChild(li);
    });
    
    toc.appendChild(tocList);
}

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

// Initialize all optional features
// Uncomment as needed:
// restoreDarkModePreference();
// lazyLoadImages();

console.log('All scripts initialized. Use Alt+Arrow keys to navigate tabs, Ctrl+Arrow keys for subtabs.');
