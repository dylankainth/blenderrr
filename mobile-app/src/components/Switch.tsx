import { TouchableOpacity, View, StyleSheet } from "react-native";
import { colors, radii } from "../theme";

interface Props {
  on: boolean;
  onChange: (next: boolean) => void;
  label: string;
}

export default function Switch({ on, onChange, label }: Props) {
  return (
    <TouchableOpacity
      onPress={() => onChange(!on)}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      accessibilityLabel={label}
      activeOpacity={0.8}
      style={[
        styles.track,
        {
          backgroundColor: on ? colors.squash : colors.canvas,
        },
      ]}
    >
      <View
        style={[
          styles.thumb,
          {
            left: on ? 36 : 3,
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 76,
    height: 42,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: colors.ink,
    justifyContent: "center",
    padding: 0,
    shadowColor: colors.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  thumb: {
    position: "absolute",
    top: 3,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.ink,
  },
});
