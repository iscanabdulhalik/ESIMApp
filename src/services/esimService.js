import functions from "@react-native-firebase/functions";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import axios from "axios";

export const esimService = {
  /**
   * Create a new eSIM order using Firebase Functions
   */
  createOrder: async (packageId) => {
    try {
      const purchaseFunction = functions().httpsCallable("purchaseESIMPackage");
      const result = await purchaseFunction({ packageId });

      if (result.data.success) {
        return result.data.esim;
      } else {
        throw new Error(result.data.error || "Sipariş oluşturulamadı");
      }
    } catch (error) {
      console.error("Create order error:", error);
      throw error;
    }
  },

  /**
   * Get user's eSIMs from Firestore
   */
  getMyESIMs: async () => {
    try {
      const uid = auth().currentUser?.uid;
      if (!uid) {
        throw new Error("Kullanıcı giriş yapmamış");
      }

      const snapshot = await firestore()
        .collection("users")
        .doc(uid)
        .collection("esims")
        .orderBy("purchasedAt", "desc")
        .get();

      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Get my eSIMs error:", error);
      throw error;
    }
  },

  /**
   * Get available packages from eSIM Access API
   */
  getPackages: async () => {
    try {
      // This endpoint should be public or use a server-side proxy
      const response = await axios.get(
        "https://api.esimaccess.com/v1/packages",
        {
          headers: {
            "X-API-Key": process.env.ESIM_ACCESS_API_KEY,
          },
        }
      );

      return response.data.packages || response.data;
    } catch (error) {
      console.error("Get packages error:", error);

      // Fallback to mock data if API fails
      return [
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
    }
  },

  /**
   * Get eSIM details by order ID
   */
  getESIMDetailsByOrder: async (orderId) => {
    try {
      const uid = auth().currentUser?.uid;
      if (!uid) {
        throw new Error("Kullanıcı giriş yapmamış");
      }

      const snapshot = await firestore()
        .collection("users")
        .doc(uid)
        .collection("esims")
        .where("orderId", "==", orderId)
        .get();

      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Get eSIM details error:", error);
      throw error;
    }
  },

  /**
   * Get package details by ID
   */
  getPackageDetails: async (packageId) => {
    try {
      const response = await axios.get(
        `https://api.esimaccess.com/v1/packages/${packageId}`,
        {
          headers: {
            "X-API-Key": process.env.ESIM_ACCESS_API_KEY,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Get package details error:", error);

      // Fallback to mock data
      return {
        id: packageId,
        country: "Türkiye",
        name: "Türkiye 30 Gün",
        price: 29.99,
        dataAmount: 5120,
        duration: 30,
        countryFlag: "🇹🇷",
      };
    }
  },

  /**
   * Get eSIM usage data
   */
  getESIMUsage: async (iccid) => {
    try {
      const response = await axios.get(
        `https://api.esimaccess.com/v1/esims/${iccid}/usage`,
        {
          headers: {
            "X-API-Key": process.env.ESIM_ACCESS_API_KEY,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Get eSIM usage error:", error);
      throw error;
    }
  },

  /**
   * Activate eSIM
   */
  activateESIM: async (iccid) => {
    try {
      const response = await axios.post(
        `https://api.esimaccess.com/v1/esims/${iccid}/activate`,
        {},
        {
          headers: {
            "X-API-Key": process.env.ESIM_ACCESS_API_KEY,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Activate eSIM error:", error);
      throw error;
    }
  },

  /**
   * Deactivate eSIM
   */
  deactivateESIM: async (iccid) => {
    try {
      const response = await axios.post(
        `https://api.esimaccess.com/v1/esims/${iccid}/deactivate`,
        {},
        {
          headers: {
            "X-API-Key": process.env.ESIM_ACCESS_API_KEY,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Deactivate eSIM error:", error);
      throw error;
    }
  },
};
