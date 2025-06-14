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

// Function to move sidebar items to top
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
            // Insert the top bar before the main content
            mainContent.parentNode.insertBefore(topBarContainer, mainContent);
        } else {
            document.body.insertBefore(topBarContainer, document.body.firstChild);
        }
    }

    try {
        // Move the elements directly instead of cloning
        const voicePlayer = sidebar.querySelector('.voice-player');
        const tsWidget = sidebar.querySelector('.ts-widget');
        const earnings = sidebar.querySelector('#ctl00_ContentPlaceHolder1_RightSide1_earnings');
        const footer = sidebar.querySelector('#divWorthYourTime');

        // Create a wrapper for the widgets to maintain their layout
        const widgetWrapper = document.createElement('div');
        widgetWrapper.className = 'widget-wrapper';
        
        if (voicePlayer) widgetWrapper.appendChild(voicePlayer);
        if (tsWidget) widgetWrapper.appendChild(tsWidget);
        
        // Reorganize the prep articles before adding to the wrapper
        if (earnings) {
            reorganizePrepArticles(earnings);
            widgetWrapper.appendChild(earnings);
        }
        
        if (footer) widgetWrapper.appendChild(footer);
        
        topBarContainer.appendChild(widgetWrapper);

        // Hide the original sidebar
        sidebar.style.display = 'none';
        
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
    subtree: false
}); 