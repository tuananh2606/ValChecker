import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";
import { getAccessTokenFromUri } from "@/utils/misc";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import useUserStore from "@/hooks/useUserStore";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import Loading from "@/components/Loading";

export default function LoginScreen() {
  const { setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const LOGIN_URL =
    "https://auth.riotgames.com/authorize?redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in&client_id=play-valorant-web-prod&response_type=token%20id_token&nonce=1&scope=account%20openid";

  const handleWebViewChange = async (newNavState: {
    url?: string;
    title?: string;
    loading?: boolean;
    canGoBack?: boolean;
    canGoForward?: boolean;
  }) => {
    if (!newNavState.url) return;
    if (newNavState.url.includes("access_token=")) {
      const accessToken = getAccessTokenFromUri(newNavState.url);
      const region = await AsyncStorage.getItem("region");
      await SecureStore.setItemAsync("access_token", accessToken);
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
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setLoading(false);
            router.replace("/(authenticated)/(store)");
          });
      } catch (e) {
        if (!__DEV__) {
          await CookieManager.clearAll(true);
          router.replace("/(login)"); // Fallback to setup, so user doesn't get stuck
        }
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container} renderToHardwareTextureAndroid>
      <WebView
        userAgent="Mozilla/5.0 (Linux; Android) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36"
        source={{
          uri: LOGIN_URL,
        }}
        onNavigationStateChange={handleWebViewChange}
        injectedJavaScriptBeforeContentLoaded={`(function() {
            const deleteCookieBanner = () => {
              if (document.getElementsByClassName('osano-cm-window').length > 0) document.getElementsByClassName('osano-cm-window')[0].style = "display:none;";
              else setTimeout(deleteCookieBanner, 10)
            }
            deleteCookieBanner();
          })();`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
