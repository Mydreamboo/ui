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

// Auth state management
let isAuthenticated = false;
let authToken = null;
let userData = null;

// Toast notification function
function showToast(message, type = 'info') {
    // Get or create toast container
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Remove existing toasts if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.classList.remove('show');
        setTimeout(() => existingToast.remove(), 300);
    }

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

// Form validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Replace the existing validatePassword function with this simpler version
function validatePassword(password) {
    // At least 6 characters
    return password && password.length >= 6;
}

// Check authentication state from localStorage
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

// Update UI based on authentication state
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

// Add this new function to populate user profile data
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
        const ageRangeEl = userProfileScreen.querySelector('.preference-item:nth-child(1) .preference-value');
        const distanceEl = userProfileScreen.querySelector('.preference-item:nth-child(2) .preference-value');
        const showMeEl = userProfileScreen.querySelector('.preference-item:nth-child(3) .preference-value');

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

// Function to check for email verification from URL parameters
function checkEmailVerification() {
    // This function will be called during initialization
    // The actual verification logic is in the script tag in index.htm
    // So this function can be empty or we can remove the call
}

// Function to handle logout
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

// Social login placeholder
function socialLogin(provider) {
    console.log(`Social login with ${provider} - Not implemented yet`);
    showToast(`${provider} login is not implemented yet`, 'info');
}

// Initialize app
function init() {
    // Make sure all elements are loaded before attaching event listeners
    if (!navItems.length) {
        console.error('Navigation items not found');
        return;
    }

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetScreen = item.getAttribute('data-screen');
            changeScreen(targetScreen);
        });
    });

    // Dialog events
    if (closeDialogBtns) {
        closeDialogBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const dialog = btn.closest('.dialog-overlay');
                closeDialog(dialog);
            });
        });
    }

    // Filter button
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            openDialog(filterDialog);
        });
    }

    // AI button
    if (aiBtn) {
        aiBtn.addEventListener('click', () => {
            openDialog(aiDialog);
        });
    }

    // Overlay like/dislike buttons
    if (likeOverlayBtn) {
        likeOverlayBtn.addEventListener('click', () => {
            showMatchAnimation(true);
            // In a real app, you'd handle the match action here
            setTimeout(() => {
                console.log('Liked profile');
                // Load the next profile
            }, 500);
        });
    }

    if (dislikeOverlayBtn) {
        dislikeOverlayBtn.addEventListener('click', () => {
            showMatchAnimation(false);
            // In a real app, you'd handle the dislike action here
            setTimeout(() => {
                console.log('Disliked profile');
                // Load the next profile
            }, 500);
        });
    }

    // Auth navigation
    if (switchToSignup) {
        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            // Find the register tab and click it to switch
            const registerTab = document.querySelector('.auth-tab[data-tab="register"]');
            if (registerTab) {
                registerTab.click();
            }
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeDialog(registerDialog);
            setTimeout(() => {
                openDialog(loginDialog);
            }, 300);
        });
    }

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('forgot-password-dialog').classList.add('active');
        });
    }

    if (backToLoginLink) {
        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('forgot-password-dialog').classList.remove('active');
        });
    }

    // Range input handlers
    setupRangeInputs();

    // Tag interactions
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('active');
        });
    });

    // Initialize photo carousel for swiping
    initPhotoCarousel();

    // Initialize favorite button
    initFavoriteButton();

    // Initialize button animations
    initButtonAnimations();

    // Initialize segment control for matches page
    initSegmentControl();

    // Auth tab switching
    const authTabs = document.querySelectorAll('.auth-tab');
    const authPanels = document.querySelectorAll('.auth-panel');

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panels
            authTabs.forEach(tab => tab.classList.remove('active'));
            authPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked tab and corresponding panel
            tab.classList.add('active');
            const targetPanel = document.getElementById(`${tab.dataset.tab}-panel`);
            targetPanel.classList.add('active');
        });
    });

    // Enhanced form validation
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        // Login form validation
        const loginEmail = document.getElementById('login-email');
        const loginPassword = document.getElementById('login-password');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Reset errors
            document.querySelectorAll('.error-message').forEach(el => el.remove());

            let hasError = false;

            // Validate email
            if (!validateEmail(loginEmail.value)) {
                showInputError(loginEmail, 'Please enter a valid email address');
                hasError = true;
            }

            // Validate password
            if (!loginPassword.value) {
                showInputError(loginPassword, 'Password is required');
                hasError = true;
            }

            if (hasError) return;

            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;

            try {
                await loginUser(loginEmail.value, loginPassword.value);
            } finally {
                // Restore button
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Register form with enhanced validation
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        const regName = document.getElementById('reg-name');
        const regEmail = document.getElementById('reg-email');
        const regPassword = document.getElementById('reg-password');
        const birthday = document.getElementById('birthday');

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Reset errors
            document.querySelectorAll('.error-message').forEach(el => el.remove());

            let hasError = false;

            // Validate username
            if (!regName.value || regName.value.length < 3) {
                showInputError(regName, 'Username must be at least 3 characters');
                hasError = true;
            }

            // Validate email
            if (!validateEmail(regEmail.value)) {
                showInputError(regEmail, 'Please enter a valid email address');
                hasError = true;
            }

            // Validate password
            if (!validatePassword(regPassword.value)) {
                showInputError(regPassword, 'Password must be at least 6 characters');
                hasError = true;
            }

            // Validate birthday (ensure user is 18+)
            const birthDate = new Date(birthday.value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (age < 18 || (age === 18 && monthDiff < 0) || (age === 18 && monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                showInputError(birthday, 'You must be at least 18 years old');
                hasError = true;
            }

            if (hasError) return;

            // Show loading state
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Creating Account...';
            submitBtn.disabled = true;

            try {
                await registerUser(regName.value, regEmail.value, regPassword.value, birthday.value);
            } finally {
                // Restore button
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Handle forgot password form
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('forgot-email').value;

            // Reset errors
            document.querySelectorAll('.error-message').forEach(el => el.remove());

            // Validate email
            if (!validateEmail(email)) {
                showInputError(document.getElementById('forgot-email'), 'Please enter a valid email address');
                return;
            }

            // Show loading state
            const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                await resetPassword(email);
                showToast('Password reset link sent to your email', 'success');
                forgotPasswordDialog.classList.remove('active');

                // Clear the input
                document.getElementById('forgot-email').value = '';
            } catch (error) {
                showToast(error.message || 'Failed to send reset link', 'error');
            } finally {
                // Restore button
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Handle logout
    const logoutSection = document.querySelector('.logout-section');
    if (logoutSection) {
        logoutSection.addEventListener('click', () => {
            logout();
        });
    }

    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const provider = e.currentTarget.classList[1]; // google, facebook, etc.
            socialLogin(provider);
        });
    });

    // Update UI based on auth state
    checkAuthState();

    // Check for email verification
    checkEmailVerification();
}

// Show input validation error
function showInputError(inputElement, message) {
    const parentElement = inputElement.closest('.form-group');
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#ff4d67';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '4px';
    parentElement.appendChild(errorElement);

    // Add error styling to input
    inputElement.style.borderColor = '#ff4d67';

    // Remove error when input changes
    inputElement.addEventListener('input', function () {
        const error = parentElement.querySelector('.error-message');
        if (error) error.remove();
        inputElement.style.borderColor = '';
    }, { once: true });
}

// Function to switch between screens
function changeScreen(screenId) {
    // Check if user is authenticated for protected screens
    if ((screenId === 'discover' || screenId === 'matches') && !isAuthenticated) {
        // Redirect to profile/login screen
        screenId = 'profile';
        showToast('Please log in to continue', 'info');
    }

    // Special handling for profile screen when authenticated
    if (screenId === 'profile' && isAuthenticated) {
        // Show user-profile instead of the login/register screen
        screenId = 'user-profile';
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

    // Update navigation (keep profile tab active even when showing user-profile)
    navItems.forEach(item => {
        const navScreenId = item.getAttribute('data-screen');
        if (navScreenId === 'profile') {
            // Keep profile tab highlighted for both profile and user-profile screens
            item.classList.toggle('active', screenId === 'profile' || screenId === 'user-profile');
        } else {
            item.classList.toggle('active', navScreenId === screenId);
        }
    });
}

// Initialize segment controls for matches screen
function initSegmentControl() {
    const segmentBtns = document.querySelectorAll('.segment-btn');
    if (!segmentBtns.length) return;

    segmentBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            segmentBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Switch between matches and messages views
            // In a full implementation, you'd toggle views here
        });
    });
}

// Helper functions
function openDialog(dialog) {
    dialog.classList.add('active');
}

function closeDialog(dialog) {
    // Add null check before accessing classList
    if (dialog && dialog.classList) {
        dialog.classList.remove('active');
    }
}

function showMatchAnimation(liked) {
    const matchPhoto = document.querySelector('.match-photo');
    if (!matchPhoto) return;

    const overlay = document.createElement('div');
    overlay.classList.add('swipe-overlay');

    const icon = document.createElement('i');

    if (liked) {
        icon.classList.add('fas', 'fa-heart');
        overlay.classList.add('liked');
    } else {
        icon.classList.add('fas', 'fa-times');
        overlay.classList.add('disliked');
    }

    overlay.appendChild(icon);
    matchPhoto.appendChild(overlay);

    setTimeout(() => {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }, 1000);
}

function setupRangeInputs() {
    const minAgeRange = document.getElementById('age-range-min');
    const maxAgeRange = document.getElementById('age-range-max');
    const distanceRange = document.getElementById('distance-range');

    if (minAgeRange && maxAgeRange) {
        const minAgeOutput = document.getElementById('age-min');
        const maxAgeOutput = document.getElementById('age-max');

        minAgeRange.addEventListener('input', () => {
            const minVal = parseInt(minAgeRange.value);
            const maxVal = parseInt(maxAgeRange.value);

            if (minVal >= maxVal) {
                minAgeRange.value = maxVal - 1;
                minAgeOutput.textContent = maxVal - 1;
            } else {
                minAgeOutput.textContent = minVal;
            }
        });

        maxAgeRange.addEventListener('input', () => {
            const minVal = parseInt(minAgeRange.value);
            const maxVal = parseInt(maxAgeRange.value);

            if (maxVal <= minVal) {
                maxAgeRange.value = minVal + 1;
                maxAgeOutput.textContent = minVal + 1;
            } else {
                maxAgeOutput.textContent = maxVal;
            }
        });
    }

    if (distanceRange) {
        const distanceOutput = document.getElementById('distance-value');

        distanceRange.addEventListener('input', () => {
            distanceOutput.textContent = distanceRange.value;
        });
    }
}

// Photo carousel functionality
function initPhotoCarousel() {
    const carousel = document.querySelector('.carousel-inner');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    const items = document.querySelectorAll('.carousel-item');

    if (!carousel || !items.length) return;

    let currentIndex = 0;
    let startX, moveX;
    let isDragging = false;

    // ------ MOUSE EVENTS (for desktop) ------
    carousel.addEventListener('mousedown', function (e) {
        startX = e.clientX;
        isDragging = true;
        carousel.style.transition = 'none';
        e.preventDefault(); // Prevent text selection during drag
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        moveX = e.clientX;
        const diff = moveX - startX;

        // Don't allow drag beyond first and last items
        if ((currentIndex === 0 && diff > 0) ||
            (currentIndex === items.length - 1 && diff < 0)) {
            return;
        }

        // Calculate the position based on drag
        const translate = -currentIndex * 100 + (diff / carousel.offsetWidth) * 100;
        carousel.style.transform = `translateX(${translate}%)`;
    });

    document.addEventListener('mouseup', function () {
        if (!isDragging) return;
        isDragging = false;

        // Restore transition
        carousel.style.transition = 'transform 0.3s ease';

        const diff = moveX - startX;

        // If drag distance is significant, change photo
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex > 0) {
                // Drag right, go to previous photo
                currentIndex--;
            } else if (diff < 0 && currentIndex < items.length - 1) {
                // Drag left, go to next photo
                currentIndex++;
            }
        }

        // Update carousel position
        carousel.style.transform = `translateX(${-currentIndex * 100}%)`;

        // Update indicators
        updateIndicators();
    });

    // ------ TOUCH EVENTS (for mobile) ------
    carousel.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        isDragging = true;
        carousel.style.transition = 'none';
    });

    carousel.addEventListener('touchmove', function (e) {
        if (!isDragging) return;
        moveX = e.touches[0].clientX;
        const diff = moveX - startX;

        // Don't allow swipe beyond first and last items
        if ((currentIndex === 0 && diff > 0) ||
            (currentIndex === items.length - 1 && diff < 0)) {
            return;
        }

        // Move carousel with finger
        const translate = -currentIndex * 100 + (diff / carousel.offsetWidth) * 100;
        carousel.style.transform = `translateX(${translate}%)`;
    });

    carousel.addEventListener('touchend', function () {
        if (!isDragging) return;
        isDragging = false;

        // Restore transition
        carousel.style.transition = 'transform 0.3s ease';

        const diff = moveX - startX;

        // If swipe distance is significant, change photo
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex > 0) {
                // Swipe right, go to previous photo
                currentIndex--;
            } else if (diff < 0 && currentIndex < items.length - 1) {
                // Swipe left, go to next photo
                currentIndex++;
            }
        }

        // Update carousel position
        carousel.style.transform = `translateX(${-currentIndex * 100}%)`;

        // Update indicators
        updateIndicators();
    });

    // Update indicators when clicking on them
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            carousel.style.transition = 'transform 0.3s ease';
            carousel.style.transform = `translateX(${-currentIndex * 100}%)`;
            updateIndicators();
        });
    });

    function updateIndicators() {
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === currentIndex);
        });
    }

    // Add keyboard navigation for accessibility
    document.addEventListener('keydown', function (e) {
        if (document.querySelector('#screen-discover.active')) {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                currentIndex--;
                carousel.style.transition = 'transform 0.3s ease';
                carousel.style.transform = `translateX(${-currentIndex * 100}%)`;
                updateIndicators();
            } else if (e.key === 'ArrowRight' && currentIndex < items.length - 1) {
                currentIndex++;
                carousel.style.transition = 'transform 0.3s ease';
                carousel.style.transform = `translateX(${-currentIndex * 100}%)`;
                updateIndicators();
            }
        }
    });
}

// Favorite button functionality
function initFavoriteButton() {
    const favoriteBtn = document.querySelector('.favorite-btn');

    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function () {
            this.classList.toggle('active');

            // In a real app, you'd save this preference
            if (this.classList.contains('active')) {
                console.log('Added to favorites');
            } else {
                console.log('Removed from favorites');
            }
        });
    }
}

// Add button animation functionality
function initButtonAnimations() {
    const likeBtn = document.querySelector('.like-overlay');
    const dislikeBtn = document.querySelector('.dislike-overlay');

    if (likeBtn) {
        likeBtn.addEventListener('click', function () {
            // Remove animation class first to allow retriggering
            this.classList.remove('animate-like');

            // Force browser to recognize the removal
            void this.offsetWidth;

            // Add animation class
            this.classList.add('animate-like');

            // Optional: Show match animation
            showMatchAnimation(true);

            // In a real app, you'd handle matching logic here
        });
    }

    if (dislikeBtn) {
        dislikeBtn.addEventListener('click', function () {
            // Remove animation class first to allow retriggering
            this.classList.remove('animate-dislike');

            // Force browser to recognize the removal
            void this.offsetWidth;

            // Add animation class
            this.classList.add('animate-dislike');

            // Optional: Show dislike animation
            showMatchAnimation(false);

            // In a real app, you'd handle dislike logic here
        });
    }
}

// API integration functions
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to login');
        }

        // Store auth token and user data
        authToken = data.token;
        userData = data.user;

        // Update authentication state
        isAuthenticated = true;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userData', JSON.stringify(userData));

        // Reset login form fields
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';

        // Show success message
        showToast('Login successful!', 'success');

        // Update UI
        updateUIForAuthState();

        // Redirect to discover page
        changeScreen('user-profile');

    } catch (error) {
        console.error('Login error:', error);
        showToast(error.message || 'Login failed. Please try again.', 'error');
    }
}

// Updated register function to show verification code entry dialog
async function registerUser(username, email, password, birthday) {
    try {
        const response = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password,
                birthday
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        // Reset registration form fields
        document.getElementById('reg-name').value = '';
        document.getElementById('reg-email').value = '';
        document.getElementById('reg-password').value = '';
        document.getElementById('birthday').value = '';

        // Show verification code entry dialog
        document.getElementById('verification-email').value = data.email;
        document.getElementById('verification-code-dialog').classList.add('active');

        // Show toast message
        showToast('Please check your email for a verification code', 'success');

    } catch (error) {
        console.error('Registration error:', error);
        showToast(error.message || 'Registration failed. Please try again.', 'error');
    }
}

// Function to verify email with code
async function verifyEmailWithCode(code, email) {
    try {
        const response = await fetch(`${API_URL}/api/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: code, email })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Verification failed');
        }

        // Reset verification code field
        document.getElementById('verification-code').value = '';

        // Close verification dialog
        document.getElementById('verification-code-dialog').classList.remove('active');

        // Store auth data and update UI
        authToken = data.token;
        userData = data.user;
        isAuthenticated = true;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userData', JSON.stringify(userData));

        // Show success message
        showToast('Email verified! You are now logged in.', 'success');

        // Update UI
        updateUIForAuthState();

        // Navigate to discover page
        changeScreen('user-profile');

        return true;
    } catch (error) {
        console.error('Verification error:', error);
        showToast(error.message || 'Verification failed. Please try again.', 'error');
        return false;
    }
}

// Update password reset flow for code-based verification
async function resetPassword(email) {
    try {
        const response = await fetch(`${API_URL}/api/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to send reset link');
        }

        // Store email for the next step
        document.getElementById('reset-email').value = email;

        // Close current dialog and open reset code dialog
        document.getElementById('forgot-password-dialog').classList.remove('active');
        document.getElementById('reset-code-dialog').classList.add('active');

        return data;
    } catch (error) {
        console.error('Reset password error:', error);
        throw error;
    }
}

// Function to submit reset code
async function submitResetCode(code, email) {
    try {
        // After validating the code, show password reset form
        document.getElementById('reset-token').value = code;
        document.getElementById('reset-code-dialog').classList.remove('active');
        document.getElementById('reset-password-dialog').classList.add('active');
    } catch (error) {
        showToast(error.message || 'Invalid reset code', 'error');
    }
}

// Submit new password with the reset code
async function submitNewPassword(code, newPassword) {
    try {
        const response = await fetch(`${API_URL}/api/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: code, newPassword })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to reset password');
        }

        showToast('Password reset successful! You can now log in.', 'success');
        document.getElementById('reset-password-dialog').classList.remove('active');

        // Switch to login tab
        document.querySelector('.auth-tab[data-tab="login"]').click();

        return true;
    } catch (error) {
        console.error('Reset password error:', error);
        showToast(error.message || 'Failed to reset password', 'error');
        return false;
    }
}

// Initialize additional event listeners for the new forms
function initAdditionalListeners() {
    // Add verification code form handler
    const verificationForm = document.getElementById('verification-code-form');
    if (verificationForm) {
        verificationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const code = document.getElementById('verification-code').value;
            const email = document.getElementById('verification-email').value;

            const submitBtn = verificationForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Verifying...';
            submitBtn.disabled = true;

            try {
                await verifyEmailWithCode(code, email);
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Add reset code form handler
    const resetCodeForm = document.getElementById('reset-code-form');
    if (resetCodeForm) {
        resetCodeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const code = document.getElementById('reset-code').value;
            const email = document.getElementById('reset-email').value;

            const submitBtn = resetCodeForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Verifying...';
            submitBtn.disabled = true;

            try {
                await submitResetCode(code, email);
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Update reset password form handler to use the code
    const resetPasswordForm = document.getElementById('reset-password-form');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const token = document.getElementById('reset-token').value;

            if (newPassword !== confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }

            const submitBtn = resetPasswordForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Resetting...';
            submitBtn.disabled = true;

            try {
                await submitNewPassword(token, newPassword);
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Add resend verification handler
    const resendVerificationLink = document.getElementById('resend-verification');
    if (resendVerificationLink) {
        resendVerificationLink.addEventListener('click', async (e) => {
            e.preventDefault();

            const email = document.getElementById('verification-email').value;
            if (!email) {
                showToast('Email address not found, please try registering again', 'error');
                return;
            }

            try {
                // Call an API to resend verification code
                const response = await fetch(`${API_URL}/api/resend-verification`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error);
                }

                showToast('Verification code resent to your email', 'success');

            } catch (error) {
                showToast(error.message || 'Failed to resend verification code', 'error');
            }
        });
    }
}

// Add this after the initAdditionalListeners function

// Profile Management Functions
function initProfileManagement() {
    // Profile picture upload handling
    const profileImageUpload = document.getElementById('profile-image-upload');
    const profileDisplayImage = document.getElementById('profile-display-image');

    if (profileImageUpload && profileDisplayImage) {
        profileImageUpload.addEventListener('change', function (e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    profileDisplayImage.src = e.target.result;
                };
                reader.readAsDataURL(e.target.files[0]);

                // In a production app, you would upload the image to your server here
                // and update the user's profile with the new image URL

                // For the demo, we'll just update the local userData
                if (userData) {
                    userData.profilePicture = profileDisplayImage.src;
                    localStorage.setItem('userData', JSON.stringify(userData));
                    showToast('Profile picture updated', 'success');
                }
            }
        });
    }

    // Edit section handling
    const editButtons = document.querySelectorAll('.edit-section-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const section = this.dataset.section;
            toggleEditMode(section, true);
        });
    });

    // Cancel edit buttons
    const cancelButtons = document.querySelectorAll('.cancel-edit');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function () {
            const section = this.dataset.section;
            toggleEditMode(section, false);
        });
    });

    // Save edit buttons
    const saveButtons = document.querySelectorAll('.save-edit');
    saveButtons.forEach(button => {
        button.addEventListener('click', function () {
            const section = this.dataset.section;
            saveSection(section);
        });
    });

    // Display name edit handling
    const editNameBtn = document.querySelector('.edit-inline-btn[data-field="displayName"]');
    if (editNameBtn) {
        editNameBtn.addEventListener('click', function () {
            showNameEditModal();
        });
    }

    // Interest options selection
    const interestOptions = document.querySelectorAll('.interest-option');
    interestOptions.forEach(option => {
        option.addEventListener('click', function () {
            this.classList.toggle('selected');
        });
    });

    // Show me preference buttons
    const showMeButtons = document.querySelectorAll('.preference-toggle .toggle-btn');
    showMeButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            showMeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Setup age range sliders
    setupProfileRangeSliders();

    // Logout button
    const logoutBtn = document.querySelector('.logout-button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            logout();
        });
    }

    // Load user data into profile
    populateUserProfileDisplay();
}

// Helper function to toggle edit mode for profile sections
function toggleEditMode(section, isEdit) {
    const displaySection = document.getElementById(`${section}-section-display`);
    const editSection = document.getElementById(`${section}-section-edit`);

    if (displaySection && editSection) {
        if (isEdit) {
            displaySection.style.display = 'none';
            editSection.style.display = 'block';

            // Populate form fields with current values
            loadSectionData(section);
        } else {
            displaySection.style.display = 'block';
            editSection.style.display = 'none';
        }
    }
}

// Load current data into edit forms
function loadSectionData(section) {
    if (!userData) return;

    switch (section) {
        case 'about':
            const bioInput = document.getElementById('bio-input');
            if (bioInput) {
                bioInput.value = userData.bio || '';
            }
            break;

        case 'details':
            const jobInput = document.getElementById('job-input');
            const educationInput = document.getElementById('education-input');

            if (jobInput) {
                jobInput.value = userData.jobTitle || '';
            }

            if (educationInput) {
                educationInput.value = userData.education || '';
            }
            break;

        case 'interests':
            // Clear all selected interests
            document.querySelectorAll('.interest-option').forEach(option => {
                option.classList.remove('selected');
            });

            // Select user's interests
            if (userData.interests && Array.isArray(userData.interests)) {
                userData.interests.forEach(interest => {
                    const option = document.querySelector(`.interest-option[data-interest="${interest}"]`);
                    if (option) {
                        option.classList.add('selected');
                    }
                });
            }
            break;

        case 'preferences':
            // Set show me preference
            if (userData.settings && userData.settings.showMe) {
                const buttons = document.querySelectorAll('.preference-toggle .toggle-btn');
                buttons.forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.value === userData.settings.showMe);
                });
            }

            // Set age range
            if (userData.settings && userData.settings.ageRange) {
                const minRange = document.getElementById('profile-age-min-range');
                const maxRange = document.getElementById('profile-age-max-range');
                const minText = document.getElementById('profile-age-min');
                const maxText = document.getElementById('profile-age-max');

                if (minRange && maxRange && minText && maxText) {
                    minRange.value = userData.settings.ageRange.min || 18;
                    maxRange.value = userData.settings.ageRange.max || 35;
                    minText.textContent = minRange.value;
                    maxText.textContent = maxRange.value;
                }
            }

            // Set distance
            if (userData.settings && userData.settings.distance !== undefined) {
                const distanceRange = document.getElementById('profile-distance-range');
                const distanceText = document.getElementById('profile-distance-value');

                if (distanceRange && distanceText) {
                    distanceRange.value = userData.settings.distance;
                    distanceText.textContent = distanceRange.value;
                }
            }
            break;
    }
}

// Save section data
async function saveSection(section) {
    if (!userData) {
        showToast('You must be logged in to update your profile', 'error');
        return;
    }

    let updateData = {};

    switch (section) {
        case 'about':
            const bioInput = document.getElementById('bio-input');
            updateData.bio = bioInput ? bioInput.value : '';
            break;

        case 'details':
            const jobInput = document.getElementById('job-input');
            const educationInput = document.getElementById('education-input');

            updateData.jobTitle = jobInput ? jobInput.value : '';
            updateData.education = educationInput ? educationInput.value : '';
            break;

        case 'interests':
            const selectedInterests = [];
            document.querySelectorAll('.interest-option.selected').forEach(option => {
                selectedInterests.push(option.dataset.interest);
            });
            updateData.interests = selectedInterests;
            break;

        case 'preferences':
            const showMeBtn = document.querySelector('.preference-toggle .toggle-btn.active');
            const ageMinRange = document.getElementById('profile-age-min-range');
            const ageMaxRange = document.getElementById('profile-age-max-range');
            const distanceRange = document.getElementById('profile-distance-range');

            const preferencesData = {
                showMe: showMeBtn ? showMeBtn.dataset.value : 'everyone',
                ageRange: {
                    min: parseInt(ageMinRange ? ageMinRange.value : 18),
                    max: parseInt(ageMaxRange ? ageMaxRange.value : 35)
                },
                distance: parseInt(distanceRange ? distanceRange.value : 15)
            };

            // Update user data
            if (!userData.settings) userData.settings = {};
            userData.settings = { ...userData.settings, ...preferencesData };
            localStorage.setItem('userData', JSON.stringify(userData));

            // In a real app, send this to the server
            try {
                await updateUserPreferences(preferencesData);
                showToast('Preferences updated', 'success');
            } catch (error) {
                showToast('Failed to update preferences', 'error');
            }

            // Update display
            populateUserProfileDisplay();
            toggleEditMode(section, false);
            return;
    }

    // Update user data
    userData = { ...userData, ...updateData };
    localStorage.setItem('userData', JSON.stringify(userData));

    // In a real app, send this to the server
    try {
        await updateUserProfile(updateData);
        showToast('Profile updated', 'success');
    } catch (error) {
        showToast('Failed to update profile', 'error');
    }

    // Update display
    populateUserProfileDisplay();
    toggleEditMode(section, false);
}

// Setup range sliders for profile preferences
function setupProfileRangeSliders() {
    const minAgeRange = document.getElementById('profile-age-min-range');
    const maxAgeRange = document.getElementById('profile-age-max-range');
    const distanceRange = document.getElementById('profile-distance-range');

    if (minAgeRange && maxAgeRange) {
        const minAgeOutput = document.getElementById('profile-age-min');
        const maxAgeOutput = document.getElementById('profile-age-max');

        minAgeRange.addEventListener('input', () => {
            const minVal = parseInt(minAgeRange.value);
            const maxVal = parseInt(maxAgeRange.value);

            if (minVal >= maxVal) {
                minAgeRange.value = maxVal - 1;
                minAgeOutput.textContent = maxVal - 1;
            } else {
                minAgeOutput.textContent = minVal;
            }
        });

        maxAgeRange.addEventListener('input', () => {
            const minVal = parseInt(minAgeRange.value);
            const maxVal = parseInt(maxAgeRange.value);

            if (maxVal <= minVal) {
                maxAgeRange.value = minVal + 1;
                maxAgeOutput.textContent = minVal + 1;
            } else {
                maxAgeOutput.textContent = maxVal;
            }
        });
    }

    if (distanceRange) {
        const distanceOutput = document.getElementById('profile-distance-value');
        distanceRange.addEventListener('input', () => {
            distanceOutput.textContent = distanceRange.value;
        });
    }
}

// Show name edit modal
function showNameEditModal() {
    // Create modal if it doesn't exist
    let modal = document.querySelector('.name-edit-modal');

    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'name-edit-modal';
        modal.innerHTML = `
            <h3>Edit Your Name</h3>
            <div class="form-group">
                <label for="display-name-input">Display Name</label>
                <div class="input-icon-wrapper">
                    <i class="fas fa-user"></i>
                    <input type="text" id="display-name-input" placeholder="Your display name">
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" id="cancel-name-edit">Cancel</button>
                <button class="btn-primary" id="save-name-edit">Save</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        document.getElementById('cancel-name-edit').addEventListener('click', () => {
            modal.classList.remove('active');
        });

        document.getElementById('save-name-edit').addEventListener('click', async () => {
            const nameInput = document.getElementById('display-name-input');
            if (nameInput && nameInput.value.trim()) {
                const newName = nameInput.value.trim();

                // Update UI
                document.getElementById('display-name-text').textContent = newName;

                // Update user data
                if (userData) {
                    userData.displayName = newName;
                    localStorage.setItem('userData', JSON.stringify(userData));

                    // In a real app, send this to the server
                    try {
                        await updateUserProfile({ displayName: newName });
                        showToast('Name updated', 'success');
                    } catch (error) {
                        showToast('Failed to update name', 'error');
                    }
                }

                modal.classList.remove('active');
            }
        });
    }

    // Set current value
    const nameInput = document.getElementById('display-name-input');
    if (nameInput && userData) {
        nameInput.value = userData.displayName || userData.username || '';
    }

    // Show modal
    modal.classList.add('active');
}

// Populate user profile display with current data
function populateUserProfileDisplay() {
    if (!userData) return;

    // Set display name
    const displayNameEl = document.getElementById('display-name-text');
    if (displayNameEl) {
        displayNameEl.textContent = userData.displayName || userData.username || 'User';
    }

    // Set profile picture
    const profileImage = document.getElementById('profile-display-image');
    if (profileImage && userData.profilePicture) {
        profileImage.src = userData.profilePicture;
    }

    // Set bio
    const bioEl = document.querySelector('#about-section-display .profile-bio');
    if (bioEl) {
        bioEl.textContent = userData.bio || 'Share a little about yourself, your interests, and what you\'re looking for.';
    }

    // Set job
    const jobEl = document.getElementById('job-display');
    if (jobEl) {
        jobEl.textContent = userData.jobTitle || 'Add your job';
    }

    // Set education
    const educationEl = document.getElementById('education-display');
    if (educationEl) {
        educationEl.textContent = userData.education || 'Add your education';
    }

    // Set birthday
    const birthdayEl = document.getElementById('birthday-display');
    if (birthdayEl && userData.settings && userData.settings.dob) {
        const dobDate = new Date(userData.settings.dob);
        birthdayEl.textContent = dobDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    // Set interests
    const interestsContainer = document.querySelector('#interests-section-display .interests-container');
    if (interestsContainer && userData.interests && Array.isArray(userData.interests)) {
        interestsContainer.innerHTML = '';

        if (userData.interests.length === 0) {
            interestsContainer.innerHTML = '<p class="profile-bio">Add some interests to help others get to know you better.</p>';
        } else {
            userData.interests.forEach(interest => {
                const interestTag = document.createElement('span');
                interestTag.className = 'interest-tag';
                interestTag.textContent = interest.charAt(0).toUpperCase() + interest.slice(1);
                interestsContainer.appendChild(interestTag);
            });
        }
    }

    // Set preferences
    if (userData.settings) {
        // Show me
        const showMeEl = document.getElementById('show-me-display');
        if (showMeEl && userData.settings.showMe) {
            showMeEl.textContent = userData.settings.showMe.charAt(0).toUpperCase() + userData.settings.showMe.slice(1);
        }

        // Age range
        const ageRangeEl = document.getElementById('age-range-display');
        if (ageRangeEl && userData.settings.ageRange) {
            ageRangeEl.textContent = `${userData.settings.ageRange.min}-${userData.settings.ageRange.max}`;
        }

        // Distance
        const distanceEl = document.getElementById('distance-display');
        if (distanceEl && userData.settings.distance !== undefined) {
            distanceEl.textContent = `${userData.settings.distance} miles`;
        }
    }
}

// Add this call at the end of your existing initialization
document.addEventListener('DOMContentLoaded', function () {
    // Existing initialization
    init();
    initAdditionalListeners();
    initProfileManagement();

    // Show save button success message
    const saveBtn = document.getElementById('profile-save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            showToast('All changes saved successfully', 'success');
        });
    }
});