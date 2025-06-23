/* filepath: /Users/admin/Documents/Apps/MyDreamBoo/ui/js/app.js */

// API URL (change based on your deployment environment)
const API_URL = 'https://api.mydreamboo.com'; // Change for development/production as needed

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const screens = document.querySelectorAll('.screen');
const loginBtn = document.querySelector('#login-btn');
const registerBtn = document.querySelector('#register-btn');
const loginDialog = document.querySelector('#login-dialog');
const registerDialog = document.querySelector('#register-dialog');
const forgotPasswordDialog = document.querySelector('#forgot-password-dialog');
const filterDialog = document.querySelector('#filter-dialog');
const aiDialog = document.querySelector('#ai-dialog');
const filterBtn = document.querySelector('#filter-btn');
const aiBtn = document.querySelector('#ai-btn');
const closeDialogBtns = document.querySelectorAll('.close-dialog');
const switchToSignup = document.querySelector('#switch-to-signup');
const switchToLogin = document.querySelector('#switch-to-login');
const forgotPasswordLink = document.querySelector('#forgot-password-link');
const backToLoginLink = document.querySelector('#back-to-login');
const likeOverlayBtn = document.querySelector('.like-overlay');
const dislikeOverlayBtn = document.querySelector('.dislike-overlay');

// Global state
let isAuthenticated = false;
let authToken = null;
let userData = null;
let availableMatches = []; // Will store potential matches
let currentMatchIndex = 0; // Index of current match being displayed
let currentUser = null; // Will store current user profile

// Toast notification function
function showToast(message, type = 'info') {
    // Get toast container (assume it exists)
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return; // Fail silently if not found

    // Remove ALL existing toasts with the same message and type
    const existingToasts = toastContainer.querySelectorAll('.toast');
    let duplicateFound = false;
    existingToasts.forEach(toast => {
        if (toast.textContent === message && toast.classList.contains(`toast-${type}`)) {
            duplicateFound = true;
        }
    });

    // If a duplicate is found, do not show the toast again
    if (duplicateFound) return;

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Add to container
    toastContainer.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    // At least 6 characters
    return password && password.length >= 6;
}

// Authentication & Profile Management
function checkAuthState() {
    const storedToken = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');

    if (storedToken && storedUserData) {
        try {
            // Parse the stored user data
            userData = JSON.parse(storedUserData);
            authToken = storedToken;
            isAuthenticated = true;

            // Update UI for authenticated user
            updateUIForAuthState();

            console.log('User authenticated from stored token');
        } catch (error) {
            console.error('Error parsing stored user data:', error);
            // Clear invalid data
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
        }
    }
}

function updateUIForAuthState() {
    if (isAuthenticated && userData) {
        // Update user profile data with the authenticated user information
        populateUserProfile(userData);

        // If currently on login/registration screen, switch to user profile
        if (document.getElementById('screen-profile').classList.contains('active')) {
            changeScreen('user-profile');
        }
    } else {
        // When logged out, ensure we're showing login screen if on profile
        if (document.getElementById('screen-user-profile').classList.contains('active')) {
            changeScreen('profile');
        }
    }
}

function populateUserProfile(userData) {
    // Get user profile elements
    const userProfileScreen = document.getElementById('screen-user-profile');
    if (!userProfileScreen) return;

    // Update username
    const usernameEl = userProfileScreen.querySelector('.user-name');
    if (usernameEl) {
        usernameEl.textContent = userData.username || 'User';
    }

    // Update profile picture if available
    if (userData.profilePicture) {
        const profilePicEl = userProfileScreen.querySelector('.profile-picture');
        if (profilePicEl) {
            profilePicEl.src = userData.profilePicture;
        }
    }

    // Update stats if available
    if (userData.stats) {
        const statsContainer = userProfileScreen.querySelector('.profile-stats');
        if (statsContainer) {
            const matchesEl = statsContainer.querySelector('.stat-value:nth-child(1)');
            const likesEl = statsContainer.querySelector('.stat-value:nth-child(2)');
            const superLikesEl = statsContainer.querySelector('.stat-value:nth-child(3)');

            if (matchesEl && userData.stats.matches !== undefined) {
                matchesEl.textContent = userData.stats.matches;
            }

            if (likesEl && userData.stats.likes !== undefined) {
                likesEl.textContent = userData.stats.likes;
            }

            if (superLikesEl && userData.stats.superLikes !== undefined) {
                superLikesEl.textContent = userData.stats.superLikes;
            }
        }
    }

    // Update preferences if available
    if (userData.settings) {
        const ageRangeEl = document.getElementById('age-range-display');
        const distanceEl = document.getElementById('distance-display');
        const showMeEl = document.getElementById('show-me-display');

        if (ageRangeEl && userData.settings.ageRange) {
            ageRangeEl.textContent = `${userData.settings.ageRange.min}-${userData.settings.ageRange.max}`;
        }

        if (distanceEl && userData.settings.distance !== undefined) {
            distanceEl.textContent = `${userData.settings.distance} miles`;
        }

        if (showMeEl && userData.settings.showMe) {
            showMeEl.textContent = userData.settings.showMe;
        }
    }
}

function checkEmailVerification() {
    // The actual verification logic is in the script tag in index.htm
}

function logout() {
    // Clear authentication state
    authToken = null;
    userData = null;
    isAuthenticated = false;

    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');

    // Redirect to login screen
    changeScreen('profile');

    // Show toast message
    showToast('You have been logged out', 'success');
}

function socialLogin(provider) {
    console.log(`Social login with ${provider} - Not implemented yet`);
    showToast(`${provider} login is not implemented yet`, 'info');
}

// Navigation and UI Management
function changeScreen(screenId) {
    console.log('Changing screen to:', screenId);

    // If user clicks "profile" and is authenticated, show user profile screen
    if (screenId === 'profile') {
        if (isAuthenticated && userData) {
            screenId = 'user-profile';
        }
    }

    // Check if user is authenticated for protected screens (only matches and other screens, not discover)
    if (screenId === 'matches' && !isAuthenticated) {
        // Redirect to profile/login screen
        screenId = 'profile';
        showToast('Please log in to continue', 'info');
    }

    // Hide all screens
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // Show the selected screen
    const targetScreen = document.querySelector(`#screen-${screenId}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }

    // Initialize match data when switching to discover screen
    if (screenId === 'discover') {
        console.log('Switching to discover screen, initializing match data');

        // Force a clean state for the discover screen to ensure we always see profiles
        availableMatches = [];
        currentMatchIndex = 0;

        // Check if dependencies are loaded
        if (typeof window.dummyProfiles !== 'undefined' && typeof window.MatchingAlgorithm !== 'undefined') {
            // Initialize match data with a slight delay to ensure UI is ready
            setTimeout(() => {
                initializeMatchData();
            }, 100);
        } else {
            console.warn('Dependencies not loaded, loading them now');

            // Try to load dependencies
            loadDependencies(() => {
                setTimeout(() => {
                    initializeMatchData();
                }, 100);
            });
        }
    }

    // Update navigation (keep profile tab active even when showing user-profile)
    navItems.forEach(item => {
        const navScreenId = item.getAttribute('data-screen');
        if (navScreenId === 'profile') {
            item.classList.toggle('active', screenId === 'profile' || screenId === 'user-profile');
        } else {
            item.classList.toggle('active', navScreenId === screenId);
        }
    });
}

function openDialog(dialog) {
    if (dialog) {
        dialog.classList.add('active');
    }
}

function closeDialog(dialog) {
    if (dialog) {
        dialog.classList.remove('active');
    }
}

// Loading scripts and dependencies
function loadDependencies(callback) {
    // Check if scripts are already loaded
    if (typeof window.dummyProfiles !== 'undefined' && typeof window.MatchingAlgorithm !== 'undefined') {
        callback();
        return;
    }

    // Try to load scripts dynamically if they're missing
    const scriptPaths = [];

    if (typeof window.dummyProfiles === 'undefined') {
        scriptPaths.push('js/dummy-data.js');
    }

    if (typeof window.MatchingAlgorithm === 'undefined') {
        scriptPaths.push('js/matching-algorithm.js');
    }

    if (scriptPaths.length === 0) {
        callback();
        return;
    }

    let loadedScripts = 0;

    scriptPaths.forEach(path => {
        const script = document.createElement('script');
        script.src = path;
        script.onload = () => {
            loadedScripts++;
            if (loadedScripts === scriptPaths.length) {
                console.log('All dependencies loaded');
                callback();
            }
        };
        document.head.appendChild(script);
    });
}

// Fetch real users from the backend
async function fetchDatabaseMatches() {
    if (!isAuthenticated || !authToken) return [];
    try {
        const res = await fetch(`${API_URL}/api/matches`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (!res.ok) throw new Error('Failed to fetch matches');
        const data = await res.json();
        return data.matches || [];
    } catch (err) {
        console.error('Error fetching database matches:', err);
        return [];
    }
}

// Matching and Discovery Functionality
async function initializeMatchData() {
    console.log('Initializing match data');

    // Set defaults for current user if not authenticated
    if (!isAuthenticated || !userData) {
        currentUser = {
            id: "guest-user",
            name: "Guest User",
            age: 25,
            location: {
                city: "New York", state: "NY", coordinates: { latitude: 40.7128, longitude: -74.0060 }
            },
            interests: ["Travel", "Music", "Art", "Fitness", "Technology"],
            settings: {
                ageRange: { min: 18, max: 35 },
                distance: 25,
                showMe: "everyone"
            }
        };
        console.log('Using guest user profile');
    } else {
        currentUser = userData;
        console.log('Using authenticated user data');
    }

    // Only fetch database matches if authenticated and token is present
    let dbMatches = [];
    if (isAuthenticated && authToken) {
        dbMatches = await fetchDatabaseMatches();
        console.log("Fetched DB matches:", dbMatches);
    }

    // Remove any accidental self-matches (shouldn't happen, but just in case)
    dbMatches = dbMatches.filter(u => u.id !== currentUser.id && u.email !== currentUser.email);

    // If less than 10, supplement with dummy data (excluding current user and duplicates)
    let allPotentialMatches = dbMatches;
    if (allPotentialMatches.length < 10) {
        const dummy = (window.dummyProfiles || []).filter(
            p => p.id !== (currentUser?.id || 'guest-user')
        );
        // Avoid duplicates by id
        const existingIds = new Set(allPotentialMatches.map(u => u.id));
        const supplement = dummy.filter(p => !existingIds.has(p.id));
        allPotentialMatches = allPotentialMatches.concat(supplement.slice(0, 10 - allPotentialMatches.length));
    }

    // Apply matching algorithm and filters
    let matches = [];
    if (window.MatchingAlgorithm) {
        matches = window.MatchingAlgorithm.getMatchesForUser(currentUser, allPotentialMatches);
        const filters = getActiveFilters();
        matches = window.MatchingAlgorithm.applyFilters(matches, filters);
    } else {
        matches = allPotentialMatches;
    }

    availableMatches = matches;
    currentMatchIndex = 0;

    if (availableMatches.length > 0) {
        loadMatchProfile(0);
        setTimeout(() => {
            const initialCard = document.querySelector('.match-card');
            if (initialCard) {
                initCardInteractions(initialCard);
            }
        }, 100);
    } else {
        showNoMoreMatches();
    }
}

// Update refreshAvailableMatches to call initializeMatchData
function refreshAvailableMatches() {
    // Now just re-run initializeMatchData to re-fetch and re-apply filters
    initializeMatchData();
    return availableMatches && availableMatches.length > 0;
}

function getActiveFilters() {
    // Get filters from UI or use defaults
    const ageMin = parseInt(document.getElementById('age-min')?.textContent);
    const ageMax = parseInt(document.getElementById('age-max')?.textContent);
    const distance = parseInt(document.getElementById('distance-value')?.textContent);

    // Find selected gender preference
    let showMe = "everyone";
    const genderBtns = document.querySelectorAll('#filter-dialog .toggle-group .toggle-btn');
    genderBtns.forEach(btn => {
        if (btn.classList.contains('active')) {
            showMe = btn.textContent.toLowerCase();
        }
    });

    // Get selected interests
    const selectedInterests = [];
    document.querySelectorAll('#filter-dialog .interest-tags .tag.active').forEach(tag => {
        selectedInterests.push(tag.textContent.toLowerCase());
    });

    return {
        ageRange: { min: ageMin, max: ageMax },
        maxDistance: distance,
        distanceUnit: 'miles',
        showMe: showMe,
        interests: selectedInterests
    };
}

// Replace the loadMatchProfile function with this improved version
function loadMatchProfile(index) {
    console.log('Loading profile at index:', index);

    if (!availableMatches || availableMatches.length === 0) {
        showNoMoreMatches();
        return;
    }

    // Handle wrap-around when reaching the end of matches
    if (index >= availableMatches.length) {
        index = 0; // Cycle back to first profile
    } else if (index < 0) {
        index = 0;
    }

    const profile = availableMatches[index];
    console.log('Profile being loaded:', profile.name);

    // Create a completely new card element
    const matchCardContainer = document.querySelector('.match-card-container');
    if (!matchCardContainer) return;

    // First, remove any existing cards in the container
    while (matchCardContainer.firstChild) {
        matchCardContainer.removeChild(matchCardContainer.firstChild);
    }

    // Create the new match card
    const newCard = document.createElement('div');
    newCard.className = 'match-card';
    newCard.style.opacity = '0';

    // Build the card content
    newCard.innerHTML = `
    <div class="photo-carousel">
        <div class="carousel-inner">
            ${generatePhotoHTML(profile.photos)}
        </div>
        <div class="carousel-indicators">
            ${generateIndicatorsHTML(profile.photos ? profile.photos.length : 0)}
        </div>
        <div class="action-overlays">
            <button class="overlay-btn dislike-overlay"><i class="fas fa-times"></i></button>
            <button class="overlay-btn like-overlay"><i class="fas fa-heart"></i></button>
        </div>
    </div>
    <div class="profile-section">
        <div class="profile-header">
            <div class="profile-main-info">
                <div class="match-name">${profile.name}, ${profile.age}</div>
                <div class="match-bio-short">${profile.occupation || ''} • ${profile.location?.distance || '0'} miles away</div>
            </div>
            <button class="favorite-btn"><i class="fas fa-star"></i></button>
        </div>
        <div class="profile-scrollable">
            <div class="profile-section-title">About me</div>
            <p class="profile-text">${profile.bio || ''}</p>
            <div class="profile-section-title">Interests</div>
            <p class="profile-text">${profile.interests ? profile.interests.join(', ') : ''}</p>
            <div class="profile-section-title">Looking for</div>
            <p class="profile-text">${profile.lookingFor || ''}</p>
        </div>
    </div>
    `;

    // Add the new card to the container
    matchCardContainer.appendChild(newCard);

    // Create animation elements for later use
    const heartBurst = document.createElement('div');
    heartBurst.className = 'heart-burst';
    heartBurst.innerHTML = '<i class="fas fa-heart" style="color: #ff4d67; font-size: 12rem;"></i>';
    matchCardContainer.appendChild(heartBurst);

    const xMark = document.createElement('div');
    xMark.className = 'x-mark';
    xMark.innerHTML = '<i class="fas fa-times" style="color: #ff4757; font-size: 10rem;"></i>';
    matchCardContainer.appendChild(xMark);

    // Make new card visible with animation
    requestAnimationFrame(() => {
        newCard.style.opacity = '1';

        // Initialize interactions for the card
        initCardInteractions(newCard);
    });

    // Update current index
    currentMatchIndex = index;
}

// Helper functions to generate card HTML
function generatePhotoHTML(photos) {
    if (!photos || photos.length === 0) {
        return `<div class="carousel-item active">
            <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80" 
                 alt="Profile photo" 
                 onerror="this.src='https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80'">
        </div>`;
    }

    return photos.map((photo, i) => `
        <div class="carousel-item${i === 0 ? ' active' : ''}">
            <img src="${photo}" 
                 alt="Profile photo ${i + 1}" 
                 onerror="this.src='https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80'">
        </div>
    `).join('');
}

function generateIndicatorsHTML(count) {
    if (!count) return '';
    let indicators = '';
    for (let i = 0; i < count; i++) {
        indicators += `<span class="indicator${i === 0 ? ' active' : ''}"></span>`;
    }
    return indicators;
}

function generateTagsHTML(interests) {
    if (!interests || !interests.length) return '';
    return interests.map(tag => `<span class="tag">${tag}</span>`).join('');
}

// Replace the handleSwipeAnimation function with this improved version
function handleSwipeAnimation(isLike, matchCard) {
    // Redirect unauthenticated users to login/register
    if (!isAuthenticated) {
        changeScreen('profile');
        showToast('Please log in or register to interact with matches.', 'info');
        return;
    }

    console.log(`Handling swipe animation: ${isLike ? 'like' : 'dislike'}`);

    if (!matchCard) {
        matchCard = document.querySelector('.match-card');
        if (!matchCard) {
            console.error("No match card found for animation");
            return;
        }
    }

    const matchCardContainer = document.querySelector('.match-card-container');
    if (!matchCardContainer) {
        console.error("No match card container found");
        return;
    }

    // Get animation elements
    const heartBurst = matchCardContainer.querySelector('.heart-burst');
    const xMark = matchCardContainer.querySelector('.x-mark');

    // Apply animations
    if (isLike) {
        if (matchCard) matchCard.classList.add('swiping-right');
        if (heartBurst) heartBurst.classList.add('animate');
    } else {
        if (matchCard) matchCard.classList.add('swiping-left');
        if (xMark) xMark.classList.add('animate');
    }

    const currentProfile = currentMatchIndex;

    // Wait for animation to complete, then load next profile
    setTimeout(() => {
        console.log("Animation complete, cleaning up");

        if (heartBurst) heartBurst.classList.remove('animate');
        if (xMark) xMark.classList.remove('animate');

        if (isLike) {
            showToast(`You liked ${availableMatches[currentProfile].name}!`, 'success');
        } else {
            showToast(`You passed on ${availableMatches[currentProfile].name}`, 'info');
        }

        // Load the next profile directly without additional timeouts
        loadMatchProfile(currentProfile + 1);

    }, 400); // Match animation duration in CSS
}

// Simplified like/dislike functions - remove the extra timeouts
function likeCurrentProfile() {
    if (!isAuthenticated) {
        changeScreen('profile');
        showToast('Please log in or register to like profiles.', 'info');
        return;
    }
    if (!availableMatches || availableMatches.length === 0) return;
    handleSwipeAnimation(true);
}

function dislikeCurrentProfile() {
    if (!isAuthenticated) {
        changeScreen('profile');
        showToast('Please log in or register to dislike profiles.', 'info');
        return;
    }
    if (!availableMatches || availableMatches.length === 0) return;
    handleSwipeAnimation(false);
}

// Add a utility function to safely check for DOM elements
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

// Fix initCardInteractions to ensure only ONE event listener is attached
function initCardInteractions(card) {
    console.log("Setting up interactions for card");

    if (!card) {
        console.error("No card provided to initCardInteractions");
        return;
    }

    // Setup carousel indicators
    const indicators = card.querySelectorAll('.carousel-indicators .indicator');
    const carousel = card.querySelector('.carousel-inner');

    if (carousel) {
        indicators.forEach((indicator, idx) => {
            indicator.addEventListener('click', () => {
                carousel.style.transition = 'transform 0.3s ease';
                carousel.style.transform = `translateX(-${idx * 100}%)`;
                updateIndicators(indicators, idx);
            });
        });
    } else {
        console.warn("Carousel inner not found in card");
    }

    // Setup like/dislike buttons WITH BUTTON FLAG TO PREVENT DUPLICATES
    const likeBtn = card.querySelector('.like-overlay');
    const dislikeBtn = card.querySelector('.dislike-overlay');

    if (likeBtn && !likeBtn.hasClickListener) {
        console.log("Found like button, setting up event listener");
        // Use onclick instead of addEventListener to ensure only one handler
        likeBtn.onclick = () => {
            console.log("Like button clicked");
            // Lock buttons during animation
            disableButtons(card);
            handleSwipeAnimation(true, card);
        };
        likeBtn.hasClickListener = true;
    }

    if (dislikeBtn && !dislikeBtn.hasClickListener) {
        console.log("Found dislike button, setting up event listener");
        // Use onclick instead of addEventListener to ensure only one handler
        dislikeBtn.onclick = () => {
            console.log("Dislike button clicked");
            // Lock buttons during animation
            disableButtons(card);
            handleSwipeAnimation(false, card);
        };
        dislikeBtn.hasClickListener = true;
    }

    // Setup favorite button
    const favoriteBtn = card.querySelector('.favorite-btn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function () {
            this.classList.toggle('active');
            if (this.classList.contains('active')) {
                showToast('Added to favorites', 'success');
            } else {
                showToast('Removed from favorites', 'info');
            }
        });
    }

    // Initialize interactions for this card
    initTouchGestures(card);

    console.log("Card interactions setup complete");
}

// Add this helper function to prevent multiple clicks during animations
function disableButtons(card) {
    const buttons = card.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
    });

    // Re-enable after animation completes
    setTimeout(() => {
        buttons.forEach(button => {
            button.disabled = false;
        });
    }, 500);
}

// Updated updateIndicators function to accept indicators param
function updateIndicators(indicators, activeIndex) {
    indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === activeIndex);
    });
}

// Add this function after initCardInteractions function
function initTouchGestures(card) {
    // Skip implementation if no card is provided
    if (!card) {
        console.error("No card provided to initTouchGestures");
        return;
    }

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;

    // Create a cleanup function to remove all event listeners
    const cleanupListeners = () => {
        card.removeEventListener('touchstart', handleTouchStart);
        card.removeEventListener('touchmove', handleTouchMove);
        card.removeEventListener('touchend', handleTouchEnd);
        card.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // Touch events
    card.addEventListener('touchstart', handleTouchStart, { passive: true });
    card.addEventListener('touchmove', handleTouchMove, { passive: false });
    card.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Mouse events (for desktop testing)
    card.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    function handleTouchStart(e) {
        if (!e.touches || e.touches.length === 0) return;

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        card.classList.add('dragging');
    }

    function handleMouseDown(e) {
        startX = e.clientX;
        startY = e.clientY;
        isDragging = true;
        card.classList.add('dragging');
    }

    function handleTouchMove(e) {
        if (!isDragging || !e.touches || e.touches.length === 0) return;

        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;

        // Calculate how far we've moved
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        // If mostly vertical movement, allow scrolling
        if (Math.abs(deltaY) > Math.abs(deltaX) * 2) {
            return;
        }

        // Prevent default to stop scrolling when swiping horizontally
        e.preventDefault();

        // Move the card
        const rotate = deltaX * 0.1;
        card.style.transform = `translateX(${deltaX}px) rotate(${rotate}deg)`;
    }

    function handleMouseMove(e) {
        if (!isDragging) return;

        currentX = e.clientX;
        currentY = e.clientY;

        // Calculate how far we've moved
        const deltaX = currentX - startX;

        // Move the card
        const rotate = deltaX * 0.1;
        card.style.transform = `translateX(${deltaX}px) rotate(${rotate}deg)`;
    }

    function handleTouchEnd() {
        if (!isDragging) return;
        endDrag();
    }

    function handleMouseUp() {
        if (!isDragging) return;
        endDrag();
    }

    function endDrag() {
        isDragging = false;
        card.classList.remove('dragging');

        // Calculate final swipe distance
        const deltaX = currentX - startX;

        // Only trigger swipe if horizontal movement is significant (e.g., > 50px)
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > card.offsetWidth * 0.2) {
            if (deltaX > 0) {
                // Swiped right - like
                handleSwipeAnimation(true, card);
            } else {
                // Swiped left - dislike
                handleSwipeAnimation(false, card);
            }
            cleanupListeners();
        } else {
            // Not enough movement, reset card position
            card.style.transform = '';
        }
    }
}

// Fix the showNoMoreMatches function to properly rebuild the UI
function showNoMoreMatches() {
    console.log('Showing no more matches screen');

    const matchCardContainer = document.querySelector('.match-card-container');
    if (!matchCardContainer) return;

    // Clear the container
    matchCardContainer.innerHTML = '';

    // Create a new card that shows "no more matches"
    const noMatchesCard = document.createElement('div');
    noMatchesCard.className = 'match-card';
    noMatchesCard.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 20px; background-color: white; color: #333;">
            <div style="font-size: 60px; color: #ff4d67; margin-bottom: 20px;">
                <i class="fas fa-heart-broken"></i>
            </div>
            <h2>No More Matches</h2>
            <p>We've run out of people to show you right now. Check back soon or adjust your filters!</p>
            <button id="refresh-matches" class="btn-primary" style="margin-top: 20px;">
                <i class="fas fa-sync-alt"></i> Refresh Matches
            </button>
        </div>
    `;

    // Add the card to the container
    matchCardContainer.appendChild(noMatchesCard);

    // Add refresh action
    const refreshBtn = document.getElementById('refresh-matches');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function () {
            console.log('Refresh matches button clicked');

            // Get new matches
            refreshAvailableMatches();

            if (availableMatches && availableMatches.length > 0) {
                loadMatchProfile(0);
                showToast('Found new matches!', 'success');
            } else {
                showToast('No new matches found. Try adjusting your filters.', 'info');
            }
        });
    }
}

// === ADD BACK THE INIT FUNCTION AND ENSURE IT'S CALLED ===
function init() {
    // Check authentication state
    checkAuthState();

    // Nav item click handlers - THIS IS THE CRITICAL PART THAT WAS MISSING
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const screenId = item.getAttribute('data-screen');
            changeScreen(screenId);
        });
    });

    // Setup dialog buttons
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            openDialog(filterDialog);
        });
    }

    if (aiBtn) {
        aiBtn.addEventListener('click', () => {
            openDialog(aiDialog);
        });
    }

    // Close dialog buttons
    closeDialogBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const dialog = btn.closest('.dialog-overlay');
            if (dialog) {
                closeDialog(dialog);
            }
        });
    });

    // Setup range inputs
    setupRangeInputs();

    // Initialize segment control for matches screen
    initSegmentControl();

    // Check for email verification
    checkEmailVerification();

    // Initialize match data if we're on the discover screen
    if (document.getElementById('screen-discover') &&
        document.getElementById('screen-discover').classList.contains('active')) {
        initializeMatchData();
    }

    // Initialize authentication-related events
    initAuthEvents();
}

// Update the document ready handler
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded');

    // First check if required elements exist
    const requiredSelectors = [
        '.match-card-container',
        '.bottom-nav',
        '#toast-container'
    ];

    const missingSelectors = requiredSelectors.filter(selector =>
        !document.querySelector(selector) && selector !== '#toast-container'
    );

    if (missingSelectors.length > 0) {
        console.warn('Missing required elements:', missingSelectors);
    }

    // Always attempt to load dependencies first with proper error handling
    loadDependencies(() => {
        console.log('Dependencies loaded successfully');

        // Use setTimeout to ensure the DOM is fully ready
        setTimeout(() => {
            // Initialize the app
            init();
            initAdditionalListeners();
            initTogglePasswordVisibility();
            initProfileManagement();
        }, 100);
    });
});

// Auth events that were missing
function initAuthEvents() {
    // Switch between login and register tabs
    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const tabName = this.getAttribute('data-tab');

            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding panel
            document.querySelectorAll('.auth-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById(`${tabName}-panel`).classList.add('active');
        });
    });

    // Switch between login and signup
    if (switchToSignup) {
        switchToSignup.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector('.auth-tab[data-tab="register"]').click();
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector('.auth-tab[data-tab="login"]').click();
        });
    }

    // Forgot password link
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function (e) {
            e.preventDefault();
            openDialog(forgotPasswordDialog);
        });
    }

    // Back to login from forgot password
    if (backToLoginLink) {
        backToLoginLink.addEventListener('click', function (e) {
            e.preventDefault();
            closeDialog(forgotPasswordDialog);
        });
    }

    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch(`${API_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();

                if (response.ok && data.token && data.user) {
                    userData = data.user;
                    authToken = data.token;
                    isAuthenticated = true;
                    localStorage.setItem('userData', JSON.stringify(userData));
                    localStorage.setItem('authToken', authToken);

                    updateUIForAuthState();
                    showToast('Login successful!', 'success');
                    changeScreen('user-profile');
                } else {
                    showToast(data.error || 'Login failed', 'error');
                }
            } catch (err) {
                showToast('Network error. Please try again.', 'error');
            }
        });
    }

    // Register form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('reg-email').value;
            const username = document.getElementById('reg-name').value;
            const password = document.getElementById('reg-password').value;
            const birthday = document.getElementById('birthday').value;

            try {
                const response = await fetch(`${API_URL}/api/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, username, password, birthday })
                });
                const data = await response.json();

                if (response.ok) {
                    showToast('Registration successful! Please check your email for verification code.', 'success');
                    // Show verification code dialog
                    document.getElementById('verification-email').value = email;
                    document.getElementById('verification-code-dialog').classList.add('active');
                } else {
                    showToast(data.error || 'Registration failed', 'error');
                }
            } catch (err) {
                showToast('Network error. Please try again.', 'error');
            }
        });
    }

    // Verification code form submission
    const verificationCodeForm = document.getElementById('verification-code-form');
    if (verificationCodeForm) {
        verificationCodeForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('verification-email').value;
            const code = document.getElementById('verification-code').value;

            try {
                const response = await fetch(`${API_URL}/api/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: code })
                });
                const data = await response.json();

                if (response.ok && data.token && data.user) {
                    userData = data.user;
                    authToken = data.token;
                    isAuthenticated = true;
                    localStorage.setItem('userData', JSON.stringify(userData));
                    localStorage.setItem('authToken', authToken);

                    showToast('Email verified! You are now logged in.', 'success');
                    document.getElementById('verification-code-dialog').classList.remove('active');
                    updateUIForAuthState();
                    changeScreen('user-profile');
                } else {
                    showToast(data.error || 'Verification failed', 'error');
                }
            } catch (err) {
                showToast('Network error. Please try again.', 'error');
            }
        });
    }

    // Logout button
    const logoutBtn = document.querySelector('.logout-button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Social login buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const provider = this.className.split(' ')[1]; // google, facebook, etc.
            socialLogin(provider);
        });
    });

    // Resend verification button
    const resendVerificationBtn = document.getElementById('resend-verification');
    if (resendVerificationBtn) {
        resendVerificationBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            const email = document.getElementById('verification-email').value;
            if (!email) {
                showToast('No email found for verification.', 'error');
                return;
            }
            try {
                const response = await fetch(`${API_URL}/api/resend-verification`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await response.json();
                if (response.ok) {
                    showToast('Verification code resent!', 'success');
                } else {
                    showToast(data.error || 'Failed to resend code', 'error');
                }
            } catch (err) {
                showToast('Network error. Please try again.', 'error');
            }
        });
    }
}

// Segment control initialization that was missing
function initSegmentControl() {
    const segmentBtns = document.querySelectorAll('.segment-btn');
    const matchesView = document.querySelector('.matches-view');

    if (segmentBtns.length && matchesView) {
        segmentBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                // Update active button
                segmentBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // For now we just have one view, but this is for future expansion
                if (this.textContent === 'Messages') {
                    showToast('Messages feature coming soon!', 'info');
                }
            });
        });
    }
}

// Setup range inputs that was missing
function setupRangeInputs() {
    // Age range sliders
    const ageMinRange = document.getElementById('age-range-min');
    const ageMaxRange = document.getElementById('age-range-max');
    const ageMinValue = document.getElementById('age-min');
    const ageMaxValue = document.getElementById('age-max');

    if (ageMinRange && ageMaxRange && ageMinValue && ageMaxValue) {
        ageMinRange.addEventListener('input', function () {
            // Ensure min doesn't exceed max
            if (parseInt(this.value) > parseInt(ageMaxRange.value)) {
                this.value = ageMaxRange.value;
            }
            ageMinValue.textContent = this.value;
        });

        ageMaxRange.addEventListener('input', function () {
            // Ensure max doesn't fall below min
            if (parseInt(this.value) < parseInt(ageMinRange.value)) {
                this.value = ageMinRange.value;
            }
            ageMaxValue.textContent = this.value;
        });
    }

    // Distance range slider
    const distanceRange = document.getElementById('distance-range');
    const distanceValue = document.getElementById('distance-value');

    if (distanceRange && distanceValue) {
        distanceRange.addEventListener('input', function () {
            distanceValue.textContent = this.value;
        });
    }

    // Toggle buttons in filter dialog
    const toggleBtns = document.querySelectorAll('#filter-dialog .toggle-group .toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Filter tags
    const filterTags = document.querySelectorAll('#filter-dialog .interest-tags .tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    });

    // Filter reset button
    const filterResetBtn = document.querySelector('#filter-dialog .btn-secondary');
    if (filterResetBtn) {
        filterResetBtn.addEventListener('click', function () {
            // Reset age range
            if (ageMinRange && ageMaxRange) {
                ageMinRange.value = 18;
                ageMaxRange.value = 45;
                ageMinValue.textContent = '18';
                ageMaxValue.textContent = '45';
            }

            // Reset distance
            if (distanceRange) {
                distanceRange.value = 25;
                distanceValue.textContent = '25';
            }

            // Reset gender preference
            toggleBtns.forEach((btn, index) => {
                btn.classList.toggle('active', index === 2); // Set "Everyone" as active
            });

            // Reset interest tags
            filterTags.forEach(tag => {
                tag.classList.remove('active');
            });
        });
    }

    // Filter apply button
    const filterApplyBtn = document.querySelector('#filter-dialog .btn-primary');
    if (filterApplyBtn) {
        filterApplyBtn.addEventListener('click', function () {
            closeDialog(filterDialog);
            showToast('Filters applied successfully!', 'success');

            // Refresh matches with new filters
            if (document.getElementById('screen-discover').classList.contains('active')) {
                refreshAvailableMatches();
                loadMatchProfile(0);
            }
        });
    }
}

// Add back additional listeners
function initAdditionalListeners() {
    // Back button for chat screen
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function () {
            changeScreen('matches');
        });
    }

    // Chat input and send button
    const chatInput = document.querySelector('.chat-input');
    const sendBtn = document.querySelector('.send-btn');

    if (chatInput && sendBtn) {
        sendBtn.addEventListener('click', function () {
            sendMessage(chatInput.value);
        });

        chatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(this.value);
            }
        });
    }

    // Message items - open chat when clicking on a message
    document.querySelectorAll('.message-item').forEach(item => {
        item.addEventListener('click', function () {
            changeScreen('chat');
        });
    });
}

// Add the missing functions for profile management
function initProfileManagement() {
    // Edit section buttons
    const editSectionBtns = document.querySelectorAll('.edit-section-btn');
    editSectionBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const section = this.getAttribute('data-section');
            showEditMode(section);
        });
    });

    // Cancel edit buttons
    const cancelEditBtns = document.querySelectorAll('.cancel-edit');
    cancelEditBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const section = this.getAttribute('data-section');
            hideEditMode(section);
        });
    });

    // Save edit buttons
    const saveEditBtns = document.querySelectorAll('.save-edit');
    saveEditBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const section = this.getAttribute('data-section');
            saveEditChanges(section);
            hideEditMode(section);
            showToast('Changes saved successfully!', 'success');
        });
    });

    // Inline edit buttons
    const inlineEditBtns = document.querySelectorAll('.edit-inline-btn');
    inlineEditBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const field = this.getAttribute('data-field');
            showNameEditModal(field);
        });
    });

    // Profile picture upload
    const profileImgUpload = document.getElementById('profile-image-upload');
    if (profileImgUpload) {
        profileImgUpload.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById('profile-display-image').src = e.target.result;
                    showToast('Profile picture updated!', 'success');
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
}

// Add missing functions for the profile edit mode
function showEditMode(section) {
    // Hide display section
    document.getElementById(`${section}-section-display`).style.display = 'none';
    // Show edit section
    document.getElementById(`${section}-section-edit`).style.display = 'block';
}

function hideEditMode(section) {
    // Show display section
    document.getElementById(`${section}-section-display`).style.display = 'block';
    // Hide edit section
    document.getElementById(`${section}-section-edit`).style.display = 'none';
}

function saveEditChanges(section) {
    // Implement saving logic for each section
    switch (section) {
        case 'about':
            const bioInput = document.getElementById('bio-input');
            if (bioInput) {
                document.querySelector('#about-section-display p').textContent = bioInput.value;
            }
            break;
        case 'preferences':
            // Save preference changes
            const showMeValue = document.querySelector('#preferences-section-edit .toggle-btn.active').textContent;
            document.getElementById('show-me-display').textContent = showMeValue;

            break;
        case 'interests':
            // Update interests
            const newInterests = [];
            document.querySelectorAll('.interest-option.selected').forEach(option => {
                newInterests.push(option.querySelector('span').textContent);
            });

            // Update interests display
            const interestsContainer = document.querySelector('#interests-section-display .interests-container');
            interestsContainer.innerHTML = '';
            newInterests.forEach(interest => {
                const tag = document.createElement('span');
                tag.className = 'interest-tag';
                tag.textContent = interest;
                interestsContainer.appendChild(tag);
            });
            break;
        case 'details':
            // Update details
            const jobInput = document.getElementById('job-input');
            const educationInput = document.getElementById('education-input');

            if (jobInput && document.querySelector('#details-section-display .detail-content:nth-child(1) .detail-value')) {
                document.querySelector('#details-section-display .detail-content:nth-child(1) .detail-value').textContent = jobInput.value;
            }

            if (educationInput && document.querySelector('#details-section-display .detail-content:nth-child(2) .detail-value')) {
                document.querySelector('#details-section-display .detail-content:nth-child(2) .detail-value').textContent = educationInput.value;
            }
            break;
    }
}

function showNameEditModal(field) {
    // You would implement a modal for editing user name
    // For this demo, we'll just use a prompt
    const newName = prompt("Enter your new display name:");
    if (newName && newName.trim() !== '') {
        document.getElementById('display-name-text').textContent = newName;
        showToast('Name updated successfully!', 'success');
    }
}

function initTogglePasswordVisibility() {
    // Create and add password toggle buttons
    const passwordInputs = document.querySelectorAll('input[type="password"]');

    passwordInputs.forEach(input => {
        // Create a toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle-btn';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        toggleBtn.style.position = 'absolute';
        toggleBtn.style.right = '10px';
        toggleBtn.style.top = '50%';
        toggleBtn.style.transform = 'translateY(-50%)';
        toggleBtn.style.background = 'none';
        toggleBtn.style.border = 'none';
        toggleBtn.style.color = '#999';
        toggleBtn.style.cursor = 'pointer';

        // Add click event
        toggleBtn.addEventListener('click', function () {
            if (input.type === 'password') {
                input.type = 'text';
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                input.type = 'password';
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });

        // Add button to parent wrapper
        const wrapper = input.closest('.input-icon-wrapper');
        if (wrapper) {
            wrapper.style.position = 'relative';
            wrapper.appendChild(toggleBtn);
        }
    });
}

function sendMessage(message) {
    if (!message || message.trim() === '') return;

    // Create a new message element
    const chatMessages = document.querySelector('.chat-messages');
    const newMessage = document.createElement('div');
    newMessage.className = 'message sent';

    newMessage.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-time">Just now</div>
    `;

    // Remove typing indicator if present
    const typingIndicator = document.querySelector('.typing');
    if (typingIndicator) {
        typingIndicator.remove();
    }

    // Add message to chat
    chatMessages.appendChild(newMessage);

    // Clear input
    document.querySelector('.chat-input').value = '';

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate reply after a delay
    setTimeout(() => {
        // Add typing indicator
        const typingElement = document.createElement('div');
        typingElement.className = 'message received typing';
        typingElement.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Remove typing and add response after a delay
        setTimeout(() => {
            typingElement.remove();

            // Sample responses
            const responses = [
                "That sounds great! When are you free?",
                "I love that idea. Tell me more!",
                "I've been wanting to do that too!",
                "Interesting! Have you tried it before?",
                "Thanks for sharing that with me."
            ];

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const responseElement = document.createElement('div');
            responseElement.className = 'message received';
            responseElement.innerHTML = `
                <div class="message-content">${randomResponse}</div>
                <div class="message-time">Just now</div>
            `;

            chatMessages.appendChild(responseElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 2000);
    }, 1000);
}