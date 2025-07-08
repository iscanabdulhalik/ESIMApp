import { create } from "zustand";

// Mock data for development
const mockPackages = [
  {
    id: "1",
    country: { name: "Türkiye" },
    data_amount: "5GB",
    validity_days: 30,
    price: { amount: 29.99 },
    countryFlag: "🇹🇷",
  },
  {
    id: "2",
    country: { name: "Amerika" },
    data_amount: "10GB",
    validity_days: 30,
    price: { amount: 49.99 },
    countryFlag: "🇺🇸",
  },
];

const mockESIM = {
  id: "mock-esim-123",
  iccid: "89014103211118510720",
  order_id: "order-123",
  smdp_address: "smdp.example.com",
  matching_id: "activation_code_123",
  qr_code_data: "LPA:1$smdp.example.com$activation_code_123",
};

export const useESIMStore = create((set, get) => ({
  // State
  packages: mockPackages,
  myESIMs: [],
  selectedESIMDetails: null,

  // Loading states
  isLoadingPackages: false,
  isLoadingOrder: false,
  isLoadingDetails: false,
  error: null,

  // Mock Actions
  fetchPackages: async () => {
    set({ isLoadingPackages: true, error: null });

    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    set({
      packages: mockPackages,
      isLoadingPackages: false,
    });
  },

  createOrder: async (packageId) => {
    set({ isLoadingOrder: true, error: null });

    try {
      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock success
      const newESIM = {
        ...mockESIM,
        id: "esim-" + Date.now(),
        order_id: "order-" + Date.now(),
        packageId,
      };

      set((state) => ({
        myESIMs: [...state.myESIMs, newESIM],
        isLoadingOrder: false,
      }));

      return newESIM;
    } catch (err) {
      set({
        error: "Sipariş oluşturulamadı. Lütfen tekrar deneyin.",
        isLoadingOrder: false,
      });
      return null;
    }
  },

  fetchESIMDetails: async (orderId) => {
    set({ isLoadingDetails: true, error: null, selectedESIMDetails: null });

    try {
      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock eSIM details
      const esimDetails = {
        ...mockESIM,
        order_id: orderId,
      };

      set({
        selectedESIMDetails: esimDetails,
        isLoadingDetails: false,
      });
    } catch (err) {
      set({
        error: "eSIM detayları yüklenemedi.",
        isLoadingDetails: false,
      });
    }
  },
}));
