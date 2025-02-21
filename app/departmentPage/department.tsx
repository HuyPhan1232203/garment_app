import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import BlankPage from "@/components/BlankPage";
import { useRouter } from "expo-router";
import { defaultStyles } from "@/styles/default";

const departmentPage = () => {
  const router = useRouter();
  return (
    <View style={defaultStyles.container}>
      <BlankPage
        api="https://67b8b3ac699a8a7baef4fde6.mockapi.io/departmentAPI"
        headerTitle="Sản xuất - Danh sách tổ"
      />
    </View>
  );
};
export default departmentPage;

const styles = StyleSheet.create({});
