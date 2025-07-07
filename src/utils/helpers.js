import { Platform } from "react-native";

// Tarih formatlamaları
export const formatDate = (date, format = "DD/MM/YYYY") => {
  if (!date) return "";

  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");

  switch (format) {
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "DD/MM/YYYY HH:mm":
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case "relative":
      return getRelativeTime(d);
    default:
      return d.toLocaleDateString("tr-TR");
  }
};

// Göreceli zaman
export const getRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} gün önce`;
  } else if (hours > 0) {
    return `${hours} saat önce`;
  } else if (minutes > 0) {
    return `${minutes} dakika önce`;
  } else {
    return "Az önce";
  }
};

// Data boyutu formatlaması
export const formatDataSize = (bytes, decimals = 1) => {
  if (bytes === 0) return "0 MB";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Para formatlaması
export const formatCurrency = (amount, currency = "USD", locale = "en-US") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Telefon numarası formatlaması
export const formatPhoneNumber = (phone) => {
  if (!phone) return "";

  // Türkiye telefon numarası formatlaması
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    return cleaned.replace(
      /(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/,
      "$1 $2 $3 $4 $5"
    );
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
  }

  return phone;
};

// Email validasyonu
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Güçlü şifre kontrolü
export const isStrongPassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid:
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers,
    checks: {
      length: password.length >= minLength,
      upperCase: hasUpperCase,
      lowerCase: hasLowerCase,
      numbers: hasNumbers,
      specialChar: hasSpecialChar,
    },
  };
};

// Deep clone objesi
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Array'i gruplama
export const groupBy = (array, key) => {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    return result;
  }, {});
};

// Debounce fonksiyonu
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle fonksiyonu
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Random ID oluşturma
export const generateId = (length = 8) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// URL validasyonu
export const isValidURL = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Platform kontrolü
export const isIOS = () => {
  return Platform.OS === "ios";
};

export const isAndroid = () => {
  return Platform.OS === "android";
};

// Safe area insets
export const getSafeAreaInsets = () => {
  // React Native Safe Area Context'ten gelecek
  return {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };
};

// Haptic feedback
export const hapticFeedback = (type = "light") => {
  if (Platform.OS === "ios") {
    // iOS için haptic feedback implementasyonu
    // Expo Haptics kullanılabilir
  }
};

// Color utility
export const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// String utilities
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Number utilities
export const formatNumber = (num) => {
  return new Intl.NumberFormat("tr-TR").format(num);
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

// Storage helpers
export const safeJsonParse = (str, fallback = null) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return fallback;
  }
};

// Network status
export const isNetworkError = (error) => {
  return (
    error.code === "NETWORK_ERROR" ||
    error.message.includes("Network Error") ||
    error.message.includes("fetch")
  );
};
