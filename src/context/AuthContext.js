import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../services/authService";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Uygulama başladığında token kontrolü
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      const userData = await AsyncStorage.getItem("userData");

      if (token && userData) {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth status check error:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);

      // Mock login for testing - replace with actual API call
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: "1",
            firstName: "Test",
            lastName: "User",
            email: email,
            phone: "+90 555 123 4567",
          },
          token: "mock_jwt_token_" + Date.now(),
          refreshToken: "mock_refresh_token_" + Date.now(),
        },
      };

      // Simulated delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (mockResponse.success) {
        const { user: userData, token, refreshToken } = mockResponse.data;

        // Store authentication data
        await AsyncStorage.multiSet([
          ["authToken", token],
          ["refreshToken", refreshToken],
          ["userData", JSON.stringify(userData)],
        ]);

        setUser(userData);
        setIsAuthenticated(true);

        return { success: true };
      } else {
        return { success: false, error: mockResponse.error };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Giriş yapılırken bir hata oluştu" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);

      // Mock register for testing
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: "2",
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
          },
          token: "mock_jwt_token_" + Date.now(),
          refreshToken: "mock_refresh_token_" + Date.now(),
        },
      };

      // Simulated delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (mockResponse.success) {
        const { user: newUser, token, refreshToken } = mockResponse.data;

        await AsyncStorage.multiSet([
          ["authToken", token],
          ["refreshToken", refreshToken],
          ["userData", JSON.stringify(newUser)],
        ]);

        setUser(newUser);
        setIsAuthenticated(true);

        return { success: true };
      } else {
        return { success: false, error: mockResponse.error };
      }
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: "Kayıt olurken bir hata oluştu" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      // Clear stored data
      await AsyncStorage.multiRemove(["authToken", "refreshToken", "userData"]);

      setUser(null);
      setIsAuthenticated(false);

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: "Çıkış yapılırken bir hata oluştu" };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);

      // Mock update for testing
      const updatedUser = { ...user, ...profileData };

      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true };
    } catch (error) {
      console.error("Profile update error:", error);
      return { success: false, error: "Profil güncellenirken bir hata oluştu" };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);

      // Mock forgot password
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return { success: true, message: "Şifre sıfırlama emaili gönderildi" };
    } catch (error) {
      console.error("Forgot password error:", error);
      return { success: false, error: "Email gönderilirken bir hata oluştu" };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
