import Input from "@/components/Input";
import { colors, fontSize, screenPadding } from "@/constraints/token";
import { defaultStyles } from "@/styles/default";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../slices/authSlice';

export default function loginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const { user, status, error } = useSelector((state: any) => state.auth);

  const handleLogin = () => {
    // dispatch(fetchUser({ account, password }));
    router.navigate('/departmentPage/department')
  };

  useEffect(() => {
    if (user) {
      router.navigate("/departmentPage/department");
    }
  }, [user]);

  return (
    <SafeAreaView
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
          onPress={handleLogin}
        >
          Đăng Nhập
        </Text>
      </View>
      {status === 'loading' && <Text>Loading...</Text>}
      {status === 'failed' && <Text>Error: {error}</Text>}
    </SafeAreaView>
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