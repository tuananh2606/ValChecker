import useUserStore from "@/hooks/useUserStore";
import { getAssets } from "@/utils/valorant-assets";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Menu, Title } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { fetchPlayerOwnedItems } from "@/utils/valorant-api";
import { convertOwnedItemIDToItem, VOwnedItemType } from "@/utils/misc";
import SkinItem from "@/components/card/SkinItem";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function SkinsScreen() {
  const navigation = useNavigation();
  const [ownedSkins, setOwnedSkins] = useState<SkinInventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const { skins } = getAssets();
  const [skinsData, setSkinsData] = useState<ValorantSkin[]>([]);
  const [ownedSkinsData, setOwnedSkinsData] = useState<SkinInventoryItem[]>([]);
  const [filteredSkins, setFilteredSkins] = useState<
    (string | SkinInventoryItem)[]
  >([]);
  const [totalCollectionCount, setTotalCollectionCount] = useState({
    select: 0,
    deluxe: 0,
    premium: 0,
    exclusive: 0,
    ultra: 0,
  });
  const [page, setPage] = useState<number>(1);
  const [ownedPage, setOwnedPage] = useState<number>(1);
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const user = useUserStore((state) => state.user);
  useEffect(() => {
    const fetchSkins = async () => {
      let accessToken = (await SecureStore.getItemAsync(
        "access_token"
      )) as string;
      let entitlementsToken = (await SecureStore.getItemAsync(
        "entitlements_token"
      )) as string;
      const ownedSkins = await fetchPlayerOwnedItems(
        accessToken,
        entitlementsToken,
        user.region,
        user.id,
        VOwnedItemType.Skins
      );

      const newSkins = convertOwnedItemIDToItem(ownedSkins);

      setOwnedSkins(newSkins as SkinInventoryItem[]);
      setOwnedSkinsData((newSkins as SkinInventoryItem[]).slice(0, 50));
    };
    fetchSkins();
  }, []);

  useEffect(() => {
    handleTotalCollectionCount(ownedSkinsData);
    setFilteredSkins(["Owned", ...ownedSkinsData]);
  }, [ownedSkinsData]);

  const handleLoadMore = () => {
    if (selectedTab === 0) {
      setOwnedPage((prevPage) => prevPage + 1);
      const newSkins = ownedSkins.slice(ownedPage * 50, ownedPage * 50 + 50);
      setOwnedSkinsData((prev) => [...prev, ...newSkins]);
    } else {
      setPage((prevPage) => prevPage + 1);
      const newSkins = skins.slice(page * 50, page * 50 + 50);
      setSkinsData((prev) => [...prev, ...newSkins]);
    }
  };

  const stickyHeaderIndices = filteredSkins
    .map((item, index) => {
      if (typeof item === "string") {
        return index;
      } else {
        return null;
      }
    })
    .filter((item) => item !== null) as number[];

  const handleTotalCollectionCount = (arr: any[]) => {
    const selectTier = arr.filter((item) => item.contentTier.rank === 0).length;
    const deluxeTier = arr.filter((item) => item.contentTier.rank === 1).length;
    const premiumTier = arr.filter(
      (item) => item.contentTier.rank === 2
    ).length;
    const exclusiveTier = arr.filter(
      (item) => item.contentTier.rank === 3
    ).length;
    const ultraTier = arr.filter((item) => item.contentTier.rank === 4).length;
    setTotalCollectionCount({
      select: selectTier,
      deluxe: deluxeTier,
      premium: premiumTier,
      exclusive: exclusiveTier,
      ultra: ultraTier,
    });
  };

  const onIconPress = (event: any) => {
    const { nativeEvent } = event;
    const anchor = {
      x: nativeEvent.pageX + 12,
      y: nativeEvent.pageY + 16,
    };

    setMenuAnchor(anchor);
    openMenu();
  };

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => (
        <View>
          <MaterialIcons
            onPress={onIconPress}
            name="filter-list"
            size={24}
            color="white"
          />
          <Menu visible={visible} onDismiss={closeMenu} anchor={menuAnchor}>
            <View>
              <Menu.Item onPress={() => {}} title="Item 1" />
              <Menu.Item onPress={() => {}} title="Item 2" />
              <Menu.Item onPress={() => {}} title="Item 1" />
              <Menu.Item onPress={() => {}} title="Item 2" />
              <Menu.Item onPress={() => {}} title="Item 1" />
              <Menu.Item onPress={() => {}} title="Item 2" />
              <Menu.Item onPress={() => {}} title="Item 1" />
              <Menu.Item onPress={() => {}} title="Item 2" />
              <Menu.Item onPress={() => {}} title="Item 1" />
              <Menu.Item onPress={() => {}} title="Item 2" />
            </View>
          </Menu>
        </View>
      ),
    });
  }, [visible]);

  console.log(visible);

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={filteredSkins}
        ListHeaderComponent={
          <View>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Image
                  style={styles.imageContentTier}
                  source={require("@/assets/images/ultra.png")}
                />
                <Text style={styles.text}>{totalCollectionCount.ultra}</Text>
              </View>
              <View style={styles.contentTierContainer}>
                <Image
                  style={styles.imageContentTier}
                  source={require("@/assets/images/exclusive.png")}
                />
                <Text style={styles.text}>
                  {totalCollectionCount.exclusive}
                </Text>
              </View>
              <View style={styles.contentTierContainer}>
                <Image
                  style={styles.imageContentTier}
                  source={require("@/assets/images/premium.png")}
                />
                <Text style={styles.text}>{totalCollectionCount.premium}</Text>
              </View>
              <View style={styles.contentTierContainer}>
                <Image
                  style={styles.imageContentTier}
                  source={require("@/assets/images/deluxe.png")}
                />
                <Text style={styles.text}>{totalCollectionCount.deluxe}</Text>
              </View>
              <View style={styles.contentTierContainer}>
                <Image
                  style={styles.imageContentTier}
                  source={require("@/assets/images/select.png")}
                />
                <Text style={styles.text}>{totalCollectionCount.select}</Text>
              </View>
            </View>
            <Title
              style={{
                fontSize: 16,
                marginTop: 4,
              }}
            >
              Total Collection Count
            </Title>
          </View>
        }
        stickyHeaderIndices={stickyHeaderIndices}
        renderItem={({ item }) => {
          if (typeof item === "string") {
            // Rendering header
            return (
              <View
                style={{
                  backgroundColor: "#000",
                  padding: 8,
                }}
              >
                <Text style={styles.header}>{item}</Text>
              </View>
            );
          } else {
            // Render item
            return <SkinItem data={item} />;
          }
        }}
        estimatedItemSize={150}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentTierContainer: {
    flexDirection: "row",
    marginLeft: 16,
  },
  imageContentTier: {
    width: 24,
    height: 24,
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
    color: "white",
  },
  header: {
    fontSize: 16,
    color: "white",
  },
});
