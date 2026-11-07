import { View, TouchableOpacity, ViewStyle } from "react-native";
import { colors, radii } from "../theme";

type CardTone = "canvas" | "squash" | "smoothie" | "pulp" | "chili" | "ink";

interface Props {
  children: React.ReactNode;
  tone?: CardTone;
  style?: ViewStyle;
  onPress?: () => void;
}

const tones: Record<CardTone, string> = {
  canvas:   colors.canvas,
  squash:   colors.squash2,
  smoothie: colors.smoothie2,
  pulp:     colors.pulp2,
  chili:    colors.chili2,
  ink:      colors.ink,
};

export default function Card({ children, tone = "canvas", style, onPress }: Props) {
  const bg = tones[tone] || tones.canvas;
  const content = (
    <View
      style={[
        {
          backgroundColor: bg,
          borderWidth: 2,
          borderColor: colors.ink,
          borderRadius: radii.r2,
          padding: 18,
          shadowColor: colors.ink,
          shadowOffset: { width: 6, height: 6 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 6,
        } as ViewStyle,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress} activeOpacity={0.85}>{content}</TouchableOpacity>;
  }
  return content;
}
