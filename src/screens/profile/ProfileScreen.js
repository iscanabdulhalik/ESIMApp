// src/screens/profile/ProfileScreen.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useAuthStore } from "../../stores/authStore";
import { COLORS, FONTS, SIZES } from "../../constants/theme";

const ProfileScreen = () => {
  const { logout, user } = useAuthStore();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  title: { ...FONTS.h1, color: COLORS.text },
  email: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginVertical: SIZES.padding,
  },
  button: {
    backgroundColor: COLORS.error,
    padding: SIZES.padding / 1.5,
    borderRadius: SIZES.radius,
    alignItems: "center",
  },
  buttonText: { ...FONTS.h3, color: COLORS.white, fontWeight: "bold" },
});
export default ProfileScreen;
