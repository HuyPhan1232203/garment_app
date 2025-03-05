import { colors, screenPadding } from "@/constraints/token";
import { defaultStyles } from "@/styles/default";
import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { logout } from "@/slices/authSlice";
type textProps = {
  text: string;
  isChild?: boolean;
};

export const Header = ({ text, isChild }: textProps) => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    router.navigate("..");
  };
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
      {isChild ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ paddingRight: 20 }}
            onPress={() => {
              router.back();
            }}
          >
            <AntDesign name="left" size={24} color={colors.icon} />
          </TouchableOpacity>
          <Text style={defaultStyles.headerText}>{text}</Text>
        </View>
      ) : (
        <Text style={defaultStyles.headerText}>{text}</Text>
      )}
      <TouchableOpacity onPress={handleLogout}>
        <Ionicons name="exit-outline" size={24} color={colors.icon} />
      </TouchableOpacity>
    </View>
  );
};
