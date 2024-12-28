import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";
import { getAccessTokenFromUri } from "@/utils/misc";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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

export default function LoginScreen() {
  const params = useLocalSearchParams();
  const { setUser } = useUserStore();

  const [loading, setLoading] = useState<string | null>(null);
  const { t } = useTranslation();
  const { region } = params;
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
      await SecureStore.setItemAsync("access_token", accessToken);
      try {
        setLoading(t("fetching.assets"));
        await loadAssets();
        setLoading(t("fetching.entitlements_token"));
        const entitlementsToken = await getEntitlementsToken(accessToken);
        await SecureStore.setItemAsync("entitlements_token", entitlementsToken);
        setLoading(t("fetching.user_id"));
        const userId = getUserId(accessToken);
        setLoading(t("fetching.username"));
        const username = await getUsername(
          accessToken,
          entitlementsToken,
          userId,
          region as string
        );
        setLoading(t("fetching.storefront"));
        const shop = await getShop(
          accessToken,
          entitlementsToken,
          region as string,
          userId
        );
        const shops = await parseShop(shop);
        setLoading(t("fetching.progress"));
        const progress = await getProgress(
          accessToken,
          entitlementsToken,
          region as string,
          userId
        );
        setLoading(t("fetching.balances"));
        const balances = await getBalances(
          accessToken,
          entitlementsToken,
          region as string,
          userId
        );
        setLoading(t("fetching.donator"));
        setUser({
          id: userId,
          name: username,
          region: region as string,
          shops,
          progress,
          balances,
        });
        router.replace("/(authenticated)/(store)");
      } catch (e) {
        console.log(e);
        if (!__DEV__) {
          console.log("vao");
          await CookieManager.clearAll(true);
          router.replace("/"); // Fallback to setup, so user doesn't get stuck
        }
      }
    }
  };
  if (loading) {
    return <Loading msg={loading} />;
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
