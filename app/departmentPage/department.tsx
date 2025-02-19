import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { defaultStyles } from "@/styles/default";
import { Header } from "@/components/Header";
import axios from "axios";
import { useRouter } from "expo-router";

const departmentPage = () => {
  const router = useRouter();
  const fetchDepartment = async () => {
    try {
      const res = await axios.get(
        "https://api-xuongmay-dev.lighttail.com/api/department?pageIndex=1&pageSize=10"
      );
    } catch {
      console.log("fetch error");
    }
  };
  useEffect(() => {
    fetchDepartment();
  }, []);
  return (
    <View style={defaultStyles.container}>
      <View>
        <Header text="Sản xuất - Danh sách tổ" />
        <TouchableOpacity onPress={() => {
            router.navigate("/taskPage/task");
          }}>
          <Text>Chuyển trang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default departmentPage;

const styles = StyleSheet.create({});
