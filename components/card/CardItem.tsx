import { TouchableWithoutFeedback, View } from "react-native";
import { Image } from "expo-image";
import { getDeviceWidth } from "@/utils/misc";
import { memo } from "react";
import { router } from "expo-router";

interface Props {
  data: ValorantCardAccessory | ValorantSprayAccessory | ValorantBuddyAccessory;
  setState?: React.Dispatch<
    React.SetStateAction<{ source: string; title: string }>
  >;
}

const CardItem = ({ data, setState }: Props) => {
  return (
    <TouchableWithoutFeedback
      onPress={() =>
        setState
          ? setState({
              title: data.displayName,
              source:
                (data as ValorantSprayAccessory).fullTransparentIcon ||
                (data as ValorantBuddyAccessory).levels[0].displayIcon,
            })
          : router.push({
              pathname: "/details-item/[id]",
              params: { id: data.uuid, type: "card" },
            })
      }
    >
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
          contentFit="contain"
          placeholder={require("@/assets/images/image-placeholder.png")}
          source={{
            uri: data.displayIcon,
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
export default memo(CardItem);
