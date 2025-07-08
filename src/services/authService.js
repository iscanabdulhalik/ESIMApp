import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

/**
 * Firebase Auth service for user authentication
 */
export const authService = {
  /**
   * Register a new user with email and password
   */
  register: async (name, email, password) => {
    try {
      // Create user with Firebase Auth
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      const { uid } = userCredential.user;

      // Update profile with display name
      await userCredential.user.updateProfile({
        displayName: name,
      });

      // Create user document in Firestore
      await firestore().collection("users").doc(uid).set({
        name,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      return userCredential.user;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  /**
   * Sign in user with email and password
   */
  login: async (email, password) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );

      // Update last login time
      await firestore()
        .collection("users")
        .doc(userCredential.user.uid)
        .update({
          lastLoginAt: firestore.FieldValue.serverTimestamp(),
        });

      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Sign out current user
   */
  logout: async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: () => {
    return auth().currentUser;
  },

  /**
   * Send password reset email
   */
  forgotPassword: async (email) => {
    try {
      await auth().sendPasswordResetEmail(email);
      return { success: true, message: "Şifre sıfırlama emaili gönderildi" };
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (updates) => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error("Kullanıcı bulunamadı");
      }

      // Update Firebase Auth profile
      if (updates.displayName) {
        await currentUser.updateProfile({
          displayName: updates.displayName,
        });
      }

      // Update Firestore document
      await firestore()
        .collection("users")
        .doc(currentUser.uid)
        .update({
          ...updates,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      return { success: true };
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },

  /**
   * Delete user account
   */
  deleteAccount: async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error("Kullanıcı bulunamadı");
      }

      // Delete user document from Firestore
      await firestore().collection("users").doc(currentUser.uid).delete();

      // Delete user from Firebase Auth
      await currentUser.delete();

      return { success: true };
    } catch (error) {
      console.error("Delete account error:", error);
      throw error;
    }
  },

  /**
   * Get user profile from Firestore
   */
  getUserProfile: async (uid) => {
    try {
      const userDoc = await firestore().collection("users").doc(uid).get();

      if (userDoc.exists) {
        return { id: userDoc.id, ...userDoc.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Get user profile error:", error);
      throw error;
    }
  },
};
