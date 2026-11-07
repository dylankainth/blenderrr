import { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, Animated, SafeAreaView, Platform, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import { useFonts, BricolageGrotesque_800ExtraBold } from "@expo-google-fonts/bricolage-grotesque";
import { SpaceGrotesk_400Regular, SpaceGrotesk_700Bold } from "@expo-google-fonts/space-grotesk";
import { JetBrainsMono_400Regular, JetBrainsMono_700Bold } from "@expo-google-fonts/jetbrains-mono";
import { Audio } from "expo-av";
import { Device } from "react-native-ble-plx";
import { useMotion } from "./src/hooks/useMotion";
import { BluetoothService } from "./src/services/bluetoothService";
import { SEND_INTERVAL_MS, DEVICE_NAME } from "./src/utils/constants";
import { colors, fonts } from "./src/theme";
import EmptyScreen from "./src/screens/EmptyScreen";
import DevicePickerSheet from "./src/screens/DevicePickerSheet";
import HomeScreen from "./src/screens/HomeScreen";
import LiveSpinScreen from "./src/screens/LiveSpinScreen";
import SettingsSheet from "./src/screens/SettingsSheet";

type ViewName = "empty" | "home" | "spin";

interface DeviceInfo {
  name: string | null;
  id: string;
}

const SCAN_TIMEOUT = 30000;
const SPEED_THRESHOLD = 3.5;
const CAT_HOLD_MS = 2000;

export default function App() {
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_800ExtraBold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
  });

  const [view, setView] = useState<ViewName>("empty");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [armed, setArmed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [catPlaying, setCatPlaying] = useState(false);
  const [nearbyDevices, setNearbyDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("");

  const { data: motionData, isActive: tracking, subscribe, unsubscribe } = useMotion();
  const btRef = useRef<BluetoothService | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const catPlayingRef = useRef(false);
  const loadingRef = useRef(false);
  const highSpeedStartRef = useRef<number | null>(null);
  const deviceRef = useRef<Device | null>(null);
  const armedRef = useRef(armed);
  const trackingRef = useRef(tracking);
  const connectedRef = useRef(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  armedRef.current = armed;
  trackingRef.current = tracking;

  // RPM conversion: rad/s → RPM (1 rad/s ≈ 9.549 RPM)
  const rpm = motionData.rotationSpeed * 9.549;

  // ── Toast helper ──
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 2000);
  }, []);

  // ── Init BLE ──
  useEffect(() => {
    const bt = new BluetoothService();
    btRef.current = bt;
    bt.getState().then((state) => {
      setConnectionStatus(state);
      if (state !== "PoweredOn") {
        showToast("Turn on Bluetooth and Location");
      }
    });
    return () => bt.destroy();
  }, [showToast]);

  // ── Cat sound ──
  const startCatSound = useCallback(async () => {
    if (catPlayingRef.current || loadingRef.current) return;
    loadingRef.current = true;
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync(
        { uri: "file:///android_asset/audio/cat.mp3" },
        { isLooping: true, shouldPlay: true, volume: 1.0 }
      );
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      }
      soundRef.current = sound;
      catPlayingRef.current = true;
      setCatPlaying(true);
      loadingRef.current = false;
    } catch (e: any) {
      loadingRef.current = false;
    }
  }, []);

  const stopCatSound = useCallback(() => {
    highSpeedStartRef.current = null;
    loadingRef.current = false;
    if (soundRef.current) {
      try { soundRef.current.stopAsync(); soundRef.current.unloadAsync(); } catch (_) {}
      soundRef.current = null;
    }
    catPlayingRef.current = false;
    setCatPlaying(false);
  }, []);

  // ── Cat sound logic (runs when tracking on LiveSpin screen) ──
  useEffect(() => {
    if (!tracking || view !== "spin") {
      stopCatSound();
      return;
    }
    const speed = motionData.rotationSpeed;
    if (speed > SPEED_THRESHOLD) {
      if (highSpeedStartRef.current === null) {
        highSpeedStartRef.current = Date.now();
      } else if (!catPlayingRef.current && !loadingRef.current) {
        if (Date.now() - highSpeedStartRef.current >= CAT_HOLD_MS) {
          startCatSound();
        }
      }
    } else {
      if (highSpeedStartRef.current !== null || catPlayingRef.current) {
        highSpeedStartRef.current = null;
        stopCatSound();
      }
    }
  }, [motionData.rotationSpeed, tracking, view, startCatSound, stopCatSound]);

  // ── BLE send interval ──
  useEffect(() => {
    if (!tracking || !connectedRef.current || view !== "spin") return;
    const interval = setInterval(async () => {
      if (!connectedRef.current) return;
      try {
        await btRef.current?.sendSpeed(motionData.rotationSpeed);
      } catch (_) {}
    }, SEND_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [tracking, motionData.rotationSpeed, view]);

  // ── Arm: start/stop tracking ──
  const handleArmChange = useCallback((next: boolean) => {
    setArmed(next);
    if (next) {
      subscribe();
      showToast("Armed. Spin to blend.");
    } else {
      unsubscribe();
      stopCatSound();
      showToast("System is chill.");
    }
  }, [subscribe, unsubscribe, stopCatSound, showToast]);

  // ── Scanning ──
  const handleScan = useCallback(() => {
    setPickerOpen(true);
    setScanning(true);
    setNearbyDevices([]);
    const bt = btRef.current;
    if (!bt) return;

    let finished = false;
    bt.scan(
      (device: Device) => {
        finished = true;
        bt.connect(device)
          .then(() => {
            deviceRef.current = device;
            connectedRef.current = true;
            setDevice({ name: device.name, id: device.id });
            setPickerOpen(false);
            setScanning(false);
            setView("home");
            showToast(`Hooked up to "${device.name}". Nice.`);
          })
          .catch((e) => {
            showToast(`Connect error: ${e.message}`);
          });
      },
      (device: Device) => {
        setNearbyDevices((prev) => {
          if (prev.find((d) => d.id === device.id)) return prev;
          return [...prev, device].slice(-30);
        });
      },
      (error: any) => {
        showToast(`Scan error: ${error.message}`);
      },
      SCAN_TIMEOUT
    ).then(() => {
      if (!finished) setScanning(false);
    });
  }, [showToast]);

  const handlePickDevice = useCallback(async (nearby: { id: string; name: string | null }) => {
    const bt = btRef.current;
    if (!bt) return;
    try {
      const d = nearbyDevices.find((d) => d.id === nearby.id);
      if (!d) return;
      setScanning(false);
      setPickerOpen(false);
      await bt.connect(d);
      deviceRef.current = d;
      connectedRef.current = true;
      setDevice({ name: d.name, id: d.id });
      setView("home");
      showToast(`Hooked up to "${d.name}". Nice.`);
    } catch (e: any) {
      showToast(`Connect error: ${e.message}`);
    }
  }, [nearbyDevices, showToast]);

  const handleDisconnect = useCallback(() => {
    btRef.current?.disconnect();
    connectedRef.current = false;
    deviceRef.current = null;
    unsubscribe();
    stopCatSound();
    setArmed(false);
    setDevice(null);
    setSettingsOpen(false);
    setPickerOpen(false);
    setView("empty");
    showToast("Lost the blender. Sad.");
  }, [unsubscribe, stopCatSound, showToast]);

  const handleStartSpin = useCallback(() => {
    if (!armed) return;
    setView("spin");
  }, [armed]);

  const handleStopSpin = useCallback(() => {
    stopCatSound();
    setArmed(false);
    unsubscribe();
    setView("home");
  }, [stopCatSound, unsubscribe]);

  // ── Cleanup sound on unmount ──
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stopAsync();
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // ── Toast fade animation ──
  const toastOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(toastOpacity, {
      toValue: toast ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [toast, toastOpacity]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <StatusBar style="dark" />
      </View>
    );
  }

  let screen;
  if (view === "spin") {
    screen = (
      <LiveSpinScreen
        rpm={rpm}
        onStop={handleStopSpin}
      />
    );
  } else if (view === "home") {
    screen = (
      <HomeScreen
        device={device!}
        armed={armed}
        onArmChange={handleArmChange}
        onStartSpin={handleStartSpin}
        onOpenSettings={() => setSettingsOpen(true)}
        onDisconnect={handleDisconnect}
      />
    );
  } else {
    screen = (
      <EmptyScreen
        onScan={handleScan}
        onOpenSettings={() => setSettingsOpen(true)}
      />
    );
  }

  return (
    <View style={[styles.root, { paddingTop: Constants.statusBarHeight }]}>
      <StatusBar style="dark" />
      {screen}

      <DevicePickerSheet
        open={pickerOpen}
        onClose={() => { setPickerOpen(false); setScanning(false); }}
        onPick={handlePickDevice}
        nearbyDevices={nearbyDevices}
        scanning={scanning}
      />

      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        device={device}
        onDisconnect={handleDisconnect}
      />

      {toast && (
        <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
          <Text style={styles.toastText}>{toast}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  toast: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 28,
    backgroundColor: colors.ink,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: colors.ink,
    shadowColor: colors.squash,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    zIndex: 20,
    alignItems: "center",
  },
  toastText: {
    color: colors.canvas,
    fontFamily: fonts.bodyBold,
    fontWeight: "600",
    fontSize: 14,
  },
});
