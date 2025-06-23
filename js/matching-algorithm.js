/**
 * Matching algorithm for finding compatible partners based on location, interests, and preferences
 */

class MatchingAlgorithm {
    /**
     * Calculate match score between current user and potential match
     * @param {Object} currentUser - The logged-in user
     * @param {Object} potentialMatch - A potential match user
     * @returns {Object} Score details and overall score
     */
    static calculateMatchScore(currentUser, potentialMatch) {
        if (!currentUser || !potentialMatch) return { total: 0, details: {} };

        // Initialize score components
        const scoreDetails = {
            distance: 0,
            interests: 0,
            agePreference: 0,
            activityScore: 0
        };

        // 1. Proximity score (max 30 points) - closer is better
        if (currentUser.location?.coordinates && potentialMatch.location?.coordinates) {
            const distance = this.calculateDistance(
                currentUser.location.coordinates,
                potentialMatch.location.coordinates
            );

            // Score decreases as distance increases (max 30 at 0 miles, min 0 at 30+ miles)
            scoreDetails.distance = Math.max(0, 30 - distance);
        }

        // 2. Interests match (max 40 points)
        if (currentUser.interests && potentialMatch.interests) {
            const currentUserInterests = new Set(currentUser.interests.map(i => i.toLowerCase()));
            const matchingInterests = potentialMatch.interests.filter(
                interest => currentUserInterests.has(interest.toLowerCase())
            );

            // Each matching interest is worth points (max 40)
            scoreDetails.interests = Math.min(40, matchingInterests.length * 8);
        }

        // 3. Age preference match (max 20 points)
        if (currentUser.settings?.ageRange && potentialMatch.age) {
            const { min: minAge, max: maxAge } = currentUser.settings.ageRange;

            if (potentialMatch.age >= minAge && potentialMatch.age <= maxAge) {
                // Full points if within preferred range
                scoreDetails.agePreference = 20;
            } else {
                // Partial points if close to range
                const distanceFromRange = Math.min(
                    Math.abs(potentialMatch.age - minAge),
                    Math.abs(potentialMatch.age - maxAge)
                );
                scoreDetails.agePreference = Math.max(0, 20 - distanceFromRange * 5);
            }
        }

        // 4. Activity score (max 10 points) - recent activity is better
        if (potentialMatch.active) {
            scoreDetails.activityScore = 10;
        } else if (potentialMatch.lastActive && potentialMatch.lastActive.includes('hour')) {
            scoreDetails.activityScore = 8;
        } else if (potentialMatch.lastActive && potentialMatch.lastActive.includes('day')) {
            scoreDetails.activityScore = 5;
        } else {
            scoreDetails.activityScore = 2;
        }

        // Calculate total score (max 100)
        const totalScore = Object.values(scoreDetails).reduce((sum, score) => sum + score, 0);

        return {
            total: totalScore,
            details: scoreDetails,
            compatibilityPercentage: Math.round(totalScore) // Out of 100
        };
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     * @param {Object} coords1 - First coordinates {latitude, longitude}
     * @param {Object} coords2 - Second coordinates {latitude, longitude}
     * @returns {number} Distance in miles
     */
    static calculateDistance(coords1, coords2) {
        const R = 3958.8; // Earth's radius in miles

        // Convert latitude and longitude from degrees to radians
        const lat1Rad = this.toRadians(coords1.latitude);
        const lon1Rad = this.toRadians(coords1.longitude);
        const lat2Rad = this.toRadians(coords2.latitude);
        const lon2Rad = this.toRadians(coords2.longitude);

        // Haversine formula
        const dLat = lat2Rad - lat1Rad;
        const dLon = lon2Rad - lon1Rad;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in miles
    }

    /**
     * Convert degrees to radians
     */
    static toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    /**
     * Get matches for the current user sorted by compatibility
     * @param {Object} currentUser - The current user
     * @param {Array} potentialMatches - Array of potential matches
     * @returns {Array} Sorted matches with scores
     */
    static getMatchesForUser(currentUser, potentialMatches) {
        if (!currentUser || !potentialMatches || !potentialMatches.length) {
            return [];
        }

        // Calculate scores for all potential matches
        const scoredMatches = potentialMatches.map(match => {
            const matchScore = this.calculateMatchScore(currentUser, match);
            return {
                ...match,
                matchScore: matchScore.total,
                compatibilityPercentage: matchScore.compatibilityPercentage,
                matchDetails: matchScore.details
            };
        });

        // Sort by score (highest first)
        return scoredMatches.sort((a, b) => b.matchScore - a.matchScore);
    }

    /**
     * Apply filters to a list of potential matches
     * @param {Array} matches - Array of potential matches with scores
     * @param {Object} filters - Filter criteria
     * @returns {Array} Filtered matches
     */
    static applyFilters(matches, filters) {
        if (!matches || !matches.length || !filters) return matches;

        console.log('Applying filters:', filters);

        return matches.filter(match => {
            // Filter by age
            if (filters.ageRange && (match.age < filters.ageRange.min || match.age > filters.ageRange.max)) {
                return false;
            }

            // Filter by distance
            if (filters.maxDistance && match.location && match.location.distance > filters.maxDistance) {
                return false;
            }

            // Filter by gender
            if (filters.showMe && filters.showMe !== 'everyone') {
                const showMeGender = filters.showMe.toLowerCase();
                const matchGender = match.gender ? match.gender.toLowerCase() : '';

                if (showMeGender === 'men' && matchGender !== 'male') {
                    return false;
                }

                if (showMeGender === 'women' && matchGender !== 'female') {
                    return false;
                }
            }

            // Filter by interests (if any interests are selected)
            if (filters.interests && filters.interests.length > 0) {
                // Must have at least one matching interest
                const matchInterests = match.interests || [];
                const hasMatchingInterest = matchInterests.some(interest =>
                    filters.interests.includes(interest.toLowerCase())
                );

                if (!hasMatchingInterest) {
                    return false;
                }
            }

            return true;
        });
    }
}

// Ensure algorithm is available in the global scope
if (typeof window !== 'undefined') {
    window.MatchingAlgorithm = MatchingAlgorithm;
    console.log("Matching algorithm loaded and available");

    // Signal that the algorithm is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        document.dispatchEvent(new Event('matchingAlgorithmLoaded'));
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            document.dispatchEvent(new Event('matchingAlgorithmLoaded'));
        });
    }
}