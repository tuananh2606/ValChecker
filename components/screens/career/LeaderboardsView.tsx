import { View, StyleSheet } from "react-native";
import useUserStore from "@/hooks/useUserStore";
import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";

const LeaderboardsView = () => {
  const user = useUserStore((state) => state.user);
  const region = [
    { label: "Asia Pacific", value: "ap" },
    { label: "Europe", value: "eu" },
    { label: "Korea", value: "kr" },
    { label: "North America", value: "na" },
  ];

  const [value, setValue] = useState(user.region);
  const [isFocus, setIsFocus] = useState(false);
  return (
    <View style={{ marginTop: 8 }}>
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && {
            borderColor: "blue",
          },
        ]}
        selectedTextStyle={[styles.selectedTextStyle, { color: "white" }]}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={region}
        maxHeight={300}
        labelField="label"
        valueField="value"
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};
export default LeaderboardsView;
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
