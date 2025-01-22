import { StatusBar, useWindowDimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useEffect, useState } from "react";
import MineView from "@/components/screens/career/MineView";
import LeaderboardsView from "@/components/screens/career/LeaderboardsView";
import i18n from "@/utils/localization";

const renderScene = SceneMap({
  mine: MineView,
  leaderboards: LeaderboardsView,
});

const routes = [
  { key: "mine", title: i18n.t("mine") },
  { key: "leaderboards", title: i18n.t("leaderboard") },
];

export default function CareerScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      activeColor="red"
      indicatorStyle={{ backgroundColor: "red" }}
      style={{
        backgroundColor: "transparent",
        marginTop: StatusBar.currentHeight,
      }}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ height: 0, width: layout.width }}
    />
  );
}
