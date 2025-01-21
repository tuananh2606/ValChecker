import { getDeviceWidth } from "@/utils/misc";
import { router } from "expo-router";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
interface ISprayAccessory extends ValorantSprayAccessory {
  equipSlot: string;
}

type Props = {
  styleContainer?: any;
  style: any;
  source: ImageSourcePropType;
  playerLoadout?: ISprayAccessory;
};

const SprayItem = ({ styleContainer, style, source, playerLoadout }: Props) => {
  return (
    <Pressable
      style={[
        styles.sprayContainer,
        {
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
      <ImageBackground
        source={source}
        resizeMode="contain"
        style={[
          styles.sprayContainer,
          {
            ...style,
          },
        ]}
      >
        <Image
          style={styles.sprayImage}
          resizeMode="contain"
          source={{
            uri: playerLoadout?.fullTransparentIcon,
          }}
        />
      </ImageBackground>
    </Pressable>
  );
};

export default SprayItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    width: getDeviceWidth(),
    height: 130,
  },
  sprayContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  sprayImage: {
    width: 60,
    height: 70,
  },
});
