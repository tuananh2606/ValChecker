import { useAppTheme } from "@/app/_layout";
import {
  TabButtonType,
  TabButtons,
  TabImageButtons,
} from "@/components/TabButtons";
import { getAssets } from "@/utils/valorant-assets";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Text, Image, ScrollView } from "react-native";

const DetailsScreen = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { skins } = getAssets();
  const skin = skins.find((_skin) => _skin.uuid === id) as ValorantSkin;
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [selectedChroma, setSelectedChromaTab] = useState(0);

  const levels: TabButtonType[] = Array.from(
    Array(skin.levels.length),
    (_, x) => {
      return { title: t("level") + " " + (x + 1) };
    }
  );
  const chromas: TabButtonType[] = Array.from(skin.chromas, (item, idx) => {
    return { title: t("level") + " " + (idx + 1), source: item.swatch };
  });

  const imageSource = skin.chromas[selectedChroma].displayIcon
    ? (skin.chromas[selectedChroma].displayIcon as string)
    : (skin.chromas[selectedChroma].fullRender as string);
  const videoSource = skin.levels[selectedTab].streamedVideo;
  const videoChromaSource = skin.chromas[selectedChroma].streamedVideo ?? null;
  const player = useVideoPlayer(videoSrc, (player) => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: {
        backgroundColor: "black",
      },
    });
  }, [navigation]);

  useEffect(() => {
    if (selectedChroma !== 0 && videoChromaSource)
      player.replace(videoChromaSource as string);
  }, [selectedChroma]);

  useEffect(() => {
    player.replace(videoSource as string);
  }, [selectedTab]);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.surface,
      }}
    >
      <View
        style={{
          marginLeft: 20,
          marginTop: 16,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: 24, height: 24, marginRight: 8 }}
          resizeMode="contain"
          source={{
            uri: skin.contentTier.displayIcon,
          }}
        />
        <Text
          style={{
            color: "white",
            fontSize: 24,
          }}
        >
          {skin.displayName}
        </Text>
      </View>

      <View style={styles.container}>
        {skin.levels[0].streamedVideo && (
          <Fragment>
            <VideoView
              style={styles.video}
              player={player}
              nativeControls={false}
            />
            <View
              style={{
                width: 300,
              }}
            >
              <TabButtons
                buttons={levels}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
            </View>
          </Fragment>
        )}

        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{
              uri: imageSource,
            }}
          />
        </View>
        <View
          style={{
            marginTop: 20,
          }}
        >
          <TabImageButtons
            buttons={chromas}
            selectedTab={selectedChroma}
            setSelectedTab={setSelectedChromaTab}
          />
        </View>
      </View>
    </ScrollView>
  );
};
export default DetailsScreen;
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 16,
  },
  video: {
    width: 300,
    height: 200,
    marginVertical: 16,
  },
  imageContainer: {
    marginTop: 60,
    alignItems: "center",
    height: 200,
  },
  image: {
    width: 300,
    height: "100%",
  },
});
