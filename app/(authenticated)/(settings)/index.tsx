import {
  Button,
  List,
  Switch,
  Title,
  Text,
  TouchableRipple,
} from "react-native-paper";
import {
  StyleSheet,
  View,
  ToastAndroid,
  ScrollView,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserStore from "@/hooks/useUserStore";
import { defaultUser } from "@/utils/valorant-api";
import { router } from "expo-router";
import CookieManager from "@react-native-cookies/cookies";
import { useTranslation } from "react-i18next";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { initBackgroundFetch, stopBackgroundFetch } from "@/utils/wishlist";
import { useWishlistStore } from "@/hooks/useWishlistStore";
import * as Notifications from "expo-notifications";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useAppTheme } from "../../_layout";
import { startActivityAsync, ActivityAction } from "expo-intent-launcher";
import * as SecureStore from "expo-secure-store";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { useCallback, useEffect, useState } from "react";
import { useCacheStore } from "@/hooks/useCacheStore";
import { LinearGradient } from "expo-linear-gradient";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import { useRevenueCat } from "@/providers/RevenueCatProvider";

const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-6005386669059232/8032880173";

export default function SettingScreen() {
  const { t } = useTranslation();
  const { setUser } = useUserStore();
  const { colors } = useAppTheme();
  const { clearAll } = useCacheStore();
  const notificationEnabled = useWishlistStore(
    (state) => state.notificationEnabled
  );
  const setNotificationEnabled = useWishlistStore(
    (state) => state.setNotificationEnabled
  );
  const {
    user: userRevenueCat,
    setUserRC,
    restorePermissions,
  } = useRevenueCat();
  const darkModeEnabled = useDarkMode((state) => state.darkModeEnabled);
  const setDarkModeEnabled = useDarkMode((state) => state.setDarkMode);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogout = useCallback(async () => {
    await CookieManager.clearAll(true);
    await AsyncStorage.removeItem("region");
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("entitlements_token");
    setUser(defaultUser);
    stopBackgroundFetch();
    setNotificationEnabled(false);
    clearAll();
    router.replace("/(login)");
  }, []);

  const isSubscribed = useCallback(async () => {
    const paywallResult: PAYWALL_RESULT =
      await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: "Pro Access",
      });

    switch (paywallResult) {
      case PAYWALL_RESULT.NOT_PRESENTED:
      case PAYWALL_RESULT.ERROR:
        return false;
      case PAYWALL_RESULT.CANCELLED:
        return false;
      case PAYWALL_RESULT.PURCHASED:
        return true;
      case PAYWALL_RESULT.RESTORED:
        return true;
      default:
        return false;
    }
  }, []);

  const removeAdsAction = useCallback(async () => {
    if (await isSubscribed()) {
      setUserRC({ isPro: true });
    } else {
      setUserRC({ isPro: false });
    }
  }, [isSubscribed]);

  const restorePurchase = async () => {
    try {
      setLoading(true);
      await restorePermissions!();
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleNotificationEnabled = useCallback(async () => {
    if (!notificationEnabled) {
      setNotificationEnabled(true);
      const permission = await Notifications.requestPermissionsAsync();
      if (permission.granted) {
        await initBackgroundFetch();
        ToastAndroid.show(
          t("wishlist.notification.enabled"),
          ToastAndroid.SHORT
        );
      } else {
        setNotificationEnabled(false);
        ToastAndroid.show(
          t("wishlist.notification.no_permission"),
          ToastAndroid.SHORT
        );
      }
    } else {
      setNotificationEnabled(false);
      await stopBackgroundFetch();
      ToastAndroid.show(t("wishlist.notification.disabled"), ToastAndroid.LONG);
    }
  }, []);
  useEffect(() => {
    const setupNotification = async () => {
      if (notificationEnabled) {
        initBackgroundFetch();
        await Notifications.setNotificationChannelAsync("daily", {
          name: "Daily",
          importance: Notifications.AndroidImportance.MAX,
        });
        const d = new Date();
        d.setUTCHours(0, 0, 0);

        const timeZoneOffset = d.getTimezoneOffset() / 60;

        await Notifications.scheduleNotificationAsync({
          content: {
            body: t("wishlist.notification.no_hit"),
          },
          identifier: "daily-notification",
          trigger: {
            channelId: "daily",
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: d.getUTCHours() - timeZoneOffset,
            minute: 0,
          },
        });
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
        stopBackgroundFetch();
      }
    };
    setupNotification();
  }, [notificationEnabled]);

  return (
    <>
      {loading && (
        <View style={styles.loading}>
          <View
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "gray",
              opacity: 0.1,
            }}
          />
          <ActivityIndicator size="large" color="red" />
        </View>
      )}
      <ScrollView
        style={{
          flex: 1,
        }}
      >
        <View style={styles.container}>
          <Title
            style={{
              textAlign: "center",
              fontWeight: 700,
              color: colors.text,
            }}
          >
            {t("settings.name")}
          </Title>

          <View
            style={{
              width: "100%",
              height: 80,
              marginTop: 16,
              marginBottom: 40,
            }}
          >
            {userRevenueCat.isPro ? (
              <LinearGradient
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                colors={["#7b4397", "#dc2430"]}
                style={[
                  {
                    marginTop: 16,
                    padding: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    width: "100%",
                    height: "100%",
                  },
                ]}
              >
                <Text variant="titleLarge">{t("settings.premium_plan")}</Text>
              </LinearGradient>
            ) : (
              <TouchableOpacity
                onPress={removeAdsAction}
                style={{ width: "100%", height: 80, marginTop: 16 }}
              >
                <LinearGradient
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 0 }}
                  colors={["#7b4397", "#dc2430"]}
                  style={[styles.gradient]}
                >
                  <Text variant="titleLarge">ValChecker Premium</Text>
                  <Text variant="labelMedium">
                    {t("settings.remove_ads_info")}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            <TouchableRipple
              style={{
                backgroundColor: "#2E2E2E",
                paddingHorizontal: 10,
                paddingVertical: 8,
                justifyContent: "center",
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}
              onPress={restorePurchase}
            >
              <Text variant="labelLarge">
                {t("settings.restore_purchases")}
              </Text>
            </TouchableRipple>
          </View>

          <List.Section style={{ flex: 1 }}>
            <List.Subheader> {t("settings.faq.name")}</List.Subheader>
            <List.Item
              style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: "#2E2E2E",
              }}
              onPress={() => router.push("/faq")}
              title={t("settings.faq.details")}
              left={() => (
                <AntDesign
                  name="questioncircle"
                  size={24}
                  color={colors.tint}
                />
              )}
              right={() => (
                <List.Icon color={colors.tint} icon="chevron-right" />
              )}
            />
            <List.Subheader> {t("general")}</List.Subheader>
            <View
              style={{
                backgroundColor: "#2E2E2E",
                borderRadius: 10,
              }}
            >
              {/* <List.Item
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
          <Divider /> */}
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
                  title={t("settings.general.change_time_language")}
                  right={() => (
                    <List.Icon color={colors.tint} icon="chevron-right" />
                  )}
                />
              </TouchableRipple>
            </View>

            <List.Subheader>{t("settings.notification.name")}</List.Subheader>
            <View
              style={{
                backgroundColor: "#2E2E2E",
                borderRadius: 10,
              }}
            >
              <List.Item
                title={t("settings.notification.store_reset_notification")}
                left={() => (
                  <View
                    style={{
                      marginLeft: 8,
                    }}
                  >
                    <SimpleLineIcons
                      name="bell"
                      size={24}
                      color={colors.tint}
                    />
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
            <List.Subheader>
              {t("settings.terms_and_privacy.name")}
            </List.Subheader>
            <View
              style={{
                backgroundColor: "#2E2E2E",
                borderRadius: 10,
              }}
            >
              <TouchableRipple
                onPress={() => {
                  Linking.openURL(
                    "https://www.privacypolicies.com/live/f6dcc4f5-015e-403f-b951-1cb4943ca6ac"
                  );
                }}
              >
                <List.Item
                  title={t("settings.terms_and_privacy.privacy_policy")}
                  left={() => (
                    <View
                      style={{
                        marginLeft: 32,
                      }}
                    ></View>
                  )}
                  right={() => (
                    <List.Icon color={colors.tint} icon="chevron-right" />
                  )}
                />
              </TouchableRipple>
            </View>
          </List.Section>
        </View>
        <View
          style={{
            paddingHorizontal: 8,
            marginTop: 100,
          }}
        >
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
          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "gray",
              marginTop: 10,
              paddingHorizontal: 15,
              marginBottom: 12,
            }}
          >
            ValChecker is not endorsed by Riot Games in any way.
            {"\n"}
            Riot Games, Valorant, and all associated properties are trademarks
            or registered trademarks of Riot Games, Inc.
          </Text>
        </View>
      </ScrollView>
      {!userRevenueCat.isPro && (
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            keywords: [
              "mobile games",
              "action games",
              "puzzle games",
              "arcade games",
              "crypto",
              "bitcoin",
              "simulation games",
              "game strategies",
              "racing game",
              "android offline games",
              "barrel shooter",
              "dodge",
              "defend",
              "defeat zombies",
              "unlock puzzles",
              "casual games",
              "crypto trading",
              "crypto exchange",
            ],
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  gradient: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: "100%",
    height: "100%",
  },
  centeredView: {
    flex: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  loading: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",

    zIndex: 10,
  },
});
