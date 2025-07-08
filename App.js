import "react-native-gesture-handler"; // Her zaman en üstte olmalı
import React, { useEffect } from "react";
import { StatusBar, View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { useAuthStore } from "./src/stores/authStore";
import { COLORS } from "./src/constants/theme";

// --- Ana Navigatörler ve Ekranlar ---
import MainTabNavigator from "./src/navigation/MainTabNavigator";
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen"; // Register ekranını da ekleyelim
import PurchaseSummaryScreen from "./src/screens/purchase/PurchaseSummaryScreen";
import ESIMDetailsScreen from "./src/screens/esims/ESIMDetailsScreen";

const Stack = createStackNavigator();

/**
 * Uygulama yüklenirken gösterilecek olan basit bir splash screen.
 */
const SplashScreen = () => (
  <View style={styles.splashContainer}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

/**
 * Kimlik doğrulama gerektirmeyen ekranları (Giriş, Kayıt vb.) gruplayan Stack.
 */
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

/**
 * Kimlik doğrulama yapıldıktan sonra erişilebilen ana uygulama ekranlarını gruplayan Stack.
 */
const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      // Modern sayfa geçiş animasyonları
      ...TransitionPresets.SlideFromRightIOS,
    }}
  >
    {/* Ana Tab Navigator (Mağaza, eSIM'lerim, Profil) */}
    <Stack.Screen name="Main" component={MainTabNavigator} />

    {/* Tam ekran modal olarak açılacak detay ekranları */}
    <Stack.Group screenOptions={{ presentation: "modal" }}>
      <Stack.Screen name="PurchaseSummary" component={PurchaseSummaryScreen} />
      <Stack.Screen name="ESIMDetails" component={ESIMDetailsScreen} />
    </Stack.Group>
  </Stack.Navigator>
);

const App = () => {
  // Zustand store'dan gerekli state'i ve action'ı alıyoruz.
  const { isAuthenticated, isLoading, setupAuthListener } = useAuthStore();

  useEffect(() => {
    // Firebase auth durum dinleyicisini bir kere kuruyoruz.
    // Bu, uygulama boyunca kullanıcı oturumunu takip eder.
    const unsubscribe = setupAuthListener();

    // Component kaldırıldığında (uygulama kapandığında) dinleyiciyi temizliyoruz.
    return () => unsubscribe();
  }, [setupAuthListener]); // Bağımlılık listesi boş, sadece bir kere çalışır.

  // Firebase ilk auth durumunu kontrol ederken yüklenme ekranı göster.
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {/* Kullanıcı giriş yapmış mı? Durumuna göre doğru Navigator'ı göster. */}
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
});

export default App;
