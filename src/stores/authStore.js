import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Expo Go uyumlu - Firebase kullanmıyor
export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Mock Login - Expo Go uyumlu
  login: async (email, password) => {
    try {
      set({ isLoading: true });

      console.log("🔑 Expo Go Mock login attempt:", { email });

      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation
      if (email === "test@example.com" && password === "password123") {
        const mockUser = {
          uid: "expo-mock-user-123",
          email: email,
          displayName: "Test User",
          phoneNumber: "+90 555 123 4567",
        };

        // Save to AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(mockUser));
        await AsyncStorage.setItem(
          "authToken",
          "expo-mock-token-" + Date.now()
        );

        set({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
        });

        console.log("✅ Expo Go Mock login successful");
        return { success: true };
      } else {
        throw new Error("Geçersiz email veya şifre");
      }
    } catch (error) {
      console.error("❌ Expo Go Login error:", error);
      set({ isLoading: false });
      return {
        success: false,
        error: error.message || "Giriş yapılırken bir hata oluştu",
      };
    }
  },

  // Mock Register - Expo Go uyumlu
  register: async (userData) => {
    try {
      set({ isLoading: true });

      console.log("📝 Expo Go Mock register:", userData);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockUser = {
        uid: "expo-mock-user-" + Date.now(),
        email: userData.email,
        displayName: `${userData.firstName} ${userData.lastName}`,
        phoneNumber: userData.phone,
      };

      await AsyncStorage.setItem("user", JSON.stringify(mockUser));
      await AsyncStorage.setItem("authToken", "expo-mock-token-" + Date.now());

      set({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });

      console.log("✅ Expo Go Mock register successful");
      return { success: true };
    } catch (error) {
      console.error("❌ Expo Go Register error:", error);
      set({ isLoading: false });
      return {
        success: false,
        error: error.message || "Kayıt olurken bir hata oluştu",
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      console.log("🚪 Expo Go Mock logout");

      await AsyncStorage.multiRemove(["user", "authToken"]);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      console.log("✅ Expo Go Mock logout successful");
      return { success: true };
    } catch (error) {
      console.error("❌ Expo Go Logout error:", error);
      return {
        success: false,
        error: error.message || "Çıkış yapılırken bir hata oluştu",
      };
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      console.log("🔐 Expo Go Mock forgot password for:", email);

      await new Promise((resolve) => setTimeout(resolve, 800));

      return {
        success: true,
        message: "Şifre sıfırlama emaili gönderildi (Expo Go Mock)",
      };
    } catch (error) {
      console.error("❌ Expo Go Forgot password error:", error);
      return {
        success: false,
        error: error.message || "Email gönderilirken bir hata oluştu",
      };
    }
  },

  // Setup Mock Auth Listener - Expo Go uyumlu
  setupAuthListener: () => {
    console.log("🎧 Expo Go - Setting up mock auth listener");

    // Initial auth check from AsyncStorage
    AsyncStorage.getItem("user")
      .then((userData) => {
        if (userData) {
          const user = JSON.parse(userData);
          console.log("✅ Expo Go - Found stored user:", user.email);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          console.log("ℹ️ Expo Go - No stored user found");
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        console.error("❌ Expo Go Auth check error:", error);
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      });

    // Return empty unsubscribe function
    return () => {
      console.log("🔇 Expo Go Mock auth listener cleanup");
    };
  },

  // Update profile
  updateProfile: async (updates) => {
    try {
      set({ isLoading: true });

      console.log("👤 Expo Go Mock update profile:", updates);

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      set((state) => ({
        user: { ...state.user, ...updates },
        isLoading: false,
      }));

      // Update AsyncStorage
      const currentUser = get().user;
      await AsyncStorage.setItem("user", JSON.stringify(currentUser));

      console.log("✅ Expo Go Mock profile update successful");
      return { success: true };
    } catch (error) {
      console.error("❌ Expo Go Update profile error:", error);
      set({ isLoading: false });
      return {
        success: false,
        error: error.message || "Profil güncellenirken bir hata oluştu",
      };
    }
  },
}));
