import { TouchableOpacity, ViewStyle } from "react-native";
import { colors, radii } from "../theme";

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel: string;
}

export default function IconButton({ children, onPress, accessibilityLabel }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      activeOpacity={0.8}
      style={{
        width: 40,
        height: 40,
        backgroundColor: colors.canvas,
        borderWidth: 2,
        borderColor: colors.ink,
        borderRadius: radii.r1,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.ink,
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 3,
      } as ViewStyle}
    >
      {children}
    </TouchableOpacity>
  );
}
