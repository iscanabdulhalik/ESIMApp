// src/stores/esimStore.js
import { create } from "zustand";
import { esimService } from "../services/esimService";

export const useESIMStore = create((set, get) => ({
  // State
  packages: [],
  myESIMs: [],
  selectedESIMDetails: null,

  // Durum Yönetimi (State Management)
  isLoadingPackages: false,
  isLoadingOrder: false,
  isLoadingDetails: false,
  error: null, // Genel bir hata state'i veya aksiyona özel (errorPackages, errorOrder vb.)

  // Actions
  fetchPackages: async () => {
    set({ isLoadingPackages: true, error: null });
    try {
      const data = await esimService.getPackages();
      set({ packages: data.packages || data, isLoadingPackages: false });
    } catch (err) {
      set({ error: "Paketler yüklenemedi.", isLoadingPackages: false });
    }
  },

  createOrder: async (packageId) => {
    set({ isLoadingOrder: true, error: null });
    try {
      const orderResponse = await esimService.createOrder(packageId);
      // Sipariş başarılı, şimdi detayları çekelim.
      const esimDetails = await esimService.getESIMDetailsByOrder(
        orderResponse.id
      );

      // State'i güncelle
      set((state) => ({
        // Kullanıcının eSIM'leri listesine yeni olanı ekle
        myESIMs: [...state.myESIMs, ...esimDetails],
        isLoadingOrder: false,
      }));

      // UI'ın yönlendirme yapabilmesi için yeni eSIM detaylarını döndür
      return esimDetails[0]; // Genellikle sipariş tek eSIM içerir
    } catch (err) {
      set({
        error: "Sipariş oluşturulamadı. Lütfen tekrar deneyin.",
        isLoadingOrder: false,
      });
      return null; // Başarısızlık durumunda null döndür
    }
  },

  fetchESIMDetails: async (orderId) => {
    set({ isLoadingDetails: true, error: null, selectedESIMDetails: null });
    try {
      const esimDetails = await esimService.getESIMDetailsByOrder(orderId);
      if (esimDetails && esimDetails.length > 0) {
        set({ selectedESIMDetails: esimDetails[0], isLoadingDetails: false });
      } else {
        throw new Error("Bu siparişe ait eSIM bulunamadı.");
      }
    } catch (err) {
      set({ error: err.message, isLoadingDetails: false });
    }
  },
}));
