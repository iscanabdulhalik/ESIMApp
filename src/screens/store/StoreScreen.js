import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Image, // Görsel zenginlik için eklendi
} from "react-native";
import { useESIMStore } from "../../stores/esimStore"; // Doğru yolu kontrol edin
import { COLORS, FONTS, SIZES } from "../../constants/theme"; // Doğru yolu kontrol edin

/**
 * Yeniden kullanılabilir, şık ve bilgilendirici eSIM paket kartı bileşeni.
 */
const PackageCard = React.memo(({ item, onPress }) => {
  // API'den gelen veriye göre esnek olalım.
  const countryName = item.countries?.[0]?.name || "Global";
  const dataAmount = item.packages?.[0]?.data || "N/A";
  const validityDays = item.packages?.[0]?.day || "N/A";
  const price = item.packages?.[0]?.price || 0;
  const flagUrl = item.countries?.[0]?.image;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <View style={styles.cardHeader}>
        {flagUrl && <Image source={{ uri: flagUrl }} style={styles.flag} />}
        <Text style={styles.countryText}>{countryName}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.dataText}>{dataAmount}</Text>
        <Text style={styles.validityText}>/ {validityDays} Gün</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.priceText}>${price.toFixed(2)}</Text>
        <View style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Detaylar</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const StoreScreen = ({ navigation }) => {
  // Zustand store'dan gerekli state'leri ve action'ları alıyoruz.
  const { packages, isLoadingPackages, error, fetchPackages } = useESIMStore(
    (state) => ({
      packages: state.packages,
      isLoadingPackages: state.isLoadingPackages,
      error: state.error,
      fetchPackages: state.fetchPackages,
    })
  );

  useEffect(() => {
    // Component ilk yüklendiğinde paketleri çekiyoruz.
    fetchPackages();
  }, [fetchPackages]);

  // Kullanıcının listeyi aşağı çekerek yenilemesini sağlayan fonksiyon.
  const onRefresh = useCallback(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Kullanıcı bir pakete tıkladığında çalışacak fonksiyon.
  const handlePackageSelect = (selectedPackage) => {
    navigation.navigate("PurchaseSummary", { packageDetails: selectedPackage });
  };

  // Yüklenme durumunda gösterilecek UI.
  if (isLoadingPackages && !packages.length) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Paketler Yükleniyor...</Text>
      </View>
    );
  }

  // Hata durumunda gösterilecek UI.
  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Bir Hata Oluştu</Text>
        <Text style={styles.errorSubText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Başarılı durumda listeyi gösteren UI.
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>eSIM Mağazası</Text>
        <Text style={styles.headerSubtitle}>
          Dünyayı Keşfet, Bağlantıda Kal
        </Text>
      </View>
      <FlatList
        data={packages}
        renderItem={({ item }) => (
          <PackageCard item={item} onPress={handlePackageSelect} />
        )}
        keyExtractor={(item) =>
          item.id?.toString() || `fallback-${Math.random()}`
        }
        contentContainerStyle={{
          paddingHorizontal: SIZES.padding,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingPackages}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text style={styles.errorText}>Gösterilecek paket bulunamadı.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.padding,
  },
  loadingText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginTop: SIZES.base * 2,
  },
  errorText: { ...FONTS.h2, color: COLORS.error, textAlign: "center" },
  errorSubText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SIZES.base,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding,
  },
  retryButtonText: { ...FONTS.h4, color: COLORS.white, fontWeight: "bold" },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding / 2,
  },
  headerTitle: { ...FONTS.h1, color: COLORS.text, fontWeight: "bold" },
  headerSubtitle: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginTop: SIZES.base / 2,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius * 1.5,
    padding: SIZES.base * 2,
    marginBottom: SIZES.base * 2,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.base,
  },
  flag: { width: 30, height: 20, borderRadius: 4, marginRight: SIZES.base },
  countryText: { ...FONTS.h3, color: COLORS.text, fontWeight: "600" },
  cardBody: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: SIZES.padding,
  },
  dataText: { ...FONTS.h1, color: COLORS.primary, fontWeight: "800" },
  validityText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base,
    marginBottom: SIZES.base,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SIZES.base,
  },
  priceText: { ...FONTS.h2, color: COLORS.text, fontWeight: "700" },
  buyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius * 2,
  },
  buyButtonText: { ...FONTS.h4, color: COLORS.white, fontWeight: "bold" },
});

export default StoreScreen;
