import useUserStore from "@/hooks/useUserStore";
import { getAssets } from "@/utils/valorant-assets";
import { Image } from "expo-image";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { Divider, FAB, Title, TouchableRipple } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { fetchPlayerOwnedItems } from "@/utils/valorant-api";
import { convertOwnedItemIDToItem, VOwnedItemType } from "@/utils/misc";
import SkinItem from "@/components/card/SkinItem";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetSectionList,
} from "@gorhom/bottom-sheet";
import { Colors } from "@/constants/Colors";
import Loading from "@/components/Loading";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useAppTheme } from "@/app/_layout";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import i18n from "@/utils/localization";
import { useQuery } from "@tanstack/react-query";

const noMeleeFilter = [
  "Vandal",
  "Phantom",
  "Spectre",
  "Odin",
  "Ares",
  "Bulldog",
  "Judge",
  "Bucky",
  "Frenzy",
  "Classic",
  "Ghost",
  "Sheriff",
  "Operator",
  "Guardian",
  "Outlaw",
  "Marshal",
  "Stinger",
  "Shorty",
];

const filterSelect = [
  {
    title: i18n.t("choose_weapon"),
    data: [
      "Owned",
      "Vandal",
      "Phantom",
      "Spectre",
      "Odin",
      "Ares",
      "Bulldog",
      "Judge",
      "Bucky",
      "Frenzy",
      "Classic",
      "Ghost",
      "Sheriff",
      "Operator",
      "Guardian",
      "Outlaw",
      "Marshal",
      "Stinger",
      "Shorty",
      "Melee",
    ],
  },
];
export default function SkinsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors } = useAppTheme();
  const { skins } = getAssets();
  const [filteredSkins, setFilteredSkins] = useState<(string | ValorantSkin)[]>(
    []
  );
  const [totalCollectionCount, setTotalCollectionCount] = useState({
    select: 0,
    deluxe: 0,
    premium: 0,
    exclusive: 0,
    ultra: 0,
  });

  const sheetRef = useRef<BottomSheet>(null);
  const flashListRef = useRef<FlashList<string | ValorantSkin> | null>(null);

  const colorScheme = useColorScheme();
  const user = useUserStore((state) => state.user);

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
    return newSkins as ValorantSkin[];
  };
  const { data, isLoading, error } = useQuery<ValorantSkin[], Error>({
    queryKey: ["skins"],
    queryFn: fetchSkins,
    staleTime: 60000,
  });

  const handleChangeWeapon = (title: string) => {
    sheetRef.current?.close();
    flashListRef.current?.scrollToOffset({ animated: false, offset: 0 });
    if (data) {
      if (title === "Melee") {
        const ownedSkin = data.filter(
          (skin) => !noMeleeFilter.some((s) => skin.displayName.includes(s))
        );
        const remainingSkin = skins.filter(
          (skin) =>
            !noMeleeFilter.some((s) => skin.displayName.includes(s)) &&
            !ownedSkin.some((item) => item.uuid === skin.uuid) &&
            skin.contentTierUuid
        );
        handleTotalCollectionCount(ownedSkin);
        setFilteredSkins([
          t("owned"),
          ...ownedSkin,
          t("not_owned"),
          ...remainingSkin,
        ]);
      } else if (title === "Owned") {
        handleTotalCollectionCount(data);
        setFilteredSkins([t("owned"), ...data]);
      } else {
        const ownedSkin = data.filter((skin) =>
          skin.displayName.includes(title)
        );
        const remainingSkin = skins.filter(
          (skin) =>
            skin.displayName.includes(title) &&
            !ownedSkin.some((item) => item.uuid === skin.uuid)
        );
        handleTotalCollectionCount(ownedSkin);
        setFilteredSkins([
          t("owned"),
          ...ownedSkin.sort(customSort()),
          t("not_owned"),
          ...remainingSkin.sort(customSort()),
        ]);
      }
    }
  };

  useEffect(() => {
    handleTotalCollectionCount(data as ValorantSkin[]);
    if (data) {
      setFilteredSkins([t("owned"), ...data.sort(customSort())]);
    }
  }, [data]);

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
    if (arr) {
      const selectTier = arr.filter(
        (item) => item.contentTier.rank === 0
      ).length;
      const deluxeTier = arr.filter(
        (item) => item.contentTier.rank === 1
      ).length;
      const premiumTier = arr.filter(
        (item) => item.contentTier.rank === 2
      ).length;
      const exclusiveTier = arr.filter(
        (item) => item.contentTier.rank === 3
      ).length;
      const ultraTier = arr.filter(
        (item) => item.contentTier.rank === 4
      ).length;
      setTotalCollectionCount({
        select: selectTier,
        deluxe: deluxeTier,
        premium: premiumTier,
        exclusive: exclusiveTier,
        ultra: ultraTier,
      });
    }
  };

  const snapPoints = useMemo(() => ["50%"], []);

  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string } }) => (
      <View
        style={[
          styles.sectionHeaderContainer,
          { backgroundColor: Colors[colorScheme ?? "light"].surface },
        ]}
      >
        <Text style={{ color: "white" }}>{section.title}</Text>
      </View>
    ),
    []
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.7}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
      />
    ),
    []
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback onPress={() => sheetRef.current?.collapse()}>
          <MaterialIcons
            name="filter-list"
            size={24}
            color="white"
            style={{ marginLeft: 8 }}
          />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  if (isLoading) {
    return <Loading />;
  }

  const customSort = () => {
    return (a: ValorantSkin, b: ValorantSkin) => {
      if (typeof a === "string" || typeof b === "string") {
        return 10;
      } else {
        if (a.contentTier && b.contentTier) {
          return (
            (b.contentTier as ValorantContentTier).rank -
            (a.contentTier as ValorantContentTier).rank
          );
        } else return 0;
      }
    };
  };

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        ref={flashListRef}
        data={filteredSkins}
        ListHeaderComponent={
          <View
            style={{
              marginLeft: 6,
            }}
          >
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
              {t("total_collection_count")}
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
            return <SkinItem data={item} />;
          }
        }}
        estimatedItemSize={150}
      />
      <FAB
        icon={() => (
          <MaterialIcons name="search" size={24} color={colors.tint} />
        )}
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push("/search")}
      />
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: Colors[colorScheme ?? "light"].surface,
        }}
      >
        <BottomSheetSectionList
          sections={filterSelect}
          keyExtractor={(i) => i}
          stickySectionHeadersEnabled
          renderSectionHeader={renderSectionHeader}
          renderItem={({ item }) => (
            <Fragment>
              <Divider
                bold
                style={{
                  backgroundColor: "grey",
                }}
              />
              <TouchableRipple
                onPress={() => handleChangeWeapon(item)}
                style={styles.itemContainer}
              >
                <Text style={{ color: "white" }}>{item}</Text>
              </TouchableRipple>
            </Fragment>
          )}
          contentContainerStyle={[
            { backgroundColor: Colors[colorScheme ?? "light"].surface },
          ]}
        />
      </BottomSheet>
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
  contentContainer: {
    color: "white",
  },
  sectionHeaderContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  itemContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
