import { useState, useCallback } from "react";
import { paymentService } from "../services/api/paymentService";

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  // Ödeme işlemi başlat
  const createPayment = useCallback(
    async (amount, packageId, currency = "USD") => {
      try {
        setLoading(true);
        setError(null);

        const response = await paymentService.createPaymentIntent(
          amount,
          currency,
          packageId
        );

        if (!response.success) {
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
    []
  );

  // Ödemeyi onayla
  const confirmPayment = useCallback(
    async (paymentIntentId, paymentMethodId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await paymentService.confirmPayment(
          paymentIntentId,
          paymentMethodId
        );

        if (!response.success) {
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
    []
  );

  // Ödeme yöntemlerini getir
  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await paymentService.getPaymentMethods();

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

  // Ödeme geçmişini getir
  const fetchPaymentHistory = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      setError(null);

      const response = await paymentService.getPaymentHistory(page, limit);

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

  // Ödeme yöntemi ekle
  const addPaymentMethod = useCallback(
    async (paymentMethodId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await paymentService.addPaymentMethod(paymentMethodId);

        if (response.success) {
          // Ödeme yöntemlerini yenile
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

  // Ödeme yöntemi sil
  const removePaymentMethod = useCallback(
    async (paymentMethodId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await paymentService.removePaymentMethod(
          paymentMethodId
        );

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
