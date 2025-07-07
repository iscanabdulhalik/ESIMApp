import { get, post, put, del } from "./apiClient";
import { API_CONFIG } from "../../constants/api";

export const esimService = {
  // Ülkeleri listele
  getCountries: async () => {
    const response = await get(API_CONFIG.ENDPOINTS.COUNTRIES);
    return response;
  },

  // Paketleri listele
  getPackages: async (filters = {}) => {
    const { country, type, dataAmount, duration, minPrice, maxPrice } = filters;

    const params = {};
    if (country) params.country = country;
    if (type) params.type = type;
    if (dataAmount) params.dataAmount = dataAmount;
    if (duration) params.duration = duration;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    const response = await get(API_CONFIG.ENDPOINTS.PACKAGES, params);
    return response;
  },

  // Paket detayları
  getPackageDetails: async (packageId) => {
    const response = await get(API_CONFIG.ENDPOINTS.PACKAGE_DETAILS(packageId));
    return response;
  },

  // Sipariş oluştur
  createOrder: async (orderData) => {
    const { packageId, paymentMethodId, customerInfo } = orderData;

    const response = await post(API_CONFIG.ENDPOINTS.CREATE_ORDER, {
      packageId,
      paymentMethodId,
      customerInfo,
    });

    return response;
  },

  // Siparişleri listele
  getOrders: async (status = null, page = 1, limit = 20) => {
    const params = { page, limit };
    if (status) params.status = status;

    const response = await get(API_CONFIG.ENDPOINTS.ORDERS, params);
    return response;
  },

  // Sipariş detayları
  getOrderDetails: async (orderId) => {
    const response = await get(API_CONFIG.ENDPOINTS.ORDER_DETAILS(orderId));
    return response;
  },

  // eSIM'leri listele
  getESIMs: async (status = null) => {
    const params = {};
    if (status) params.status = status;

    const response = await get(API_CONFIG.ENDPOINTS.ESIMS, params);
    return response;
  },

  // eSIM detayları
  getESIMDetails: async (iccid) => {
    const response = await get(API_CONFIG.ENDPOINTS.ESIM_DETAILS(iccid));
    return response;
  },

  // eSIM kullanım bilgileri
  getESIMUsage: async (iccid, startDate = null, endDate = null) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await get(API_CONFIG.ENDPOINTS.ESIM_USAGE(iccid), params);
    return response;
  },

  // eSIM QR kodu
  getESIMQR: async (iccid) => {
    const response = await get(API_CONFIG.ENDPOINTS.ESIM_QR(iccid));
    return response;
  },

  // eSIM etkinleştir
  activateESIM: async (iccid) => {
    const response = await post(`/esims/${iccid}/activate`);
    return response;
  },

  // eSIM devre dışı bırak
  deactivateESIM: async (iccid) => {
    const response = await post(`/esims/${iccid}/deactivate`);
    return response;
  },

  // eSIM sil
  deleteESIM: async (iccid) => {
    const response = await del(`/esims/${iccid}`);
    return response;
  },

  // Veri paketi yenile
  renewDataPlan: async (iccid, packageId) => {
    const response = await post(`/esims/${iccid}/renew`, {
      packageId,
    });

    return response;
  },

  // Veri paketi ekle (top-up)
  topUpData: async (iccid, dataAmount) => {
    const response = await post(`/esims/${iccid}/topup`, {
      dataAmount,
    });

    return response;
  },

  // eSIM isim değiştir
  renameESIM: async (iccid, newName) => {
    const response = await put(API_CONFIG.ENDPOINTS.ESIM_DETAILS(iccid), {
      name: newName,
    });

    return response;
  },

  // Bölgesel paketler
  getRegionalPackages: async (region) => {
    const response = await get("/packages/regional", {
      region,
    });

    return response;
  },

  // Global paketler
  getGlobalPackages: async () => {
    const response = await get("/packages/global");
    return response;
  },

  // Popüler paketler
  getPopularPackages: async () => {
    const response = await get("/packages/popular");
    return response;
  },

  // Paket karşılaştırması
  comparePackages: async (packageIds) => {
    const response = await post("/packages/compare", {
      packageIds,
    });

    return response;
  },

  // Uyumluluk kontrolü
  checkCompatibility: async (deviceInfo) => {
    const response = await post("/compatibility/check", deviceInfo);
    return response;
  },

  // Kurulum talimatları
  getInstallationInstructions: async (deviceType, os) => {
    const response = await get("/instructions", {
      deviceType,
      os,
    });

    return response;
  },

  // Destek talebi oluştur
  createSupportTicket: async (ticketData) => {
    const response = await post("/support/tickets", ticketData);
    return response;
  },

  // Destek taleplerini listele
  getSupportTickets: async () => {
    const response = await get("/support/tickets");
    return response;
  },
};
