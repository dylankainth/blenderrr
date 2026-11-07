import { View, Text, StyleSheet } from "react-native";
import { colors, fonts, radii } from "../theme";

type StickerTone = "squash" | "pulp" | "chili" | "smoothie";

interface Props {
  children: React.ReactNode;
  tone?: StickerTone;
}

const stickerTones: Record<StickerTone, { bg: string; fg: string; ink: string }> = {
  squash:   { bg: colors.squash, fg: colors.ink, ink: colors.ink },
  pulp:     { bg: colors.pulp, fg: colors.ink, ink: colors.ink },
  chili:    { bg: colors.canvas, fg: colors.chili, ink: colors.chili },
  smoothie: { bg: colors.smoothie, fg: colors.canvas, ink: colors.ink },
};

export default function Sticker({ children, tone = "squash" }: Props) {
  const t = stickerTones[tone] || stickerTones.squash;
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: t.bg,
          borderColor: t.ink,
          shadowColor: t.ink,
        },
      ]}
    >
      <Text style={[styles.label, { color: t.fg }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 3,
    borderRadius: radii.r1,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  label: {
    fontFamily: fonts.display,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: -0.16,
  },
});
