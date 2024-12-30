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
      <Title>Settings</Title>
      <List.Section style={{ flex: 1 }}>
        <List.Subheader>FAQ</List.Subheader>
        <List.Item title="FAQ" left={() => <List.Icon icon="folder" />} />
        <List.Subheader>General</List.Subheader>
        <List.Item
          title="Second Item"
          left={() => <List.Icon color={MD3Colors.tertiary70} icon="folder" />}
        />
        <List.Subheader>NOTIFICATION</List.Subheader>
        <List.Item
          title="Store Reset Notification"
          left={() => <List.Icon color={MD3Colors.tertiary70} icon="folder" />}
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
  },
});
