import { Tabs } from "expo-router";
import { Platform, useColorScheme } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import UpdatePopup from "@/components/popup/UpdatePopup";
import { Fragment } from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
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
          name="setting"
          options={{
            title: t("settings.name"),
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="settings" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
      {Platform.OS === "android" && <UpdatePopup />}
    </Fragment>
  );
}
