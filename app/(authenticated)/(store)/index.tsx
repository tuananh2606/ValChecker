import { TouchableOpacity, useWindowDimensions, View } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useState } from "react";

import StoreView from "@/components/StoreView";
import AccessoryView from "@/components/AccessoryView";
import BundleView from "@/components/BundleView";
import { Title } from "react-native-paper";
import { useAppTheme } from "@/app/_layout";
import i18n from "@/utils/localization";
import { Image } from "expo-image";
import { router } from "expo-router";

const renderScene = SceneMap({
  store: StoreView,
  accessory: AccessoryView,
  bundle: BundleView,
});

const routes = [
  { key: "store", title: "Skin" },
  { key: "accessory", title: i18n.t("accessory") },
  { key: "bundle", title: i18n.t("bundle") },
];

export default function StoreScreen() {
  const { colors } = useAppTheme();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      activeColor="red"
      indicatorStyle={{ backgroundColor: "red" }}
      inactiveColor={colors.text}
      style={{
        backgroundColor: "transparent",
      }}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          position: "relative",
        }}
      >
        <Title
          style={{
            flex: 1,
            fontWeight: 700,
            color: colors.text,
            textAlign: "center",
          }}
        >
          {i18n.t("store")}
        </Title>
        <TouchableOpacity
          style={{
            zIndex: 20,

            right: 20,
            position: "absolute",
          }}
          onPress={() => router.push("/night-market")}
        >
          <Image
            style={{
              width: 30,
              height: 30,
            }}
            source={require("@/assets/images/Night_Market_Icon.png")}
          />
        </TouchableOpacity>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ height: 0, width: layout.width }}
      />
    </View>
  );
}
