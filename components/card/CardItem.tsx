import { View } from "react-native";
import { Image } from "expo-image";
import { getDeviceWidth } from "@/utils/misc";
import { memo } from "react";

interface Props {
  data: ValorantCardAccessory | ValorantSprayAccessory | ValorantBuddyAccessory;
}

const CardItem = ({ data }: Props) => {
  return (
    <View
      style={{
        height: getDeviceWidth() / 5 - 4,
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
        contentFit="contain"
        placeholder={require("@/assets/images/image-placeholder.png")}
        source={{
          uri: data.displayIcon,
        }}
      />
    </View>
  );
};
export default memo(CardItem);
