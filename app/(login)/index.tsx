import { StyleSheet, View, Text, Pressable } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppTheme } from "../_layout";

export default function RegionScreen() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const region = [
    { label: "Asia Pacific", value: "ap" },
    { label: "Europe", value: "eu" },
    { label: "Korea", value: "kr" },
    { label: "North America", value: "na" },
  ];

  const [value, setValue] = useState("ap");
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && {
            borderColor: "blue",
          },
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={[styles.selectedTextStyle, { color: colors.text }]}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={region}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Select region" : ""}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />

      <Pressable
        style={styles.buttonContainer}
        onPress={async () => {
          await AsyncStorage.setItem("region", value);
          router.push("/login_webview");
        }}
      >
        <Text style={styles.buttonText}>{t("login")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    width: 200,
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  buttonContainer: {
    width: 100,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    borderRadius: 8,
    backgroundColor: "#ff4654",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
