// besturf - Turf Booking Platform JavaScript
// Main application file with all functionality

// Global variables
let map;
let userLocation = null;
let turfData = [];
let currentUser = null;
let bookingDetails = {};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize map
    initMap();
    
    // Load turf data
    loadTurfData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup modal click-outside functionality
    setupModalClickOutside();
    
    // Check for logged in user
    checkUserSession();
    
    // Setup mobile menu
    setupMobileMenu();
}

// Map initialization
function initMap() {
    // Default coordinates (India)
    const defaultCoords = [20.5937, 78.9629];
    
    map = L.map('map').setView(defaultCoords, 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Try to get user location
    getCurrentLocation();
}

// Get user's current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Update map view
                map.setView([userLocation.lat, userLocation.lng], 13);
                
                // Add user location marker
                L.marker([userLocation.lat, userLocation.lng])
                    .addTo(map)
                    .bindPopup('Your Location')
                    .openPopup();
                
                // Find nearby turfs
                findNearbyTurfs();
            },
            (error) => {
                console.error('Error getting location:', error);
                showNotification('Location access denied. Showing all turfs.', 'warning');
            }
        );
    } else {
        showNotification('Geolocation is not supported by this browser.', 'error');
    }
}

// Load turf data (mock data for demo)
function loadTurfData() {
    turfData = [
        {
            id: 1,
            name: "Green Valley Sports Complex",
            location: "Mumbai, Maharashtra",
            sport: "football",
            price: 800,
            rating: 4.5,
            image: "🏟️",
            amenities: ["Parking", "Changing Rooms", "Equipment Rental"],
            lat: 19.0760,
            lng: 72.8777,
            availableSlots: ["09:00-10:00", "10:00-11:00", "14:00-15:00", "16:00-17:00"]
        },
        {
            id: 2,
            name: "City Cricket Ground",
            location: "Delhi, NCR",
            sport: "cricket",
            price: 1200,
            rating: 4.8,
            image: "🏏",
            amenities: ["Parking", "Cafeteria", "Coaching"],
            lat: 28.7041,
            lng: 77.1025,
            availableSlots: ["08:00-10:00", "10:00-12:00", "14:00-16:00"]
        },
        {
            id: 3,
            name: "Elite Tennis Academy",
            location: "Bangalore, Karnataka",
            sport: "tennis",
            price: 600,
            rating: 4.3,
            image: "🎾",
            amenities: ["Parking", "Coaching", "Equipment"],
            lat: 12.9716,
            lng: 77.5946,
            availableSlots: ["06:00-07:00", "07:00-08:00", "18:00-19:00", "19:00-20:00"]
        },
        {
            id: 4,
            name: "Royal Badminton Court",
            location: "Chennai, Tamil Nadu",
            sport: "badminton",
            price: 400,
            rating: 4.6,
            image: "🏸",
            amenities: ["AC", "Parking", "Shower"],
            lat: 13.0827,
            lng: 80.2707,
            availableSlots: ["07:00-08:00", "08:00-09:00", "17:00-18:00", "18:00-19:00"]
        },
        {
            id: 5,
            name: "Premier Football Arena",
            location: "Pune, Maharashtra",
            sport: "football",
            price: 1000,
            rating: 4.7,
            image: "⚽",
            amenities: ["Parking", "Cafeteria", "Live Streaming"],
            lat: 18.5204,
            lng: 73.8567,
            availableSlots: ["09:00-10:00", "11:00-12:00", "15:00-16:00", "17:00-18:00"]
        },
        {
            id: 6,
            name: "Champions Cricket Club",
            location: "Hyderabad, Telangana",
            sport: "cricket",
            price: 1500,
            rating: 4.9,
            image: "🏏",
            amenities: ["Parking", "Coaching", "Equipment", "Cafeteria"],
            lat: 17.4065,
            lng: 78.4772,
            availableSlots: ["07:00-09:00", "09:00-11:00", "14:00-16:00", "16:00-18:00"]
        }
    ];
    
    displayTurfs(turfData);
    addMarkersToMap(turfData);
}

// Display turfs in grid
function displayTurfs(turfs) {
    const turfList = document.getElementById('turfList');
    turfList.innerHTML = '';
    
    if (turfs.length === 0) {
        turfList.innerHTML = '<p class="no-results">No turfs found matching your criteria.</p>';
        return;
    }
    
    turfs.forEach(turf => {
        const turfCard = createTurfCard(turf);
        turfList.appendChild(turfCard);
    });
}

// Create turf card element
function createTurfCard(turf) {
    const card = document.createElement('div');
    card.className = 'turf-card';
    card.innerHTML = `
        <div class="turf-image">${turf.image}</div>
        <div class="turf-info">
            <h3 class="turf-name">${turf.name}</h3>
            <p class="turf-location"><i class="fas fa-map-marker-alt"></i> ${turf.location}</p>
            <p class="turf-sport"><i class="fas fa-futbol"></i> ${turf.sport.charAt(0).toUpperCase() + turf.sport.slice(1)}</p>
            <p class="turf-price"><i class="fas fa-rupee-sign"></i> ${turf.price}/hour</p>
            <div class="turf-rating">
                <i class="fas fa-star" style="color: #ffd700;"></i> ${turf.rating}
            </div>
            <div class="turf-amenities">
                <small>${turf.amenities.join(' • ')}</small>
            </div>
            <button class="book-btn" onclick="openBookingModal(${turf.id})">Book Now</button>
        </div>
    `;
    return card;
}

// Add markers to map
function addMarkersToMap(turfs) {
    turfs.forEach(turf => {
        const marker = L.marker([turf.lat, turf.lng])
            .addTo(map)
            .bindPopup(`
                <div style="min-width: 200px;">
                    <h4>${turf.name}</h4>
                    <p>${turf.location}</p>
                    <p>₹${turf.price}/hour</p>
                    <button onclick="openBookingModal(${turf.id})" style="
                        background: var(--primary-green);
                        color: white;
                        border: none;
                        padding: 5px 10px;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Book Now</button>
                </div>
            `);
    });
}

// Search functionality
function searchTurfs() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        displayTurfs(turfData);
        return;
    }
    
    const filteredTurfs = turfData.filter(turf => 
        turf.name.toLowerCase().includes(searchTerm) ||
        turf.location.toLowerCase().includes(searchTerm) ||
        turf.sport.toLowerCase().includes(searchTerm)
    );
    
    displayTurfs(filteredTurfs);
}

// Filter functionality
function applyFilters() {
    const sportFilter = document.getElementById('sportFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    
    let filteredTurfs = [...turfData];
    
    if (sportFilter) {
        filteredTurfs = filteredTurfs.filter(turf => turf.sport === sportFilter);
    }
    
    if (priceFilter) {
        const [min, max] = priceFilter.split('-');
        if (max === '+') {
            filteredTurfs = filteredTurfs.filter(turf => turf.price >= parseInt(min));
        } else {
            filteredTurfs = filteredTurfs.filter(turf => 
                turf.price >= parseInt(min) && turf.price <= parseInt(max)
            );
        }
    }
    
    displayTurfs(filteredTurfs);
}

// Find nearby turfs
function findNearbyTurfs() {
    if (!userLocation) return;
    
    const nearbyTurfs = turfData.filter(turf => {
        const distance = calculateDistance(
            userLocation.lat, userLocation.lng,
            turf.lat, turf.lng
        );
        return distance <= 50; // 50km radius
    });
    
    displayTurfs(nearbyTurfs);
}

// Calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Modal functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function openRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
    closeLoginModal();
}

function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
}

function openBookingModal(turfId) {
    const turf = turfData.find(t => t.id === turfId);
    if (!turf) return;
    
    bookingDetails = { turf };
    
    const modal = document.getElementById('bookingModal');
    const turfDetails = document.getElementById('turfDetails');
    
    turfDetails.innerHTML = `
        <h3>${turf.name}</h3>
        <p><i class="fas fa-map-marker-alt"></i> ${turf.location}</p>
        <p><i class="fas fa-rupee-sign"></i> ₹${turf.price}/hour</p>
    `;
    
    // Set minimum date to today
    const bookingDate = document.getElementById('bookingDate');
    bookingDate.min = new Date().toISOString().split('T')[0];
    bookingDate.value = new Date().toISOString().split('T')[0];
    
    // Load time slots
    loadTimeSlots(turf.availableSlots);
    
    document.getElementById('bookingAmount').textContent = turf.price;
    
    modal.style.display = 'block';
}

function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

function openPaymentModal() {
    document.getElementById('paymentModal').style.display = 'block';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

// Load time slots
function loadTimeSlots(slots) {
    const timeSlotsContainer = document.getElementById('timeSlots');
    timeSlotsContainer.innerHTML = '';
    
    slots.forEach(slot => {
        const slotElement = document.createElement('div');
        slotElement.className = 'time-slot available';
        slotElement.textContent = slot;
        slotElement.onclick = () => selectTimeSlot(slotElement);
        timeSlotsContainer.appendChild(slotElement);
    });
}

// Select time slot
function selectTimeSlot(element) {
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    element.classList.add('selected');
    bookingDetails.timeSlot = element.textContent;
}

// Setup modal click-outside functionality
function setupModalClickOutside() {
    // Get all modals
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            // Check if click was outside the modal content
            if (e.target === modal) {
                // Close the modal
                modal.style.display = 'none';
            }
        });
    });
}

// Event listeners setup
function setupEventListeners() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchTurfs();
        }
    });
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // Booking form
    document.getElementById('bookingForm').addEventListener('submit', handleBooking);
    
    // Payment form
    document.getElementById('paymentForm').addEventListener('submit', handlePayment);
    
    // Close modals when clicking outside
    setupModalClickOutside();
    
    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Setup mobile menu
function setupMobileMenu() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navMenu = document.querySelector('.nav-menu');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.hamburger')?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const type = document.getElementById('loginType').value;
    
    // Mock authentication
    if (email && password) {
        currentUser = {
            email,
            type,
            name: email.split('@')[0]
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        closeLoginModal();
        showNotification('Login successful!', 'success');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const phone = document.getElementById('regPhone').value;
    
    // Mock registration
    if (name && email && password && phone) {
        currentUser = {
            name,
            email,
            phone,
            type: 'customer'
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        closeRegisterModal();
        showNotification('Registration successful!', 'success');
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    if (!currentUser) return;
    
    // Hide login/register buttons
    document.querySelector('.btn-login').style.display = 'none';
    document.querySelector('.btn-register').style.display = 'none';
    
    // Show user menu or dashboard
    const navMenu = document.querySelector('.nav-menu');
    const userItem = document.createElement('li');
    userItem.innerHTML = `
        <span style="color: white; margin-right: 10px;">Hi ${currentUser.name}!</span>
        <button onclick="showDashboard()" style="background: var(--primary-green); color: white; border: none; padding: 5px 10px; border-radius: 4px;">Dashboard</button>
        <button onclick="logout()" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; margin-left: 5px;">Logout</button>
    `;
    navMenu.appendChild(userItem);
}

// Show dashboard
function showDashboard() {
    document.getElementById('userDashboard').style.display = 'block';
    loadUserBookings();
}

// Load user bookings
function loadUserBookings() {
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const bookingList = document.getElementById('bookingList');
    
    if (bookings.length === 0) {
        bookingList.innerHTML = '<p>No bookings yet.</p>';
        return;
    }
    
    bookingList.innerHTML = bookings.map(booking => `
        <div class="booking-item">
            <h4>${booking.turfName}</h4>
            <p><strong>Date:</strong> ${booking.date}</p>
            <p><strong>Time:</strong> ${booking.timeSlot}</p>
            <p><strong>Amount:</strong> ₹${booking.amount}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
        </div>
    `).join('');
}

// Handle booking
function handleBooking(e) {
    e.preventDefault();
    
    const date = document.getElementById('bookingDate').value;
    const timeSlot = bookingDetails.timeSlot;
    
    if (!timeSlot) {
        showNotification('Please select a time slot', 'error');
        return;
    }
    
    bookingDetails.date = date;
    bookingDetails.amount = bookingDetails.turf.price;
    
    openPaymentModal();
}

// Handle payment
function handlePayment(e) {
    e.preventDefault();
    
    // Mock payment processing
    const booking = {
        id: Date.now(),
        turfName: bookingDetails.turf.name,
        date: bookingDetails.date,
        timeSlot: bookingDetails.timeSlot,
        amount: bookingDetails.amount,
        status: 'Confirmed',
        bookedAt: new Date().toISOString()
    };
    
    // Save booking
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('userBookings', JSON.stringify(bookings));
    
    closePaymentModal();
    closeBookingModal();
    
    showNotification('Booking confirmed! Check your dashboard.', 'success');
    
    // Reload bookings
    if (document.getElementById('userDashboard').style.display !== 'none') {
        loadUserBookings();
    }
}

// Check user session
function checkUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userBookings');
    currentUser = null;
    location.reload();
}

// Show dashboard section
function showSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        zIndex: '9999',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = '#2ecc71';
            break;
        case 'error':
            notification.style.background = '#e74c3c';
            break;
        case 'warning':
            notification.style.background = '#f39c12';
            break;
        default:
            notification.style.background = '#3498db';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    return timeString;
}

// Export functions for global access
window.besturf = {
    searchTurfs,
    applyFilters,
    getCurrentLocation,
    openBookingModal,
    openLoginModal,
    openRegisterModal,
    logout
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeApp);
