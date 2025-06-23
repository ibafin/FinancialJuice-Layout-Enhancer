// Keep track of whether we've already moved the sidebar
let sidebarMoved = false;

// Function to reorganize prep articles
function reorganizePrepArticles(earnings) {
    if (!earnings) return;

    // Find all the article sections
    const content = earnings.innerHTML;
    
    // Create a new container for the prep articles
    const prepContainer = document.createElement('div');
    prepContainer.className = 'prep-articles-container';

    // Extract and reorganize the content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    
    // Get all p elements that contain the articles
    const articles = doc.querySelectorAll('p');
    articles.forEach(article => {
        if (article.textContent.trim()) {
            const newP = document.createElement('p');
            newP.innerHTML = article.innerHTML;
            prepContainer.appendChild(newP);
        }
    });

    // Clear the original content and append the reorganized content
    earnings.innerHTML = '';
    earnings.appendChild(prepContainer);
}

// Function to move specific sidebar items to top
function moveSidebarToTop() {
    // Don't run if we've already moved the sidebar
    if (sidebarMoved) return;

    // Find the specific sidebar
    const sidebar = document.querySelector('aside.col-md-3.col-lg-2.hidden-xs.hidden-sm');
    if (!sidebar) return;

    // Create top bar container if it doesn't exist
    let topBarContainer = document.querySelector('.top-bar-container');
    if (!topBarContainer) {
        topBarContainer = document.createElement('div');
        topBarContainer.className = 'top-bar-container';
        
        // Find the main content container
        const mainContent = document.querySelector('.container-fluid');
        if (mainContent) {
            // Insert the top bar after the header navigation
            const headerNav = document.querySelector('header nav');
            if (headerNav) {
                headerNav.parentNode.insertBefore(topBarContainer, headerNav.nextSibling);
            } else {
                mainContent.parentNode.insertBefore(topBarContainer, mainContent);
            }
        }
    }

    try {
        // Get all sidebar elements
        const voicePlayer = sidebar.querySelector('.voice-player');  // Audio Streaming
        const tsWidget = sidebar.querySelector('.ts-widget');  // Tickstrike
        const trumpSchedule = sidebar.querySelector('#ctl00_ContentPlaceHolder1_RightSide1_trumpSchedule');  // Trump's Schedule
        const earnings = sidebar.querySelector('#ctl00_ContentPlaceHolder1_RightSide1_earnings');  // Contains prep articles

        // Create a wrapper for the top bar widgets
        const widgetWrapper = document.createElement('div');
        widgetWrapper.className = 'widget-wrapper';
        
        // Move only specific items to the top bar
        if (voicePlayer) widgetWrapper.appendChild(voicePlayer);
        if (tsWidget) widgetWrapper.appendChild(tsWidget);
        if (trumpSchedule) widgetWrapper.appendChild(trumpSchedule);
        
        // Reorganize and move prep articles
        if (earnings) {
            reorganizePrepArticles(earnings);
            widgetWrapper.appendChild(earnings);
        }
        
        topBarContainer.appendChild(widgetWrapper);

        // Show the sidebar (it will contain the remaining elements)
        sidebar.style.display = 'block';
        
        // Mark as completed
        sidebarMoved = true;
        
        // Disconnect the observer since we don't need it anymore
        if (observer) {
            observer.disconnect();
        }
    } catch (error) {
        console.error('Error moving sidebar:', error);
    }
}

// Run when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', moveSidebarToTop);
} else {
    moveSidebarToTop();
}

// Create a MutationObserver with a more specific target
const observer = new MutationObserver((mutations) => {
    // Check if the sidebar exists now
    if (document.querySelector('aside.col-md-3.col-lg-2.hidden-xs.hidden-sm')) {
        moveSidebarToTop();
    }
});

// Start observing only the body for child changes
observer.observe(document.body, {
    childList: true,
    subtree: true
}); 