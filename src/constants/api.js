// eSIM Access API endpoints
export const API_CONFIG = {
  // Base URL
  BASE_URL: "https://api.esimaccess.com/v1",

  // API Key (test environment)
  API_KEY: "your_esim_access_api_key",

  // Endpoints
  ENDPOINTS: {
    // Auth
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      REFRESH: "/auth/refresh",
      LOGOUT: "/auth/logout",
    },

    // Countries & Packages
    COUNTRIES: "/countries",
    PACKAGES: "/packages",
    PACKAGE_DETAILS: (id) => `/packages/${id}`,

    // Orders
    ORDERS: "/orders",
    ORDER_DETAILS: (id) => `/orders/${id}`,
    CREATE_ORDER: "/orders",

    // eSIM Management
    ESIMS: "/esims",
    ESIM_DETAILS: (iccid) => `/esims/${iccid}`,
    ESIM_USAGE: (iccid) => `/esims/${iccid}/usage`,
    ESIM_QR: (iccid) => `/esims/${iccid}/qr`,

    // User Profile
    PROFILE: "/profile",
    UPDATE_PROFILE: "/profile",

    // Notifications
    NOTIFICATIONS: "/notifications",
    MARK_READ: (id) => `/notifications/${id}/read`,
  },

  // Request headers
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-API-Key": "your_esim_access_api_key",
  },

  // Timeout settings
  TIMEOUT: 30000, // 30 seconds

  // Retry settings
  RETRY: {
    COUNT: 3,
    DELAY: 1000, // 1 second
  },
};

// Stripe Configuration
export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: "pk_test_your_stripe_publishable_key",
  SECRET_KEY: "sk_test_your_stripe_secret_key", // Backend'de kullanılacak
  WEBHOOK_SECRET: "whsec_your_webhook_secret",
  CURRENCY: "USD",
};

// App Configuration
export const APP_CONFIG = {
  // App Store URLs
  IOS_URL: "https://apps.apple.com/app/datago-esim/id123456789",
  ANDROID_URL: "https://play.google.com/store/apps/details?id=com.datago.esim",

  // Support
  SUPPORT_EMAIL: "support@datago.com",
  SUPPORT_PHONE: "+1-800-DATAGO",

  // Social Media
  WEBSITE: "https://datagoesim.com",
  TWITTER: "https://twitter.com/datago",
  FACEBOOK: "https://facebook.com/datago",

  // Terms & Privacy
  TERMS_URL: "https://datagoesim.com/terms",
  PRIVACY_URL: "https://datagoesim.com/privacy",

  // Cache settings
  CACHE_EXPIRY: 5 * 60 * 1000, // 5 minutes

  // Pagination
  PAGE_SIZE: 20,

  // File upload limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};
