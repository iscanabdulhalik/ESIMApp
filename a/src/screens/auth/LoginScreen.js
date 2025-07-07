import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { sizes } from "../../constants/sizes";
import { globalStyles } from "../../styles/globalStyles";

// Validation schema
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Geçerli bir email adresi girin")
    .required("Email adresi zorunludur"),
  password: yup
    .string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre zorunludur"),
});

const LoginScreen = ({ navigation }) => {
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const result = await login(data.email, data.password);

      if (!result.success) {
        Alert.alert("Giriş Hatası", result.error);
      }
    } catch (error) {
      Alert.alert("Hata", "Beklenmeyen bir hata oluştu");
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Giriş yapılıyor..." />;
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <LinearGradient colors={colors.gradient.dark} style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo ve Başlık */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={colors.gradient.primary}
                  style={styles.logo}
                >
                  <Ionicons
                    name="phone-portrait"
                    size={sizes.icon.xl}
                    color={colors.text}
                  />
                </LinearGradient>
              </View>

              <Text style={styles.title}>DataGo eSIM</Text>
              <Text style={styles.subtitle}>
                Dünya çapında internet erişimi
              </Text>
            </View>

            {/* Login Form */}
            <View style={styles.form}>
              <Text style={styles.formTitle}>Giriş Yap</Text>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email Adresi"
                    placeholder="ornek@email.com"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon={
                      <Ionicons
                        name="mail-outline"
                        size={sizes.icon.sm}
                        color={colors.textMuted}
                      />
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Şifre"
                    placeholder="Şifrenizi girin"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    secureTextEntry
                    showPasswordToggle
                    leftIcon={
                      <Ionicons
                        name="lock-closed-outline"
                        size={sizes.icon.sm}
                        color={colors.textMuted}
                      />
                    }
                  />
                )}
              />

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
              </TouchableOpacity>

              <Button
                title="Giriş Yap"
                variant="gradient"
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid}
                style={styles.loginButton}
              />
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login */}
            <View style={styles.socialContainer}>
              <Button
                title="Google ile Giriş"
                variant="outline"
                icon={
                  <Ionicons
                    name="logo-google"
                    size={sizes.icon.sm}
                    color={colors.primary}
                    style={{ marginRight: sizes.margin.sm }}
                  />
                }
                style={styles.socialButton}
              />

              <Button
                title="Apple ile Giriş"
                variant="outline"
                icon={
                  <Ionicons
                    name="logo-apple"
                    size={sizes.icon.sm}
                    color={colors.primary}
                    style={{ marginRight: sizes.margin.sm }}
                  />
                }
                style={styles.socialButton}
              />
            </View>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Henüz hesabınız yok mu? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.registerLink}>Hesap Oluşturun</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    padding: sizes.padding.lg,
  },

  header: {
    alignItems: "center",
    marginTop: sizes.margin.xl,
    marginBottom: sizes.margin.xxl,
  },

  logoContainer: {
    marginBottom: sizes.margin.lg,
  },

  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: fonts.size.xxxl,
    fontFamily: fonts.family.bold,
    color: colors.text,
    marginBottom: sizes.margin.sm,
  },

  subtitle: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
    textAlign: "center",
  },

  form: {
    marginBottom: sizes.margin.xl,
  },

  formTitle: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.semiBold,
    color: colors.text,
    marginBottom: sizes.margin.lg,
    textAlign: "center",
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: sizes.margin.lg,
  },

  forgotPasswordText: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.medium,
    color: colors.primary,
  },

  loginButton: {
    marginTop: sizes.margin.sm,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: sizes.margin.lg,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  dividerText: {
    marginHorizontal: sizes.margin.md,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.regular,
    color: colors.textMuted,
  },

  socialContainer: {
    marginBottom: sizes.margin.xl,
  },

  socialButton: {
    marginBottom: sizes.margin.sm,
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  registerText: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
  },

  registerLink: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.medium,
    color: colors.primary,
  },
});

export default LoginScreen;
