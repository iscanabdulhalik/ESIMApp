import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuthStore } from "../../stores/authStore";
import { COLORS, FONTS, SIZES } from "../../constants/theme";

const LoginScreen = ({ navigation }) => {
  const { login } = useAuthStore();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Email ve şifre alanlarını doldurun");
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert("Giriş Hatası", result.error || "Bir hata oluştu");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>DataGo eSIM'e Hoş Geldiniz</Text>
        <Text style={styles.subtitle}>Giriş yapın ve dünyayı keşfedin</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="E-posta"
            placeholderTextColor={COLORS.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Şifre"
            placeholderTextColor={COLORS.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Giriş Yap</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>
              Hesabınız yok mu?{" "}
              <Text style={styles.linkHighlight}>Kayıt olun</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.linkText}>Şifremi Unuttum</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SIZES.padding * 2,
  },
  form: {
    marginBottom: SIZES.padding * 2,
  },
  input: {
    backgroundColor: COLORS.surface,
    ...FONTS.body3,
    color: COLORS.text,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginTop: SIZES.padding,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...FONTS.h3,
    color: COLORS.white,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
  },
  linkText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
  },
  linkHighlight: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});

export default LoginScreen;
