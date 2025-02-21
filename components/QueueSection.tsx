import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Card, Text } from "react-native-paper";
import Pie from "./circle-progress/Pie";

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
export default QueueSection;
