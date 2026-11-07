import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, fonts } from "../theme";
import TopBar from "../components/TopBar";
import IconButton from "../components/IconButton";
import Eyebrow from "../components/Eyebrow";
import Button from "../components/Button";
import Card from "../components/Card";
import Switch from "../components/Switch";
import Glyph from "../components/Glyph";
import BluetoothIcon from "../components/BluetoothIcon";
import Pill from "../components/Pill";
import Mono from "../components/Mono";

interface DeviceInfo {
  name: string | null;
  id: string;
}

interface Props {
  device: DeviceInfo;
  armed: boolean;
  onArmChange: (next: boolean) => void;
  onStartSpin: () => void;
  onOpenSettings: () => void;
  onDisconnect: () => void;
}

export default function HomeScreen({ device, armed, onArmChange, onStartSpin, onOpenSettings, onDisconnect }: Props) {
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
        <Card tone="canvas" style={{ padding: 16 }}>
          <View style={styles.deviceRow}>
            <View style={styles.deviceInfo}>
              <BluetoothIcon size={34} />
              <View style={{ minWidth: 0 }}>
                <Eyebrow>connected to</Eyebrow>
                <Text style={styles.deviceName}>{device.name || "Blender"}</Text>
              </View>
            </View>
            <Pill color="pulp" dot>online</Pill>
          </View>
          <View style={styles.metaRow}>
            <Mono size={11} color={colors.ink3}>{device.id}</Mono>
            <TouchableOpacity onPress={onDisconnect}>
              <Text style={styles.disconnectBtn}>disconnect</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card tone={armed ? "squash" : "canvas"} style={{ padding: 18 }}>
          <View style={styles.armRow}>
            <View style={{ minWidth: 0, flex: 1 }}>
              <Eyebrow color={armed ? colors.ink : undefined}>
                {armed ? "system armed" : "system off"}
              </Eyebrow>
              <Text style={styles.armLabel}>
                {armed ? "Armed. Spin to blend." : "System is chill."}
              </Text>
            </View>
            <Switch on={armed} onChange={onArmChange} label="arm system" />
          </View>
        </Card>

        <View style={{ flex: 1 }} />

        <Button
          variant={armed ? "primary" : "secondary"}
          big
          full
          disabled={!armed}
          onPress={onStartSpin}
          style={{ paddingVertical: 26, paddingHorizontal: 24 }}
        >
          {armed && <Glyph size={34} spin color={colors.canvas} />}
          {armed ? "HOLD AND SPIN" : "arm to begin"}
        </Button>

        <Text style={styles.hint}>
          motor only runs while your phone is spinning.
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
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 24,
    flex: 1,
    gap: 18,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  deviceName: {
    fontFamily: fonts.display,
    fontWeight: "800",
    fontSize: 22,
    letterSpacing: -0.44,
    lineHeight: 22,
    marginTop: 2,
    color: colors.ink,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  disconnectBtn: {
    color: colors.chili,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  armRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  armLabel: {
    fontFamily: fonts.display,
    fontWeight: "800",
    fontSize: 26,
    letterSpacing: -0.78,
    lineHeight: 27,
    marginTop: 4,
    color: colors.ink,
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
