import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StripeProvider } from "@stripe/stripe-react-native";

import MainNavigator from "./src/navigation/MainNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { colors } from "./src/constants/colors";

// Splash screen'i hazır tutma
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <StripeProvider publishableKey="pk_test_your_stripe_key">
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor={colors.background} />
          <MainNavigator />
        </NavigationContainer>
      </AuthProvider>
    </StripeProvider>
  );
}
