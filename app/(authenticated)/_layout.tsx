import { Tabs } from "expo-router";
import React from "react";
import { Platform, StatusBar } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      backBehavior={"history"}
      screenOptions={{
        headerShown: false,
        headerStyle: {
          marginTop: StatusBar.currentHeight,
          backgroundColor: "black",
        },
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="(store)"
        options={{
          title: "Store",

          tabBarIcon: ({ color }) => (
            <MaterialIcons name="storefront" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(mission)"
        options={{
          title: "Mission",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="list-alt" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="career"
        options={{
          title: "Career",
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="insert-chart-outlined"
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(inventory)"
        options={{
          title: "Inventory",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="inventory" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "Setting",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
