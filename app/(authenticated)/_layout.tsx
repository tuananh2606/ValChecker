import { Tabs } from "expo-router";
import { Platform, useColorScheme } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { Fragment, useEffect, useRef } from "react";
import { AppOpenAd, TestIds } from "react-native-google-mobile-ads";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRevenueCat } from "../../providers/RevenueCatProvider";

const AD_INTERVAL = 15 * 60 * 1000;

const adUnitId = __DEV__
  ? TestIds.APP_OPEN
  : "ca-app-pub-6005386669059232/4926504569";

const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});
appOpenAd.load();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const { user } = useRevenueCat();

  useEffect(() => {
    const getAds = async () => {
      const now = Date.now();
      const lastAds = Number.parseInt(
        (await AsyncStorage.getItem("lastOpenAds")) || "0"
      );

      if (now - lastAds < AD_INTERVAL) return;
      if (appOpenAd.loaded) {
        const now = new Date();
        await AsyncStorage.setItem("lastOpenAds", now.getTime().toString());
        setTimeout(() => appOpenAd.show(), 1000);
      }
    };
    if (!user.isPro) {
      getAds();
    }
  }, []);

  return (
    <Fragment>
      <Tabs
        screenOptions={{
          headerShown: false,
          headerStyle: {
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
            default: {
              backgroundColor: "black",
            },
          }),
        }}
      >
        <Tabs.Screen
          name="(store)"
          options={{
            title: t("store"),
            popToTopOnBlur: true,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="storefront" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(mission)"
          options={{
            title: t("mission"),
            popToTopOnBlur: true,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="list-alt" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(career)"
          options={{
            title: t("career"),
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
            title: t("inventory"),
            popToTopOnBlur: true,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="inventory" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(settings)"
          options={{
            title: t("settings.name"),
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="settings" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
      {/* {Platform.OS === "android" && <UpdatePopup />} */}
    </Fragment>
  );
}
