import { useWindowDimensions, View } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useState } from "react";

import StoreView from "@/components/StoreView";
import AccessoryView from "@/components/AccessoryView";
import BundleView from "@/components/BundleView";
import { Title } from "react-native-paper";
import { useAppTheme } from "@/app/_layout";
import i18n from "@/utils/localization";

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
      <Title
        style={{
          fontWeight: 700,
          color: colors.text,
          textAlign: "center",
        }}
      >
        {i18n.t("store")}
      </Title>
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
