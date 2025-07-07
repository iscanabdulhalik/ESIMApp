import { useState, useEffect, useCallback } from "react";
import { esimService } from "../services/api/esimService";

export const useESIM = (iccid = null) => {
  const [esims, setEsims] = useState([]);
  const [selectedESIM, setSelectedESIM] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tüm eSIM'leri getir
  const fetchESIMs = useCallback(async (status = null) => {
    try {
      setLoading(true);
      setError(null);

      const response = await esimService.getESIMs(status);

      if (response.success) {
        setEsims(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Belirli bir eSIM'i getir
  const fetchESIMDetails = useCallback(
    async (iccidParam) => {
      const targetIccid = iccidParam || iccid;

      if (!targetIccid) return;

      try {
        setLoading(true);
        setError(null);

        const response = await esimService.getESIMDetails(targetIccid);

        if (response.success) {
          setSelectedESIM(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [iccid]
  );

  // eSIM etkinleştir
  const activateESIM = useCallback(
    async (iccidParam) => {
      const targetIccid = iccidParam || iccid;

      if (!targetIccid) return { success: false, error: "ICCID gerekli" };

      try {
        setLoading(true);
        setError(null);

        const response = await esimService.activateESIM(targetIccid);

        if (response.success) {
          // eSIM'i güncelle
          await fetchESIMDetails(targetIccid);
          // Liste varsa güncelle
          if (esims.length > 0) {
            await fetchESIMs();
          }
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
    [iccid, esims.length, fetchESIMDetails, fetchESIMs]
  );

  // eSIM devre dışı bırak
  const deactivateESIM = useCallback(
    async (iccidParam) => {
      const targetIccid = iccidParam || iccid;

      if (!targetIccid) return { success: false, error: "ICCID gerekli" };

      try {
        setLoading(true);
        setError(null);

        const response = await esimService.deactivateESIM(targetIccid);

        if (response.success) {
          await fetchESIMDetails(targetIccid);
          if (esims.length > 0) {
            await fetchESIMs();
          }
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
    [iccid, esims.length, fetchESIMDetails, fetchESIMs]
  );

  // eSIM kullanımını getir
  const fetchUsageData = useCallback(
    async (iccidParam, startDate, endDate) => {
      const targetIccid = iccidParam || iccid;

      if (!targetIccid) return { success: false, error: "ICCID gerekli" };

      try {
        setLoading(true);
        setError(null);

        const response = await esimService.getESIMUsage(
          targetIccid,
          startDate,
          endDate
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
    [iccid]
  );

  // eSIM QR kodunu getir
  const fetchQRCode = useCallback(
    async (iccidParam) => {
      const targetIccid = iccidParam || iccid;

      if (!targetIccid) return { success: false, error: "ICCID gerekli" };

      try {
        setLoading(true);
        setError(null);

        const response = await esimService.getESIMQR(targetIccid);

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
    [iccid]
  );

  // eSIM isim değiştir
  const renameESIM = useCallback(
    async (iccidParam, newName) => {
      const targetIccid = iccidParam || iccid;

      if (!targetIccid || !newName) {
        return { success: false, error: "ICCID ve yeni isim gerekli" };
      }

      try {
        setLoading(true);
        setError(null);

        const response = await esimService.renameESIM(targetIccid, newName);

        if (response.success) {
          await fetchESIMDetails(targetIccid);
          if (esims.length > 0) {
            await fetchESIMs();
          }
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
    [iccid, esims.length, fetchESIMDetails, fetchESIMs]
  );

  // Component mount olduğunda veri getir
  useEffect(() => {
    if (iccid) {
      fetchESIMDetails();
    }
  }, [iccid, fetchESIMDetails]);

  return {
    // State
    esims,
    selectedESIM,
    loading,
    error,

    // Actions
    fetchESIMs,
    fetchESIMDetails,
    activateESIM,
    deactivateESIM,
    fetchUsageData,
    fetchQRCode,
    renameESIM,

    // Helpers
    refreshESIMs: () => fetchESIMs(),
    clearError: () => setError(null),
  };
};

export default useESIM;
