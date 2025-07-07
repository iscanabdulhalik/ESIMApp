import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
// Stripe import'unu kaldırdık - Expo Go'da çalışmıyor
// import { CardField, useStripe } from "@stripe/stripe-react-native";

import Header from "../../components/common/Header";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { esimService } from "../../services/api/esimService";
import { usePayment } from "../../hooks/usePayment";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { sizes } from "../../constants/sizes";

// Helper functions
const formatPrice = (amount, currency = "USD") => {
  return `$${amount.toFixed(2)}`;
};

const formatDataAmount = (mb) => {
  if (mb < 1024) return `${mb} MB`;
  return `${(mb / 1024).toFixed(1)} GB`;
};

const formatDuration = (days) => {
  if (days < 30) return `${days} Gün`;
  return `${Math.round(days / 30)} Ay`;
};

const PurchaseScreen = ({ navigation, route }) => {
  const { packageId } = route.params;
  // Stripe hooks'ları kaldırdık
  // const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { createPayment, loading: paymentLoading } = usePayment();

  const [loading, setLoading] = useState(true);
  const [packageDetails, setPackageDetails] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentReady, setPaymentReady] = useState(true); // Mock için true

  useEffect(() => {
    loadPackageDetails();
  }, [packageId]);

  const loadPackageDetails = async () => {
    try {
      setLoading(true);
      const response = await esimService.getPackageDetails(packageId);

      if (response.success) {
        setPackageDetails(response.data);
        // Mock payment initialization
        setPaymentReady(true);
      } else {
        Alert.alert("Hata", response.error);
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Hata", "Paket bilgileri yüklenemedi");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // Mock payment handler
  const handlePurchase = async () => {
    if (!paymentReady) {
      Alert.alert("Hata", "Ödeme sistemi hazır değil");
      return;
    }

    try {
      setProcessing(true);

      // Mock payment simulation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate payment success
      Alert.alert(
        "Ödeme Başarılı!",
        "eSIM'iniz başarıyla satın alındı. Kısa süre içinde hesabınıza eklenecektir.",
        [
          {
            text: "Tamam",
            onPress: () => navigation.navigate("MyESIMs"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Hata", "Beklenmeyen bir hata oluştu");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Paket yükleniyor..." />;
  }

  if (!packageDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Satın Al"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Paket bulunamadı</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Satın Al"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Package Info */}
        <Card
          gradient
          gradientColors={colors.gradient.primary}
          style={styles.packageCard}
        >
          <View style={styles.packageHeader}>
            <Text style={styles.packageFlag}>{packageDetails.countryFlag}</Text>
            <View style={styles.packageInfo}>
              <Text style={styles.packageCountry}>
                {packageDetails.country}
              </Text>
              <Text style={styles.packageName}>{packageDetails.name}</Text>
            </View>
            <Text style={styles.packagePrice}>
              {formatPrice(packageDetails.price)}
            </Text>
          </View>

          <View style={styles.packageFeatures}>
            <View style={styles.featureRow}>
              <Ionicons name="wifi" size={20} color={colors.text} />
              <Text style={styles.featureText}>
                {formatDataAmount(packageDetails.dataAmount)}
              </Text>
            </View>

            <View style={styles.featureRow}>
              <Ionicons name="time" size={20} color={colors.text} />
              <Text style={styles.featureText}>
                {formatDuration(packageDetails.duration)}
              </Text>
            </View>

            <View style={styles.featureRow}>
              <Ionicons name="flash" size={20} color={colors.text} />
              <Text style={styles.featureText}>
                {packageDetails.speed || "4G/5G"}
              </Text>
            </View>
          </View>
        </Card>

        {/* Package Details */}
        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Paket Detayları</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Kapsama Alanı</Text>
            <Text style={styles.detailValue}>{packageDetails.coverage}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Aktivasyon</Text>
            <Text style={styles.detailValue}>Otomatik</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Hotspot</Text>
            <Text style={styles.detailValue}>
              {packageDetails.hotspotAllowed ? "Desteklenir" : "Desteklenmez"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>SMS</Text>
            <Text style={styles.detailValue}>
              {packageDetails.smsIncluded ? "Dahil" : "Dahil Değil"}
            </Text>
          </View>
        </Card>

        {/* Mock Payment Info */}
        <Card style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Ödeme Bilgileri</Text>
          <Text style={styles.mockPaymentText}>
            Demo modunda çalışıyorsunuz. Gerçek ödeme yapılmayacaktır.
          </Text>

          <View style={styles.mockCardContainer}>
            <Ionicons name="card" size={24} color={colors.primary} />
            <Text style={styles.mockCardText}>Demo Kredi Kartı</Text>
          </View>
        </Card>

        {/* Terms */}
        <Card style={styles.termsCard}>
          <Text style={styles.sectionTitle}>Önemli Bilgiler</Text>

          <Text style={styles.termsText}>
            • eSIM aktivasyonu satın aldıktan sonra 30 gün içinde yapılmalıdır
            {"\n"}• Veri paketi bir kez etkinleştirildikten sonra iade edilemez
            {"\n"}• Kullanılmayan veri bir sonraki döneme aktarılamaz{"\n"}•
            24/7 müşteri desteğimizden yardım alabilirsiniz
          </Text>

          <TouchableOpacity style={styles.termsLink}>
            <Text style={styles.termsLinkText}>
              Detaylı kullanım şartlarını okuyun
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Price Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Paket Fiyatı</Text>
            <Text style={styles.summaryValue}>
              {formatPrice(packageDetails.price)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Vergi</Text>
            <Text style={styles.summaryValue}>Dahil</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Toplam</Text>
            <Text style={styles.totalValue}>
              {formatPrice(packageDetails.price)}
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Purchase Button */}
      <View style={styles.purchaseContainer}>
        <Button
          title={processing ? "İşleniyor..." : "Satın Al (Demo)"}
          variant="gradient"
          onPress={handlePurchase}
          disabled={!paymentReady || processing}
          loading={processing}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    padding: sizes.padding.md,
  },

  packageCard: {
    marginBottom: sizes.margin.md,
  },

  packageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: sizes.margin.md,
  },

  packageFlag: {
    fontSize: 40,
    marginRight: sizes.margin.md,
  },

  packageInfo: {
    flex: 1,
  },

  packageCountry: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.semiBold,
    color: colors.text,
  },

  packageName: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.regular,
    color: colors.text,
    opacity: 0.9,
  },

  packagePrice: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.bold,
    color: colors.text,
  },

  packageFeatures: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  featureText: {
    marginLeft: sizes.margin.xs,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.medium,
    color: colors.text,
  },

  detailsCard: {
    marginBottom: sizes.margin.md,
  },

  sectionTitle: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.semiBold,
    color: colors.text,
    marginBottom: sizes.margin.md,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: sizes.margin.sm,
  },

  detailLabel: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
  },

  detailValue: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.medium,
    color: colors.text,
  },

  paymentCard: {
    marginBottom: sizes.margin.md,
  },

  mockPaymentText: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.regular,
    color: colors.warning,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    padding: sizes.padding.sm,
    borderRadius: sizes.radius.sm,
    marginBottom: sizes.margin.sm,
  },

  mockCardContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: sizes.padding.sm,
    backgroundColor: colors.surface,
    borderRadius: sizes.radius.sm,
  },

  mockCardText: {
    marginLeft: sizes.margin.sm,
    fontSize: fonts.size.md,
    fontFamily: fonts.family.medium,
    color: colors.text,
  },

  termsCard: {
    marginBottom: sizes.margin.md,
  },

  termsText: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: sizes.margin.sm,
  },

  termsLink: {
    alignSelf: "flex-start",
  },

  termsLinkText: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.medium,
    color: colors.primary,
  },

  summaryCard: {
    marginBottom: sizes.margin.md,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: sizes.margin.sm,
  },

  summaryLabel: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
  },

  summaryValue: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.medium,
    color: colors.text,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: sizes.margin.sm,
  },

  totalLabel: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.semiBold,
    color: colors.text,
  },

  totalValue: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.bold,
    color: colors.primary,
  },

  purchaseContainer: {
    padding: sizes.padding.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.medium,
    color: colors.error,
  },
});

export default PurchaseScreen;
