import { View, StyleSheet, ScrollView } from "react-native";
import useUserStore from "@/hooks/useUserStore";
import { Text } from "react-native-paper";
import { useCallback, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { fetchPlayerMMR, parseSeason } from "@/utils/valorant-api";
import { fetchSeasons } from "@/utils/valorant-assets";
import { useTranslation } from "react-i18next";
import Loading from "@/components/Loading";
import QueueSection from "@/components/QueueSection";
import { useQuery } from "@tanstack/react-query";

interface QueueSkills {
  competitive: {
    currentSeason: {
      numberOfGames: number;
      numberOfWin: number;
    };
    allTime: {
      numberOfGames: number;
      numberOfWin: number;
    };
  };
  deathmatch: {
    currentSeason: {
      numberOfGames: number;
      numberOfWin: number;
    };
    allTime: {
      numberOfGames: number;
      numberOfWin: number;
    };
  };
  ggteam: {
    currentSeason: {
      numberOfGames: number;
      numberOfWin: number;
    };
    allTime: {
      numberOfGames: number;
      numberOfWin: number;
    };
  };
  hurm: {
    currentSeason: {
      numberOfGames: number;
      numberOfWin: number;
    };
    allTime: {
      numberOfGames: number;
      numberOfWin: number;
    };
  };
  newmap: {
    currentSeason: {
      numberOfGames: number;
      numberOfWin: number;
    };
    allTime: {
      numberOfGames: number;
      numberOfWin: number;
    };
  };
  seeding: {
    currentSeason: {
      numberOfGames: number;
      numberOfWin: number;
    };
    allTime: {
      numberOfGames: number;
      numberOfWin: number;
    };
  };
  spikerush: {
    currentSeason: {
      numberOfGames: number;
      numberOfWin: number;
    };
    allTime: {
      numberOfGames: number;
      numberOfWin: number;
    };
  };
  swiftplay: {
    currentSeason: {
      numberOfGames: number;
      numberOfWin: number;
    };
    allTime: {
      numberOfGames: number;
      numberOfWin: number;
    };
  };
  unrated: {
    currentSeason: {
      numberOfGames: number;
      numberOfWin: number;
    };
    allTime: {
      numberOfGames: number;
      numberOfWin: number;
    };
  };
}

const CareerSummary = () => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);

  const [currentSeason, setCurrentSeason] = useState<{
    label: string;
    value: string;
  }>({ label: "", value: "" });

  const fetchData = async () => {
    let accessToken = (await SecureStore.getItemAsync(
      "access_token"
    )) as string;
    let entitlementsToken = (await SecureStore.getItemAsync(
      "entitlements_token"
    )) as string;
    let [playerMMR, seasons] = await Promise.all([
      fetchPlayerMMR(accessToken, entitlementsToken, user.region, user.id),
      fetchSeasons(),
    ]);
    const seasonsAvailabe = parseSeason(seasons);
    const currentSeason = seasonsAvailabe[seasonsAvailabe.length - 1];
    setCurrentSeason(currentSeason);
    let queueSkills = {
      competitive: {
        currentSeason: {
          numberOfGames: 0,
          numberOfWin: 0,
        },
        allTime: {
          numberOfGames: 0,
          numberOfWin: 0,
        },
      },
      deathmatch: {
        currentSeason: {
          numberOfGames: 0,
          numberOfWin: 0,
        },
        allTime: {
          numberOfGames: 0,
          numberOfWin: 0,
        },
      },
      ggteam: {
        currentSeason: {
          numberOfGames: 0,
          numberOfWin: 0,
        },
        allTime: {
          numberOfGames: 0,
          numberOfWin: 0,
        },
      },
      hurm: {
        currentSeason: {
          numberOfGames: 0,
          numberOfWin: 0,
        },
        allTime: {
          numberOfGames: 0,
          numberOfWin: 0,
        },
      },
      newmap: {
        currentSeason: {
          numberOfGames: 0,
          numberOfWin: 0,
        },
        allTime: {
          numberOfGames: 0,
          numberOfWin: 0,
        },
      },
      seeding: {
        currentSeason: {
          numberOfGames: 0,
          numberOfWin: 0,
        },
        allTime: {
          numberOfGames: 0,
          numberOfWin: 0,
        },
      },
      spikerush: {
        currentSeason: {
          numberOfGames: 0,
          numberOfWin: 0,
        },
        allTime: {
          numberOfGames: 0,
          numberOfWin: 0,
        },
      },
      swiftplay: {
        currentSeason: {
          numberOfGames: 0,
          numberOfWin: 0,
        },
        allTime: {
          numberOfGames: 0,
          numberOfWin: 0,
        },
      },
      unrated: {
        currentSeason: {
          numberOfGames: 0,
          numberOfWin: 0,
        },
        allTime: {
          numberOfGames: 0,
          numberOfWin: 0,
        },
      },
    };
    for (let key in playerMMR.QueueSkills) {
      for (let key1 in playerMMR.QueueSkills[key].SeasonalInfoBySeasonID) {
        queueSkills[key as keyof typeof queueSkills].allTime.numberOfGames =
          queueSkills[key as keyof typeof queueSkills].allTime.numberOfGames +
          playerMMR.QueueSkills[key].SeasonalInfoBySeasonID[key1].NumberOfGames;

        queueSkills[key as keyof typeof queueSkills].allTime.numberOfWin =
          queueSkills[key as keyof typeof queueSkills].allTime.numberOfWin +
          playerMMR.QueueSkills[key].SeasonalInfoBySeasonID[key1]
            .NumberOfWinsWithPlacements;
      }
      for (let keySeason in playerMMR.QueueSkills[key].SeasonalInfoBySeasonID) {
        if (currentSeason.value === keySeason) {
          queueSkills[
            key as keyof typeof queueSkills
          ].currentSeason.numberOfGames =
            playerMMR.QueueSkills[key].SeasonalInfoBySeasonID[
              currentSeason.value
            ].NumberOfGames;
          queueSkills[
            key as keyof typeof queueSkills
          ].currentSeason.numberOfWin =
            playerMMR.QueueSkills[key].SeasonalInfoBySeasonID[
              currentSeason.value
            ].NumberOfWinsWithPlacements;
        }
      }
    }

    return queueSkills as QueueSkills;
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ["career-summary"],
    queryFn: fetchData,
    staleTime: 60000,
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ScrollView style={styles.flex}>
      <Text variant="titleMedium">{t("game_mode.competitive")}</Text>
      <QueueSection label={currentSeason.label} data={data!.competitive} />
      <Text
        variant="titleMedium"
        style={{
          marginTop: 16,
        }}
      >
        {t("game_mode.deathmatch")}
      </Text>
      <QueueSection label={currentSeason.label} data={data!.deathmatch} />
      <Text
        variant="titleMedium"
        style={{
          marginTop: 16,
        }}
      >
        {t("game_mode.unrated")}
      </Text>
      <QueueSection label={currentSeason.label} data={data!.unrated} />
      <Text
        variant="titleMedium"
        style={{
          marginTop: 16,
        }}
      >
        {t("game_mode.hurm")}
      </Text>
      <QueueSection label={currentSeason.label} data={data!.hurm} />
      <Text
        variant="titleMedium"
        style={{
          marginTop: 16,
        }}
      >
        {t("game_mode.spikerush")}
      </Text>
      <QueueSection label={currentSeason.label} data={data!.spikerush} />
      <Text
        variant="titleMedium"
        style={{
          marginTop: 16,
        }}
      >
        {t("game_mode.swiftplay")}
      </Text>
      <QueueSection label={currentSeason.label} data={data!.swiftplay} />
      <View
        style={{
          height: 20,
        }}
      />
    </ScrollView>
  );
};
export default CareerSummary;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    paddingHorizontal: 8,
  },
});
