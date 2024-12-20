import { useWindowDimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useState } from "react";

import StoreView from "@/components/StoreView";
import AccessoryView from "@/components/AccessoryView";
import BundleView from "@/components/BundleView";

const renderScene = SceneMap({
  store: StoreView,
  accessory: AccessoryView,
  bundle: BundleView,
});

const routes = [
  { key: "store", title: "Store" },
  { key: "accessory", title: "Accessory" },
  { key: "bundle", title: "Bundle" },
];

export default function StoreScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "white" }}
      style={{ backgroundColor: "transparent" }}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}
