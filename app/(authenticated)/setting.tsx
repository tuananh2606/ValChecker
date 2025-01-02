import { Button, List, MD3Colors, Title } from "react-native-paper";
import { StatusBar, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserStore from "@/hooks/useUserStore";
import { defaultUser } from "@/utils/valorant-api";
import { router } from "expo-router";
import CookieManager from "@react-native-cookies/cookies";

export default function SettingScreen() {
  const { user, setUser } = useUserStore();
  const handleLogout = async () => {
    await CookieManager.clearAll(true);
    await AsyncStorage.removeItem("region");
    setUser(defaultUser);
    router.replace("/(login)");
  };

  return (
    <View style={styles.container}>
      <Title
        style={{
          fontSize: 24,
          fontWeight: 900,
          color: "white",
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
          right={() => (
            <List.Icon color={MD3Colors.tertiary70} icon="chevron-right" />
          )}
        />
        <List.Subheader>General</List.Subheader>
        <List.Item
          style={{
            padding: 10,
            borderRadius: 10,
            backgroundColor: "#2E2E2E",
          }}
          title="Second Item"
          right={() => (
            <List.Icon color={MD3Colors.tertiary70} icon="chevron-right" />
          )}
        />
        <List.Subheader>NOTIFICATION</List.Subheader>
        <List.Item
          style={{
            padding: 10,
            borderRadius: 10,
            backgroundColor: "#2E2E2E",
          }}
          title="Store Reset Notification"
          right={() => (
            <List.Icon color={MD3Colors.tertiary70} icon="chevron-right" />
          )}
        />
      </List.Section>
      <Button
        onPress={handleLogout}
        style={{
          borderRadius: 8,
        }}
        mode="contained"
      >
        Sign out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
});
