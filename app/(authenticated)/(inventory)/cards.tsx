import CardItem from "@/components/card/CardItem";
import TabButtons from "@/components/TabButtons";
import { fetchPlayerCards, getAssets } from "@/utils/valorant-assets";
import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";

const SwitchTabArray = [{ title: "Owned" }, { title: "All" }];

export default function CardsScreen() {
  //const [cards, setCards] = useState<ValorantCardAccessory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const { cards } = getAssets();
  const [cardsData, setCardsData] = useState<ValorantCardAccessory[]>([]);
  const [page, setPage] = useState<number>(1);
  //   useEffect(() => {
  //     const fetchCards = async () => {
  //       const cards = await fetchPlayerCards();
  //       setCards(cards);
  //     };
  //     fetchCards();
  //   }, []);
  useEffect(() => {
    setCardsData(cards.slice(0, 50));
  }, []);
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
    const newCards = cards.slice(page * 50, page * 50 + 50);
    setCardsData((prev) => [...prev, ...newCards]);
  };
  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponentStyle={{
          width: 150,
          justifyContent: "flex-end",
        }}
        ListHeaderComponent={
          <TabButtons
            buttons={SwitchTabArray}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        }
        numColumns={5}
        horizontal={false}
        data={cardsData}
        contentContainerStyle={{
          gap: 4,
        }}
        columnWrapperStyle={{
          gap: 4,
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
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
