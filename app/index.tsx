import Input from "@/components/Input";
import { colors, fontSize, screenPadding } from "@/constraints/token";
import { login } from "@/slices/authSlice";
import { defaultStyles } from "@/styles/default";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

export default function loginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      if (account === "" || password === "") return;
      const response = await axios.post(
        "https://api-xuongmay-dev.lighttail.com/api/users/authorize-user",
        {
          userName: account,
          password: password,
        }
      );
      dispatch(login(response.data.data));
      if (response.data.data.userLogin.roles[0] === "WORKER")
        router.navigate("/departmentPage/department");
      else if (response.data.data.userLogin.roles[0] === "GUEST")
        router.navigate("/QADepartmentPage/QADepartment");
    } catch (error) {
      const errorMessage =
        error.response?.data?.data || "Tài khoản hoặc mật khẩu không đúng";
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    }
  };
  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        { alignItems: "center", paddingHorizontal: screenPadding.horizontal },
      ]}
    >
      <View style={styles.logoImgContainer}>
        <Image
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
        <Text style={styles.btn} onPress={handleLogin}>
          Đăng Nhập
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoImgContainer: {},
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
