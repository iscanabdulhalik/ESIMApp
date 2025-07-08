import { get, post, put, del } from "./apiClient";
import { API_CONFIG } from "../../constants/api";

export const esimService = {
  // Paketleri getir
  getPackages: async (country = null, region = null, page = 1, limit = 20) => {
    const params = {};
    if (country) params.country = country;
    if (region) params.region = region;
    params.page = page;
    params.limit = limit;

    const response = await get(API_CONFIG.ENDPOINTS.PACKAGES, params);
    return response;
  },

  // Paket detaylarını getir
  getPackageDetails: async (packageId) => {
    const response = await get(API_CONFIG.ENDPOINTS.PACKAGE_DETAILS(packageId));
    return response;
  },

  // Sipariş oluştur
  createOrder: async (packageId, quantity = 1) => {
    const response = await post(API_CONFIG.ENDPOINTS.CREATE_ORDER, {
      packageId,
      quantity,
    });
    return response;
  },

  // Siparişleri getir
  getOrders: async (status = null, page = 1, limit = 20) => {
    const params = { page, limit };
    if (status) params.status = status;

    const response = await get(API_CONFIG.ENDPOINTS.ORDERS, params);
    return response;
  },

  // Sipariş detaylarını getir
  getOrderDetails: async (orderId) => {
    const response = await get(API_CONFIG.ENDPOINTS.ORDER_DETAILS(orderId));
    return response;
  },

  // Kullanıcının eSIM'lerini getir
  getESIMs: async (status = null) => {
    const params = {};
    if (status) params.status = status;

    const response = await get(API_CONFIG.ENDPOINTS.ESIMS, params);
    return response;
  },

  // eSIM detaylarını getir
  getESIMDetails: async (iccid) => {
    const response = await get(API_CONFIG.ENDPOINTS.ESIM_DETAILS(iccid));
    return response;
  },

  // eSIM kullanım verilerini getir
  getESIMUsage: async (iccid, startDate = null, endDate = null) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await get(API_CONFIG.ENDPOINTS.ESIM_USAGE(iccid), params);
    return response;
  },

  // eSIM QR kodunu getir
  getESIMQR: async (iccid) => {
    const response = await get(API_CONFIG.ENDPOINTS.ESIM_QR(iccid));
    return response;
  },

  // eSIM'i etkinleştir
  activateESIM: async (iccid) => {
    const response = await post(
      `${API_CONFIG.ENDPOINTS.ESIM_DETAILS(iccid)}/activate`
    );
    return response;
  },

  // eSIM'i devre dışı bırak
  deactivateESIM: async (iccid) => {
    const response = await post(
      `${API_CONFIG.ENDPOINTS.ESIM_DETAILS(iccid)}/deactivate`
    );
    return response;
  },

  // eSIM'i yeniden adlandır
  renameESIM: async (iccid, newName) => {
    const response = await put(API_CONFIG.ENDPOINTS.ESIM_DETAILS(iccid), {
      name: newName,
    });
    return response;
  },

  // eSIM durumunu güncelle
  updateESIMStatus: async (iccid, status) => {
    const response = await put(API_CONFIG.ENDPOINTS.ESIM_DETAILS(iccid), {
      status,
    });
    return response;
  },

  // eSIM'i sil
  deleteESIM: async (iccid) => {
    const response = await del(API_CONFIG.ENDPOINTS.ESIM_DETAILS(iccid));
    return response;
  },

  // Ülkeleri getir
  getCountries: async () => {
    const response = await get(API_CONFIG.ENDPOINTS.COUNTRIES);
    return response;
  },

  // Mock veriler (geliştirme için)
  getMockPackages: () => {
    return {
      success: true,
      data: [
        {
          id: "1",
          country: "Türkiye",
          countryCode: "TR",
          countryFlag: "🇹🇷",
          name: "Türkiye 30 Gün",
          dataAmount: 5120, // MB
          duration: 30, // gün
          price: 29.99,
          currency: "USD",
          coverage: "Türkiye Geneli",
          speed: "4G/5G",
          hotspotAllowed: true,
          smsIncluded: false,
          provider: "Turkcell",
        },
        {
          id: "2",
          country: "Almanya",
          countryCode: "DE",
          countryFlag: "🇩🇪",
          name: "Almanya 15 Gün",
          dataAmount: 3072, // MB
          duration: 15,
          price: 19.99,
          currency: "USD",
          coverage: "Almanya Geneli",
          speed: "4G/5G",
          hotspotAllowed: true,
          smsIncluded: false,
          provider: "Deutsche Telekom",
        },
        {
          id: "3",
          country: "Amerika",
          countryCode: "US",
          countryFlag: "🇺🇸",
          name: "Amerika 30 Gün",
          dataAmount: 10240, // MB
          duration: 30,
          price: 49.99,
          currency: "USD",
          coverage: "ABD Geneli",
          speed: "4G/5G",
          hotspotAllowed: true,
          smsIncluded: true,
          provider: "Verizon",
        },
      ],
    };
  },

  // Mock eSIM'ler (geliştirme için)
  getMockESIMs: () => {
    return {
      success: true,
      data: [
        {
          iccid: "89014103211118510720",
          country: "Türkiye",
          countryFlag: "🇹🇷",
          packageName: "Türkiye 30 Gün",
          provider: "Turkcell",
          status: "active",
          dataLimit: 5120,
          dataUsed: 2048,
          expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          purchaseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        },
        {
          iccid: "89014103211118510721",
          country: "Almanya",
          countryFlag: "🇩🇪",
          packageName: "Almanya 15 Gün",
          provider: "Deutsche Telekom",
          status: "expired",
          dataLimit: 3072,
          dataUsed: 3000,
          expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          purchaseDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        },
      ],
    };
  },

  // Mock sipariş oluşturma
  createMockOrder: async (packageId) => {
    // Simülasyon için delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockESIM = {
      iccid: "89014103211118510" + Math.floor(Math.random() * 1000),
      orderId: "order_" + Date.now(),
      status: "active",
      qrCode: "LPA:1$smdp.example.com$activation_code_123",
      smdpAddress: "smdp.example.com",
      activationCode: "activation_code_123",
      packageId,
    };

    return {
      success: true,
      data: mockESIM,
    };
  },
};
