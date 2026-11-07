import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "../theme";

interface Props {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export default function TopBar({ title, left, right }: Props) {
  return (
    <View style={styles.bar}>
      <View style={styles.side}>{left}</View>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
    backgroundColor: colors.canvas,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.66,
    color: colors.ink,
  },
  side: {
    width: 80,
    flexDirection: "row",
  },
  right: {
    justifyContent: "flex-end",
  },
});
