import { Text, TextStyle } from "react-native";
import { colors, fonts } from "../theme";

interface Props {
  children: React.ReactNode;
  color?: string;
  style?: TextStyle;
}

export default function Eyebrow({ children, color, style }: Props) {
  return (
    <Text
      style={[
        {
          fontFamily: fonts.bodyBold,
          fontSize: 11,
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: 1.54,
          color: color || colors.ink3,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
