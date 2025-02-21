import SkinItem from "@/components/card/SkinItem";
import { useWishlistStore } from "@/hooks/useWishlistStore";
import { getAssets } from "@/utils/valorant-assets";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Searchbar } from "react-native-paper";
import { useDebounce } from "use-debounce";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [value] = useDebounce(searchQuery, 500);
  const { t } = useTranslation();
  const { skinIds } = useWishlistStore();
  const { skins } = getAssets();
  const [searchSkins, setSearchSkins] = useState<ValorantSkin[]>([]);

  useEffect(() => {
    setSearchSkins(
      skins
        .filter(
          (skin) =>
            skin.displayName.match(
              new RegExp(value.replace(/[&/\\#,+()$~%.^'":*?<>{}]/g, ""), "i")
            ) && skin.contentTierUuid
        )
        .map((item) => ({
          ...item,
          onWishlist: skinIds.includes(item.levels[0].uuid),
        }))
        .sort((a, b) =>
          a.onWishlist === b.onWishlist ? 0 : a.onWishlist ? -1 : 1
        )
    );
  }, [value, skinIds]);

  const renderItem = ({ item }: { item: ValorantSkin }) => (
    <SkinItem data={item} />
  );
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 8,
      }}
    >
      <Searchbar
        style={{
          marginBottom: 8,
          height: 40,
        }}
        inputStyle={{
          minHeight: 0,
        }}
        placeholder={t("search")}
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <FlashList
        data={searchSkins}
        renderItem={renderItem}
        estimatedItemSize={150}
      />
    </View>
  );
};
export default Search;
