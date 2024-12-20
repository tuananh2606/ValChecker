import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { View, Image, Text, StyleSheet } from "react-native";

interface Props {
  balances: any;
}

const CurrencyFooter = ({ balances }: Props) => {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Image
          style={{ width: 16, height: 16 }}
          resizeMode="contain"
          source={require("@/assets/images/valorantPoints.png")}
        />
        <Text
          style={{
            fontSize: 16,
            marginLeft: 4,
            color: Colors[colorScheme ?? "light"].text,
          }}
        >
          {balances.vp}
        </Text>
      </View>
      <View style={[styles.container, { marginLeft: 12 }]}>
        <Image
          style={{ width: 16, height: 16 }}
          resizeMode="contain"
          source={require("@/assets/images/kingdomCredits.png")}
        />
        <Text
          style={{
            fontSize: 16,
            marginLeft: 4,
            color: Colors[colorScheme ?? "light"].text,
          }}
        >
          {balances.kc}
        </Text>
      </View>
      <View style={[styles.container, { marginLeft: 12 }]}>
        <Image
          style={{ width: 16, height: 16 }}
          resizeMode="contain"
          source={require("@/assets/images/radianitePoints.png")}
        />
        <Text
          style={{
            fontSize: 16,
            marginLeft: 4,
            color: Colors[colorScheme ?? "light"].text,
          }}
        >
          {balances.rad}
        </Text>
      </View>
    </View>
  );
};
export default CurrencyFooter;
const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 8,
  },
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
});
