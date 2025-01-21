import TabButtons, { TabButtonType } from "@/components/TabButtons";
import { Colors } from "@/constants/Colors";
import { getDeviceWidth } from "@/utils/misc";
import { getAssets } from "@/utils/valorant-assets";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useState, useEffect, Fragment } from "react";
import {
  View,
  StyleSheet,
  Text,
  useColorScheme,
  Image,
  ScrollView,
} from "react-native";

const DetailsScreen = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { skins } = getAssets();
  const colorScheme = useColorScheme();
  const skin = skins.find((_skin) => _skin.uuid === id) as ValorantSkin;
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [selectedChroma, setSelectedChromaTab] = useState(0);

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
  const videoChromaSource = skin.chromas[selectedChroma].streamedVideo;
  const player = useVideoPlayer(videoSrc, (player) => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    navigation.setOptions({
      title: "",
    });
  }, [navigation]);

  useEffect(() => {
    if (selectedChroma !== 0) setVideoSrc(videoChromaSource as string);
  }, [selectedChroma]);

  useEffect(() => {
    setVideoSrc(videoSource as string);
  }, [selectedTab]);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "light"].background,
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
            width: 300,
          }}
        >
          <TabButtons
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
