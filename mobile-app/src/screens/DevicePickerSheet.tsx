import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Device } from "react-native-ble-plx";
import { colors, fonts, radii } from "../theme";
import Glyph from "../components/Glyph";
import Mono from "../components/Mono";
import Pill from "../components/Pill";
import Card from "../components/Card";
import Button from "../components/Button";
import Eyebrow from "../components/Eyebrow";

interface NearbyDevice {
  id: string;
  name: string | null;
  rssi: number | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onPick: (device: NearbyDevice) => void;
  nearbyDevices: Device[];
  scanning: boolean;
}

export default function DevicePickerSheet({ open, onClose, onPick, nearbyDevices, scanning }: Props) {
  if (!open) return null;

  return (
    <Modal transparent animationType="slide" visible={open} onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.sheet} activeOpacity={1}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Nearby blenders</Text>
            {scanning ? (
              <Pill color="squash" dot>scanning…</Pill>
            ) : (
              <Pill color="pulp" dot>{nearbyDevices.length} found</Pill>
            )}
          </View>

          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {nearbyDevices.map((d, i) => (
              <Card key={d.id} onPress={() => onPick({ id: d.id, name: d.name, rssi: d.rssi })} style={{ padding: 16 }}>
                <View style={styles.deviceRow}>
                  <View style={styles.deviceInfo}>
                    <Glyph size={36} spin={i === 0} />
                    <View style={{ minWidth: 0 }}>
                      <Text style={styles.deviceName}>{d.name || "Unknown"}</Text>
                      <Mono size={11} color={colors.ink3}>
                        {d.id} · {d.rssi ?? "?"} dBm
                      </Mono>
                    </View>
                  </View>
                  <Text style={styles.pairLabel}>pair →</Text>
                </View>
              </Card>
            ))}
            {scanning && nearbyDevices.length === 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>listening for hellos…</Text>
              </View>
            )}
          </ScrollView>

          <View style={{ flex: 1 }} />
          <Button variant="secondary" full onPress={onClose}>
            cancel
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
    maxHeight: "75%",
  },
  handle: {
    width: 56,
    height: 5,
    borderRadius: radii.pill,
    backgroundColor: colors.ink,
    opacity: 0.25,
    alignSelf: "center",
    marginTop: -8,
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.78,
    color: colors.ink,
  },
  list: {
    flexGrow: 0,
    maxHeight: 300,
  },
  listContent: {
    gap: 10,
    paddingBottom: 8,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
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
    fontSize: 18,
    letterSpacing: -0.36,
    color: colors.ink,
  },
  pairLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: colors.smoothie,
  },
  empty: {
    paddingVertical: 30,
    alignItems: "center",
  },
  emptyText: {
    color: colors.ink3,
    fontSize: 14,
    fontFamily: fonts.body,
  },
});
