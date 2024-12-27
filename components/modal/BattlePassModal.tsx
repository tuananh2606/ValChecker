import { Colors } from "@/constants/Colors";
import {
  View,
  Image,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Portal } from "react-native-paper";

interface Props {
  isModalVisible: boolean;
  toggleModal: () => void;
  data: BattlePassItem;
}

const BattlePassModal = (props: Props) => {
  const { isModalVisible, toggleModal, data } = props;
  const colorScheme = useColorScheme();

  const hanndleImage = () => {
    return data.type === "PlayerCard"
      ? { uri: data.largeArt as string }
      : data.type === "Spray"
      ? { uri: data.fullTransparentIcon as string }
      : { uri: data.displayIcon as string };
  };

  return (
    <Portal>
      <Modal isVisible={isModalVisible} onDismiss={toggleModal}>
        <View
          style={[
            styles.container,
            { backgroundColor: Colors[colorScheme ?? "light"].background },
          ]}
        >
          <TouchableOpacity onPress={toggleModal} style={styles.close}>
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Image
            resizeMode="contain"
            style={styles.image}
            source={hanndleImage()}
          />
        </View>
      </Modal>
    </Portal>

    // <Modal
    //   swipeDirection="down"
    //   onSwipeComplete={toggleModal}
    //   isVisible={isModalVisible}
    //   hideModalContentWhileAnimating
    // >
    //   <View
    //     style={[
    //       styles.container,
    //       { backgroundColor: Colors[colorScheme ?? "light"].background },
    //     ]}
    //   >
    //     <TouchableOpacity onPress={toggleModal} style={styles.close}>
    //       <MaterialIcons name="close" size={24} color="white" />
    //     </TouchableOpacity>
    //     <Image
    //       resizeMode="contain"
    //       style={styles.image}
    //       source={hanndleImage()}
    //     />
    //   </View>
    // </Modal>
  );
};
export default BattlePassModal;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
  },
  close: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    height: 400,
    width: 200,
  },
});
