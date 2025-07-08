import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

/**
 * Firebase Auth ve Firestore kullanarak kimlik doğrulama işlemlerini yönetir.
 */
export const authService = {
  /**
   * Yeni bir kullanıcı kaydı oluşturur ve Firestore'da bir profil dokümanı açar.
   */
  register: async (name, email, password) => {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password
    );
    const { uid } = userCredential.user;

    // Firestore'da kullanıcıya özel bir doküman oluştur
    await firestore().collection("users").doc(uid).set({
      name,
      email,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    return userCredential.user;
  },

  /**
   * Kullanıcının giriş yapmasını sağlar.
   */
  login: async (email, password) => {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password
    );
    return userCredential.user;
  },

  /**
   * Kullanıcının oturumunu kapatır.
   */
  logout: async () => {
    await auth().signOut();
  },

  /**
   * Aktif kullanıcıyı döndürür.
   */
  getCurrentUser: () => {
    return auth().currentUser;
  },
};
