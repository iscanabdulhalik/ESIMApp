// src/navigation/MainTabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { COLORS } from "../constants/theme";

// Ekranlar
import StoreScreen from "../screens/store/StoreScreen";
import MyESIMsScreen from "../screens/esims/MyESIMsScreen"; // Yeni
import ProfileScreen from "../screens/profile/ProfileScreen"; // Yeni

// İkonlar için bir kütüphane kullanmak iyi olur (örn: react-native-vector-icons)
// import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
      }}
    >
      <Tab.Screen name="StoreTab" component={StoreScreen} />
      <Tab.Screen name="MyESIMsTab" component={MyESIMsScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
