import {
  Button,
  Divider,
  List,
  MD3Colors,
  Switch,
  Title,
} from "react-native-paper";
import {
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserStore from "@/hooks/useUserStore";
import { defaultUser } from "@/utils/valorant-api";
import { router } from "expo-router";
import CookieManager from "@react-native-cookies/cookies";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

export default function SettingScreen() {
  const { t } = useTranslation();
  const { user, setUser } = useUserStore();
  const [time, setTime] = useState<Date>();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSwitchStoreOn, setIsSwitchStoreOn] = useState(false);
  const handleTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    const {
      type,
      nativeEvent: { timestamp, utcOffset },
    } = event;
    if (type === "set") {
      const currentDate = date;
      setTime(currentDate);
      handleShowPicker();
      console.log(currentDate?.toLocaleTimeString());
    }
  };

  const handleLogout = async () => {
    await CookieManager.clearAll(true);
    await AsyncStorage.removeItem("region");
    setUser(defaultUser);
    router.replace("/(login)");
  };

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const handleShowPicker = () => setShowTimePicker(!showTimePicker);

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
                  color="white"
                />
              </View>
            )}
            title="Dark Mode"
            right={() => (
              <Switch
                color="green"
                value={isSwitchOn}
                onValueChange={onToggleSwitch}
              />
            )}
          />
          <Divider />
          <List.Item
            left={() => (
              <View
                style={{
                  marginLeft: 8,
                }}
              >
                <AntDesign name="earth" size={24} color="white" />
              </View>
            )}
            title="Change Time Language"
            right={() => (
              <List.Icon color={MD3Colors.tertiary70} icon="chevron-right" />
            )}
          />
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
                <SimpleLineIcons name="bell" size={24} color="white" />
              </View>
            )}
            right={() => (
              <Switch
                color="green"
                value={isSwitchStoreOn}
                onValueChange={() => setIsSwitchStoreOn(!isSwitchStoreOn)}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Time"
            left={() => (
              <View
                style={{
                  marginLeft: 8,
                }}
              >
                <MaterialCommunityIcons
                  name="clock-time-three-outline"
                  size={24}
                  color="white"
                />
              </View>
            )}
            right={() => (
              <Pressable onPress={handleShowPicker}>
                <TextInput
                  keyboardType={"numeric"}
                  editable={false}
                  value={time?.toLocaleTimeString().slice(0, 5) || "07:00"}
                />
              </Pressable>
            )}
          />
        </View>
      </List.Section>
      {showTimePicker && (
        <DateTimePicker
          display="spinner"
          is24Hour
          value={time || new Date()}
          onChange={handleTimeChange}
          mode="time"
        />
      )}
      <Button
        onPress={handleLogout}
        style={{
          borderRadius: 8,
        }}
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
    marginTop: StatusBar.currentHeight,
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
});
