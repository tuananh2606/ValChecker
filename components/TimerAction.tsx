import { View, Text, StyleSheet, StyleProp, TextStyle } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { convertSecstoHhMmSs } from "@/utils/misc";
import { useAppTheme } from "@/app/_layout";
interface Props {
  remainingSecs: number;
  leadIconStyles?: StyleProp<TextStyle>;
  contentStyles?: StyleProp<TextStyle>;
}

const TimerAction = ({
  remainingSecs,
  leadIconStyles,
  contentStyles = { fontSize: 16 },
}: Props) => {
  const { colors } = useAppTheme();
  const [diff, setDiff] = useState(remainingSecs);
  useEffect(() => {
    const interval = setInterval(() => {
      setDiff((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [remainingSecs]);

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <MaterialIcons
          name="access-time"
          style={[leadIconStyles]}
          size={18}
          color={colors.tint}
        />
        <Text
          style={[
            contentStyles,
            {
              marginLeft: 2,
              color: colors.text,
            },
          ]}
        >
          {convertSecstoHhMmSs(diff)}
        </Text>
      </View>
    </View>
  );
};
export default TimerAction;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
