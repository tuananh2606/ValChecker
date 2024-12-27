import TabButtons, { TabButtonType } from "@/components/TabButtons";
import { Colors } from "@/constants/Colors";
import { getAssets } from "@/utils/valorant-assets";
import { useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import { useState } from "react";
import { View, StyleSheet, Text, useColorScheme, Image } from "react-native";

const DetailsScreen = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedChroma, setSelectedChromaTab] = useState(0);

  const { id } = useLocalSearchParams();
  const { skins, contentTier } = getAssets();
  const colorScheme = useColorScheme();
  const skin = skins.find((_skin) => _skin.uuid === id) as ValorantSkin;
  const contentTierSkin = contentTier.find(
    (_contentTier) => _contentTier.uuid === skin.contentTierUuid
  ) as ValorantContentTier;
  const levels: TabButtonType[] = Array.from(
    Array(skin.levels.length),
    (_, x) => {
      return { title: "Level " + (x + 1) };
    }
  );
  const chromas: TabButtonType[] = Array.from(
    Array(skin.chromas.length),
    (_, x) => {
      return { title: "Level " + (x + 1) };
    }
  );
  const imageSource = skin.chromas[selectedChroma].displayIcon
    ? (skin.chromas[selectedChroma].displayIcon as string)
    : (skin.chromas[selectedChroma].fullRender as string);
  const videoSource = skin.levels[selectedTab].streamedVideo;
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      <View
        style={{ marginLeft: 30, flexDirection: "row", alignItems: "center" }}
      >
        <Image
          style={{ width: 24, height: 24, marginRight: 8 }}
          resizeMode="contain"
          source={{
            uri: contentTierSkin.displayIcon,
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
          <>
            <VideoView style={styles.video} player={player} />
            <View
              style={{
                width: 350,
              }}
            >
              <TabButtons
                buttons={levels}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
            </View>
          </>
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
            width: 350,
          }}
        >
          <TabButtons
            buttons={chromas}
            selectedTab={selectedChroma}
            setSelectedTab={setSelectedChromaTab}
          />
        </View>
      </View>
    </View>
  );
};
export default DetailsScreen;
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  video: {
    width: 350,
    height: 200,
    marginVertical: 16,
  },
  imageContainer: {
    marginTop: 60,
    alignItems: "center",
    height: 200,
  },
  image: {
    width: 350,
    height: "100%",
  },
});
