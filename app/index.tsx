import Input from "@/components/Input";
import { colors, fontSize, screenPadding } from "@/constraints/token";
import { defaultStyles } from "@/styles/default";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";

export default function loginPage() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    console.log(account + password);
  };
  return (
    <View
      style={[
        defaultStyles.container,
        { alignItems: "center", paddingHorizontal: screenPadding.horizontal },
      ]}
    >
      <View style={styles.logoImgContainer}>
        <FastImage
          source={require("../assets/images/Logo.png")}
          style={styles.logoImg}
          resizeMode="contain"
        />
      </View>
      <View>
        <Text
          style={[
            defaultStyles.text,
            { fontWeight: 500, fontSize: fontSize.lg, marginTop: 59 },
          ]}
        >
          Hệ Thống Xưởng May
        </Text>
      </View>
      <View>
        <Input
          onChangeText={setAccount}
          value={account}
          type="text"
          name={"Tài Khoản"}
        />
        <Input
          onChangeText={setPassword}
          value={password}
          type="password"
          name={"Mật Khẩu"}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Text
          style={styles.btn}
          onPress={() => {
            handleLogin();
            router.navigate("/departmentPage/department");
          }}
        >
          Đăng Nhập
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoImgContainer: {
    height: "30%",
  },
  logoImg: {
    width: 304,
    height: 104,
    marginTop: 138,
  },
  buttonContainer: {
    marginTop: 40,
    backgroundColor: colors.primary,
    borderRadius: 40,
  },
  btn: {
    ...defaultStyles.text,
    color: "#fff",
    fontWeight: 600,
    paddingVertical: 6.5,
    paddingHorizontal: 102.5,
  },
});
