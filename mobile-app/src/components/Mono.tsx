import { Text, TextStyle } from "react-native";
import { fonts } from "../theme";

interface Props {
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: TextStyle["fontWeight"];
  style?: TextStyle;
}

export default function Mono({ children, size = 14, color, weight = 500, style }: Props) {
  return (
    <Text
      style={[
        {
          fontFamily: weight === 700 ? fonts.monoBold : fonts.mono,
          fontSize: size,
          fontWeight: weight,
          color: color || "#111",
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
