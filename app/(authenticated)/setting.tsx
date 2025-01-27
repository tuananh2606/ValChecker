import {
  Button,
  Divider,
  List,
  Switch,
  Title,
  TouchableRipple,
} from "react-native-paper";
import { StyleSheet, View, ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserStore from "@/hooks/useUserStore";
import { defaultUser } from "@/utils/valorant-api";
import { router } from "expo-router";
import CookieManager from "@react-native-cookies/cookies";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { initBackgroundFetch, stopBackgroundFetch } from "@/utils/wishlist";
import { useWishlistStore } from "@/hooks/useWishlistStore";
import * as Notifications from "expo-notifications";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useAppTheme } from "../_layout";
import { startActivityAsync, ActivityAction } from "expo-intent-launcher";

export default function SettingScreen() {
  const { t } = useTranslation();
  const { setUser } = useUserStore();
  const { colors } = useAppTheme();
  const notificationEnabled = useWishlistStore(
    (state) => state.notificationEnabled
  );
  const setNotificationEnabled = useWishlistStore(
    (state) => state.setNotificationEnabled
  );

  const darkModeEnabled = useDarkMode((state) => state.darkModeEnabled);
  const setDarkModeEnabled = useDarkMode((state) => state.setDarkMode);
  const handleLogout = async () => {
    await CookieManager.clearAll(true);
    await AsyncStorage.removeItem("region");
    setUser(defaultUser);
    stopBackgroundFetch();
    setNotificationEnabled(false);
    router.replace("/(login)");
  };

  const toggleNotificationEnabled = async () => {
    setNotificationEnabled(!notificationEnabled);
    if (!notificationEnabled) {
      const permission = await Notifications.requestPermissionsAsync();
      if (permission.granted) {
        await initBackgroundFetch();
        ToastAndroid.show(
          t("wishlist.notification.enabled"),
          ToastAndroid.SHORT
        );
      } else {
        ToastAndroid.show(
          t("wishlist.notification.no_permission"),
          ToastAndroid.SHORT
        );
      }
    } else {
      await stopBackgroundFetch();
      ToastAndroid.show(t("wishlist.notification.disabled"), ToastAndroid.LONG);
    }
  };

  return (
    <View style={styles.container}>
      <Title
        style={{
          textAlign: "center",
          fontWeight: 700,
          color: colors.text,
        }}
      >
        Settings
      </Title>
      <List.Section style={{ flex: 1 }}>
        <List.Subheader>FAQ</List.Subheader>
        <List.Item
          style={{
            padding: 10,
            borderRadius: 10,
            backgroundColor: "#2E2E2E",
          }}
          title="FAQ"
          right={() => <List.Icon color={colors.tint} icon="chevron-right" />}
        />
        <List.Subheader>General</List.Subheader>
        <View
          style={{
            backgroundColor: "#2E2E2E",
            borderRadius: 10,
          }}
        >
          <List.Item
            left={() => (
              <View
                style={{
                  marginLeft: 8,
                }}
              >
                <MaterialCommunityIcons
                  name="lightbulb-outline"
                  size={24}
                  color={colors.tint}
                />
              </View>
            )}
            title="Dark Mode"
            right={() => (
              <Switch
                color="green"
                value={darkModeEnabled}
                onValueChange={() => setDarkModeEnabled(!darkModeEnabled)}
              />
            )}
          />
          <Divider />
          <TouchableRipple
            onPress={() => {
              startActivityAsync(ActivityAction.LOCALE_SETTINGS);
            }}
          >
            <List.Item
              left={() => (
                <View
                  style={{
                    marginLeft: 8,
                  }}
                >
                  <AntDesign name="earth" size={24} color={colors.tint} />
                </View>
              )}
              title="Change Time Language"
              right={() => (
                <List.Icon color={colors.tint} icon="chevron-right" />
              )}
            />
          </TouchableRipple>
        </View>

        <List.Subheader>NOTIFICATION</List.Subheader>
        <View
          style={{
            backgroundColor: "#2E2E2E",
            borderRadius: 10,
          }}
        >
          <List.Item
            title="Store Reset Notification"
            left={() => (
              <View
                style={{
                  marginLeft: 8,
                }}
              >
                <SimpleLineIcons name="bell" size={24} color={colors.tint} />
              </View>
            )}
            right={() => (
              <Switch
                color="green"
                value={notificationEnabled}
                onValueChange={toggleNotificationEnabled}
              />
            )}
          />
        </View>
      </List.Section>
      <Button
        onPress={handleLogout}
        style={{
          borderRadius: 8,
        }}
        buttonColor="#ff4654"
        dark
        mode="contained"
      >
        {t("logout")}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
});
