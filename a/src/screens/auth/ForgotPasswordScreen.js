import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { authService } from "../../services/authService";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { sizes } from "../../constants/sizes";
import { globalStyles } from "../../styles/globalStyles";

const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Geçerli bir email adresi girin")
    .required("Email adresi zorunludur"),
});

const ForgotPasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const result = await authService.forgotPassword(data.email);

      if (result.success) {
        setEmailSent(true);
      } else {
        Alert.alert("Hata", result.error);
      }
    } catch (error) {
      Alert.alert("Hata", "Beklenmeyen bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <LinearGradient colors={colors.gradient.dark} style={styles.container}>
        <View style={styles.content}>
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

            <View style={styles.iconContainer}>
              <LinearGradient
                colors={colors.gradient.primary}
                style={styles.icon}
              >
                <Ionicons
                  name="lock-closed"
                  size={sizes.icon.lg}
                  color={colors.text}
                />
              </LinearGradient>
            </View>

            <Text style={styles.title}>
              {emailSent ? "Email Gönderildi" : "Şifremi Unuttum"}
            </Text>

            <Text style={styles.subtitle}>
              {emailSent
                ? "Email adresinizi kontrol edin ve şifre sıfırlama bağlantısına tıklayın"
                : "Email adresinizi girin, size şifre sıfırlama bağlantısı gönderelim"}
            </Text>
          </View>

          {!emailSent ? (
            <View style={styles.form}>
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

              <Button
                title="Şifre Sıfırlama Bağlantısı Gönder"
                variant="gradient"
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid}
                loading={loading}
                style={styles.submitButton}
              />
            </View>
          ) : (
            <View style={styles.successContainer}>
              <Button
                title="Email Tekrar Gönder"
                variant="outline"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                style={styles.resendButton}
              />

              <Button
                title="Giriş Sayfasına Dön"
                variant="ghost"
                onPress={() => navigation.navigate("Login")}
                style={styles.backToLoginButton}
              />
            </View>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    padding: sizes.padding.lg,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: sizes.margin.xxl,
  },

  backButton: {
    position: "absolute",
    left: -sizes.padding.lg,
    top: -sizes.padding.lg,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  iconContainer: {
    marginBottom: sizes.margin.lg,
  },

  icon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: fonts.size.xxl,
    fontFamily: fonts.family.bold,
    color: colors.text,
    marginBottom: sizes.margin.sm,
    textAlign: "center",
  },

  subtitle: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: sizes.padding.md,
  },

  form: {
    marginBottom: sizes.margin.xl,
  },

  submitButton: {
    marginTop: sizes.margin.lg,
  },

  successContainer: {
    alignItems: "center",
  },

  resendButton: {
    marginBottom: sizes.margin.md,
  },

  backToLoginButton: {
    marginTop: sizes.margin.sm,
  },
});

export default ForgotPasswordScreen;
