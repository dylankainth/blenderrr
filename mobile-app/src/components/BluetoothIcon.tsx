import { View, StyleSheet } from "react-native";
import { colors } from "../theme";

interface Props {
  size?: number;
}

export default function BluetoothIcon({ size = 24 }: Props) {
  const sw = Math.max(2, Math.round(size / 10));
  const half = size / 2;
  const q = size / 4;
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      {/* Vertical bar */}
      <View style={[styles.bar, { width: sw, height: size * 0.85, backgroundColor: colors.ink }]} />
      {/* Top-right diagonal */}
      <View style={[styles.diag, { width: size * 0.55, height: sw, backgroundColor: colors.ink, top: size * 0.12, left: half, transform: [{ rotate: "30deg" }], transformOrigin: "left center" }]} />
      {/* Bottom-right diagonal */}
      <View style={[styles.diag, { width: size * 0.55, height: sw, backgroundColor: colors.ink, top: half, left: half, transform: [{ rotate: "-30deg" }], transformOrigin: "left center" }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { position: "absolute" },
  diag: { position: "absolute" },
});
