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
        api="https://api-xuongmay-dev.lighttail.com/api/department?pageIndex=1&pageSize=10"
        headerTitle="Sản xuất - Danh sách tổ"
      />
    </View>
  );
};
export default departmentPage;

const styles = StyleSheet.create({});
