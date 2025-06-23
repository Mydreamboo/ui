/**
 * Dummy profiles for development and testing
 */
window.dummyProfiles = [
    {
        id: "dummy1",
        name: "Alexis Johnson",
        age: 27,
        gender: "female",
        photos: ["https://randomuser.me/api/portraits/women/2.jpg"],
        interests: ["Music", "Travel", "Fitness"],
        occupation: "Engineer",
        bio: "Yoga instructor by day, bookworm by night. I love finding hidden coffee shops and practicing mindfulness. Looking for someone who values personal growth and adventure.",
        lookingFor: "A mindful partner who enjoys deep conversations and spontaneous adventures.",
        location: { city: "NYC", state: "NY", coordinates: { latitude: 40.71, longitude: -74.00 }, distance: 2 }
    },
    {
        id: "dummy2",
        name: "Samantha Lee",
        age: 24,
        gender: "female",
        photos: ["https://randomuser.me/api/portraits/women/2.jpg"],
        interests: ["Art", "Yoga", "Cooking"],
        occupation: "Designer",
        bio: "Art is my passion.",
        lookingFor: "Relationship",
        location: { city: "Brooklyn", state: "NY", coordinates: { latitude: 40.68, longitude: -73.95 }, distance: 5 }
    },
    {
        id: "user1",
        name: "Jessica",
        age: 26,
        gender: "female",
        location: {
            city: "Los Angeles",
            state: "CA",
            coordinates: {
                latitude: 34.0522,
                longitude: -118.2437
            },
            distance: 3 // miles away
        },
        occupation: "Photographer",
        education: "Art Institute",
        bio: "Hey there! I'm a professional photographer with a passion for capturing beautiful moments. When I'm not behind the camera, you can find me exploring hiking trails or checking out local art galleries.",
        interests: ["Photography", "Travel", "Art", "Hiking", "Music"],
        lookingFor: "Someone who appreciates art and nature. Bonus points if you know the best hiking spots or can recommend a good indie band!",
        photos: [
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80",
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80",
            "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=500&q=80"
        ],
        active: true,
        lastActive: "10 minutes ago",
        verified: true
    },
    {
        id: "user2",
        name: "Sophia",
        age: 24,
        gender: "female",
        location: {
            city: "New York",
            state: "NY",
            coordinates: {
                latitude: 40.7128,
                longitude: -74.0060
            },
            distance: 1.5 // miles away
        },
        occupation: "Yoga Instructor",
        education: "NYU",
        bio: "Yoga instructor by day, bookworm by night. I love finding hidden coffee shops and practicing mindfulness. Looking for someone who values personal growth and adventure.",
        interests: ["Yoga", "Reading", "Meditation", "Coffee", "Travel"],
        lookingFor: "A mindful partner who enjoys deep conversations and spontaneous adventures.",
        photos: [
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80"
        ],
        active: true,
        lastActive: "2 hours ago",
        verified: true
    },
    {
        id: "user3",
        name: "Michelle",
        age: 28,
        gender: "female",
        location: {
            city: "Chicago",
            state: "IL",
            coordinates: {
                latitude: 41.8781,
                longitude: -87.6298
            },
            distance: 5 // miles away
        },
        occupation: "Software Developer",
        education: "University of Chicago",
        bio: "Tech enthusiast who loves coding and creating apps. When I'm not in front of my computer, I'm playing guitar or trying out new restaurants. I believe in work hard, play harder!",
        interests: ["Yoga", "Reading", "Meditation", "Coffee", "Travel", "Coding", "Music", "Food", "Gaming", "Movies"],
        lookingFor: "Someone who appreciates good food and doesn't mind my terrible jokes.",
        photos: [
            "https://randomuser.me/api/portraits/women/6.jpg",
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=80",
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=80"
        ],
        active: true,
        lastActive: "1 day ago",
        verified: true
    },
    {
        id: "user4",
        name: "Emma",
        age: 25,
        gender: "female",
        location: {
            city: "San Francisco",
            state: "CA",
            coordinates: {
                latitude: 37.7749,
                longitude: -122.4194
            },
            distance: 2.1 // miles away
        },
        occupation: "Marketing Manager",
        education: "Stanford University",
        bio: "Marketing professional with a love for art and design. I spend my weekends at museums, farmers markets, and experimenting with new recipes. Looking for someone to share these experiences with.",
        interests: ["Art", "Cooking", "Markets", "Museums", "Wine Tasting"],
        lookingFor: "A partner in crime for culinary adventures and museum hopping.",
        photos: [
            "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=500&q=80",
            "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=500&q=80"
        ],
        active: true,
        lastActive: "Just now",
        verified: true
    },
    {
        id: "user5",
        name: "Alex",
        age: 27,
        gender: "male",
        location: {
            city: "Austin",
            state: "TX",
            coordinates: {
                latitude: 30.2672,
                longitude: -97.7431
            },
            distance: 4.5 // miles away
        },
        occupation: "Music Producer",
        education: "Berklee College of Music",
        bio: "Music producer and DJ with a passion for creating unique sounds. When I'm not in the studio, I'm at concerts or exploring the outdoors. Looking for someone who shares my love for music and adventure.",
        interests: ["Music Production", "Concerts", "Hiking", "Travel", "Photography"],
        lookingFor: "A creative soul who appreciates good music and isn't afraid to dance in public.",
        photos: [
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80",
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80"
        ],
        active: false,
        lastActive: "3 days ago",
        verified: true
    },
    {
        id: "user6",
        name: "Olivia",
        age: 23,
        gender: "female",
        location: {
            city: "Portland",
            state: "OR",
            coordinates: {
                latitude: 45.5051,
                longitude: -122.6750
            },
            distance: 1.8 // miles away
        },
        occupation: "Environmental Scientist",
        education: "Oregon State University",
        bio: "Environmental scientist passionate about sustainability and outdoor adventures. You'll find me hiking, camping, or volunteering at community gardens. Let's make the world a better place together!",
        interests: ["Environmentalism", "Hiking", "Camping", "Gardening", "Sustainability"],
        lookingFor: "An eco-conscious partner for outdoor adventures and making a positive impact.",
        photos: [
            "https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?w=500&q=80",
            "https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?w=500&q=80"
        ],
        active: true,
        lastActive: "5 hours ago",
        verified: true
    },
    {
        id: "user7",
        name: "Ethan",
        age: 29,
        gender: "male",
        location: {
            city: "Seattle",
            state: "WA",
            coordinates: {
                latitude: 47.6062,
                longitude: -122.3321
            },
            distance: 3.2 // miles away
        },
        occupation: "Architect",
        education: "University of Washington",
        bio: "Architect with a love for innovative design and urban exploring. Coffee enthusiast and amateur photographer. Looking for someone to share cozy rainy days and adventures around the city.",
        interests: ["Architecture", "Design", "Photography", "Coffee", "Urban Exploring"],
        lookingFor: "Someone who appreciates aesthetics, good conversation, and isn't afraid of Seattle rain.",
        photos: [
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80"
        ],
        active: true,
        lastActive: "1 hour ago",
        verified: true
    },
    {
        id: "user8",
        name: "Ava",
        age: 24,
        gender: "female",
        location: {
            city: "Denver",
            state: "CO",
            coordinates: {
                latitude: 39.7392,
                longitude: -104.9903
            },
            distance: 2.9 // miles away
        },
        occupation: "Fitness Trainer",
        education: "Colorado State University",
        bio: "Fitness trainer and outdoor enthusiast. When I'm not at the gym, I'm hiking, skiing, or trying out new healthy recipes. Looking for someone who shares my active lifestyle and passion for wellness.",
        interests: ["Fitness", "Hiking", "Skiing", "Cooking", "Nutrition"],
        lookingFor: "An active partner who values health and wellness but also knows how to enjoy a good cheat day.",
        photos: [
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80"
        ],
        active: true,
        lastActive: "30 minutes ago",
        verified: true
    },
    {
        id: "user9",
        name: "Noah",
        age: 30,
        gender: "male",
        location: {
            city: "Boston",
            state: "MA",
            coordinates: {
                latitude: 42.3601,
                longitude: -71.0589
            },
            distance: 4.1 // miles away
        },
        occupation: "History Professor",
        education: "Harvard University",
        bio: "History professor with a passion for literature, art, and thoughtful conversations. Weekends are for museums, bookstores, and exploring historical sites. Looking for an intellectual connection and shared adventures.",
        interests: ["History", "Literature", "Art", "Museums", "Travel"],
        lookingFor: "A kindred spirit who enjoys intellectual discussions and cultural experiences.",
        photos: [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80"
        ],
        active: false,
        lastActive: "2 days ago",
        verified: true
    },
    {
        id: "user10",
        name: "Isabella",
        age: 26,
        gender: "female",
        location: {
            city: "Miami",
            state: "FL",
            coordinates: {
                latitude: 25.7617,
                longitude: -80.1918
            },
            distance: 0.8 // miles away
        },
        occupation: "Marine Biologist",
        education: "University of Miami",
        bio: "Marine biologist with a love for the ocean and conservation. You'll find me diving, at the beach, or volunteering for ocean cleanup projects. Looking for someone who shares my passion for protecting our planet.",
        interests: ["Marine Biology", "Diving", "Beach", "Conservation", "Swimming"],
        lookingFor: "A fellow ocean lover who wants to make a difference and enjoy beautiful sunsets.",
        photos: [
            "https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=500&q=80",
            "https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=500&q=80"
        ],
        active: true,
        lastActive: "Just now",
        verified: true
    }
];

// Signal that profiles are ready
document.dispatchEvent(new Event('dummyProfilesLoaded'));