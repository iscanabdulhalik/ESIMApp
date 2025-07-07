import { useState, useCallback } from "react";
// Stripe import'unu kaldırdık
// import { paymentService } from "../services/api/paymentService";

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  // Mock ödeme işlemi başlat
  const createPayment = useCallback(
    async (amount, packageId, currency = "USD") => {
      try {
        setLoading(true);
        setError(null);

        // Mock API call simulation
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockResponse = {
          success: true,
          data: {
            paymentIntent: "pi_mock_" + Date.now(),
            ephemeralKey: "ek_mock_" + Date.now(),
            customer: "cus_mock_" + Date.now(),
            clientSecret: "pi_mock_secret_" + Date.now(),
          },
        };

        if (!mockResponse.success) {
          setError(mockResponse.error);
        }

        return mockResponse;
      } catch (err) {
        const errorMsg = err.message;
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Mock ödemeyi onayla
  const confirmPayment = useCallback(
    async (paymentIntentId, paymentMethodId) => {
      try {
        setLoading(true);
        setError(null);

        // Mock confirmation
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockResponse = {
          success: true,
          data: {
            paymentIntent: {
              id: paymentIntentId,
              status: "succeeded",
            },
          },
        };

        if (!mockResponse.success) {
          setError(mockResponse.error);
        }

        return mockResponse;
      } catch (err) {
        const errorMsg = err.message;
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Mock ödeme yöntemlerini getir
  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockMethods = [
        {
          id: "pm_mock_1",
          type: "card",
          card: {
            brand: "visa",
            last4: "4242",
            exp_month: 12,
            exp_year: 2025,
          },
        },
      ];

      const response = { success: true, data: mockMethods };

      if (response.success) {
        setPaymentMethods(response.data);
      } else {
        setError(response.error);
      }

      return response;
    } catch (err) {
      const errorMsg = err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Mock ödeme geçmişini getir
  const fetchPaymentHistory = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockHistory = [
        {
          id: "pay_mock_1",
          amount: 29.99,
          currency: "USD",
          status: "succeeded",
          created: new Date().toISOString(),
          description: "eSIM Package - Turkey 30 Days",
        },
      ];

      const response = { success: true, data: mockHistory };

      if (response.success) {
        setPaymentHistory(response.data);
      } else {
        setError(response.error);
      }

      return response;
    } catch (err) {
      const errorMsg = err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Mock ödeme yöntemi ekle
  const addPaymentMethod = useCallback(
    async (paymentMethodId) => {
      try {
        setLoading(true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const response = { success: true, message: "Ödeme yöntemi eklendi" };

        if (response.success) {
          await fetchPaymentMethods();
        } else {
          setError(response.error);
        }

        return response;
      } catch (err) {
        const errorMsg = err.message;
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [fetchPaymentMethods]
  );

  // Mock ödeme yöntemi sil
  const removePaymentMethod = useCallback(
    async (paymentMethodId) => {
      try {
        setLoading(true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 500));

        const response = { success: true, message: "Ödeme yöntemi silindi" };

        if (response.success) {
          await fetchPaymentMethods();
        } else {
          setError(response.error);
        }

        return response;
      } catch (err) {
        const errorMsg = err.message;
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [fetchPaymentMethods]
  );

  return {
    // State
    loading,
    error,
    paymentMethods,
    paymentHistory,

    // Actions
    createPayment,
    confirmPayment,
    fetchPaymentMethods,
    fetchPaymentHistory,
    addPaymentMethod,
    removePaymentMethod,

    // Helpers
    clearError: () => setError(null),
  };
};

export default usePayment;
