// src/screens/purchase/PurchaseSummaryScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useESIMStore } from "../../stores/esimStore";
import { COLORS, FONTS, SIZES } from "../../constants/theme";

const PurchaseSummaryScreen = ({ route, navigation }) => {
  const { packageDetails } = route.params;
  const { createOrder, isLoadingOrder, error } = useESIMStore();

  const handleConfirmPurchase = async () => {
    // Bu noktada gerçek bir projede Stripe/Apple Pay/Google Pay entegrasyonu olur.
    // Şimdilik ödemenin başarılı olduğunu varsayıyoruz.

    const newESIM = await createOrder(packageDetails.id);

    if (newESIM) {
      Alert.alert("Başarılı!", "eSIM paketiniz başarıyla oluşturuldu.");
      // Kullanıcıyı geri dönemeyeceği şekilde detay ekranına yönlendir.
      navigation.replace("ESIMDetails", {
        esimId: newESIM.id,
        orderId: newESIM.order_id,
      }); // API'den gelen doğru ID'leri kullan
    } else {
      // Hata state'i store'da zaten ayarlandı. Sadece bir uyarı göster.
      Alert.alert(
        "Hata",
        "Siparişiniz oluşturulamadı. Lütfen daha sonra tekrar deneyin."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Sipariş Özeti</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {packageDetails.country?.name || "Global Paket"}
          </Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Veri:</Text>
            <Text style={styles.detailValue}>
              {packageDetails.data_amount || "N/A"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Geçerlilik:</Text>
            <Text style={styles.detailValue}>
              {packageDetails.validity_days || "N/A"} gün
            </Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.detailRow}>
            <Text style={styles.totalLabel}>Toplam Tutar:</Text>
            <Text style={styles.totalValue}>
              ${packageDetails.price?.amount || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            isLoadingOrder && styles.disabledButton,
          ]}
          onPress={handleConfirmPurchase}
          disabled={isLoadingOrder}
        >
          {isLoadingOrder ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.confirmButtonText}>Onayla ve Öde</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "space-between",
  },
  content: { padding: SIZES.padding },
  headerTitle: {
    ...FONTS.h1,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SIZES.padding,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
  },
  cardTitle: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: SIZES.padding,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: SIZES.base,
  },
  detailLabel: { ...FONTS.body3, color: COLORS.textSecondary },
  detailValue: { ...FONTS.h3, color: COLORS.text },
  separator: {
    height: 1,
    backgroundColor: COLORS.background,
    marginVertical: SIZES.padding,
  },
  totalLabel: { ...FONTS.h3, color: COLORS.text, fontWeight: "bold" },
  totalValue: { ...FONTS.h2, color: COLORS.primary, fontWeight: "bold" },
  footer: { padding: SIZES.padding },
  confirmButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding / 1.5,
    borderRadius: SIZES.radius,
    alignItems: "center",
  },
  disabledButton: { backgroundColor: COLORS.textSecondary },
  confirmButtonText: { ...FONTS.h3, color: COLORS.white, fontWeight: "bold" },
});

export default PurchaseSummaryScreen;
