import { colors, screenPadding } from "@/constraints/token";
import { defaultStyles } from "@/styles/default";
import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
type textProps = {
  text: string;
};
export const Header = ({ text }: textProps) => {
  return (
    <View
      style={{
        backgroundColor: colors.primary,
        height: 67,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 17,
      }}
    >
      <Text style={defaultStyles.headerText}>{text}</Text>
      <Ionicons name="exit-outline" size={24} color={colors.icon} />
    </View>
  );
};
