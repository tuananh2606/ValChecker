import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Animated,
} from "react-native";

import { fetchContracts } from "@/utils/valorant-assets";
import { fetchContractsByPID, parseBattlePass } from "@/utils/valorant-api";
import { usePagerView } from "react-native-pager-view";
import * as SecureStore from "expo-secure-store";
import BattlePassItem from "@/components/card/BattlePassItem";
import { TypeBattlePass } from "@/utils/misc";
import useUserStore from "@/hooks/useUserStore";
import type { PagerViewOnPageScrollEventData } from "react-native-pager-view";
import PaginationBattlePass from "@/components/PaginationBattlePass";
import Loading from "@/components/Loading";

interface BattlePassContract {
  ProgressionLevelReached: number;
  ProgressionTowardsNextLevel: number;
  battlePass: BattlePass[];
}

const BattlePass = () => {
  const colorScheme = useColorScheme();
  const [contracts, setContracts] = useState<BattlePassContract>();
  const [loading, setLoading] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);
  const scrollOffsetAnimatedValue = useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = useRef(new Animated.Value(0)).current;
  const { AnimatedPagerView, ref, setPage, activePage, ...rest } = usePagerView(
    {
      pagesAmount: 11,
    }
  );
  const filterCurrentBattlePass = (contracts: ValorantContract[]) => {
    const battlePass = contracts
      .reverse()
      .find((contract) => contract.content.relationType === TypeBattlePass);
    return battlePass as ValorantContract;
  };

  useEffect(() => {
    const fetchData = async () => {
      let accessToken = (await SecureStore.getItemAsync(
        "access_token"
      )) as string;
      let entitlementsToken = (await SecureStore.getItemAsync(
        "entitlements_token"
      )) as string;
      const contracts = fetchContracts();
      const contract = fetchContractsByPID(
        accessToken,
        entitlementsToken,
        user.region,
        user.id
      );
      setLoading("Fetching battlepass");
      Promise.all([contracts, contract])
        .then(async ([data1, data2]) => {
          const currentBP = filterCurrentBattlePass(data1);
          const progressBP = data2.find(
            (item) => item.ContractDefinitionID === currentBP.uuid
          );
          const battlePass = await parseBattlePass(currentBP);
          positionAnimatedValue.setValue(
            Math.floor((progressBP as Contract).ProgressionLevelReached / 5)
          );
          setContracts({
            ProgressionLevelReached: (progressBP as Contract)
              .ProgressionLevelReached,
            ProgressionTowardsNextLevel: (progressBP as Contract)
              .ProgressionTowardsNextLevel,
            battlePass: battlePass,
          });
          setLoading(null);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
  }, []);
  if (loading) {
    return <Loading msg={loading} />;
  }

  return (
    <View style={styles.flex}>
      <PaginationBattlePass
        setPage={setPage}
        scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
        positionAnimatedValue={positionAnimatedValue}
      />
      {contracts && (
        <AnimatedPagerView
          initialPage={Math.floor(contracts.ProgressionLevelReached / 5)}
          testID="pager-view"
          ref={ref}
          onPageScroll={Animated.event<PagerViewOnPageScrollEventData>(
            [
              {
                nativeEvent: {
                  offset: scrollOffsetAnimatedValue,
                  position: positionAnimatedValue,
                },
              },
            ],
            {
              listener: ({ nativeEvent: { offset, position } }) => {},
              useNativeDriver: true,
            }
          )}
          style={[styles.flex, { marginTop: 30 }]}
        >
          {contracts?.battlePass.map((battlePass, idx) => (
            <ScrollView key={idx} style={styles.content}>
              {battlePass.levels.map((_, index) => (
                <BattlePassItem
                  key={`level-key-${index}`}
                  data={_}
                  index={index}
                  parentIdx={idx}
                  ProgressionLevelReached={contracts.ProgressionLevelReached}
                  ProgressionTowardsNextLevel={
                    contracts.ProgressionTowardsNextLevel
                  }
                />
              ))}
              {battlePass.freeRewards.length > 0 && (
                <View>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      textTransform: "uppercase",
                      marginVertical: 8,
                      opacity: 0.6,
                    }}
                  >
                    Free Rewards
                  </Text>
                  {battlePass.freeRewards.map((_, idx) => (
                    <BattlePassItem key={`free-rewards-key-${idx}`} data={_} />
                  ))}
                </View>
              )}
            </ScrollView>
          ))}
        </AnimatedPagerView>
      )}
    </View>
  );
};
export default BattlePass;
const styles = StyleSheet.create({
  flex: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 16,
  },

  name: {
    fontSize: 16,
    color: "white",
    marginLeft: 4,
    textAlign: "center",
    marginTop: 8,
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    height: 100,
    width: 150,
  },
});
