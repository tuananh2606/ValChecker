import { router, Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, StatusBar } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as SecureStore from "expo-secure-store";
import { loadAssets } from "@/utils/valorant-assets";
import {
  getBalances,
  getEntitlementsToken,
  getProgress,
  getShop,
  getUserId,
  getUsername,
  parseShop,
} from "@/utils/valorant-api";
import useUserStore from "@/hooks/useUserStore";
import Loading from "@/components/Loading";
import CookieManager from "@react-native-cookies/cookies";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { setUser } = useUserStore();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      const region = await AsyncStorage.getItem("region");
      const accessToken = (await SecureStore.getItemAsync(
        "access_token"
      )) as string;
      try {
        setLoading(true);
        await loadAssets();
        const entitlementsToken = await getEntitlementsToken(accessToken);
        await SecureStore.setItemAsync("entitlements_token", entitlementsToken);
        const userId = getUserId(accessToken);

        const username = getUsername(
          accessToken,
          entitlementsToken,
          userId,
          region as string
        );

        const shop = getShop(
          accessToken,
          entitlementsToken,
          region as string,
          userId
        );

        const progress = getProgress(
          accessToken,
          entitlementsToken,
          region as string,
          userId
        );

        const balances = getBalances(
          accessToken,
          entitlementsToken,
          region as string,
          userId
        );
        Promise.all([username, shop, progress, balances])
          .then(async ([username, shop, progress, balances]) => {
            const shops = await parseShop(shop);
            setUser({
              id: userId,
              ...username,
              region: region as string,
              shops,
              progress,
              balances,
            });
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (e) {
        if (!__DEV__) {
          await CookieManager.clearAll(true);
          router.replace("/(login)"); // Fallback to setup, so user doesn't get stuck
        }
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <Tabs
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
          popToTopOnBlur: true,
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
          popToTopOnBlur: true,
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
