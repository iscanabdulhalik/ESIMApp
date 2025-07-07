import "react-native-gesture-handler"; // En üstte olmalı
import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { COLORS } from "./src/constants/theme"; // Yolu doğrulayın

// --- Ekranlarımızı import ediyoruz ---
// Not: Bu ekranların projenizde doğru yollarda var olduğunu varsayıyoruz.
import StoreScreen from "./src/screens/store/StoreScreen";
import PurchaseSummaryScreen from "./src/screens/purchase/PurchaseSummaryScreen";
import ESIMDetailsScreen from "./src/screens/esims/ESIMDetailsScreen";

// --- Gelecekteki Ekranlar İçin Yer Tutucular ---
// Bu ekranları daha sonra oluşturduğunuzda importları açabilirsiniz.
// import MyESIMsScreen from './src/screens/esims/MyESIMsScreen';
// import ProfileScreen from './src/screens/profile/ProfileScreen';

const Stack = createStackNavigator();

/**
 * Uygulamanın ana akışını yöneten Stack Navigator.
 * Bu yapı, gelecekte bir Tab Navigator ile kolayca entegre edilebilir.
 */
const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Store" // Uygulama açıldığında ilk gösterilecek ekran
      screenOptions={{
        headerShown: false, // Her ekranda özel başlık kullanacağımız için global başlığı kapatıyoruz.
        cardStyle: { backgroundColor: COLORS.background }, // Tüm ekranlar için varsayılan arka plan rengi.
        // --- Sayfa Geçiş Animasyonu ---
        ...Platform.select({
          ios: {
            ...TransitionPresets.SlideFromRightIOS,
          },
          android: {
            ...TransitionPresets.FadeFromBottomAndroid,
          },
        }),
      }}
    >
      {/* 
        Gelecekte buraya bir Tab Navigator ekleyebilirsiniz:
        <Stack.Screen name="Main" component={MainTabNavigator} /> 
      */}
      <Stack.Screen
        name="Store"
        component={StoreScreen}
        options={{ title: "Mağaza" }}
      />
      <Stack.Screen
        name="PurchaseSummary"
        component={PurchaseSummaryScreen}
        options={{
          headerShown: true, // Bu ekranda varsayılan başlığı gösterebiliriz
          headerBackTitle: "Geri",
          headerTitle: "Sipariş Özeti",
          headerStyle: { backgroundColor: COLORS.surface },
          headerTintColor: COLORS.text,
        }}
      />
      <Stack.Screen
        name="ESIMDetails"
        component={ESIMDetailsScreen}
        options={{
          title: "eSIM Detayları",
          // Bu ekrandan geri gidilmesini istemeyebiliriz.
          // gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    // NavigationContainer, tüm navigasyon yapısını sarmalar.
    <NavigationContainer>
      {/* Koyu tema için status bar stilini ayarlıyoruz. */}
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <AppStack />
    </NavigationContainer>
  );
};

export default App;
