import CardItem from "@/components/card/CardItem";
import {
  fetchPlayerCards,
  fetchSprays,
  getAssets,
} from "@/utils/valorant-assets";
import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";

export default function SpraysScreen() {
  //   const [sprays, setsprays] = useState<ValorantSprayAccessory[]>([]);
  const [page, setPage] = useState<number>(1);
  const { sprays } = getAssets();
  //   useEffect(() => {
  //     const fetchSpraysData = async () => {
  //       const sprays = await fetchSprays();
  //       setsprays(sprays);
  //     };
  //     fetchSpraysData();
  //   }, []);

  useEffect(() => {}, [page]);

  return (
    <View style={styles.container}>
      <FlatList
        numColumns={5}
        horizontal={false}
        data={sprays}
        contentContainerStyle={{
          gap: 4,
        }}
        columnWrapperStyle={{
          gap: 4,
        }}
        renderItem={({ item }) => <CardItem data={item} />}
        keyExtractor={(item) => item.uuid}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
