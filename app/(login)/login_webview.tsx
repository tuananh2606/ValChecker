import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";
import { getAccessTokenFromUri } from "@/utils/misc";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen() {
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
      router.replace("/(authenticated)/(store)");
    }
  };

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
