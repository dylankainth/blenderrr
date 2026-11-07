import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { colors, fonts, radii } from "../theme";
import Card from "../components/Card";
import Eyebrow from "../components/Eyebrow";
import Mono from "../components/Mono";
import Button from "../components/Button";

interface DeviceInfo {
  name: string | null;
  id: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  device: DeviceInfo | null;
  onDisconnect: () => void;
}

export default function SettingsSheet({ open, onClose, device, onDisconnect }: Props) {
  if (!open) return null;

  return (
    <Modal transparent animationType="slide" visible={open} onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.sheet} activeOpacity={1}>
          <View style={styles.handle} />

          <Text style={styles.title}>Settings</Text>

          <Card tone="canvas" style={{ padding: 14 }}>
            <Eyebrow>paired device</Eyebrow>
            <View style={styles.pairedRow}>
              <View>
                <Text style={styles.deviceName}>{device?.name || "—"}</Text>
                <Mono size={11} color={colors.ink3}>
                  {device?.id || "no device paired"}
                </Mono>
              </View>
              {device && (
                <Button variant="dark" onPress={onDisconnect}>
                  forget
                </Button>
              )}
            </View>
          </Card>

          <Card tone="canvas" style={{ padding: 14 }}>
            <Eyebrow>about blender</Eyebrow>
            <Text style={styles.aboutText}>
              v0.1 · made at a hackathon · probably fine.
            </Text>
          </Card>

          <Button variant="secondary" full onPress={onClose}>
            done
          </Button>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(17,17,17,0.55)",
  },
  sheet: {
    backgroundColor: colors.canvas,
    borderTopLeftRadius: radii.r3,
    borderTopRightRadius: radii.r3,
    borderWidth: 2,
    borderColor: colors.ink,
    borderBottomWidth: 0,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 14,
  },
  handle: {
    width: 56,
    height: 5,
    borderRadius: radii.pill,
    backgroundColor: colors.ink,
    opacity: 0.25,
    alignSelf: "center",
    marginTop: -8,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.78,
    color: colors.ink,
  },
  pairedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  deviceName: {
    fontFamily: fonts.display,
    fontWeight: "800",
    fontSize: 18,
    color: colors.ink,
  },
  aboutText: {
    fontSize: 13,
    color: colors.ink2,
    marginTop: 6,
    fontFamily: fonts.body,
  },
});
