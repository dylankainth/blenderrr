import { View, Text, StyleSheet } from "react-native";
import { colors, fonts, radii } from "../theme";

type PillColor = "neutral" | "pulp" | "squash" | "smoothie" | "chili";

interface Props {
  children: React.ReactNode;
  color?: PillColor;
  dot?: boolean;
}

const tints: Record<PillColor, { bg: string; dot: string }> = {
  neutral:  { bg: colors.canvas, dot: colors.ink },
  pulp:     { bg: colors.pulp2, dot: colors.pulp },
  squash:   { bg: colors.squash2, dot: colors.squash },
  smoothie: { bg: colors.smoothie2, dot: colors.smoothie },
  chili:    { bg: colors.chili2, dot: colors.chili },
};

export default function Pill({ children, color = "neutral", dot: showDot = false }: Props) {
  const t = tints[color] || tints.neutral;
  return (
    <View style={[styles.base, { backgroundColor: t.bg }]}>
      {showDot && (
        <View style={[styles.dot, { backgroundColor: t.dot }]} />
      )}
      <Text style={styles.label}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: radii.pill,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.ink,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontWeight: "700",
    fontSize: 12,
    color: colors.ink,
  },
});
