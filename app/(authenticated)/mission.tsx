import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

import useUserStore from "@/hooks/useUserStore";
import { parseBattlePass } from "@/utils/valorant-api";
import { fetchContracts } from "@/utils/valorant-assets";

export default function MissionScreen() {
  const [contracts, setContracts] = useState<BattlePass[]>();
  const user = useUserStore((state) => state.user);

  console.log(user);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchContracts();
      const battlePass = await parseBattlePass(res[res.length - 1]);

      console.log(battlePass);
      setContracts(battlePass);
    };
    fetchData();
  }, []);

  return (
    <View>
      <Text>Mission screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
