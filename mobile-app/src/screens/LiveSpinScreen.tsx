import { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, Easing, StyleSheet } from "react-native";
import { colors, fonts } from "../theme";
import Glyph from "../components/Glyph";
import Button from "../components/Button";

interface Props {
  rpm: number;
  onStop: () => void;
}

export default function LiveSpinScreen({ rpm, onStop }: Props) {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const duration = Math.max(300, 1200 - rpm * 3);
    const loop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [rpm, spinAnim]);

  const rotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const fast = rpm > 160;

  return (
    <View style={[styles.container, { backgroundColor: colors.squash }]}>
      <View style={styles.topRow}>
        <View style={styles.pillLive}>
          <View style={styles.liveDot} />
          <Text style={styles.pillText}>live · gyro</Text>
        </View>
        <TouchableOpacity onPress={onStop} style={styles.endBtn}>
          <Text style={styles.endBtnText}>✕ end</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.center}>
        <Text style={[styles.eyebrow, { color: "rgba(17,17,17,0.55)" }]}>
          phone spin
        </Text>

        <Text style={styles.rpmNumber}>{Math.round(rpm)}</Text>
        <Text style={styles.rpmLabel}>rpm</Text>

        <View style={styles.ringContainer}>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <View style={styles.ring} />
          </Animated.View>
          <View style={styles.glyphCenter}>
            <Glyph size={64} color={colors.canvas} />
          </View>
        </View>

        {rpm > 0 && (
          <View style={styles.stickerWrap}>
            <View style={styles.sticker}>
              <Text style={styles.stickerText}>
                {fast ? "DO NOT LET GO" : "spin harder"}
              </Text>
            </View>
          </View>
        )}
      </View>

      <Button variant="danger" big full onPress={onStop}>
        STOP THE BLENDER
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pillLive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.pulp,
    borderWidth: 1.5,
    borderColor: colors.ink,
  },
  pillText: {
    fontFamily: fonts.bodyBold,
    fontWeight: "700",
    fontSize: 12,
    color: colors.ink,
  },
  endBtn: {
    backgroundColor: colors.ink,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  endBtnText: {
    color: colors.canvas,
    fontFamily: fonts.bodyBold,
    fontWeight: "700",
    fontSize: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  eyebrow: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.98,
  },
  rpmNumber: {
    fontFamily: fonts.monoBold,
    fontSize: 120,
    fontWeight: "700",
    color: colors.ink,
    lineHeight: 108,
    letterSpacing: -4.8,
    fontVariant: ["tabular-nums"],
  },
  rpmLabel: {
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -0.44,
    marginTop: -4,
  },
  ringContainer: {
    position: "relative",
    width: 180,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  ring: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 5,
    borderColor: colors.ink,
    borderStyle: "dashed",
  },
  glyphCenter: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  stickerWrap: {
    marginTop: 14,
    alignItems: "center",
  },
  sticker: {
    backgroundColor: colors.canvas,
    borderWidth: 3,
    borderColor: colors.chili,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowColor: colors.chili,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    transform: [{ rotate: "3deg" }],
  },
  stickerText: {
    fontFamily: fonts.display,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: -0.16,
    color: colors.chili,
  },
});
