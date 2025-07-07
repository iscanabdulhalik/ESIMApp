import { get, post } from "./api/apiClient";
import { API_CONFIG } from "../constants/api";

export const authService = {
  // Kullanıcı girişi
  login: async (email, password) => {
    const response = await post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    return response;
  },

  // Kullanıcı kaydı
  register: async (userData) => {
    const { firstName, lastName, email, password, phone, country } = userData;

    const response = await post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      firstName,
      lastName,
      email,
      password,
      phone,
      country,
    });

    return response;
  },

  // Şifre sıfırlama isteği
  forgotPassword: async (email) => {
    const response = await post("/auth/forgot-password", {
      email,
    });

    return response;
  },

  // Şifre sıfırlama doğrulama
  resetPassword: async (token, newPassword) => {
    const response = await post("/auth/reset-password", {
      token,
      password: newPassword,
    });

    return response;
  },

  // Token yenileme
  refreshToken: async (refreshToken) => {
    const response = await post(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });

    return response;
  },

  // Çıkış yapma
  logout: async () => {
    const response = await post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    return response;
  },

  // Email doğrulama
  verifyEmail: async (token) => {
    const response = await post("/auth/verify-email", {
      token,
    });

    return response;
  },

  // Email doğrulama kodu gönderme
  resendVerification: async (email) => {
    const response = await post("/auth/resend-verification", {
      email,
    });

    return response;
  },

  // Profil bilgilerini getir
  getProfile: async () => {
    const response = await get(API_CONFIG.ENDPOINTS.PROFILE);
    return response;
  },

  // Profil güncelle
  updateProfile: async (profileData) => {
    const response = await post(
      API_CONFIG.ENDPOINTS.UPDATE_PROFILE,
      profileData
    );
    return response;
  },

  // Şifre değiştirme
  changePassword: async (currentPassword, newPassword) => {
    const response = await post("/auth/change-password", {
      currentPassword,
      newPassword,
    });

    return response;
  },

  // Hesap silme
  deleteAccount: async (password) => {
    const response = await post("/auth/delete-account", {
      password,
    });

    return response;
  },

  // Two-factor authentication etkinleştirme
  enableTwoFactor: async () => {
    const response = await post("/auth/enable-2fa");
    return response;
  },

  // Two-factor authentication devre dışı bırakma
  disableTwoFactor: async (code) => {
    const response = await post("/auth/disable-2fa", {
      code,
    });

    return response;
  },

  // Two-factor authentication doğrulama
  verifyTwoFactor: async (code) => {
    const response = await post("/auth/verify-2fa", {
      code,
    });

    return response;
  },
};
