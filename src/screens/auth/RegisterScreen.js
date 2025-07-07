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
const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("Ad zorunludur")
    .min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: yup
    .string()
    .required("Soyad zorunludur")
    .min(2, "Soyad en az 2 karakter olmalıdır"),
  email: yup
    .string()
    .email("Geçerli bir email adresi girin")
    .required("Email adresi zorunludur"),
  phone: yup
    .string()
    .required("Telefon numarası zorunludur")
    .min(10, "Geçerli bir telefon numarası girin"),
  password: yup
    .string()
    .min(8, "Şifre en az 8 karakter olmalıdır")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Şifre en az bir büyük harf, küçük harf ve rakam içermelidir"
    )
    .required("Şifre zorunludur"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Şifreler eşleşmiyor")
    .required("Şifre tekrarı zorunludur"),
});

const RegisterScreen = ({ navigation }) => {
  const { register, loading } = useAuth();
  const [acceptTerms, setAcceptTerms] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    if (!acceptTerms) {
      Alert.alert("Uyarı", "Kullanım şartlarını kabul etmelisiniz");
      return;
    }

    try {
      const result = await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      if (!result.success) {
        Alert.alert("Kayıt Hatası", result.error);
      }
    } catch (error) {
      Alert.alert("Hata", "Beklenmeyen bir hata oluştu");
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Hesap oluşturuluyor..." />;
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
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons
                  name="arrow-back"
                  size={sizes.icon.md}
                  color={colors.text}
                />
              </TouchableOpacity>

              <Text style={styles.title}>Hesap Oluştur</Text>
              <Text style={styles.subtitle}>DataGo eSIM ailesine katılın</Text>
            </View>

            {/* Register Form */}
            <View style={styles.form}>
              <View style={styles.nameRow}>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Ad"
                      placeholder="Adınız"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.firstName?.message}
                      style={styles.halfInput}
                      leftIcon={
                        <Ionicons
                          name="person-outline"
                          size={sizes.icon.sm}
                          color={colors.textMuted}
                        />
                      }
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Soyad"
                      placeholder="Soyadınız"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.lastName?.message}
                      style={styles.halfInput}
                    />
                  )}
                />
              </View>

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
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Telefon Numarası"
                    placeholder="+90 5xx xxx xx xx"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.phone?.message}
                    keyboardType="phone-pad"
                    leftIcon={
                      <Ionicons
                        name="call-outline"
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
                    placeholder="Güçlü bir şifre oluşturun"
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

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Şifre Tekrarı"
                    placeholder="Şifrenizi tekrar girin"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.confirmPassword?.message}
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

              {/* Terms and Conditions */}
              <TouchableOpacity
                style={styles.termsContainer}
                onPress={() => setAcceptTerms(!acceptTerms)}
              >
                <View
                  style={[
                    styles.checkbox,
                    acceptTerms && styles.checkboxActive,
                  ]}
                >
                  {acceptTerms && (
                    <Ionicons name="checkmark" size={16} color={colors.text} />
                  )}
                </View>
                <Text style={styles.termsText}>
                  <Text style={styles.termsLink}>Kullanım Şartları</Text> ve{" "}
                  <Text style={styles.termsLink}>Gizlilik Politikası</Text>'nı
                  okudum ve kabul ediyorum
                </Text>
              </TouchableOpacity>

              <Button
                title="Hesap Oluştur"
                variant="gradient"
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || !acceptTerms}
                style={styles.registerButton}
              />
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Giriş Yapın</Text>
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
    marginTop: sizes.margin.lg,
    marginBottom: sizes.margin.xl,
  },

  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: fonts.size.xxl,
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

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  halfInput: {
    width: "48%",
  },

  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: sizes.margin.lg,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    marginRight: sizes.margin.sm,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },

  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  termsText: {
    flex: 1,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  termsLink: {
    color: colors.primary,
    fontFamily: fonts.family.medium,
  },

  registerButton: {
    marginTop: sizes.margin.sm,
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  loginText: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
  },

  loginLink: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.medium,
    color: colors.primary,
  },
});

export default RegisterScreen;
