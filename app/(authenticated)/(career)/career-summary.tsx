import { View, StyleSheet, ScrollView } from "react-native";
import useUserStore from "@/hooks/useUserStore";
import { useAppTheme } from "@/app/_layout";
import Pie from "@/components/circle-progress/Pie";
import { Card, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { fetchPlayerMMR, parseSeason } from "@/utils/valorant-api";
import { fetchSeasons } from "@/utils/valorant-assets";
import { useTranslation } from "react-i18next";
import Loading from "@/components/Loading";

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
  const { colors } = useAppTheme();
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [queueSkills, setQueueSkills] = useState<QueueSkills>({
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
  });
  const [currentSeason, setCurrentSeason] = useState<{
    label: string;
    value: string;
  }>({ label: "", value: "" });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
            playerMMR.QueueSkills[key].SeasonalInfoBySeasonID[key1]
              .NumberOfGames;

          queueSkills[key as keyof typeof queueSkills].allTime.numberOfWin =
            queueSkills[key as keyof typeof queueSkills].allTime.numberOfWin +
            playerMMR.QueueSkills[key].SeasonalInfoBySeasonID[key1]
              .NumberOfWinsWithPlacements;
        }
        for (let keySeason in playerMMR.QueueSkills[key]
          .SeasonalInfoBySeasonID) {
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
        setQueueSkills(queueSkills);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView style={styles.flex}>
      <Text variant="titleMedium">{t("game_mode.competitive")}</Text>
      <QueueSection
        label={currentSeason.label}
        data={queueSkills.competitive}
      />
      <Text
        variant="titleMedium"
        style={{
          marginTop: 16,
        }}
      >
        {t("game_mode.deathmatch")}
      </Text>
      <QueueSection label={currentSeason.label} data={queueSkills.deathmatch} />
      <Text
        variant="titleMedium"
        style={{
          marginTop: 16,
        }}
      >
        {t("game_mode.unrated")}
      </Text>
      <QueueSection label={currentSeason.label} data={queueSkills.unrated} />
      <Text
        variant="titleMedium"
        style={{
          marginTop: 16,
        }}
      >
        {t("game_mode.hurm")}
      </Text>
      <QueueSection label={currentSeason.label} data={queueSkills.hurm} />
      <Text
        variant="titleMedium"
        style={{
          marginTop: 16,
        }}
      >
        {t("game_mode.spikerush")}
      </Text>
      <QueueSection label={currentSeason.label} data={queueSkills.spikerush} />
      <Text
        variant="titleMedium"
        style={{
          marginTop: 16,
        }}
      >
        {t("game_mode.swiftplay")}
      </Text>
      <QueueSection label={currentSeason.label} data={queueSkills.swiftplay} />
      <View
        style={{
          height: 20,
        }}
      />
    </ScrollView>
  );
};
export default CareerSummary;

const QueueSection = ({
  label,
  data,
}: {
  label: string;
  data: {
    currentSeason: {
      numberOfGames: number;
      numberOfWin: number;
    };
    allTime: {
      numberOfGames: number;
      numberOfWin: number;
    };
  };
}) => {
  const { t } = useTranslation();
  function roundToTwo(num: number) {
    return Math.round(num * 100) / 100;
  }

  return (
    <Card
      style={{
        marginTop: 4,
      }}
    >
      <Card.Content
        style={{
          flexDirection: "row",
        }}
      >
        <View
          style={{
            width: "50%",
            alignItems: "center",
          }}
        >
          <Text>{label}</Text>
          <Pie
            radius={40}
            borderWidth={10}
            percentage={
              data.currentSeason.numberOfWin > 0
                ? roundToTwo(
                    (data.currentSeason.numberOfWin /
                      data.currentSeason.numberOfGames) *
                      100
                  )
                : 0
            }
            color={"red"}
          />
          <Text
            style={{
              marginTop: 8,
            }}
          >{`${data.currentSeason.numberOfWin} / ${
            data.currentSeason.numberOfGames
          } ${
            data.currentSeason.numberOfWin > 0 ? t("games_win") : t("game_win")
          }`}</Text>
        </View>
        <View
          style={{
            width: "50%",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              textTransform: "uppercase",
            }}
          >
            {t("alltime")}
          </Text>
          <Pie
            radius={40}
            borderWidth={10}
            percentage={roundToTwo(
              (data.allTime.numberOfWin / data.allTime.numberOfGames) * 100
            )}
            color={"red"}
          />
          <Text
            style={{
              marginTop: 8,
            }}
          >{`${data.allTime.numberOfWin} / ${data.allTime.numberOfGames} ${
            data.allTime.numberOfWin > 0 ? t("games_win") : t("game_win")
          }`}</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    paddingHorizontal: 8,
  },
});
