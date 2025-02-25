import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CookieManager from "@react-native-cookies/cookies";
import {
  getBalances,
  getEntitlementsToken,
  getProgress,
  getShop,
  getUserId,
  getUsername,
  parseShop,
} from "@/utils/valorant-api";
import { loadAssets } from "@/utils/valorant-assets";
import useUserStore from "@/hooks/useUserStore";
import LoadingScreen from "@/components/screens/career/LoadingScreen";

export default function Loading() {
  const { setUser } = useUserStore();

  useEffect(() => {
    async function prepare() {
      const region = await AsyncStorage.getItem("region");
      const accessToken = (await SecureStore.getItemAsync(
        "access_token"
      )) as string;

      if (region && accessToken) {
        const decoded = jwtDecode(accessToken as string);
        if ((decoded.exp as number) < Math.floor(Date.now() / 1000)) {
          router.replace("/(login)/login_webview");
        } else {
          try {
            await loadAssets();
            const entitlementsToken = await getEntitlementsToken(accessToken);
            await SecureStore.setItemAsync(
              "entitlements_token",
              entitlementsToken
            );
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
              })
              .catch((error) => {
                console.log(error);
              })
              .finally(() => {
                router.replace("/(authenticated)/(store)");
              });
          } catch (e) {
            if (!__DEV__) {
              await CookieManager.clearAll(true);
              router.replace("/(login)"); // Fallback to setup, so user doesn't get stuck
            }
          }
        }
      } else router.replace("/(login)");
    }
    prepare();
  }, []);

  return <LoadingScreen />;
}
