// https://dev.to/jackherizsmith/making-a-progress-circle-in-react-3o65

import { useAppTheme } from "@/app/_layout";
import Svg, { Circle, G, Text, TSpan } from "react-native-svg";

const cleanPercentage = (percentage: number) => {
  const tooLow = !Number.isFinite(+percentage) || percentage < 0;
  const tooHigh = percentage > 100;
  return tooLow ? 0 : tooHigh ? 100 : +percentage;
};

const PieCircle = ({
  color,
  pct = 0,
  radius = 50,
  borderWidth = 2,
}: {
  color: string;
  pct: number;
  radius: number;
  borderWidth: number;
}) => {
  const circ = 2 * Math.PI * radius;
  const strokePct = ((100 - pct) * circ) / 100;
  return (
    <Circle
      r={radius}
      cx={radius + borderWidth}
      cy={radius + borderWidth}
      fill="transparent"
      fillRule={"nonzero"}
      stroke={pct > 0 ? color : ""}
      strokeWidth={borderWidth}
      strokeDasharray={circ}
      strokeDashoffset={pct ? strokePct : 0}
      strokeLinecap="round"
    ></Circle>
  );
};

const PieText = ({ percentage }: { percentage: number }) => {
  return (
    <Text x="50%" y="50%" textAnchor="middle">
      <TSpan
        x="50%"
        dy={6}
        fontSize={16}
        fill={"white"}
      >{`${percentage}%`}</TSpan>
    </Text>
  );
};

const Pie = ({
  percentage,
  color,
  title,
  radius = 50,
  borderWidth = 2,
}: {
  percentage: number;
  color: string;
  title?: string;
  radius: number;
  borderWidth: number;
}) => {
  const { colors } = useAppTheme();
  const pct = cleanPercentage(percentage);
  const fullSize = radius * 2 + borderWidth * 2;
  return (
    <Svg width={fullSize} height={fullSize}>
      <G
        transform={`rotate(-90 ${radius + borderWidth} ${
          radius + borderWidth
        })`}
        fill={"white"}
      >
        <Circle
          r={radius}
          cx={radius + borderWidth}
          cy={radius + borderWidth}
          fill={colors.card}
        ></Circle>
        <PieCircle
          borderWidth={borderWidth}
          radius={radius}
          color="#e3e3e3"
          pct={100}
        />
        <PieCircle
          borderWidth={borderWidth}
          radius={radius}
          color={color}
          pct={pct}
        />
      </G>
      <PieText percentage={pct} />
    </Svg>
  );
};

export default Pie;
