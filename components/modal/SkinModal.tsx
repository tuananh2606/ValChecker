import { Colors } from "@/constants/Colors";
import { useEvent } from "expo";
import { ResizeMode, Video } from "expo-av";
import { useVideoPlayer, VideoView } from "expo-video";
import { useRef, useState } from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import Modal from "react-native-modal";

interface Props {
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  data: {
    levels: any[];
    chromas: any[];
  };
}

const SkinModal = (props: Props) => {
  const {
    isModalVisible,
    setModalVisible,
    data: { levels, chromas },
  } = props;
  const colorScheme = useColorScheme();
  // const videoSource = levels[0].streamedVideo;

  // const player = useVideoPlayer(videoSource, (player) => {
  //   player.loop = true;
  //   player.play();
  // });

  return (
    <Modal
      swipeDirection="down"
      onSwipeComplete={() => setModalVisible(false)}
      isVisible={isModalVisible}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
      >
        {/* <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        /> */}
      </View>
    </Modal>
  );
};
export default SkinModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
  },
  video: {
    width: 350,
    height: 275,
  },
});
