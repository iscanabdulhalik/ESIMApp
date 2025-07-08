import { create } from "zustand";
import auth from "@react-native-firebase/auth";
import { authService } from "../services/authService";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Sadece ilk dinleyici kurulumu için

  /**
   * Firebase'in auth durum dinleyicisini kurar.
   * Bu fonksiyon App.js'de bir kere çağrılacak.
   * Kullanıcı giriş/çıkış yaptığında bu dinleyici otomatik olarak tetiklenir.
   */
  setupAuthListener: () => {
    return auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // Kullanıcı giriş yapmış
        // Firestore'dan detaylı bilgiyi de alabiliriz, ama şimdilik bu yeterli.
        set({ user: firebaseUser, isAuthenticated: true, isLoading: false });
      } else {
        // Kullanıcı çıkış yapmış veya hiç giriş yapmamış
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
  },

  /**
   * Kullanıcıyı sisteme kaydeder.
   */
  register: async (name, email, password) => {
    await authService.register(name, email, password);
    // onAuthStateChanged dinleyicisi state'i otomatik güncelleyecek.
  },

  /**
   * Kullanıcıyı sisteme giriş yaptırır.
   */
  login: async (email, password) => {
    await authService.login(email, password);
    // onAuthStateChanged dinleyicisi state'i otomatik güncelleyecek.
  },

  /**
   * Kullanıcının oturumunu kapatır.
   */
  logout: async () => {
    await authService.logout();
    // onAuthStateChanged dinleyicisi state'i otomatik güncelleyecek.
  },
}));
