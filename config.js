// Configuration file for besturf application
// Contains API endpoints, constants, and configuration settings

const CONFIG = {
    // API Endpoints (mock endpoints for demo)
    API_BASE_URL: 'https://api.besturf.com/v1',
    
    // Authentication endpoints
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh'
    },
    
    // Turf endpoints
    TURFS: {
        GET_ALL: '/turfs',
        GET_BY_ID: '/turfs/:id',
        SEARCH: '/turfs/search',
        FILTER: '/turfs/filter',
        NEARBY: '/turfs/nearby'
    },
    
    // Booking endpoints
    BOOKINGS: {
        CREATE: '/bookings',
        GET_USER_BOOKINGS: '/bookings/user/:userId',
        CANCEL: '/bookings/:id/cancel',
        GET_SLOTS: '/turfs/:id/slots'
    },
    
    // Payment endpoints
    PAYMENTS: {
        CREATE_ORDER: '/payments/create-order',
        VERIFY_PAYMENT: '/payments/verify',
        GET_STATUS: '/payments/:id/status'
    },
    
    // User endpoints
    USERS: {
        PROFILE: '/users/profile',
        UPDATE_PROFILE: '/users/profile',
        DASHBOARD: '/users/dashboard'
    },
    
    // Map configuration
    MAP: {
        DEFAULT_CENTER: [20.5937, 78.9629], // India center
        DEFAULT_ZOOM: 5,
        MAX_ZOOM: 18,
        MIN_ZOOM: 3,
        TILE_LAYER: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        ATTRIBUTION: '© OpenStreetMap contributors'
    },
    
    // Search configuration
    SEARCH: {
        MIN_LENGTH: 2,
        DEBOUNCE_TIME: 300,
        MAX_RESULTS: 50
    },
    
    // Filter options
    FILTERS: {
        SPORTS: ['football', 'cricket', 'tennis', 'badminton', 'basketball', 'volleyball'],
        PRICE_RANGES: [
            { label: 'All Prices', value: '' },
            { label: '₹0-₹500', value: '0-500' },
            { label: '₹500-₹1000', value: '500-1000' },
            { label: '₹1000+', value: '1000+' }
        ],
        DISTANCE_RANGES: [
            { label: 'Any Distance', value: '' },
            { label: 'Within 5 km', value: 5 },
            { label: 'Within 10 km', value: 10 },
            { label: 'Within 25 km', value: 25 },
            { label: 'Within 50 km', value: 50 }
        ]
    },
    
    // Booking configuration
    BOOKING: {
        MIN_ADVANCE_HOURS: 2,
        MAX_ADVANCE_DAYS: 30,
        SLOT_DURATION: 60, // minutes
        CANCELLATION_HOURS: 24
    },
    
    // Payment configuration
    PAYMENT: {
        CURRENCY: 'INR',
        GATEWAY: 'razorpay',
        MIN_AMOUNT: 100,
        MAX_AMOUNT: 50000
    },
    
    // Local storage keys
    STORAGE: {
        USER_TOKEN: 'besturf_user_token',
        USER_DATA: 'besturf_user_data',
        BOOKINGS: 'besturf_bookings',
        RECENT_SEARCHES: 'besturf_recent_searches',
        FILTERS: 'besturf_filters'
    },
    
    // UI Configuration
    UI: {
        NOTIFICATION_DURATION: 3000,
        LOADING_DELAY: 500,
        ANIMATION_DURATION: 300,
        DEBOUNCE_DELAY: 300
    },
    
    // Error messages
    ERRORS: {
        NETWORK_ERROR: 'Network error. Please check your connection.',
        AUTH_ERROR: 'Authentication failed. Please login again.',
        BOOKING_ERROR: 'Booking failed. Please try again.',
        PAYMENT_ERROR: 'Payment failed. Please try again.',
        VALIDATION_ERROR: 'Please fill all required fields correctly.'
    },
    
    // Success messages
    SUCCESS: {
        LOGIN_SUCCESS: 'Login successful!',
        REGISTER_SUCCESS: 'Registration successful!',
        BOOKING_SUCCESS: 'Booking confirmed successfully!',
        PAYMENT_SUCCESS: 'Payment completed successfully!',
        PROFILE_UPDATE_SUCCESS: 'Profile updated successfully!'
    }
};

// Environment detection
const ENVIRONMENT = {
    IS_PRODUCTION: window.location.hostname !== 'localhost',
    IS_DEVELOPMENT: window.location.hostname === 'localhost',
    IS_MOBILE: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    IS_IOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    IS_ANDROID: /Android/.test(navigator.userAgent)
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, ENVIRONMENT };
} else {
    window.CONFIG = CONFIG;
    window.ENVIRONMENT = ENVIRONMENT;
}
