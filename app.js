// Store data
let turfData = [];
let currentUser = null;

// Start app when page loads
function initApp() {
    loadTurfData();
    setupEventListeners();
    checkLoginStatus();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM already ready
    initApp();
}

// Load sample turf data
function loadTurfData() {
    turfData = [
        {
            id: 1,
            name: "Green Valley Sports",
            location: "Mumbai",
            sport: "Football",
            price: 800,
            rating: 4.5,
            amenities: ["Parking", "Changing Rooms"]
        },
        {
            id: 2,
            name: "City Cricket Ground",
            location: "Delhi",
            sport: "Cricket",
            price: 1200,
            rating: 4.8,
            amenities: ["Parking", "Cafeteria"]
        },
        {
            id: 3,
            name: "Tennis Academy",
            location: "Bangalore",
            sport: "Tennis",
            price: 600,
            rating: 4.3,
            amenities: ["Parking", "Equipment"]
        }
    ];
    
    displayTurfs(turfData);
}

// Display turfs in grid
function displayTurfs(turfs) {
    const turfList = document.getElementById('turfList');
    if (!turfList) return;
    
    turfList.innerHTML = '';
    
    if (turfs.length === 0) {
        turfList.innerHTML = '<p>No turfs found</p>';
        return;
    }
    
    turfs.forEach(turf => {
        const card = document.createElement('div');
        card.className = 'turf-card';
        card.innerHTML = `
            <h3>${turf.name}</h3>
            <p>Location: ${turf.location}</p>
            <p>Sport: ${turf.sport}</p>
            <p>Price: ₹${turf.price}/hour</p>
            <p>Rating: ${turf.rating}/5</p>
            <p>Amenities: ${turf.amenities.join(', ')}</p>
            <button onclick="bookTurf(${turf.id})">Book Now</button>
        `;
        turfList.appendChild(card);
    });
}

// Search functionality
function searchTurfs() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchText = searchInput.value.toLowerCase();
    
    if (!searchText) {
        displayTurfs(turfData);
        return;
    }
    
    const filteredTurfs = turfData.filter(turf => 
        turf.name.toLowerCase().includes(searchText) ||
        turf.location.toLowerCase().includes(searchText) ||
        turf.sport.toLowerCase().includes(searchText)
    );
    
    displayTurfs(filteredTurfs);
}

// Filter functionality
function filterTurfs() {
    const sportFilter = document.getElementById('sportFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    if (!sportFilter || !priceFilter) return;
    
    let filtered = [...turfData];
    
    // Filter by sport
    if (sportFilter.value) {
        filtered = filtered.filter(turf => 
            turf.sport.toLowerCase() === sportFilter.value.toLowerCase()
        );
    }
    
    // Filter by price
    if (priceFilter.value) {
        const [min, max] = priceFilter.value.split('-').map(Number);
        filtered = filtered.filter(turf => 
            turf.price >= min && (!max || turf.price <= max)
        );
    }
    
    displayTurfs(filtered);
}

// Booking functionality
function bookTurf(id) {
    if (!currentUser) {
        alert('Please login to book a turf');
        window.location.href = 'login.html';
        return;
    }
    const turf = turfData.find(t => t.id === id);
    if (!turf) return;

    // Remember which turf is being booked
    window.selectedTurfId = id;

    const modal = document.getElementById('bookingModal');
    const details = document.getElementById('turfDetails');
    const timeSlots = document.getElementById('timeSlots');
    const bookingAmount = document.getElementById('bookingAmount');

    if (!modal || !details || !timeSlots || !bookingAmount) return;

    details.innerHTML = `
        <h3>${turf.name}</h3>
        <p>Location: ${turf.location}</p>
        <p>Price: ₹${turf.price}/hour</p>
    `;

    // Populate time slots for this turf
    generateTimeSlots(turf);

    // Set amount shown in booking modal to 0 until user selects slots
    bookingAmount.textContent = 0;

    // Show modal
    modal.style.display = 'block';
}

// Generate simple list of time slots
function generateTimeSlots(turf) {
    const timeSlots = document.getElementById('timeSlots');
    if (!timeSlots) return;

    const slots = [
        '06:00 - 07:00',
        '07:00 - 08:00',
        '08:00 - 09:00',
        '17:00 - 18:00',
        '18:00 - 19:00',
        '19:00 - 20:00'
    ];

    timeSlots.innerHTML = '';
    // Use checkboxes so user can select multiple slots
    slots.forEach((s, idx) => {
        const id = `slot_${turf.id}_${idx}`;
        const wrapper = document.createElement('div');
        wrapper.className = 'slot-item';
        wrapper.innerHTML = `
            <label for="${id}" class="slot-label-wrapper">
                <input type="checkbox" name="selectedSlots" id="${id}" value="${s}">
                <span class="slot-label">${s}</span>
            </label>
        `;
        timeSlots.appendChild(wrapper);
    });

    // Attach change listener to update amount when slots change
    const checkboxes = timeSlots.querySelectorAll('input[name="selectedSlots"]');
    checkboxes.forEach(ch => ch.addEventListener('change', updateBookingAmount));
}

// Update booking amount shown based on selected slots
function updateBookingAmount() {
    const turfId = window.selectedTurfId;
    const turf = turfData.find(t => t.id === turfId);
    const bookingAmount = document.getElementById('bookingAmount');
    if (!turf || !bookingAmount) return;

    const selected = document.querySelectorAll('input[name="selectedSlots"]:checked');
    const count = selected ? selected.length : 0;
    const total = turf.price * count;

    // show total (if none selected, 0)
    bookingAmount.textContent = total;
}

// Login functionality
function handleLogin(e) {
    try {
        if (e && e.preventDefault) e.preventDefault();
        console.log('handleLogin called');

        const emailEl = document.getElementById('loginEmail');
        const passEl = document.getElementById('loginPassword');
        if (!emailEl || !passEl) {
            alert('Login form elements not found');
            console.error('Missing loginEmail or loginPassword element');
            return false;
        }

        const email = emailEl.value;
        const password = passEl.value;

        console.log('Login attempt', { email: email });

        if (email && password) {
            // Simple login (no real authentication)
            currentUser = {
                email: email,
                name: email.split('@')[0]
            };

            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            // redirect
            window.location.href = 'index.html';
            return true;
        } else {
            alert('Please fill in all fields');
            return false;
        }
    } catch (err) {
        console.error('Error in handleLogin:', err);
        alert('An error occurred during login. Check developer console for details.');
        return false;
    }
}

// Ensure the function is available for inline onsubmit handlers
window.handleLogin = handleLogin;



// Check login status
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUI();
    }
}

// Update UI based on login status
function updateUI() {
    const loginLink = document.querySelector('a[href="login.html"]');
    const navMenu = document.querySelector('.nav-menu');

    if (!navMenu) return;

    // If user is logged in, show welcome message and logout button
    if (currentUser) {
        const welcomeHtml = `<li class="nav-user"><span>Welcome, ${currentUser.name}</span> <button onclick="logout()" class="nav-logout">Logout</button></li>`;

        if (loginLink && loginLink.parentElement) {
            loginLink.parentElement.outerHTML = welcomeHtml;
        } else {
            const existing = navMenu.querySelector('.nav-user');
            if (!existing) navMenu.insertAdjacentHTML('beforeend', welcomeHtml);
        }
        return;
    }

    // Not logged in: show login link
    const existingWelcome = navMenu.querySelector('.nav-user');
    if (existingWelcome) existingWelcome.remove();

    if (!loginLink) {
        navMenu.insertAdjacentHTML('beforeend', '<li><a href="login.html">Login</a></li>');
    }
}

// Logout functionality
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    window.location.reload();
}

// Setup event listeners
function setupEventListeners() {
    // Search on Enter key
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchTurfs();
            }
        });
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    

    
    // Close modals when clicking outside
    window.onclick = function(e) {
        if (e.target.className === 'modal') {
            e.target.style.display = 'none';
        }
    };

    // Proceed to payment button
    const proceedBtn = document.getElementById('proceedToPayment');
    if (proceedBtn) {
        proceedBtn.addEventListener('click', function() {
            // Ensure a date and at least one slot are selected
            const dateInput = document.getElementById('bookingDate');
            const selectedSlots = document.querySelectorAll('input[name="selectedSlots"]:checked');
            if (!dateInput || !dateInput.value) {
                alert('Please select a date');
                return;
            }
            if (!selectedSlots || selectedSlots.length === 0) {
                alert('Please select at least one time slot');
                return;
            }

            // Optionally update payment amount display here
            const turfId = window.selectedTurfId;
            const turf = turfData.find(t => t.id === turfId);
            const amountEl = document.getElementById('bookingAmount');
            if (amountEl && turf) {
                amountEl.textContent = turf.price * selectedSlots.length;
            }

            // Open payment modal
            const paymentModal = document.getElementById('paymentModal');
            if (paymentModal) paymentModal.style.display = 'block';
        });
    }

    // Payment form submit
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Gather booking info
            const turfId = window.selectedTurfId;
            const turf = turfData.find(t => t.id === turfId);
            const dateInput = document.getElementById('bookingDate');
            const selectedNodes = document.querySelectorAll('input[name="selectedSlots"]:checked');
            const selectedSlots = Array.from(selectedNodes).map(n => n.value);
            const amount = turf ? turf.price * selectedSlots.length : 0;

            if (!turf || !dateInput || !dateInput.value || selectedSlots.length === 0) {
                alert('Missing booking information');
                return;
            }

            const booking = {
                id: Date.now(),
                turfId: turf.id,
                turfName: turf.name,
                date: dateInput.value,
                slots: selectedSlots,
                amount: amount,
                user: currentUser ? currentUser.email : 'guest'
            };

            // Save booking to localStorage
            const saved = JSON.parse(localStorage.getItem('bookings') || '[]');
            saved.push(booking);
            localStorage.setItem('bookings', JSON.stringify(saved));

            // Close modals and notify user
            const paymentModalEl = document.getElementById('paymentModal');
            const bookingModalEl = document.getElementById('bookingModal');
            if (paymentModalEl) paymentModalEl.style.display = 'none';
            if (bookingModalEl) bookingModalEl.style.display = 'none';

            alert('Payment successful! Your booking is confirmed.');

        });
    }
}

