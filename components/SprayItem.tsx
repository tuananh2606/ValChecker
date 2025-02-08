import { useAppTheme } from "@/app/_layout";
import { router } from "expo-router";
import { StyleSheet, Image, TouchableHighlight } from "react-native";

interface ISprayAccessory extends ValorantSprayAccessory {
  equipSlot: string;
}

type Props = {
  styleContainer?: any;
  styleImage: any;
  playerLoadout?: ISprayAccessory;
};

const SprayItem = ({ styleContainer, styleImage, playerLoadout }: Props) => {
  const { colors } = useAppTheme();

  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#413D45"
      style={[
        styles.sprayContainer,
        {
          backgroundColor: colors.card,
          ...styleContainer,
        },
      ]}
      onPress={() =>
        router.push({
          pathname: "/sprays",
          params: {
            source: playerLoadout?.fullTransparentIcon,
            title: playerLoadout?.displayName,
          },
        })
      }
    >
      <Image
        style={{
          width: 90,
          height: 90,
          ...styleImage,
        }}
        resizeMode="contain"
        source={{
          uri: playerLoadout?.fullTransparentIcon,
        }}
      />
    </TouchableHighlight>
  );
};

export default SprayItem;

const styles = StyleSheet.create({
  sprayContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 150,
    margin: -4,
  },
});
