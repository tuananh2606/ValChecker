import { View, Text } from "react-native";
import useUserStore from "@/hooks/useUserStore";

const MineView = () => {
  const user = useUserStore((state) => state.user);

  return (
    <View style={{ marginTop: 8 }}>
      <Text style={{ fontSize: 16, color: "white" }}>{user.name}</Text>
    </View>
  );
};
export default MineView;
