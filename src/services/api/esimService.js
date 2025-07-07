// src/services/esimService.js
import axios from "axios";

// ÖNEMLİ: Gerçek API base URL'sini ve anahtarınızı buraya girin.
// Bunları bir .env dosyasında saklamak en iyi pratiktir.
const API_BASE_URL = "https://api.esimaccess.com/v1"; // DOKÜMANTASYONDAN KONTROL EDİN!
const API_KEY = "YOUR_ESIM_ACCESS_API_KEY_HERE"; // API Anahtarınız

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`, // veya 'X-API-Key' olabilir, dokümantasyona bakın
  },
});

// Axios interceptor'leri eklemek, merkezi hata yönetimi ve loglama için harikadır.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Merkezi hata loglama
    console.error("API Error:", {
      message: error.message,
      url: error.config.url,
      response: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export const esimService = {
  /**
   * Satılabilir tüm eSIM paketlerini getirir.
   */
  getPackages: async () => {
    const response = await apiClient.get("/packages");
    return response.data;
  },

  /**
   * Yeni bir sipariş oluşturur.
   * @param {string} packageId - Satın alınacak paketin ID'si.
   * @returns {Promise<object>} Oluşturulan siparişin bilgileri.
   */
  createOrder: async (packageId) => {
    // API'nin beklediği payload'ı dokümantasyona göre ayarlayın.
    // Örneğin: { package_id: packageId, quantity: 1 }
    const response = await apiClient.post("/orders", { packageId });
    return response.data;
  },

  /**
   * Belirli bir siparişe ait eSIM'leri (QR kodu dahil) getirir.
   * @param {string} orderId - Sipariş ID'si.
   * @returns {Promise<Array>} eSIM listesi. Genellikle 1 elemanlı bir dizi döner.
   */
  getESIMDetailsByOrder: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}/esims`);
    return response.data;
  },

  /**
   * Kullanıcının tüm aktif/geçmiş eSIM'lerini listeler (My eSIMs ekranı için).
   */
  getMyESIMs: async () => {
    const response = await apiClient.get("/esims"); // Bu endpoint'i API dokümantasyonundan doğrulayın.
    return response.data;
  },
};
