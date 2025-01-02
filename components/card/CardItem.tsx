import { View, Image } from "react-native";
import { getDeviceWidth } from "@/utils/misc";

interface Props {
  data: ValorantCardAccessory | ValorantSprayAccessory;
}

const CardItem = ({ data }: Props) => {
  return (
    <View
      style={{
        height: getDeviceWidth() / 5,
        width: getDeviceWidth() / 5 - 4,
        borderWidth: 1,
        borderColor: "grey",
      }}
    >
      <Image
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="contain"
        source={{
          uri: data.displayIcon,
        }}
      />
    </View>
  );
};
export default CardItem;
