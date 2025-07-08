import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { COLORS, FONTS, SIZES } from "../../constants/theme";

const StoreScreen = ({ navigation }) => {
  console.log("🏪 StoreScreen rendering...");

  const mockPackages = [
    {
      id: "1",
      country: "Türkiye",
      flag: "🇹🇷",
      data: "5GB",
      duration: "30 Gün",
      price: "$29.99",
    },
    {
      id: "2",
      country: "Amerika",
      flag: "🇺🇸",
      data: "10GB",
      duration: "30 Gün",
      price: "$49.99",
    },
    {
      id: "3",
      country: "Almanya",
      flag: "🇩🇪",
      data: "3GB",
      duration: "15 Gün",
      price: "$19.99",
    },
  ];

  const PackageCard = ({ item }) => (
    <TouchableOpacity
      style={styles.packageCard}
      onPress={() => {
        console.log("📦 Package selected:", item.country);
        // navigation.navigate("PurchaseSummary", { packageDetails: item });
      }}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.countryInfo}>
          <Text style={styles.countryName}>{item.country}</Text>
          <Text style={styles.packageDetails}>
            {item.data} • {item.duration}
          </Text>
        </View>
        <Text style={styles.price}>{item.price}</Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.features}>
          <Text style={styles.featureText}>📶 4G/5G Hız</Text>
          <Text style={styles.featureText}>🌐 Geniş Kapsama</Text>
        </View>

        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Satın Al</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>eSIM Mağazası</Text>
        <Text style={styles.headerSubtitle}>
          Dünyayı Keşfet, Bağlantıda Kal
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Popüler Paketler</Text>

        {mockPackages.map((item) => (
          <PackageCard key={item.id} item={item} />
        ))}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>✨ Neden DataGo eSIM?</Text>
          <Text style={styles.infoText}>
            • Anında aktivasyon{"\n"}• 190+ ülke desteği{"\n"}• 24/7 müşteri
            desteği{"\n"}• Fiziksel SIM kart gerektirmez
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding / 2,
  },

  headerTitle: {
    ...FONTS.h1,
    color: COLORS.text,
    fontWeight: "bold",
    marginBottom: 4,
  },

  headerSubtitle: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    padding: SIZES.padding,
  },

  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    fontWeight: "600",
    marginBottom: SIZES.padding,
  },

  packageCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius * 1.5,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.padding,
  },

  flag: {
    fontSize: 32,
    marginRight: SIZES.base,
  },

  countryInfo: {
    flex: 1,
  },

  countryName: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: "600",
  },

  packageDetails: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },

  price: {
    ...FONTS.h2,
    color: COLORS.primary,
    fontWeight: "700",
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  features: {
    flex: 1,
  },

  featureText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },

  buyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding * 1.5,
    borderRadius: SIZES.radius * 2,
  },

  buyButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: "bold",
  },

  infoSection: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginTop: SIZES.padding,
  },

  infoTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: "600",
    marginBottom: SIZES.base,
  },

  infoText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});

export default StoreScreen;
