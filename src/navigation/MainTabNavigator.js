import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

// Basit Screen Bileşenleri
import StoreScreen from "../screens/store/StoreScreen";
import MyESIMsScreen from "../screens/esims/MyESIMsScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  console.log("🗂️ MainTabNavigator rendering...");

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "StoreTab") {
            iconName = focused ? "storefront" : "storefront-outline";
          } else if (route.name === "MyESIMsTab") {
            iconName = focused ? "phone-portrait" : "phone-portrait-outline";
          } else if (route.name === "ProfileTab") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      })}
    >
      <Tab.Screen
        name="StoreTab"
        component={StoreScreen}
        options={{
          tabBarLabel: "Mağaza",
        }}
      />
      <Tab.Screen
        name="MyESIMsTab"
        component={MyESIMsScreen}
        options={{
          tabBarLabel: "eSIM'lerim",
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profil",
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
