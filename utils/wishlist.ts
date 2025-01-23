import { getAccessTokenFromUri, isSameDayUTC } from "./misc";
import {
  getEntitlementsToken,
  getShop,
  getUserId,
  reAuth,
} from "./valorant-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import i18n, { getVAPILang } from "./localization";
import { useWishlistStore } from "@/hooks/useWishlistStore";
import * as Notifications from "expo-notifications";
import BackgroundFetch from "react-native-background-fetch";
import { fetchVersion } from "./valorant-assets";
import { SchedulableTriggerInputTypes } from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NOTIFICATION_CHANNEL = "wishlist";

export async function wishlistBgTask() {
  await useWishlistStore.persist.rehydrate();
  const wishlistStore = useWishlistStore.getState();

  if (!wishlistStore.notificationEnabled) return;
  console.log(wishlistStore);
  await checkShop(wishlistStore.skinIds);
}

export async function checkShop(wishlist: string[]) {
  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL, {
    name: "Wishlist",
    importance: Notifications.AndroidImportance.MAX,
  });

  try {
    const version = await fetchVersion();

    // Automatic cookies: https://github.com/facebook/react-native/issues/1274
    const res = await reAuth(version);
    const accessToken = getAccessTokenFromUri(res.data.response.parameters.uri);
    const userId = getUserId(accessToken);

    const entitlementsToken = await getEntitlementsToken(accessToken);
    const region = (await AsyncStorage.getItem("region")) as string;
    const shop = await getShop(accessToken, entitlementsToken, region, userId);

    var hit = false;
    for (let i = 0; i < wishlist.length; i++) {
      if (shop.SkinsPanelLayout.SingleItemOffers.includes(wishlist[i])) {
        const skinData = await axios.get<{
          status: number;
          data: ValorantSkinLevel;
        }>(
          `https://valorant-api.com/v1/weapons/skinlevels/${
            wishlist[i]
          }?language=${getVAPILang()}`
        );
        console.log(skinData);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: i18n.t("wishlist.name"),
            body: i18n.t("wishlist.notification.hit", {
              displayname: skinData.data.data.displayName,
            }),
          },
          trigger: {
            channelId: NOTIFICATION_CHANNEL,
            type: SchedulableTriggerInputTypes.DAILY,
            hour: 7,
            minute: 0,
          },
        });
        hit = true;
      }
    }
    if (!hit) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t("wishlist.name"),
          body: i18n.t("wishlist.notification.no_hit"),
        },
        trigger: {
          channelId: NOTIFICATION_CHANNEL,
          type: SchedulableTriggerInputTypes.DAILY,
          hour: 7,
          minute: 0,
        },
      });
    }
  } catch (e) {
    console.log(e);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t("wishlist.name"),
        body: i18n.t("wishlist.notification.error"),
      },
      trigger: {
        channelId: NOTIFICATION_CHANNEL,
        seconds: 1,
      },
    });
  }
}

export async function initBackgroundFetch() {
  await BackgroundFetch.configure(
    {
      minimumFetchInterval: 15,
      stopOnTerminate: false,
      enableHeadless: true,
      startOnBoot: true,
      // Android options
      forceAlarmManager: false,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
      requiresCharging: false,
      requiresDeviceIdle: false,
      requiresBatteryNotLow: false,
      requiresStorageNotLow: false,
    },
    async (taskId: string) => {
      await wishlistBgTask();
      BackgroundFetch.finish(taskId);
    },
    (taskId: string) => {
      console.log("[Fetch] TIMEOUT taskId:", taskId);
      BackgroundFetch.finish(taskId);
    }
  );
}

export async function stopBackgroundFetch() {
  await BackgroundFetch.stop();
}
