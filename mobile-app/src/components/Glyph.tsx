import { View, StyleSheet } from "react-native";
import { colors } from "../theme";

interface Props {
  size?: number;
  spin?: boolean;
  color?: string;
  strokeWidth?: number;
}

export default function Glyph({ size = 24, spin = false, color = colors.squash, strokeWidth }: Props) {
  const sw = strokeWidth ?? Math.max(2, Math.round(size / 12));
  const inner = sw + 2;
  return (
    <View
      style={[
        styles.outer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          borderWidth: sw,
        },
        spin && styles.spin,
      ]}
    >
      <View
        style={{
          position: "absolute",
          top: inner,
          left: inner,
          right: inner,
          bottom: inner,
          borderRadius: (size - inner * 2) / 2,
          borderWidth: sw,
          borderColor: colors.ink,
          borderTopColor: "transparent",
          borderRightColor: "transparent",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: "relative",
    borderColor: colors.ink,
    flexShrink: 0,
  },
  spin: {
    // Animation handled by parent via Animated or animation prop in RN
  },
});
