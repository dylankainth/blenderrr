import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "../theme";
import TopBar from "../components/TopBar";
import IconButton from "../components/IconButton";
import Eyebrow from "../components/Eyebrow";
import Button from "../components/Button";

interface Props {
  onScan: () => void;
  onOpenSettings: () => void;
}

export default function EmptyScreen({ onScan, onOpenSettings }: Props) {
  return (
    <View style={styles.container}>
      <TopBar
        title="blender"
        right={
          <IconButton accessibilityLabel="settings" onPress={onOpenSettings}>
            <View style={styles.gearOuter}>
              <View style={styles.gearHole} />
              <View style={[styles.gearTooth, styles.gearToothTop]} />
              <View style={[styles.gearTooth, styles.gearToothRight]} />
              <View style={[styles.gearTooth, styles.gearToothBottom]} />
              <View style={[styles.gearTooth, styles.gearToothLeft]} />
            </View>
          </IconButton>
        }
      />

      <View style={styles.body}>
        <Eyebrow>Step 1</Eyebrow>
        <Text style={styles.heading}>
          No blender yet. Wave your phone at one.
        </Text>

        {/* Bluetooth illustration */}
        <View style={styles.illustration}>
          <View style={styles.glyphCol}>
            <View style={styles.btSymbol}>
              <Text style={styles.btLetter}>B</Text>
            </View>
            <View>
              <View style={styles.slash} />
              <Text style={styles.zzz}>zzz</Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <Button variant="primary" full onPress={onScan}>
          Look for blenders
        </Button>
        <Text style={styles.hint}>
          make sure your blender is on and saying hello over BLE
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 28,
    gap: 20,
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 52,
    fontWeight: "800",
    lineHeight: 48,
    letterSpacing: -2.08,
    color: colors.ink,
  },
  illustration: {
    marginTop: 10,
    alignItems: "center",
    height: 200,
  },
  glyphCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  btSymbol: {
    width: 80,
    height: 100,
    borderWidth: 4,
    borderColor: colors.ink,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btLetter: {
    fontFamily: fonts.display,
    fontSize: 48,
    fontWeight: "800",
    color: colors.ink,
  },
  slash: {
    width: 60,
    height: 4,
    backgroundColor: colors.chili,
    borderRadius: 2,
    transform: [{ rotate: "-30deg" }],
    marginTop: 20,
  },
  zzz: {
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: "700",
    color: colors.ink4,
    marginTop: 4,
  },
  hint: {
    textAlign: "center",
    fontSize: 12,
    color: colors.ink3,
    fontFamily: fonts.body,
  },
  gearOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: colors.ink,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  gearHole: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.canvas,
    borderWidth: 2,
    borderColor: colors.ink,
  },
  gearTooth: {
    position: "absolute",
    backgroundColor: colors.ink,
  },
  gearToothTop: { width: 7, height: 3, top: -3, left: 6.5 },
  gearToothRight: { width: 3, height: 7, top: 6.5, right: -3 },
  gearToothBottom: { width: 7, height: 3, bottom: -3, left: 6.5 },
  gearToothLeft: { width: 3, height: 7, top: 6.5, left: -3 },
});
