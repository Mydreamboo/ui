/* filepath: /Users/admin/Documents/Apps/MyDreamBoo/ui/js/app.js */

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const screens = document.querySelectorAll('.screen');
const loginBtn = document.querySelector('#login-btn');
const registerBtn = document.querySelector('#register-btn');
const loginDialog = document.querySelector('#login-dialog');
const registerDialog = document.querySelector('#register-dialog');
const forgotDialog = document.querySelector('#forgot-dialog');
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
            closeDialog(loginDialog);
            setTimeout(() => {
                openDialog(registerDialog);
            }, 300);
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
            closeDialog(loginDialog);
            setTimeout(() => {
                openDialog(forgotDialog);
            }, 300);
        });
    }

    if (backToLoginLink) {
        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeDialog(forgotDialog);
            setTimeout(() => {
                openDialog(loginDialog);
            }, 300);
        });
    }

    // Range input handlers
    setupRangeInputs();

    // Form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted:', e.target.id);
            // Add your form handling logic here
        });
    });

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
}

// Function to switch between screens
function changeScreen(screenId) {
    // Hide all screens
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // Show the selected screen
    const targetScreen = document.querySelector(`#screen-${screenId}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }

    // Update navigation
    navItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-screen') === screenId);
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
    dialog.classList.remove('active');
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

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);