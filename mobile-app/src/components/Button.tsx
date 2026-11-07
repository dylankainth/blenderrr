import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors, fonts, radii } from "../theme";

type Variant = "primary" | "danger" | "secondary" | "dark" | "smoothie";

interface Props {
  children: React.ReactNode;
  variant?: Variant;
  onPress?: () => void;
  disabled?: boolean;
  big?: boolean;
  full?: boolean;
  style?: ViewStyle;
}

const palettes: Record<Variant, { bg: string; fg: string }> = {
  primary:   { bg: colors.squash, fg: colors.ink },
  danger:    { bg: colors.chili, fg: colors.canvas },
  secondary: { bg: colors.canvas, fg: colors.ink },
  dark:      { bg: colors.ink, fg: colors.canvas },
  smoothie:  { bg: colors.smoothie, fg: colors.canvas },
};

export default function Button({ children, variant = "primary", onPress, disabled, big = false, full = false, style }: Props) {
  const p = palettes[variant] || palettes.primary;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[
        styles.base,
        {
          backgroundColor: p.bg,
          borderWidth: 2,
          borderColor: colors.ink,
          borderRadius: big ? 18 : radii.r2,
          paddingVertical: big ? 20 : 14,
          paddingHorizontal: big ? 28 : 22,
          opacity: disabled ? 0.5 : 1,
          width: full ? "100%" : undefined,
          shadowColor: colors.ink,
          shadowOffset: { width: 6, height: 6 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 6,
        } as ViewStyle,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: p.fg,
            fontSize: big ? 24 : 14,
            letterSpacing: big ? -0.5 : 0.7,
            textTransform: big ? "none" : "uppercase",
            fontFamily: big ? fonts.display : fonts.bodyBold,
          },
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  } as ViewStyle,
  text: {
    fontWeight: "700",
  } as TextStyle,
  bigText: {
    fontFamily: fonts.display,
  },
});
