import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";
import useUserStore from "@/hooks/useUserStore";
import TimerAction from "@/components/TimerAction";
import NightMarketItem from "@/components/card/NightMarketItem";

function NightMarket() {
  const { t } = useTranslation();
  const user = useUserStore(({ user }) => user);

  return (
    <>
      {user.shops.nightMarket.length > 0 ? (
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignContent: "center",
              paddingVertical: 5,
              paddingHorizontal: 10,
            }}
          >
            <TimerAction remainingSecs={user.shops.remainingSecs.nightMarket} />
          </View>
          {user.shops.nightMarket.map((item) => (
            <NightMarketItem item={item} key={item.uuid} />
          ))}
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{
              width: 80,
              height: 80,
            }}
            source={require("@/assets/images/Night_Market_Icon.png")}
          />
          <Text
            style={{
              textAlign: "center",
              fontSize: 14,
              marginTop: 10,
              fontWeight: "bold",
            }}
          >
            {t("no_nightmarket")}
          </Text>
        </View>
      )}
    </>
  );
}

export default NightMarket;
