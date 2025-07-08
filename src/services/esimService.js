import functions from "@react-native-firebase/functions";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export const esimService = {
  /**
   * Güvenli Cloud Function'ı çağırarak yeni bir eSIM siparişi oluşturur.
   */
  createOrder: async (packageId) => {
    const purchaseFunction = functions().httpsCallable("purchaseESIM");
    const result = await purchaseFunction({ packageId });
    return result.data.esim;
  },

  /**
   * Kullanıcının Firestore'a kaydedilmiş eSIM'lerini getirir.
   */
  getMyESIMs: async () => {
    const uid = auth().currentUser?.uid;
    if (!uid) throw new Error("Kullanıcı giriş yapmamış.");

    const snapshot = await firestore()
      .collection("users")
      .doc(uid)
      .collection("esims")
      .orderBy("purchasedAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Mağazada gösterilecek paketleri getirir.
   * Bu endpoint'in public olduğunu ve API key gerektirmediğini varsayıyoruz.
   * Eğer API key gerekiyorsa, bunun için de bir Cloud Function yazılmalıdır.
   */
  getPackages: async () => {
    const response = await fetch("https://api.esimaccess.com/v1/packages");
    return response.json();
  },
};
