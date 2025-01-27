import { useWindowDimensions, View } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useState } from "react";
import MineView from "@/components/screens/career/MineView";
import LeaderboardsView from "@/components/screens/career/LeaderboardsView";
import i18n from "@/utils/localization";
import { useAppTheme } from "../_layout";
import { Title } from "react-native-paper";

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
  const { colors } = useAppTheme();

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      activeColor="red"
      inactiveColor={colors.text}
      indicatorStyle={{ backgroundColor: "red" }}
      style={{
        backgroundColor: "transparent",
      }}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <Title style={{ textAlign: "center", fontWeight: 700 }}>Career</Title>
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
