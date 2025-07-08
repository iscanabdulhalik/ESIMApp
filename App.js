import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { StatusBar, View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { useAuthStore } from "./src/stores/authStore";
import { COLORS } from "./src/constants/theme";

// Navigators and Screens
import MainTabNavigator from "./src/navigation/MainTabNavigator";
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/auth/ForgotPasswordScreen";
import PurchaseSummaryScreen from "./src/screens/purchase/PurchaseSummaryScreen";
import PurchaseScreen from "./src/screens/store/PurchaseScreen";
import ESIMDetailsScreen from "./src/screens/esims/ESIMDetailsScreen";

const Stack = createStackNavigator();

const SplashScreen = () => (
  <View style={styles.splashContainer}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      ...TransitionPresets.SlideFromRightIOS,
    }}
  >
    <Stack.Screen name="Main" component={MainTabNavigator} />
    
    <Stack.Group screenOptions={{ presentation: "modal" }}>
      <Stack.Screen name="PurchaseSummary" component={PurchaseSummaryScreen} />
      <Stack.Screen name="Purchase" component={PurchaseScreen} />
      <Stack.Screen name="ESIMDetails" component={ESIMDetailsScreen} />
    </Stack.Group>
  </Stack.Navigator>
);

const App = () => {
  const { isAuthenticated, isLoading, setupAuthListener } = useAuthStore();

  useEffect(() => {
    const unsubscribe = setupAuthListener();
    return () => unsubscribe();
  }, [setupAuthListener]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
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