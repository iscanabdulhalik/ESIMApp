// src/screens/auth/LoginScreen.js
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useAuthStore } from "../../stores/authStore";
import { COLORS, FONTS, SIZES } from "../../constants/theme";

const LoginScreen = () => {
  const { login } = useAuthStore();
  // Gerçek uygulamada useState ile input'ları yönetin
  const [email, setEmail] = React.useState("user@example.com");
  const [password, setPassword] = React.useState("password");

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>DataGo'ya Hoş Geldiniz</Text>
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        placeholderTextColor={COLORS.textSecondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        placeholderTextColor={COLORS.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => login(email, password)}
      >
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
// Stil kodları eklenmeli
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SIZES.padding * 2,
  },
  input: {
    backgroundColor: COLORS.surface,
    ...FONTS.body3,
    color: COLORS.text,
    padding: SIZES.padding / 1.5,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base * 2,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding / 1.5,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginTop: SIZES.padding,
  },
  buttonText: { ...FONTS.h3, color: COLORS.white, fontWeight: "bold" },
});

export default LoginScreen;
