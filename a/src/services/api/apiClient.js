import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "../../constants/api";

// API client instance oluşturma
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor - her istekte token ekle
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Token alınamadı:", error);
    }

    // Request log
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params,
    });

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - yanıtları işle
apiClient.interceptors.response.use(
  (response) => {
    // Response log
    console.log(
      `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
      {
        status: response.status,
        data: response.data,
      }
    );

    return response;
  },
  async (error) => {
    const { response, config } = error;

    // Error log
    console.error(`❌ ${config?.method?.toUpperCase()} ${config?.url}`, {
      status: response?.status,
      message: error.message,
      data: response?.data,
    });

    // 401 Unauthorized - token süresi dolmuş
    if (response?.status === 401) {
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        if (refreshToken) {
          // Token yenileme işlemi
          const refreshResponse = await axios.post(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
            { refreshToken },
            { headers: API_CONFIG.HEADERS }
          );

          if (refreshResponse.data.success) {
            const { token: newToken, refreshToken: newRefreshToken } =
              refreshResponse.data.data;

            // Yeni token'ları kaydet
            await AsyncStorage.setItem("authToken", newToken);
            await AsyncStorage.setItem("refreshToken", newRefreshToken);

            // Orijinal isteği yeni token ile tekrar dene
            config.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(config);
          }
        }

        // Refresh başarısız, kullanıcıyı çıkış yap
        await AsyncStorage.multiRemove([
          "authToken",
          "refreshToken",
          "userData",
        ]);
        // Navigation reset - login ekranına yönlendir
      } catch (refreshError) {
        console.error("Token yenileme hatası:", refreshError);
        await AsyncStorage.multiRemove([
          "authToken",
          "refreshToken",
          "userData",
        ]);
      }
    }

    // Retry mekanizması
    if (config && !config._retry && response?.status >= 500) {
      config._retry = true;
      config._retryCount = (config._retryCount || 0) + 1;

      if (config._retryCount <= API_CONFIG.RETRY.COUNT) {
        console.log(
          `🔄 Retry ${config._retryCount}/${API_CONFIG.RETRY.COUNT} for ${config.url}`
        );

        // Delay ekle
        await new Promise((resolve) =>
          setTimeout(resolve, API_CONFIG.RETRY.DELAY * config._retryCount)
        );

        return apiClient(config);
      }
    }

    return Promise.reject(error);
  }
);

// API response wrapper
export const apiRequest = async (requestFn) => {
  try {
    const response = await requestFn();

    return {
      success: true,
      data: response.data?.data || response.data,
      message: response.data?.message || "İşlem başarılı",
      status: response.status,
    };
  } catch (error) {
    const { response } = error;

    let errorMessage = "Bir hata oluştu";
    let errorCode = "UNKNOWN_ERROR";

    if (response) {
      errorMessage =
        response.data?.message || response.data?.error || "Sunucu hatası";
      errorCode = response.data?.code || `HTTP_${response.status}`;
    } else if (error.code === "NETWORK_ERROR") {
      errorMessage = "İnternet bağlantınızı kontrol edin";
      errorCode = "NETWORK_ERROR";
    } else if (error.code === "TIMEOUT") {
      errorMessage = "İstek zaman aşımına uğradı";
      errorCode = "TIMEOUT";
    }

    return {
      success: false,
      error: errorMessage,
      code: errorCode,
      status: response?.status || 0,
    };
  }
};

// GET request
export const get = (url, params = {}) =>
  apiRequest(() => apiClient.get(url, { params }));

// POST request
export const post = (url, data = {}) =>
  apiRequest(() => apiClient.post(url, data));

// PUT request
export const put = (url, data = {}) =>
  apiRequest(() => apiClient.put(url, data));

// DELETE request
export const del = (url) => apiRequest(() => apiClient.delete(url));

// PATCH request
export const patch = (url, data = {}) =>
  apiRequest(() => apiClient.patch(url, data));

export default apiClient;
