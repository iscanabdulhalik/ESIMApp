import { get, post, put, del } from "./apiClient";
import { API_CONFIG } from "../../constants/api";
// src/services/api/esimService.js güncellenmesi için
// Mevcut dosyanızın başına bu mock data'yı ekleyin:

// Mock data for testing
const mockESIMs = [
  {
    iccid: "89901234567890123456",
    country: "Türkiye",
    countryFlag: "🇹🇷",
    packageName: "30 Gün Unlimited",
    status: "active",
    dataUsed: 2048,
    dataLimit: 10240,
    expiryDate: "2024-02-15",
    provider: "Turkcell",
  },
  {
    iccid: "89901234567890123457",
    country: "ABD",
    countryFlag: "🇺🇸",
    packageName: "7 Gün 5GB",
    status: "inactive",
    dataUsed: 0,
    dataLimit: 5120,
    expiryDate: "2024-01-20",
    provider: "Verizon",
  },
];

const mockCountries = [
  { id: "tr", name: "Türkiye", flag: "🇹🇷", packageCount: 15 },
  { id: "us", name: "ABD", flag: "🇺🇸", packageCount: 12 },
  { id: "gb", name: "İngiltere", flag: "🇬🇧", packageCount: 8 },
  { id: "de", name: "Almanya", flag: "🇩🇪", packageCount: 10 },
  { id: "fr", name: "Fransa", flag: "🇫🇷", packageCount: 9 },
  { id: "es", name: "İspanya", flag: "🇪🇸", packageCount: 7 },
  { id: "it", name: "İtalya", flag: "🇮🇹", packageCount: 6 },
  { id: "jp", name: "Japonya", flag: "🇯🇵", packageCount: 5 },
];

const mockPackages = [
  {
    id: "pkg-1",
    country: "Türkiye",
    countryFlag: "🇹🇷",
    name: "30 Gün Unlimited",
    dataAmount: 10240,
    duration: 30,
    price: 29.99,
    originalPrice: 39.99,
    speed: "4G/5G",
    coverage: "Tüm Türkiye",
    hotspotAllowed: true,
    smsIncluded: false,
    isPopular: true,
    type: "national",
  },
  {
    id: "pkg-2",
    country: "ABD",
    countryFlag: "🇺🇸",
    name: "7 Gün 5GB",
    dataAmount: 5120,
    duration: 7,
    price: 19.99,
    speed: "4G/5G",
    coverage: "USA & Puerto Rico",
    hotspotAllowed: true,
    smsIncluded: true,
    isPopular: false,
    type: "national",
  },
];

// Mevcut esimService objenizin fonksiyonlarını bu mock datalarla güncelleyin:

export const esimService = {
  // Mock implementations
  getCountries: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, data: mockCountries };
  },

  getPackages: async (filters = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, data: mockPackages };
  },

  getPopularPackages: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const popular = mockPackages.filter((pkg) => pkg.isPopular);
    return { success: true, data: popular };
  },

  getPackageDetails: async (packageId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const pkg = mockPackages.find((p) => p.id === packageId);
    if (pkg) {
      return { success: true, data: pkg };
    }
    return { success: false, error: "Paket bulunamadı" };
  },

  getESIMs: async (status = null) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    let filtered = mockESIMs;
    if (status) {
      filtered = mockESIMs.filter((esim) => esim.status === status);
    }
    return { success: true, data: filtered };
  },

  getOrders: async (status = null, page = 1, limit = 5) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockOrders = [
      {
        id: "order-1",
        country: "Türkiye",
        packageName: "30 Gün Unlimited",
        price: 29.99,
        status: "completed",
        createdAt: new Date().toISOString(),
      },
    ];
    return { success: true, data: mockOrders };
  },

  // Diğer fonksiyonlar için de benzer mock implementasyonlar ekleyebilirsiniz
  getESIMDetails: async (iccid) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const esim = mockESIMs.find((e) => e.iccid === iccid);
    if (esim) {
      return { success: true, data: esim };
    }
    return { success: false, error: "eSIM bulunamadı" };
  },

  // Basit mock implementasyonlar - gerçek API'ye bağlandığında değiştirilecek
  activateESIM: async (iccid) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: "eSIM başarıyla aktive edildi" };
  },

  deactivateESIM: async (iccid) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: "eSIM devre dışı bırakıldı" };
  },

  getESIMUsage: async (iccid, startDate, endDate) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        usage: [
          { date: "2024-01-15", dataUsed: 512 },
          { date: "2024-01-16", dataUsed: 1024 },
        ],
        totalUsed: 1536,
        totalLimit: 10240,
      },
    };
  },

  getESIMQR: async (iccid) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        qrCode: "LPA:1$example.com$activation-code-123",
        downloadUrl: "https://example.com/download/123",
      },
    };
  },

  renameESIM: async (iccid, newName) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, message: "eSIM adı güncellendi" };
  },

  // Diğer tüm fonksiyonlar için benzer mock implementasyonlar...
};

// export const esimService = {
//   // Ülkeleri listele
//   getCountries: async () => {
//     const response = await get(API_CONFIG.ENDPOINTS.COUNTRIES);
//     return response;
//   },

//   // Paketleri listele
//   getPackages: async (filters = {}) => {
//     const { country, type, dataAmount, duration, minPrice, maxPrice } = filters;

//     const params = {};
//     if (country) params.country = country;
//     if (type) params.type = type;
//     if (dataAmount) params.dataAmount = dataAmount;
//     if (duration) params.duration = duration;
//     if (minPrice) params.minPrice = minPrice;
//     if (maxPrice) params.maxPrice = maxPrice;

//     const response = await get(API_CONFIG.ENDPOINTS.PACKAGES, params);
//     return response;
//   },

//   // Paket detayları
//   getPackageDetails: async (packageId) => {
//     const response = await get(API_CONFIG.ENDPOINTS.PACKAGE_DETAILS(packageId));
//     return response;
//   },

//   // Sipariş oluştur
//   createOrder: async (orderData) => {
//     const { packageId, paymentMethodId, customerInfo } = orderData;

//     const response = await post(API_CONFIG.ENDPOINTS.CREATE_ORDER, {
//       packageId,
//       paymentMethodId,
//       customerInfo,
//     });

//     return response;
//   },

//   // Siparişleri listele
//   getOrders: async (status = null, page = 1, limit = 20) => {
//     const params = { page, limit };
//     if (status) params.status = status;

//     const response = await get(API_CONFIG.ENDPOINTS.ORDERS, params);
//     return response;
//   },

//   // Sipariş detayları
//   getOrderDetails: async (orderId) => {
//     const response = await get(API_CONFIG.ENDPOINTS.ORDER_DETAILS(orderId));
//     return response;
//   },

//   // eSIM'leri listele
//   getESIMs: async (status = null) => {
//     const params = {};
//     if (status) params.status = status;

//     const response = await get(API_CONFIG.ENDPOINTS.ESIMS, params);
//     return response;
//   },

//   // eSIM detayları
//   getESIMDetails: async (iccid) => {
//     const response = await get(API_CONFIG.ENDPOINTS.ESIM_DETAILS(iccid));
//     return response;
//   },

//   // eSIM kullanım bilgileri
//   getESIMUsage: async (iccid, startDate = null, endDate = null) => {
//     const params = {};
//     if (startDate) params.startDate = startDate;
//     if (endDate) params.endDate = endDate;

//     const response = await get(API_CONFIG.ENDPOINTS.ESIM_USAGE(iccid), params);
//     return response;
//   },

//   // eSIM QR kodu
//   getESIMQR: async (iccid) => {
//     const response = await get(API_CONFIG.ENDPOINTS.ESIM_QR(iccid));
//     return response;
//   },

//   // eSIM etkinleştir
//   activateESIM: async (iccid) => {
//     const response = await post(`/esims/${iccid}/activate`);
//     return response;
//   },

//   // eSIM devre dışı bırak
//   deactivateESIM: async (iccid) => {
//     const response = await post(`/esims/${iccid}/deactivate`);
//     return response;
//   },

//   // eSIM sil
//   deleteESIM: async (iccid) => {
//     const response = await del(`/esims/${iccid}`);
//     return response;
//   },

//   // Veri paketi yenile
//   renewDataPlan: async (iccid, packageId) => {
//     const response = await post(`/esims/${iccid}/renew`, {
//       packageId,
//     });

//     return response;
//   },

//   // Veri paketi ekle (top-up)
//   topUpData: async (iccid, dataAmount) => {
//     const response = await post(`/esims/${iccid}/topup`, {
//       dataAmount,
//     });

//     return response;
//   },

//   // eSIM isim değiştir
//   renameESIM: async (iccid, newName) => {
//     const response = await put(API_CONFIG.ENDPOINTS.ESIM_DETAILS(iccid), {
//       name: newName,
//     });

//     return response;
//   },

//   // Bölgesel paketler
//   getRegionalPackages: async (region) => {
//     const response = await get("/packages/regional", {
//       region,
//     });

//     return response;
//   },

//   // Global paketler
//   getGlobalPackages: async () => {
//     const response = await get("/packages/global");
//     return response;
//   },

//   // Popüler paketler
//   getPopularPackages: async () => {
//     const response = await get("/packages/popular");
//     return response;
//   },

//   // Paket karşılaştırması
//   comparePackages: async (packageIds) => {
//     const response = await post("/packages/compare", {
//       packageIds,
//     });

//     return response;
//   },

//   // Uyumluluk kontrolü
//   checkCompatibility: async (deviceInfo) => {
//     const response = await post("/compatibility/check", deviceInfo);
//     return response;
//   },

//   // Kurulum talimatları
//   getInstallationInstructions: async (deviceType, os) => {
//     const response = await get("/instructions", {
//       deviceType,
//       os,
//     });

//     return response;
//   },

//   // Destek talebi oluştur
//   createSupportTicket: async (ticketData) => {
//     const response = await post("/support/tickets", ticketData);
//     return response;
//   },

//   // Destek taleplerini listele
//   getSupportTickets: async () => {
//     const response = await get("/support/tickets");
//     return response;
//   },
// };
