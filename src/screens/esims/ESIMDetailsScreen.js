// src/screens/esims/ESIMDetailsScreen.js
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useESIMStore } from "../../stores/esimStore";
import { COLORS, FONTS, SIZES } from "../../constants/theme";

const ESIMDetailsScreen = ({ route }) => {
  const { orderId } = route.params;
  const { selectedESIMDetails, isLoadingDetails, error, fetchESIMDetails } =
    useESIMStore();

  useEffect(() => {
    if (orderId) {
      fetchESIMDetails(orderId);
    }
  }, [orderId]);

  if (isLoadingDetails) {
    return (
      <ActivityIndicator
        style={styles.center}
        size="large"
        color={COLORS.primary}
      />
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!selectedESIMDetails) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>eSIM detayları bulunamadı.</Text>
      </View>
    );
  }

  // QR kodu için gereken veri API dokümantasyonundan kontrol edilmelidir.
  // Genellikle 'smdp_address' ve 'matching_id' birleştirilir. LPA:1$smdp_address$matching_id
  const qrCodeData =
    selectedESIMDetails.qr_code_data ||
    `LPA:1$${selectedESIMDetails.smdp_address}$${selectedESIMDetails.matching_id}`;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>eSIM Kurulumu</Text>

        <View style={styles.qrContainer}>
          <QRCode
            value={qrCodeData}
            size={250}
            backgroundColor={COLORS.white}
            color={COLORS.black}
          />
        </View>

        <Text style={styles.infoText}>
          Kurulum için yukarıdaki QR kodu telefonunuzun ayarlarından tarayın.
        </Text>

        <View style={styles.manualSetupContainer}>
          <Text style={styles.manualTitle}>Veya Manuel Kurulum Yapın</Text>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>SM-DP+ Adresi</Text>
            <Text style={styles.detailValue} selectable>
              {selectedESIMDetails.smdp_address}
            </Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Aktivasyon Kodu</Text>
            <Text style={styles.detailValue} selectable>
              {selectedESIMDetails.matching_id}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding, alignItems: "center" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  headerTitle: { ...FONTS.h1, color: COLORS.text, marginBottom: SIZES.padding },
  qrContainer: {
    padding: SIZES.base * 2,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    elevation: 10,
  },
  infoText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginVertical: SIZES.padding,
  },
  manualSetupContainer: {
    width: "100%",
    backgroundColor: COLORS.surface,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginTop: SIZES.base,
  },
  manualTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SIZES.padding,
  },
  detailBox: { marginBottom: SIZES.base * 2 },
  detailLabel: { ...FONTS.body4, color: COLORS.textSecondary },
  detailValue: {
    ...FONTS.h4,
    color: COLORS.primary,
    marginTop: SIZES.base / 2,
  },
  errorText: { ...FONTS.h3, color: COLORS.error },
});

export default ESIMDetailsScreen;
